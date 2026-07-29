package services

import (
	"crypto/hmac"
	"crypto/sha256"
	"crypto/subtle"
	"encoding/base64"
	"encoding/json"
	"errors"
	"strings"
	"time"

	"github.com/fulltank-garage/linora/apps/api/internal/config"
)

const MetaReviewSessionLifetime = 8 * time.Hour

var ErrMetaReviewUnavailable = errors.New("Meta review access is unavailable")
var ErrInvalidMetaReviewToken = errors.New("invalid Meta review access")

type metaReviewSessionPayload struct {
	ExpiresAt int64  `json:"exp"`
	OwnerID   string `json:"sub"`
}

// MetaReviewSessionService creates short-lived identities for Meta reviewers.
// It is enabled explicitly through environment variables and does not change
// the normal LINE LIFF authentication flow.
type MetaReviewSessionService struct {
	enabled bool
	now     func() time.Time
	secret  []byte
	ownerID string
}

func NewMetaReviewSessionService(cfg config.MetaReviewConfig) *MetaReviewSessionService {
	token := strings.TrimSpace(cfg.Token)
	digest := sha256.Sum256([]byte(token))
	return &MetaReviewSessionService{
		enabled: cfg.Enabled && token != "",
		now:     time.Now,
		secret:  []byte(token),
		ownerID: "meta-review:" + base64.RawURLEncoding.EncodeToString(digest[:12]),
	}
}

func (s *MetaReviewSessionService) Create(accessToken string) (string, error) {
	if !s.enabled {
		return "", ErrMetaReviewUnavailable
	}
	if subtle.ConstantTimeCompare([]byte(strings.TrimSpace(accessToken)), s.secret) != 1 {
		return "", ErrInvalidMetaReviewToken
	}
	payload, err := json.Marshal(metaReviewSessionPayload{
		ExpiresAt: s.now().Add(MetaReviewSessionLifetime).Unix(),
		OwnerID:   s.ownerID,
	})
	if err != nil {
		return "", err
	}
	encodedPayload := base64.RawURLEncoding.EncodeToString(payload)
	mac := hmac.New(sha256.New, s.secret)
	_, _ = mac.Write([]byte(encodedPayload))
	return encodedPayload + "." + base64.RawURLEncoding.EncodeToString(mac.Sum(nil)), nil
}

func (s *MetaReviewSessionService) Verify(session string) (string, error) {
	if !s.enabled {
		return "", ErrMetaReviewUnavailable
	}
	parts := strings.Split(session, ".")
	if len(parts) != 2 {
		return "", ErrInvalidMetaReviewToken
	}
	providedMAC, err := base64.RawURLEncoding.DecodeString(parts[1])
	if err != nil {
		return "", ErrInvalidMetaReviewToken
	}
	mac := hmac.New(sha256.New, s.secret)
	_, _ = mac.Write([]byte(parts[0]))
	if !hmac.Equal(providedMAC, mac.Sum(nil)) {
		return "", ErrInvalidMetaReviewToken
	}
	payloadBytes, err := base64.RawURLEncoding.DecodeString(parts[0])
	if err != nil {
		return "", ErrInvalidMetaReviewToken
	}
	var payload metaReviewSessionPayload
	if err := json.Unmarshal(payloadBytes, &payload); err != nil || payload.OwnerID != s.ownerID || payload.ExpiresAt <= s.now().Unix() {
		return "", ErrInvalidMetaReviewToken
	}
	return payload.OwnerID, nil
}
