package repository

import (
	"todo-go/cmd/server/internal/model"
	"gorm.io/gorm"
)

type TodoRepository interface {
	Create(*model.Todo) error
	FindAll() ([]*model.Todo, error)
}

type todoRepository struct {
	db *gorm.DB
}

func NewTodoRepository(db *gorm.DB) TodoRepository {
	return &todoRepository{db: db}
}

func (r *todoRepository) Create(todo *model.Todo) error {
	return r.db.Create(todo).Error
}

func (r *todoRepository) FindAll() ([]*model.Todo, error) {
	var todos []*model.Todo
	err := r.db.Find(&todos).Error
	return todos, err
}
