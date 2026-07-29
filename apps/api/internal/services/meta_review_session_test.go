package services

import (
	"testing"
	"time"

	"github.com/fulltank-garage/linora/apps/api/internal/config"
)

func TestMetaReviewSessionLifecycle(t *testing.T) {
	service := NewMetaReviewSessionService(config.MetaReviewConfig{Enabled: true, Token: "review-access-token"})
	service.now = func() time.Time { return time.Date(2026, 7, 30, 10, 0, 0, 0, time.UTC) }

	session, err := service.Create("review-access-token")
	if err != nil {
		t.Fatalf("Create returned error: %v", err)
	}
	ownerID, err := service.Verify(session)
	if err != nil {
		t.Fatalf("Verify returned error: %v", err)
	}
	if ownerID == "" || ownerID[:12] != "meta-review:" {
		t.Fatalf("owner ID = %q, want a meta review owner", ownerID)
	}
	if _, err := service.Create("wrong-token"); err == nil {
		t.Fatal("Create accepted an invalid token")
	}
}

func TestMetaReviewSessionExpires(t *testing.T) {
	service := NewMetaReviewSessionService(config.MetaReviewConfig{Enabled: true, Token: "review-access-token"})
	now := time.Date(2026, 7, 30, 10, 0, 0, 0, time.UTC)
	service.now = func() time.Time { return now }
	session, err := service.Create("review-access-token")
	if err != nil {
		t.Fatalf("Create returned error: %v", err)
	}
	service.now = func() time.Time { return now.Add(MetaReviewSessionLifetime + time.Second) }
	if _, err := service.Verify(session); err == nil {
		t.Fatal("Verify accepted an expired session")
	}
}
