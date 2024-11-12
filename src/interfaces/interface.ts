export interface AuthResponse {
  message: string;
  name: string;
  email:string;
  refreshToken: string;
  token: string;
  _id: string;
  service: string;
  image: string;
  mobile: string;
  isVerified: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  serviceImage:string;
}

export interface User {
  message: string;
  id: string;
  name: string;
  email: string;
  mobile: number;
  userImage: string;
  password?: string;
  accountStatus?: string;
  createdAt?: Date;        
  updatedAt?: Date;
}

export interface Job {
  message: string;
  _id: string;
  service: string;
  expertId: string;
  userId: string;
  userLocation: {
    lat: number;
    lng: number;
  };
  expertLocation: {
    latitude: number;
    longitude: number;
  };
  notes?: string;
  distance: number;
  totalAmount: number;
  ratePerHour: number;
  status: string;
  pin: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UpdateUser {
  message: string;
  name: string;
  mobile: number;
  userImage: string;
}

export interface UpdateExpert {
  message: string;
  name: string;
  mobile: number;
  expertImage: string;
}

interface Earning {
  jobId: string;
  earning: number;
  type: string;
}

export interface WalletDataResponse {
  totalEarning: number;
  earnings: Earning[];
}

export interface Expert {
  message?: string;
  id?: string;              
  name?: string;
  email?: string;
  mobile?: number;
  expertImage?: string;
  service?: string;
  password?: string;
  accountStatus?: string;   
  isVerified?: string;      
  verificationDetails?: {
    govIdType?: string;
    govIdNumber?: string;
    document?: string;
  };
  status?: string;
  earnings?: Earning[];
  totalEarning?: number;
  createdAt?: Date;        
  updatedAt?: Date;
}



export interface AdminAuthResponse {
  message: string;
  name: string;
  token: string;
}

export interface Tokens {
  access_token: string;
  refresh_token: string;
}

export interface UserCredentials {
  userId: string;
  role: string;
}

interface DailyEarnings {
  _id: number;
  dailyEarnings: number;
  date: string;
}

export interface AggregationResponse {
  dailyEarningsCurrentMonth: DailyEarnings[];
  totalEarnings: number;
  totalJobs: number;
  totalCompletedJobs: number;
  totalDistance: number;
  totalEarningsGrowth: number | null;
  totalJobsGrowth: number | null;
  totalCompletedJobsGrowth: number | null;
  totalDistanceGrowth: number | null;
}

export interface UserData {
  totalUsers: number; 
  userGrowthRate: number; 
}

export interface ExpertData {
  totalExperts: number; 
  expertGrowthRate: number; 
  top5Experts: TopExpert[];
}

export interface TopExpert {
  expertId: string; 
  name: string;
  email: string;
  totalEarning: number;
}

export interface ServiceData {
  totalServices: number; 
  serviceGrowthRate: number; 
  totalJobsCompleted: number; 
  jobCompletionGrowthRate: number; 
  top5BookedServices: TopBookedService[]; 
}

export interface TopBookedService {
  serviceId: string; 
  bookingCount: number; 
  name: string;
}

export interface DashboardData {
  userData: UserData; 
  expertData: ExpertData; 
  serviceData: ServiceData; 
}


