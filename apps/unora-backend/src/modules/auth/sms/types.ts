export type SendSmsResult = {ok: true} | {ok: false; reason: string};

export interface SmsProvider {
  sendOtp(params: {code: string; toE164: string}): Promise<SendSmsResult>;
}
