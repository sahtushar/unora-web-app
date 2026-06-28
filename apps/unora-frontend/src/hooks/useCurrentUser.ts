import {useQuery} from "@tanstack/react-query";

import {fetchCurrentUser} from "@/services/profileService";
import {queryKeys} from "@/services/queryKeys";

export function useCurrentUser() {
  return useQuery({
    queryKey: queryKeys.currentUser,
    queryFn: fetchCurrentUser,
    staleTime: 5 * 60_000,
  });
}
