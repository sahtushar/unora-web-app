import type {Db} from "../../db/client.js";
import {authAuditLogs} from "../../db/schema.js";

export type AuthAuditEvent =
  | "otp_sent"
  | "otp_verified"
  | "otp_send_blocked"
  | "google_login"
  | "refresh_rotated"
  | "logout"
  | "refresh_rejected";

export async function insertAuthAuditLog(
  db: Db,
  params: {
    eventType: AuthAuditEvent;
    ip?: string;
    meta?: Record<string, unknown>;
    userAgent?: string;
    userId?: string;
  }
): Promise<void> {
  await db.insert(authAuditLogs).values({
    eventType: params.eventType,
    ip: params.ip,
    meta: params.meta,
    userAgent: params.userAgent,
    userId: params.userId,
  });
}
