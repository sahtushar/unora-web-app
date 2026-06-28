import type {RedisReply, SendCommandFn} from "rate-limit-redis";

import type {RedisClient} from "../redis/client.js";

export function createRedisSendCommand(redis: RedisClient): SendCommandFn {
  return (...args: string[]) => {
    const cmd = args[0];
    if (cmd === undefined) {
      return Promise.reject(new Error("redis command missing"));
    }
    return redis.call(cmd, ...args.slice(1)) as Promise<RedisReply>;
  };
}
