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

class SocketService {
  private io: SocketIOServer;
  private userRequestData: { userId: string; location: any; service: string; notes: string } | null = null;
  private serviceData: { userData: any; location: any; service: string; notes: string; distance: number; expertId:string; totalAmount?: number; ratePerHour?: number; pin?: number; jobId?: string} | null = null;

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
        ExpertService.GetOnlineExperts(
          { id:service },
          (err: any, result: { expertIds: Expert[] }) => {
            if (err) {
              console.error('Error fetching experts:', err);
              return; 
            }
            if (result && result.expertIds && result.expertIds.length > 0) {
              const arrayOfExpertIds = result.expertIds
              this.io.emit('get-nearby-experts',  arrayOfExpertIds );
            } else {
              console.error('No experts found for the requested service')
            }
          }
        );
      });
      socket.on('expertLocation', async(latitude: number, longitude: number, expertId: string) => {
        if (this.userRequestData) {
          const { location, service, userId, notes } = this.userRequestData;
          const distance = calculateDistance(location, { latitude, longitude });
          if (distance <= 5) {
            UserService.GetUser({ id: userId }, (err: any, result: User ) => {
              if (err) {
                console.error('Error fetching user:', err);
                return;
              }
              if (result) {
                const {name, email, mobile, userImage} = result
                const userData = {name, email, mobile, userImage};
                this.serviceData = {expertId, location, service, notes, userData, distance};
                console.log(this.serviceData);
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
          this.serviceData = { ...this.serviceData, totalAmount, ratePerHour, pin };
          ServiceManagement.CreateService({serviceData: this.serviceData}, (err: any, result: string ) => {
            if (err) {
              console.error('Error fetching user:', err);
              return;
            }
            if (result) {
              const jobId = result
              if(this.serviceData) {
                this.serviceData = {...this.serviceData, jobId}
                this.io.emit('expert-confirmation', this.serviceData.jobId, this.serviceData.expertId);
              } else {
                console.error('No service data to update');
              }
            } else {
              console.error('No Users found');
            }
          });
          console.log(this.serviceData)
        } else {
          console.error('No service data to update');
        }
      });
      
      socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
      });
    });
  }
}

export default SocketService;
