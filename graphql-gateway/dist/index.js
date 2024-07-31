"use strict";
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (
          !desc ||
          ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)
        ) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
      }
    : function (o, v) {
        o["default"] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const express_1 = __importDefault(require("express"));
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const todo_1 = __importDefault(require("./resolvers/todo"));
const grpc = __importStar(require("@grpc/grpc-js"));
const protoLoader = __importStar(require("@grpc/proto-loader"));
const typeDefs = (0, fs_1.readFileSync)(
  path_1.default.join(__dirname, "schema", "todo.graphql"),
  "utf8"
);
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
const PROTO_PATH = path_1.default.resolve(
  __dirname,
  "../../backend/proto/todo/todo.proto"
);
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
const todoProto = protoDescriptor.todo;
const client = new todoProto.TodoService(
  "localhost:50051",
  grpc.credentials.createInsecure()
);
// 接続テスト
client.getTodos({}, (err, response) => {
  if (err) {
    console.error("gRPC接続テストエラー:", err);
    console.error("利用可能なメソッド:", Object.keys(client));
    process.exit(1); // エラーが発生した場合、プロセスを終了
  } else {
    console.log("gRPC接続テスト成功:", response);
    console.log("利用可能なメソッド:", Object.keys(client));
  }
});
async function startServer() {
  const server = new apollo_server_express_1.ApolloServer({
    typeDefs,
    resolvers: todo_1.default,
  });
  await server.start();
  server.applyMiddleware({ app: app, path: "/graphql" });
  await new Promise((resolve) => app.listen({ port: 4000 }, resolve));
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}
startServer();
