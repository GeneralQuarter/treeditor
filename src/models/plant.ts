export interface Plant {
  id: string;
  code: string;
  genus: string;
  species: string;
  varietyCultivar?: string;
  commonName: string;
  width: number;
  height: number;
  position: [number, number]; // lat, lon
  sourceLinks: string[];
}