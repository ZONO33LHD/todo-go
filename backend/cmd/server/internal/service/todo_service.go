package service

import (
	"context"
	"log"
	"time"

	"github.com/google/uuid"

	"todo-go/cmd/server/internal/model"
	"todo-go/cmd/server/internal/repository"
	pb "todo-go/proto/todo"
)

type TodoService struct {
	repo repository.TodoRepository
	pb.UnimplementedTodoServiceServer
}

func NewTodoService(repo repository.TodoRepository) *TodoService {
	return &TodoService{repo: repo}
}

func (s *TodoService) CreateTodo(ctx context.Context, req *pb.CreateTodoRequest) (*pb.Todo, error) {
    id := uuid.New().String()
    now := time.Now()
    todo := &model.Todo{
        ID:        id,
        Title:     req.Title,
        Completed: false,
        CreatedAt: now,
    }
    err := s.repo.Create(todo)
    if err != nil {
        return nil, err
    }
    return &pb.Todo{
        Id:        todo.ID,
        Title:     todo.Title,
        Completed: todo.Completed,
    }, nil
}

func (s *TodoService) GetTodos(ctx context.Context, req *pb.GetTodosRequest) (*pb.GetTodosResponse, error) {
	todos, err := s.repo.FindAll()
	if err != nil {
		log.Printf("FindAll エラー: %v", err)
		return nil, err
	}
	log.Printf("取得されたTodos: %+v", todos)
	var pbTodos []*pb.Todo
    for _, todo := range todos {
        pbTodo := &pb.Todo{
            Id:        todo.ID,
            Title:     todo.Title,
            Completed: todo.Completed,
        }
        log.Printf("変換されたTodo: %+v", pbTodo)
        pbTodos = append(pbTodos, pbTodo)
    }
    response := &pb.GetTodosResponse{Todos: pbTodos}
    log.Printf("GetTodos レスポンス: %+v", response)
	return response, nil
}