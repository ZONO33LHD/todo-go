"use client";

import React from "react";

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

interface TodoListProps {
  todos: Todo[];
  onToggleComplete: (id: string) => void;
}

const TodoList: React.FC<TodoListProps> = ({ todos, onToggleComplete }) => {
  return (
    <ul className="space-y-3">
      {todos.map((todo) => (
        <li
          key={todo.id}
          className="flex items-center bg-white p-4 rounded-md shadow-sm"
        >
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => onToggleComplete(todo.id)}
            className="mr-3 h-5 w-5 text-blue-500 focus:ring-blue-400 border-gray-300 rounded"
          />
          <span
            className={`text-lg ${
              todo.completed ? "line-through text-gray-500" : "text-gray-800"
            }`}
          >
            {todo.title}
          </span>
        </li>
      ))}
    </ul>
  );
};

export default TodoList;
