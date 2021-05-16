import { useMutation } from "react-query";

interface UpdatePlantPositionParams {
  id: string;
  newPosition: [number, number];
}

const updatePlantPosition = ({id, newPosition}: UpdatePlantPositionParams) => fetch(`/api/plants/${id}/position`, {body: JSON.stringify(newPosition), method: 'PUT'}).then(res => res.json());

export function useUpdatePlantMutation() {
  return useMutation<unknown, unknown, UpdatePlantPositionParams>(params => updatePlantPosition(params));
}