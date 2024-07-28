import { useQuery, useMutation, gql } from '@apollo/client';
import TodoList from './TodoList';
import TodoForm from './TodoForm';

const GET_TODOS = gql`
  query GetTodos {
    todos {
      id
      title
      completed
    }
  }
`;

const CREATE_TODO = gql`
  mutation CreateTodo($title: String!) {
    createTodo(title: $title) {
      id
      title
      completed
    }
  }
`;

export default function Home() {
  const { loading, error, data } = useQuery(GET_TODOS);
  const [createTodo] = useMutation(CREATE_TODO, {
    refetchQueries: [{ query: GET_TODOS }],
  });

  if (loading) return <p>読み込み中...</p>;
  if (error) return <p>エラーが発生しました: {error.message}</p>;

  const handleCreateTodo = async (title: string) => {
    try {
      await createTodo({ variables: { title } });
    } catch (err) {
      console.error('TODO作成エラー:', err);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">TODOリスト</h1>
      <TodoForm onSubmit={handleCreateTodo} />
      <TodoList todos={data.todos} />
    </div>
  );
}
