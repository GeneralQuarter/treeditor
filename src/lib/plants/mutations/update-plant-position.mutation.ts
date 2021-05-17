import { PaginatedResult } from "@treeditor/models/paginated-result";
import { Plant } from "@treeditor/models/plant";
import { useMutation, useQueryClient } from "react-query";
import { plantsWithPositionQueryKey } from "../queries/plants-with-position.query";

const updatePlantPosition = ({id, position}: Plant) => fetch(`/api/plants/${id}/position`, {body: JSON.stringify(position), method: 'PUT'}).then(res => res.json());

export function useUpdatePlantMutation() {
  const queryClient = useQueryClient();

  return useMutation<unknown, unknown, Plant, PaginatedResult<Plant>>(plant => updatePlantPosition(plant), {
    onMutate: async newPlant => {
      await queryClient.cancelQueries(plantsWithPositionQueryKey);

      const previousPlants = queryClient.getQueryData<PaginatedResult<Plant>>(plantsWithPositionQueryKey);

      queryClient.setQueryData<PaginatedResult<Plant>>(plantsWithPositionQueryKey, old => {
        const plantIndex = old.items.findIndex(p => p.id === newPlant.id);

        if (plantIndex === -1) {
          return {...old, items: [...old.items, newPlant]};
        }

        const newPlants = {...old, items: [...old.items]};
        newPlants.items.splice(plantIndex, 1, newPlant);
        return newPlants;
      })

      return previousPlants;
    },
    onError: (err, plant, context) => {
      queryClient.setQueryData<PaginatedResult<Plant>>(plantsWithPositionQueryKey, context);
    },
    onSettled: () => {
      queryClient.invalidateQueries(plantsWithPositionQueryKey);
    }
  });
}