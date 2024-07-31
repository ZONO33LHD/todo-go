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
const grpc = __importStar(require("@grpc/grpc-js"));
const protoLoader = __importStar(require("@grpc/proto-loader"));
const path_1 = __importDefault(require("path"));
const PROTO_PATH = path_1.default.resolve(
  __dirname,
  "../../../backend/proto/todo/todo.proto"
);
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
// protoファイルを読み込む
const todoProto = grpc.loadPackageDefinition(packageDefinition).todo;
// gRPCクライアントを作成
const client = new todoProto.TodoService(
  "localhost:50051",
  grpc.credentials.createInsecure()
);
// クエリとミューテーションを定義
const resolvers = {
  Query: {
    todos: () => {
      return new Promise((resolve, reject) => {
        console.log("getTodosリクエスト開始");
        client.getTodos({}, (err, response) => {
          if (err) {
            console.error("gRPCエラー (getTodos):", err);
            reject(err);
          } else {
            console.log(
              "gRPC応答 (getTodos):",
              JSON.stringify(response, null, 2)
            );
            if (response && Array.isArray(response.todos)) {
              console.log("Todos数:", response.todos.length);
              resolve(response.todos);
            } else {
              console.error("予期しない応答形式 (getTodos):", response);
              reject(new Error("予期しない応答形式"));
            }
          }
        });
      });
    },
  },
  Mutation: {
    // createTodoミューテーションを定義
    createTodo: (_, { title }) => {
      return new Promise((resolve, reject) => {
        client.createTodo({ title }, (err, response) => {
          if (err) {
            console.error("gRPCエラー (createTodo):", err);
            reject(err);
          } else {
            console.log("gRPC応答 (createTodo):", response);
            if (response && response.id && response.title) {
              resolve(response);
            } else {
              console.error("予期しない応答形式 (createTodo):", response);
              reject(new Error("予期しない応答形式"));
            }
          }
        });
      });
    },
    // updateTodoミューテーションを定義
    updateTodo: (_, { id, completed }) => {
      return new Promise((resolve, reject) => {
        client.updateTodo({ id, completed }, (err, response) => {
          if (err) {
            console.error("gRPCエラー (updateTodo):", err);
            reject(err);
          } else {
            console.log("gRPC応答 (updateTodo):", response);
            if (response && response.id) {
              resolve(response);
            } else {
              console.error("予期しない応答形式 (updateTodo):", response);
              reject(new Error("予期しない応答形式"));
            }
          }
        });
      });
    },
    // deleteTodoミューテーションを定義
    deleteTodo: (_, { id }) => {
      return new Promise((resolve, reject) => {
        client.deleteTodo({ id }, (err, response) => {
          if (err) {
            console.error("gRPCエラー (deleteTodo):", err);
            reject(err);
          } else {
            console.log("gRPC応答 (deleteTodo):", response);
            if (response && response.id) {
              resolve(response);
            } else {
              console.error("予期しない応答形式 (deleteTodo):", response);
              reject(new Error("予期しない応答形式"));
            }
          }
        });
      });
    },
    toggleTodo: (_, { id }) => {
      return new Promise((resolve, reject) => {
        client.toggleTodo({ id }, (err, response) => {
          if (err) {
            console.error("gRPCエラー (toggleTodo):", err);
            reject(err);
          } else {
            console.log("gRPC応答 (toggleTodo):", response);
            if (response && response.id) {
              resolve(response);
            } else {
              console.error("予期しない応答形式 (toggleTodo):", response);
              reject(new Error("予期しない応答形式"));
            }
          }
        });
      });
    },
  },
};
exports.default = resolvers;
