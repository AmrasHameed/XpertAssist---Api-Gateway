import { Server as HttpServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { AuthService } from '../modules/auth/config/gRPC-client/auth.client';
import jwt from 'jsonwebtoken';
import { Expert, Tokens, User } from '../interfaces/interface';
import { ExpertService } from '../modules/expert/config/gRPC-client/auth.expert';
import { calculateDistance } from '../utils/calculateDistance';
import { UserService } from '../modules/user/config/gRPC-client/user.client';
import generatePIN from '../utils/generatePin';
import { ServiceManagement } from '../modules/serviceManagement/config/gRPC-client/service.client';
import axios from 'axios';

class SocketService {
  private io: SocketIOServer;
  private userRequestData: { userId: string; location: any; service: string; notes: string } | null = null;
  private serviceData: { userData: any; userLocation: any;expertLocation:any; service: string; notes: string; distance: number; expertId:string; totalAmount?: number; ratePerHour?: number; pin?: number; jobId?: string, userId?: string} | null = null;
  private userSocketMap: Map<string, string> = new Map();

  constructor(server: HttpServer) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: process.env.CORS_ORIGIN,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      },
    });
    this.io.use(this.authenticateSocket.bind(this));
    this.initializeSocketEvents();
  }

  private async authenticateSocket(socket: Socket, next: (err?: any) => void) {
    try {
      const { token, refreshToken } = socket.handshake.auth;
      if (!token && !refreshToken) {
        console.error('No tokens provided');
        return next(new Error('No tokens provided'));
      }

      if (token) {
        try {
          jwt.verify(token, process.env.SECRET_KEY as string);
          return next();
        } catch (error) {
          if (error instanceof Error) {
            console.error('Access token verification error:', error.message);

            if (error instanceof jwt.TokenExpiredError) {
              console.warn('Access token expired, attempting to refresh token');
            } else {
              return next(new Error('Invalid access token'));
            }
          } else {
            console.error('Unknown error occurred during token verification');
            return next(new Error('Unknown error occurred'));
          }
        }
      }

      if (refreshToken) {
        AuthService.RefreshToken(
          { token: refreshToken },
          (err: any, result: Tokens) => {
            if (err) {
              console.error('Error refreshing token:', err);
              return next(new Error('Refresh token error'));
            } else {
              socket.emit('newTokens', {
                token: result.access_token,
                refreshToken: result.refresh_token,
              });
              return next();
            }
          }
        );
      } else {
        return next(new Error('Authentication error: No token provided'));
      }
    } catch (error) {
      console.error('Socket authentication error:', error);
      return next(new Error('Authentication error'));
    }
  }

  private initializeSocketEvents(): void {
    this.io.on('connection', (socket: Socket) => {
      console.log(`Client connected: ${socket.id}`);
      socket.on('service-request', async (data) => {
        const { location, service, notes, userId } = data;
        this.userRequestData = { userId, location, service, notes };
        const expertAvailabilityTimeout = setTimeout(() => {
          if (!this.serviceData) {
            socket.emit('no-experts-available', { message: 'No experts are available at this time. Please try again later.' });
          }
        }, 20000);
        ExpertService.GetOnlineExperts(
          { id:service },
          (err: any, result: { expertIds: Expert[] }) => {
            if (err) {
              console.error('Error fetching experts:', err);
              clearTimeout(expertAvailabilityTimeout);
              return; 
            }
            if (result && result.expertIds && result.expertIds.length > 0) {
              const arrayOfExpertIds = result.expertIds
              this.io.emit('get-nearby-experts',  arrayOfExpertIds );
              clearTimeout(expertAvailabilityTimeout);
            } else {
              console.error('No experts found for the requested service')
            }
          }
        );
      });
      socket.on('expertLocation', async(latitude: number, longitude: number, expertId: string) => {
        if (this.userRequestData) {
          const { location, service, userId, notes } = this.userRequestData;
          const radius = calculateDistance(location, { latitude, longitude });
          if (radius <= 5) {
            const origin = `${location.lat},${location.lng}`;
            const destination = `${latitude},${longitude}`;
            const API_KEY = process.env.OLA_MAPS_API_KEY
            const { data } = await axios.post(
              'https://api.olamaps.io/routing/v1/directions',
              null,
              {
                params: {
                  origin,
                  destination,
                  api_key: API_KEY,
                },
              }
            );
            const distance = (data?.routes[0]?.legs[0]?.distance)/1000
            UserService.GetUser({ id: userId }, (err: any, result: User ) => {
              if (err) {
                console.error('Error fetching user:', err);
                return;
              }
              if (result) {
                const {name, email, mobile, userImage} = result
                const userData = {name, email, mobile, userImage};
                this.serviceData = {expertId, userLocation:location,expertLocation:{latitude,longitude}, service, notes, userData, distance};
                this.io.emit('new-service-request', this.serviceData);
              } else {
                console.error('No Users found');
              }
            });
          }
        } else {
          console.error('No user request data found for this expert.');
        }
      });
      socket.on('accept-service', (data) => {
        const { totalAmount, ratePerHour } = data;
        const pin = generatePIN()
        if(this.serviceData) {
          this.serviceData = { ...this.serviceData,expertId:data.expertId,userId: this.userRequestData?.userId, totalAmount, ratePerHour, pin };
          ExpertService.NotAvailable({id: this.serviceData.expertId}, (err:any, result: string) => {
            if (err) {
              console.error('Error fetching user:', err);
              return;
            }
          })
          const { userData, ...filteredServiceData } = this.serviceData;
          ServiceManagement.CreateService(filteredServiceData, (err: any, result: { id: string } ) => {
            if (err) {
              console.error('Error fetching user:', err);
              return;
            }
            if (result) {
              const {id} = result
              if(this.serviceData) {
                this.serviceData = {...this.serviceData, jobId:id}
                const jobId = this.serviceData.jobId
                const expertId = this.serviceData.expertId
                this.io.emit('expert-confirmation',{jobId,expertId});
              } else {
                console.error('No service data to update');
              }
            } else {
              console.error('No Users found');
            }
          });
        } else {
          console.error('No service data to update');
        }
      });

      socket.on('user-confirmation',(jobId: string)=>{
        const userId = this.serviceData?.userId
        this.io.emit('user-confirmed', {jobId,userId})
      })

      socket.on('otp-verified',(jobId, expertId, userId, )=>{
        ServiceManagement.StartJob( {id:jobId}, (err: any, result:{message: string }) => {
          if (err) {
            console.error('Error fetching user:', err);
            return;
          }
          console.log(result)
          if (result.message ==='success') {
            this.io.emit('start-job',expertId, userId)
          } else {
            console.error('No Jobs found');
          }
        });
        console.log(expertId, userId, jobId)
      })

      socket.on('join_chat', (roomName) => {
        socket.join(roomName);
        console.log(`Socket ${socket.id} joined room ${roomName}`);
      });

      socket.on('user_send_message', ({ roomName, message }) => {
        console.log(`User message to room ${roomName}:`, message);
        this.io.to(roomName).emit('receive-expert-message', { message });
      });

      socket.on('expert_send_message', ({ roomName, message }) => {
        console.log(`Expert message to room ${roomName}:`, message);
        this.io.to(roomName).emit('receive-user-message', { message });
      });

      socket.on('join_call',(data)=>{
        this.userSocketMap.set(data, socket.id);
      })

      socket.on('callUser', ({ userToCall, from, offer, fromId }) => {
        const userSocketId = this.userSocketMap.get(userToCall);
        if (userSocketId) {
            this.io.to(userSocketId).emit('incomingCall', { from, offer, fromId });
        }
      });

      socket.on('signal', (data) => {
        const { userId, type, candidate, answer, context } = data;        
        if (context === 'webRTC') {
          const userSocketId = this.userSocketMap.get(userId);
          if (userSocketId) {
            this.io.to(userSocketId).emit('signal', { type, candidate, answer });
          }
        }
      });

      socket.on('callAccepted', ({ userId, answer, context }) => {
        if (context === 'webRTC') {
          const userSocketId = this.userSocketMap.get(userId) || '';
          this.io.to(userSocketId).emit('callAcceptedSignal', { answer });
        }
      });

      socket.on('callReject', (currentUser) => {
        let userSocketId = this.userSocketMap.get(currentUser) || '';
        this.io.to(userSocketId).emit('callEndedSignal');
      });
  
      socket.on('callEnded', (userId, expertId) => {
        let userSocketId = this.userSocketMap.get(userId) || '';
        let expertSocketId = this.userSocketMap.get(expertId) || '';
        console.log(userSocketId, expertSocketId, '=======>', userId, expertId)
        if(userSocketId) {
          this.io.to(userSocketId).emit('callEndedSignal');
        }
        if(expertSocketId) {
          this.io.to(expertSocketId).emit('callEndedSignal');
        }
      });
    
      
      socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
      });
    });
  }
}

export default SocketService;
