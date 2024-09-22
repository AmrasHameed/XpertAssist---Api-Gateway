import path from 'path';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import 'dotenv/config';
const protoLoaderOptions: protoLoader.Options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};

const packageDef = protoLoader.loadSync(path.resolve(__dirname, '../proto/expert.proto'), protoLoaderOptions);
const grpcObject = grpc.loadPackageDefinition(packageDef) as any; 

const Domain = process.env.NODE_ENV === 'dev' ? process.env.DEV_DOMAIN : process.env.PRO_DOMAIN_USER;

const ExpertService = new grpcObject.expert.Expert(
  `${Domain}:${process.env.EXPERT_GRPC_PORT}`, grpc.credentials.createInsecure()
);

export { ExpertService };
