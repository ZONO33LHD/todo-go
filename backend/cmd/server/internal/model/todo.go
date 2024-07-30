package model

import (
	"time"

	"gorm.io/gorm"
)

type Todo struct {
	gorm.Model
    ID        string    `json:"id" gorm:"primaryKey;type:uuid"`
	Title     string    `json:"title"`
	Completed bool      `json:"completed"`
	CreatedAt time.Time `json:"created_at"`
}
