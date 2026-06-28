import {useSessionQuery} from "./useSessionQuery";

export function useActiveConnection() {
  return useSessionQuery({
    select: (s) => s.activeConnection,
  });
}
