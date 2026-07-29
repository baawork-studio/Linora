package controllers

import (
	"net/http"

	"github.com/fulltank-garage/linora/apps/api/internal/services"
	"github.com/gin-gonic/gin"
)

type MetaReviewController struct {
	sessions *services.MetaReviewSessionService
}

func NewMetaReviewController(sessions *services.MetaReviewSessionService) *MetaReviewController {
	return &MetaReviewController{sessions: sessions}
}

func (c *MetaReviewController) CreateSession(ctx *gin.Context) {
	var input struct {
		Token string `json:"token"`
	}
	if err := ctx.ShouldBindJSON(&input); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid Meta review request"})
		return
	}
	session, err := c.sessions.Create(input.Token)
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Meta review access is unavailable"})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"session": session})
}
