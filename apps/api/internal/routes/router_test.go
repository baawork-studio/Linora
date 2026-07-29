package routes

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/fulltank-garage/linora/apps/api/internal/config"
	"github.com/fulltank-garage/linora/apps/api/internal/middleware"
	"github.com/fulltank-garage/linora/apps/api/internal/services"
)

func newTestRouter() http.Handler {
	cfg := config.Config{Environment: "development", Port: "8080"}
	return NewRouter(cfg, services.NewAnalysisService(), services.NewFacebookService(cfg.Facebook), nil, nil, services.NewLineIdentityService(cfg.Line))
}

func TestHealthRoute(t *testing.T) {
	recorder := httptest.NewRecorder()
	newTestRouter().ServeHTTP(recorder, httptest.NewRequest(http.MethodGet, "/health", nil))
	if recorder.Code != http.StatusOK {
		t.Fatalf("status = %d, want %d", recorder.Code, http.StatusOK)
	}
}

func TestFacebookLoginRequiresConfiguration(t *testing.T) {
	recorder := httptest.NewRecorder()
	request := httptest.NewRequest(http.MethodPost, "/api/facebook/login", nil)
	request.Header.Set("X-Linora-Dev-User", "test-line-user")
	newTestRouter().ServeHTTP(recorder, request)
	if recorder.Code != http.StatusServiceUnavailable {
		t.Fatalf("status = %d, want %d", recorder.Code, http.StatusServiceUnavailable)
	}
}

func TestFacebookDeauthorizeRouteIsPublic(t *testing.T) {
	recorder := httptest.NewRecorder()
	newTestRouter().ServeHTTP(recorder, httptest.NewRequest(http.MethodPost, "/api/facebook/deauthorize", nil))
	if recorder.Code != http.StatusServiceUnavailable {
		t.Fatalf("status = %d, want %d", recorder.Code, http.StatusServiceUnavailable)
	}
}

func TestMetaReviewSessionAllowsFacebookLoginWithoutLINE(t *testing.T) {
	cfg := config.Config{
		Environment: "production",
		MetaReview:  config.MetaReviewConfig{Enabled: true, Token: "review-access-token"},
		Port:        "8080",
	}
	router := NewRouter(cfg, services.NewAnalysisService(), services.NewFacebookService(cfg.Facebook), nil, nil, services.NewLineIdentityService(cfg.Line))
	payload, _ := json.Marshal(map[string]string{"token": "review-access-token"})
	createRecorder := httptest.NewRecorder()
	router.ServeHTTP(createRecorder, httptest.NewRequest(http.MethodPost, "/api/meta-review/session", bytes.NewReader(payload)))
	if createRecorder.Code != http.StatusOK {
		t.Fatalf("session status = %d, want %d", createRecorder.Code, http.StatusOK)
	}
	var sessionResponse struct {
		Session string `json:"session"`
	}
	if err := json.Unmarshal(createRecorder.Body.Bytes(), &sessionResponse); err != nil || sessionResponse.Session == "" {
		t.Fatalf("invalid session response: %v", err)
	}

	loginRequest := httptest.NewRequest(http.MethodPost, "/api/facebook/login", nil)
	loginRequest.Header.Set(middleware.MetaReviewSessionHeader, sessionResponse.Session)
	loginRecorder := httptest.NewRecorder()
	router.ServeHTTP(loginRecorder, loginRequest)
	if loginRecorder.Code != http.StatusServiceUnavailable {
		t.Fatalf("login status = %d, want %d", loginRecorder.Code, http.StatusServiceUnavailable)
	}
}
