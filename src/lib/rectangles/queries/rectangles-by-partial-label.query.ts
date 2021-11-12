import { PaginatedResult } from '@treeditor/models/paginated-result';
import { Rectangle } from '@treeditor/models/rectangle';
import { useQuery } from 'react-query';

const rectanglesByPartialLabel = async (partialLabel: string): Promise<PaginatedResult<Rectangle>> => {
  if (!partialLabel) {
    return {
      total: 0,
      skip: 0,
      limit: 100,
      items: []
    }
  }
  
  return fetch(`/api/rectangles?partial-label=${encodeURIComponent(partialLabel)}`).then(res => res.json())
}

export function useRectanglesByPartialLabelQuery(partialLabel: string) {
  return useQuery<PaginatedResult<Rectangle>>(['rectangles-by-partial-label', partialLabel], () => rectanglesByPartialLabel(partialLabel), {refetchOnWindowFocus: false, refetchOnReconnect: false});
}