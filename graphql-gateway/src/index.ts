import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import { Express } from 'express-serve-static-core';
import { readFileSync } from 'fs';
import path from 'path';
import cors from 'cors';
import resolvers from './resolvers/todo';

const typeDefs = readFileSync(path.join(__dirname, 'schema', 'todo.graphql'), 'utf8');

const app: Express = express();
app.use(cors());

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
