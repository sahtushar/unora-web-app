import type {Env} from "../../../config/env.js";
import type {Logger} from "../../../lib/logger.js";
import {createStubSmsProvider} from "./stubSmsProvider.js";
import type {SmsProvider} from "./types.js";

export function createSmsProvider(env: Env, log: Logger): SmsProvider {
  switch (env.SMS_PROVIDER) {
    case "stub":
      return createStubSmsProvider(log);
    default: {
      const _exhaustive: never = env.SMS_PROVIDER;
      return _exhaustive;
    }
  }
}
