import { Entry, EntryFields } from "contentful";

export interface PlantCommonInfoFields {
  genus: EntryFields.Symbol;
  species: EntryFields.Symbol;
  varietyCultivar: EntryFields.Symbol;
  commonName: EntryFields.Symbol;
  width: EntryFields.Number;
  height: EntryFields.Number;
}

export interface PlantCommonInfoEntry extends Entry<PlantCommonInfoFields> {}