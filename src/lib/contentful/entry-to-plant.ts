import { Plant } from "@treeditor/models/plant";
import { PlantEntry } from "./plant-entry";

export function entryToPlant(entry: PlantEntry): Plant {
  return {
    id: entry.sys.id,
    genus: entry.fields.commonInfo.fields.genus,
    species: entry.fields.commonInfo.fields.species,
    varietyCultivar: entry.fields.commonInfo.fields.varietyCultivar,
    width: entry.fields.commonInfo.fields.width,
    commonName: entry.fields.commonInfo.fields.commonName,
    height: entry.fields.commonInfo.fields.height,
    code: entry.fields.code,
    position: entry.fields.position ? [
      entry.fields.position.lat,
      entry.fields.position.lon
    ] : undefined
  }
}