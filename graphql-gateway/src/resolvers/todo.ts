import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from 'path';

const PROTO_PATH = path.resolve(__dirname, '../../../backend/proto/todo/todo.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const todoProto = grpc.loadPackageDefinition(packageDefinition).todo;
const client = new (todoProto as any).TodoService(
  "localhost:50051",
  grpc.credentials.createInsecure()
);

interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

const resolvers = {
  Query: {
    todos: (): Promise<Todo[]> => {
      return new Promise((resolve, reject) => {
        client.getTodos(
          {},
          (err: Error | null, response: { todos: Todo[] }) => {
            if (err) {
              console.error('gRPCエラー (getTodos):', err);
              reject(err);
            } else {
              console.log('gRPC応答 (getTodos):', response);
              if (response && response.todos) {
                resolve(response.todos);
              } else {
                console.error('予期しない応答形式 (getTodos):', response);
                reject(new Error('予期しない応答形式'));
              }
            }
          }
        );
      });
    },
  },
  Mutation: {
    createTodo: (_: any, { title }: { title: string }): Promise<Todo> => {
      return new Promise((resolve, reject) => {
        client.createTodo({ title }, (err: Error | null, response: Todo) => {
          if (err) {
            console.error('gRPCエラー (createTodo):', err);
            reject(err);
          } else {
            console.log('gRPC応答 (createTodo):', response);
            if (response && response.id && response.title) {
              resolve(response);
            } else {
              console.error('予期しない応答形式 (createTodo):', response);
              reject(new Error('予期しない応答形式'));
            }
          }
        });
      });
    },
    updateTodo: (
      _: any,
      { id, completed }: { id: string; completed: boolean }
    ): Promise<Todo> => {
      return new Promise((resolve, reject) => {
        client.updateTodo(
          { id, completed },
          (err: Error | null, response: Todo) => {
            if (err) {
              console.error('gRPCエラー (updateTodo):', err);
              reject(err);
            } else {
              console.log('gRPC応答 (updateTodo):', response);
              if (response && response.id) {
                resolve(response);
              } else {
                console.error('予期しない応答形式 (updateTodo):', response);
                reject(new Error('予期しない応答形式'));
              }
            }
          }
        );
      });
    },
  },
};

export default resolvers;
