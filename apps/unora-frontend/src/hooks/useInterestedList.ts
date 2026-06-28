import {useSessionQuery} from "./useSessionQuery";

export function useInterestedList() {
  return useSessionQuery({
    select: (s) => s.interested,
  });
}
