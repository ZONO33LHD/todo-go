import { useQuery, useMutation } from "@apollo/client";
import { GET_TODOS, TOGGLE_TODO, CREATE_TODO } from "../graphql/mutations";
import TodoList, { Todo } from "./TodoList";
import TodoForm from "./TodoForm";
import { useState } from "react";

export default function Home() {
  const { loading, error: queryError, data } = useQuery<{ todos: Todo[] }>(GET_TODOS);
  const [toggleTodo] = useMutation(TOGGLE_TODO);
  const [createTodo] = useMutation(CREATE_TODO);
  const [error, setError] = useState<string | null>(null);

  const handleCreateTodo = async (title: string) => {
    try {
      setError(null);
      await createTodo({
        variables: { title },
        update: (cache, { data: { createTodo } }) => {
          const existingTodos = cache.readQuery<{ todos: Todo[] }>({ query: GET_TODOS });
          if (existingTodos) {
            cache.writeQuery({
              query: GET_TODOS,
              data: { todos: [...existingTodos.todos, createTodo] },
            });
          }
        },
      });
    } catch (err) {
      console.error("TODO作成エラー:", err);
      setError("TODOの作成中にエラーが発生しました。");
    }
  };

  const handleToggleComplete = async (id: string) => {
    try {
      setError(null);
      await toggleTodo({
        variables: { id },
        update: (cache, { data: { toggleTodo } }) => {
          const existingTodos = cache.readQuery<{ todos: Todo[] }>({ query: GET_TODOS });
          if (existingTodos) {
            const newTodos = existingTodos.todos.map(todo =>
              todo.id === id ? { ...todo, completed: toggleTodo.completed } : todo
            );
            cache.writeQuery({
              query: GET_TODOS,
              data: { todos: newTodos },
            });
          }
        },
      });
    } catch (err) {
      console.error("TODOの切り替えエラー:", err);
      setError("TODOの状態を変更中にエラーが発生しました。");
    }
  };

  if (loading) return <p>読み込み中...</p>;
  if (queryError) return <p>エラーが発生しました: {queryError.message}</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">TODOリスト</h1>
      <TodoForm onSubmit={handleCreateTodo} />
      {data && <TodoList todos={data.todos} onToggleComplete={handleToggleComplete} />}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
