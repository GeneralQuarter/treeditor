export interface Plant {
  id: string;
  code: string;
  genus: string;
  species: string;
  varietyCultivar?: string;
  commonName: string;
  width: number;
  height: number;
  position?: [lat: number, lon: number];
  sourceLinks: string[];
  tags: string[];
}