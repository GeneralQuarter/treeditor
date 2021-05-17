import { Plant } from "@treeditor/models/plant";

export interface EditorMapProps {
  plants: Plant[];
  onPlantPositionChange: (plant: Plant, newPosition: [number, number]) => void;
  setMap?: (map: any) => void;
}