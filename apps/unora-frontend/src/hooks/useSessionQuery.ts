import {type UseQueryOptions, useQuery} from "@tanstack/react-query";

import {fetchSessionState} from "@/services/profileService";
import {queryKeys} from "@/services/queryKeys";
import type {AppSessionState} from "@/types";

type SessionQueryOptions<TSelected> = Omit<
  UseQueryOptions<AppSessionState, Error, TSelected, typeof queryKeys.session>,
  "queryKey" | "queryFn"
>;

export function useSessionQuery<TSelected = AppSessionState>(
  options?: SessionQueryOptions<TSelected>
) {
  return useQuery({
    queryKey: queryKeys.session,
    queryFn: fetchSessionState,
    staleTime: 60_000,
    ...options,
  });
}
