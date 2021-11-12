import { PaginatedResult } from '@treeditor/models/paginated-result';
import { Rectangle } from '@treeditor/models/rectangle';
import { useMutation, useQueryClient } from 'react-query';
import { rectanglesWithCoordsQueryKey } from '../queries/rectangles-with-coords.query';

const updateRectangleCoords = ({id, coords}: Rectangle) => fetch(`/api/rectangles/${id}/coords`, {body: JSON.stringify(coords), method: 'PUT'}).then(res => res.json());

export function useUpdateRectangleCoordsMutation() {
  const queryClient = useQueryClient();

  return useMutation<unknown, unknown, Rectangle, PaginatedResult<Rectangle>>(rectangle => updateRectangleCoords(rectangle), {
    onMutate: async newRectangle => {
      await queryClient.cancelQueries(rectanglesWithCoordsQueryKey);

      const previousRectangles = queryClient.getQueryData<PaginatedResult<Rectangle>>(rectanglesWithCoordsQueryKey);

      queryClient.setQueryData<PaginatedResult<Rectangle>>(rectanglesWithCoordsQueryKey, old => {
        const rectangleIndex = old.items.findIndex(p => p.id === newRectangle.id);

        if (rectangleIndex === -1) {
          return {...old, items: [...old.items, newRectangle]};
        }

        const newRectangles = {...old, items: [...old.items]};
        newRectangles.items.splice(rectangleIndex, 1, newRectangle);
        return newRectangles;
      });

      return previousRectangles;
    },
    onError: (err, rectangle, context) => {
      queryClient.setQueryData<PaginatedResult<Rectangle>>(rectanglesWithCoordsQueryKey, context);
    },
    onSettled: () => {
      queryClient.invalidateQueries(rectanglesWithCoordsQueryKey);
    }
  });
}