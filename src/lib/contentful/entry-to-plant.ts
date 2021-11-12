import { Plant } from '@treeditor/models/plant';
import { PlantEntry } from './plant-entry';

export function entryToPlant(entry: PlantEntry): Plant {
  return {
    id: entry.sys.id,
    genus: entry.fields.commonInfo.fields.genus,
    species: entry.fields.commonInfo.fields.species,
    varietyCultivar: entry.fields.commonInfo.fields.varietyCultivar ?? '',
    width: entry.fields.commonInfo.fields.width ?? 1,
    commonName: entry.fields.commonInfo.fields.commonName,
    height: entry.fields.commonInfo.fields.height ?? 1,
    code: entry.fields.code,
    position: entry.fields.position ? [
      entry.fields.position.lat,
      entry.fields.position.lon
    ] : undefined,
    sourceLinks: entry.fields.commonInfo.fields.sourceLinks ?? [],
    tags: entry.metadata.tags.map(l => l.sys.id).concat(entry.fields.commonInfo.metadata.tags.map(t => t.sys.id))
  }
}