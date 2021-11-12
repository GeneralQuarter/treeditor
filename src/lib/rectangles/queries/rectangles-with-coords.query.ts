import { PaginatedResult } from '@treeditor/models/paginated-result';
import { Rectangle } from '@treeditor/models/rectangle';
import { useQuery } from 'react-query';

const fetchRectanglesWithCoords = () => fetch('/api/rectangles?has-coords=true').then(res => res.json());

export const rectanglesWithCoordsQueryKey = 'rectangles-with-coords';

export function useRectanglesWithCoordsQuery() {
  return useQuery<PaginatedResult<Rectangle>>(rectanglesWithCoordsQueryKey, fetchRectanglesWithCoords, {refetchOnWindowFocus: false});
}