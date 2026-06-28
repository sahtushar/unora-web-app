import path from "node:path";
import {z} from "zod";

const twentyMb = 20 * 1024 * 1024;

const envSchema = z
  .object({
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    PORT: z.coerce.number().int().positive().default(8000),
    HOST: z.string().min(1).default("0.0.0.0"),
    LOG_LEVEL: z
      .enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"])
      .default("info"),
    DATABASE_URL: z
      .string()
      .min(1)
      .refine(
        (value) =>
          value.startsWith("postgresql://") || value.startsWith("postgres://"),
        "Must be a postgres connection string"
      ),
    REDIS_URL: z
      .string()
      .min(1)
      .refine(
        (value) =>
          value.startsWith("redis://") || value.startsWith("rediss://"),
        "Must be a redis connection string"
      ),
    JWT_ACCESS_SECRET: z.string().min(32),
    OTP_PEPPER: z.string().min(16),
    GOOGLE_CLIENT_IDS: z
      .string()
      .min(1)
      .transform((value) =>
        value
          .split(",")
          .map((id) => id.trim())
          .filter(Boolean)
      ),
    CORS_ORIGINS: z
      .string()
      .default("http://localhost:5173")
      .transform((value) =>
        value
          .split(",")
          .map((origin) => origin.trim())
          .filter(Boolean)
      ),
    TRUST_PROXY: z
      .enum(["true", "false"])
      .default("false")
      .transform((value) => value === "true"),
    // When TRUST_PROXY is true, Express receives this number (not boolean true), which satisfies
    // express-rate-limit (ERR_ERL_PERMISSIVE_TRUST_PROXY) and matches one edge hop (Vercel, Render).
    TRUST_PROXY_HOPS: z.coerce.number().int().min(1).max(32).default(1),
    REQUIRE_HTTPS: z
      .enum(["true", "false"])
      .default("false")
      .transform((value) => value === "true"),
    ACCESS_TOKEN_TTL_SECONDS: z.coerce.number().int().positive().default(900),
    REFRESH_TOKEN_TTL_DAYS: z.coerce.number().int().positive().default(30),
    RATE_LIMIT_GLOBAL_MAX: z.coerce.number().int().positive().default(300),
    RATE_LIMIT_GLOBAL_WINDOW_MS: z.coerce
      .number()
      .int()
      .positive()
      .default(60_000),
    RATE_LIMIT_AUTH_MAX: z.coerce.number().int().positive().default(30),
    RATE_LIMIT_AUTH_WINDOW_MS: z.coerce
      .number()
      .int()
      .positive()
      .default(60_000),
    RATE_LIMIT_UPLOAD_MAX: z.coerce.number().int().positive().default(20),
    RATE_LIMIT_UPLOAD_WINDOW_MS: z.coerce
      .number()
      .int()
      .positive()
      .default(900_000),
    SMS_PROVIDER: z.enum(["stub"]).default("stub"),
    OTP_LENGTH: z.coerce.number().int().min(4).max(8).default(6),
    OTP_TTL_SECONDS: z.coerce.number().int().positive().default(600),
    OTP_SEND_COOLDOWN_SECONDS: z.coerce.number().int().positive().default(60),
    OTP_SEND_MAX_PER_WINDOW: z.coerce.number().int().positive().default(3),
    OTP_SEND_WINDOW_SECONDS: z.coerce.number().int().positive().default(3600),
    OTP_VERIFY_MAX_ATTEMPTS: z.coerce.number().int().positive().default(5),
    OTP_VERIFY_LOCK_SECONDS: z.coerce.number().int().positive().default(900),
    ENABLE_OPENAPI_UI: z
      .enum(["true", "false"])
      .default("true")
      .transform((value) => value === "true"),
    USER_PHOTOS_STORAGE: z.enum(["local", "s3", "postgres"]).default("local"),
    USER_PHOTOS_LOCAL_DIR: z.string().min(1).default("data/user-photos"),
    USER_PHOTOS_MAX_BYTES: z.coerce.number().int().positive().default(twentyMb),
    USER_PHOTOS_MAX_PER_USER: z.coerce
      .number()
      .int()
      .positive()
      .max(50)
      .default(8),
    PUBLIC_MEDIA_BASE_URL: z
      .string()
      .min(1)
      .url()
      .default("http://127.0.0.1:8000/v1/media"),
    S3_BUCKET: z.string().min(1).optional(),
    S3_REGION: z.string().min(1).optional(),
    S3_ENDPOINT: z.string().url().optional(),
    S3_ACCESS_KEY_ID: z.string().min(1).optional(),
    S3_SECRET_ACCESS_KEY: z.string().min(1).optional(),
    S3_SIGNED_URL_TTL_SECONDS: z.coerce.number().int().positive().default(3600),
  })
  .superRefine((data, ctx) => {
    if (data.USER_PHOTOS_STORAGE === "s3") {
      if (data.S3_BUCKET === undefined || data.S3_BUCKET.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "S3_BUCKET is required when USER_PHOTOS_STORAGE=s3",
          path: ["S3_BUCKET"],
        });
      }
      if (data.S3_REGION === undefined || data.S3_REGION.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "S3_REGION is required when USER_PHOTOS_STORAGE=s3",
          path: ["S3_REGION"],
        });
      }
      const hasKey =
        data.S3_ACCESS_KEY_ID !== undefined && data.S3_ACCESS_KEY_ID.length > 0;
      const hasSecret =
        data.S3_SECRET_ACCESS_KEY !== undefined &&
        data.S3_SECRET_ACCESS_KEY.length > 0;
      if (hasKey !== hasSecret) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "S3_ACCESS_KEY_ID and S3_SECRET_ACCESS_KEY must both be set or both omitted (IAM role / instance profile)",
          path: ["S3_ACCESS_KEY_ID"],
        });
      }
    }
  });

export type Env = z.infer<typeof envSchema>;

export function loadEnv(raw: NodeJS.ProcessEnv): Env {
  const input: NodeJS.ProcessEnv = {...raw};
  // Vercel injects VERCEL and forwards X-Forwarded-For. express-rate-limit throws if trust proxy
  // is false while that header is present (ERR_ERL_UNEXPECTED_X_FORWARDED_FOR).
  // https://github.com/nfriedly/express-rate-limit/issues/1078
  const vercel = input["VERCEL"];
  if (
    vercel !== undefined &&
    vercel.length > 0 &&
    input["TRUST_PROXY"] === undefined
  ) {
    input["TRUST_PROXY"] = "true";
  }
  const parsed = envSchema.safeParse(input);
  if (!parsed.success) {
    const message = parsed.error.flatten().fieldErrors;
    throw new Error(`Invalid environment: ${JSON.stringify(message)}`);
  }
  const data = parsed.data;
  if (
    vercel !== undefined &&
    vercel.length > 0 &&
    data.USER_PHOTOS_STORAGE === "local"
  ) {
    throw new Error(
      "Invalid environment: on Vercel, USER_PHOTOS_STORAGE=local is not supported (no durable writable disk). " +
        "Use USER_PHOTOS_STORAGE=postgres (images in the database) or s3, with PUBLIC_MEDIA_BASE_URL " +
        "set to a URL that serves the photos (e.g. https://your-app.vercel.app/v1/media for this API when using postgres, or your CDN for S3)."
    );
  }
  const userPhotosLocalDir = path.isAbsolute(data.USER_PHOTOS_LOCAL_DIR)
    ? data.USER_PHOTOS_LOCAL_DIR
    : path.resolve(process.cwd(), data.USER_PHOTOS_LOCAL_DIR);
  return {...data, USER_PHOTOS_LOCAL_DIR: userPhotosLocalDir};
}
