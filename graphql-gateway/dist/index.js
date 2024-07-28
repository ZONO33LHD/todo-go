"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const express_1 = __importDefault(require("express"));
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const todo_1 = __importDefault(require("./resolvers/todo"));
const typeDefs = (0, fs_1.readFileSync)(path_1.default.join(__dirname, 'schema', 'todo.graphql'), 'utf8');
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
async function startServer() {
    const server = new apollo_server_express_1.ApolloServer({
        typeDefs,
        resolvers: todo_1.default,
    });
    await server.start();
    server.applyMiddleware({ app: app, path: '/graphql' });
    await new Promise((resolve) => app.listen({ port: 4000 }, resolve));
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}
startServer();
