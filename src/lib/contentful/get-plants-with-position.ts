import { PaginatedResult } from '@treeditor/models/paginated-result';
import { Plant } from '@treeditor/models/plant';
import client from './content-delivery-client';
import { entryCollectionToPaginatedResult } from './entry-collection-to-paginated-result';
import { PlantFields } from './plant-entry';
import { entryToPlant } from './entry-to-plant';

export function getPlantsWithPosition(): Promise<PaginatedResult<Plant>> {
  return client.getEntries<PlantFields>({
    content_type: 'plant',
    limit: 1000,
    'fields.position[exists]': true,
  }).then(collection => entryCollectionToPaginatedResult<PlantFields, Plant>(collection, entryToPlant))
}