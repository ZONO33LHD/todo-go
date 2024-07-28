package service

import (
	"context"

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
	todo := &model.Todo{
		Title: req.Title,
	}
	err := s.repo.Create(todo)
	if err != nil {
		return nil, err
	}
	return &pb.Todo{
		Id:        uint64(todo.ID),
		Title:     todo.Title,
		Completed: todo.Completed,
	}, nil
}

func (s *TodoService) GetTodos(ctx context.Context, req *pb.GetTodosRequest) (*pb.GetTodosResponse, error) {
	todos, err := s.repo.FindAll()
	if err != nil {
		return nil, err
	}
	var pbTodos []*pb.Todo
	for _, todo := range todos {
		pbTodos = append(pbTodos, &pb.Todo{
			Id:        uint64(todo.ID),
			Title:     todo.Title,
			Completed: todo.Completed,
		})
	}
	return &pb.GetTodosResponse{Todos: pbTodos}, nil
}
