import { PaginatedResult } from "@treeditor/models/paginated-result";
import { Plant } from "@treeditor/models/plant";
import { useQuery } from "react-query";

const fetchPlantsWithPosition = () => fetch('/api/plants?has-position=true').then(res => res.json());

export const plantsWithPositionQueryKey = 'plants-with-position';

export function usePlantsWithPositionQuery() {
  return useQuery<PaginatedResult<Plant>>(plantsWithPositionQueryKey, fetchPlantsWithPosition, {refetchOnWindowFocus: false});
}