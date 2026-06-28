import {useQuery} from "@tanstack/react-query";

import {fetchDiscoverQueue} from "@/services/profileService";
import {queryKeys} from "@/services/queryKeys";

export function useDiscoverQueue() {
  return useQuery({
    queryKey: queryKeys.discoverQueue,
    queryFn: fetchDiscoverQueue,
    staleTime: 30_000,
  });
}
