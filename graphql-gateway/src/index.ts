import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import { Express } from 'express-serve-static-core';
import { readFileSync } from 'fs';
import path from 'path';
import cors from 'cors';
import resolvers from './resolvers/todo';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';

const typeDefs = readFileSync(path.join(__dirname, 'schema', 'todo.graphql'), 'utf8');

const app: Express = express();
app.use(cors());

const PROTO_PATH = path.resolve(__dirname, '../../backend/proto/todo/todo.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
const todoProto = protoDescriptor.todo;

const client = new (todoProto as any).TodoService('localhost:50051', grpc.credentials.createInsecure()) as any;

// 接続テスト
client.getTodos({}, (err: Error | null, response: any) => {
  if (err) {
    console.error('gRPC接続テストエラー:', err);
    console.error('利用可能なメソッド:', Object.keys(client));
    process.exit(1); // エラーが発生した場合、プロセスを終了
  } else {
    console.log('gRPC接続テスト成功:', response);
    console.log('利用可能なメソッド:', Object.keys(client));
  }
});

async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();
  server.applyMiddleware({ app: app as any, path: '/graphql' });

  await new Promise<void>((resolve) => app.listen({ port: 4000 }, resolve));
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}

startServer();
