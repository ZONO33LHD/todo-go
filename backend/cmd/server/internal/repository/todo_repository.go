package repository

import (
	"gorm.io/gorm"
	"todo-go/cmd/server/internal/model"
)

// TodoRepository インターフェース
type TodoRepository interface {
	Create(*model.Todo) error
	FindAll() ([]*model.Todo, error)
	ToggleCompleted(id string) (*model.Todo, error)
}

// ToggleCompleted メソッド
func (r *todoRepository) ToggleCompleted(id string) (*model.Todo, error) {
	var todo model.Todo
	if err := r.db.First(&todo, "id = ?", id).Error; err != nil {
		return nil, err
	}
	todo.Completed = !todo.Completed
	if err := r.db.Save(&todo).Error; err != nil {
		return nil, err
	}
	return &todo, nil
}

// todoRepository 構造体
type todoRepository struct {
	db *gorm.DB
}

// NewTodoRepository 関数
func NewTodoRepository(db *gorm.DB) TodoRepository {
	return &todoRepository{db: db}
}

// Create メソッド
func (r *todoRepository) Create(todo *model.Todo) error {
	return r.db.Create(todo).Error
}

// FindAll メソッド
func (r *todoRepository) FindAll() ([]*model.Todo, error) {
	var todos []*model.Todo
	err := r.db.Find(&todos).Error
	return todos, err
}

// FindByID メソッド
func (r *todoRepository) FindByID(id string) (*model.Todo, error) {
	var todo model.Todo
	err := r.db.First(&todo, "id = ?", id).Error
	return &todo, err
}
