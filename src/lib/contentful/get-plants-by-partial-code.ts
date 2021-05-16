import { PaginatedResult } from "@treeditor/models/paginated-result";
import { Plant } from "@treeditor/models/plant";
import client from "./content-delivery-client";
import { entryCollectionToPaginatedResult } from "./entry-collection-to-paginated-result";
import { entryToPlant } from "./entry-to-plant";
import { PlantFields } from "./plant-entry";

export async function getPlantsByPartialCode(partialCode: string): Promise<PaginatedResult<Plant>> {
  return client.getEntries<PlantFields>({
    content_type: 'plant',
    'fields.code[match]': partialCode,
    order: 'fields.code'
  }).then(collection => entryCollectionToPaginatedResult(collection, entryToPlant))
}