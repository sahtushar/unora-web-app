import type {Logger} from "../../../lib/logger.js";
import type {SmsProvider} from "./types.js";

export function createStubSmsProvider(log: Logger): SmsProvider {
  return {
    async sendOtp(params) {
      log.info(
        {
          sms: "stub_send_otp",
          toE164: params.toE164,
          code: params.code,
        },
        "stub_sms_otp"
      );
      return {ok: true};
    },
  };
}
