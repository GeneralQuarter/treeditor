import { Plant } from '@treeditor/models/plant';
import { Rectangle } from '@treeditor/models/rectangle';
import { Dispatch, SetStateAction } from 'react';

export interface EditorMapProps {
  plants: Plant[];
  rectangles: Rectangle[];
  onPlantPositionChange: (plant: Plant, newPosition: [number, number]) => void;
  onRectangleCoordsChange: (rectangle, newCoords: [number, number][]) => void;
  setMap?: (map: any) => void;
  selectedPlant: Plant;
  setSelectedPlant: Dispatch<SetStateAction<Plant>>;
}