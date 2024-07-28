"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const grpc = __importStar(require("@grpc/grpc-js"));
const protoLoader = __importStar(require("@grpc/proto-loader"));
const path_1 = __importDefault(require("path"));
const PROTO_PATH = path_1.default.resolve(__dirname, '../../../backend/proto/todo/todo.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});
const todoProto = grpc.loadPackageDefinition(packageDefinition).todo;
const client = new todoProto.TodoService("localhost:50051", grpc.credentials.createInsecure());
const resolvers = {
    Query: {
        todos: () => {
            return new Promise((resolve, reject) => {
                client.getTodos({}, (err, response) => {
                    if (err)
                        reject(err);
                    resolve(response.todos);
                });
            });
        },
    },
    Mutation: {
        createTodo: (_, { title }) => {
            return new Promise((resolve, reject) => {
                client.createTodo({ title }, (err, response) => {
                    if (err)
                        reject(err);
                    resolve(response);
                });
            });
        },
        updateTodo: (_, { id, completed }) => {
            return new Promise((resolve, reject) => {
                client.updateTodo({ id, completed }, (err, response) => {
                    if (err)
                        reject(err);
                    resolve(response);
                });
            });
        },
    },
};
exports.default = resolvers;
