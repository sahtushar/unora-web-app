process.env.NODE_ENV ??= "test";
process.env.HOST ??= "127.0.0.1";
process.env.PORT ??= "3001";
process.env.LOG_LEVEL ??= "silent";

process.env.DATABASE_URL ??=
  "postgresql://unora:unora@127.0.0.1:5433/unora";
process.env.REDIS_URL ??= "redis://127.0.0.1:6379";

process.env.JWT_ACCESS_SECRET ??=
  "test_jwt_access_secret________________";
process.env.OTP_PEPPER ??= "test_otp_pepper_16_chars________";

process.env.GOOGLE_CLIENT_IDS ??=
  "123456789-test.apps.googleusercontent.com";

process.env.CORS_ORIGINS ??= "http://localhost:5173";

process.env.PUBLIC_MEDIA_BASE_URL ??= "http://127.0.0.1:3001/v1/media";
process.env.USER_PHOTOS_LOCAL_DIR ??= ".tmp/test-user-photos";
process.env.TRUST_PROXY ??= "false";
process.env.REQUIRE_HTTPS ??= "false";

process.env.ACCESS_TOKEN_TTL_SECONDS ??= "900";
process.env.REFRESH_TOKEN_TTL_DAYS ??= "30";

process.env.RATE_LIMIT_GLOBAL_MAX ??= "1000";
process.env.RATE_LIMIT_GLOBAL_WINDOW_MS ??= "60000";
process.env.RATE_LIMIT_AUTH_MAX ??= "100";
process.env.RATE_LIMIT_AUTH_WINDOW_MS ??= "60000";

process.env.SMS_PROVIDER ??= "stub";

process.env.OTP_LENGTH ??= "6";
process.env.OTP_TTL_SECONDS ??= "600";
process.env.OTP_SEND_COOLDOWN_SECONDS ??= "1";
process.env.OTP_SEND_MAX_PER_WINDOW ??= "10";
process.env.OTP_SEND_WINDOW_SECONDS ??= "3600";
process.env.OTP_VERIFY_MAX_ATTEMPTS ??= "5";
process.env.OTP_VERIFY_LOCK_SECONDS ??= "900";

process.env.ENABLE_OPENAPI_UI ??= "false";

// Set DATABASE_INTEGRATION=1 when Postgres + Redis from docker compose are reachable.
process.env.DATABASE_INTEGRATION ??= "0";
