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

// protoファイルを読み込む
const todoProto = grpc.loadPackageDefinition(packageDefinition).todo;

// gRPCクライアントを作成
const client = new (todoProto as any).TodoService(
  "localhost:50051",
  grpc.credentials.createInsecure()
) as any;

// Todo型を定義
interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

// クエリとミューテーションを定義
const resolvers = {
  Query: {
    // todosクエリを定義
    todos: (): Promise<Todo[]> => {
      return new Promise((resolve, reject) => {
        console.log('getTodosリクエスト開始');
        client.getTodos(
          {},
          (err: Error | null, response: { todos: Todo[] }) => {
            if (err) {
              console.error('gRPCエラー (getTodos):', err);
              console.error('エラーの詳細:', err.stack);
              reject(err);
            } else {
              console.log('gRPC応答 (getTodos):', JSON.stringify(response, null, 2));
              if (response && response.todos) {
                console.log('Todos数:', response.todos.length);
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
    // createTodoミューテーションを定義
    createTodo: (_: any, { title }: { title: string }) => {
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
    // updateTodoミューテーションを定義
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
    // deleteTodoミューテーションを定義
    deleteTodo: (
      _: any,
      { id }: { id: string }
    ): Promise<Todo> => {
      return new Promise((resolve, reject) => {
        client.deleteTodo({ id }, (err: Error | null, response: Todo) => {
          // エラーハンドリングと応答の処理
        });
      });
    },
    toggleTodo: (_: any, { id }: { id: string }): Promise<Todo> => {
      return new Promise((resolve, reject) => {
        client.toggleTodo({ id }, (err: Error | null, response: Todo) => {
          if (err) {
            console.error('gRPCエラー (toggleTodo):', err);
            reject(err);
          } else {
            console.log('gRPC応答 (toggleTodo):', response);
            if (response && response.id) {
              resolve(response);
            } else {
              console.error('予期しない応答形式 (toggleTodo):', response);
              reject(new Error('予期しない応答形式'));
            }
          }
        });
      });
    },
  },
};

export default resolvers;
