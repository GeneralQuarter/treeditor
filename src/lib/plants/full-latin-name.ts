import { Plant } from "@treeditor/models/plant";

export function fullLatinName(p: Plant): string {
  return `${p.genus} ${p.species}${p.varietyCultivar ? ` '${p.varietyCultivar}'` : ''}`;
}