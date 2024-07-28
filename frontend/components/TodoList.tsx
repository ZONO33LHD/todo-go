"use client";

import React from "react";
import { useMutation } from "@apollo/client";
import { UPDATE_TODO } from "../graphql/mutations";

interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

interface TodoListProps {
  todos: Todo[];
}

const TodoList: React.FC<TodoListProps> = ({ todos }) => {
  const [updateTodo] = useMutation(UPDATE_TODO);

  const handleToggle = async (id: string, completed: boolean) => {
    try {
      await updateTodo({ variables: { id, completed: !completed } });
    } catch (err) {
      console.error("TODO更新エラー:", err);
    }
  };

  return (
    <ul className="list-disc pl-5">
      {todos.map((todo) => (
        <li key={todo.id} className="mb-2 flex items-center">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => handleToggle(todo.id, todo.completed)}
            className="mr-2"
          />
          <span className={todo.completed ? "line-through" : ""}>
            {todo.title}
          </span>
        </li>
      ))}
    </ul>
  );
};

export default TodoList;
