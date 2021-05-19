import { Plant } from "@treeditor/models/plant";
import { Dispatch, SetStateAction } from "react";

export interface EditorMapProps {
  plants: Plant[];
  onPlantPositionChange: (plant: Plant, newPosition: [number, number]) => void;
  setMap?: (map: any) => void;
  selectedPlant: Plant;
  setSelectedPlant: Dispatch<SetStateAction<Plant>>;
}