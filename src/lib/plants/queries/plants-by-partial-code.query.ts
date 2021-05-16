import { PaginatedResult } from "@treeditor/models/paginated-result";
import { Plant } from "@treeditor/models/plant";
import { useQuery } from "react-query";

const plantsByPartialCode = async (partialCode: string): Promise<PaginatedResult<Plant>> => {
  if (!partialCode) {
    return {
      total: 0,
      skip: 0,
      limit: 100,
      items: []
    }
  }
  
  return fetch(`/api/plants?partial-code=${encodeURIComponent(partialCode)}`).then(res => res.json())
}

export function usePlantsByPartialCodeQuery(partialCode: string) {
  return useQuery<PaginatedResult<Plant>>(['plants-by-partial-code', partialCode], () => plantsByPartialCode(partialCode), {refetchOnWindowFocus: false, refetchOnReconnect: false});
}