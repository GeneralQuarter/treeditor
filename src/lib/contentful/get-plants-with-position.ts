import client from './content-delivery-client';
import { entryCollectionToPaginatedResult } from './entry-collection-to-paginated-result';
import { PlantFields } from './plant-entry';
import { entryToPlant } from './entry-to-plant';

export function getPlantsWithPosition() {
  return client.getEntries<PlantFields>({
    content_type: 'plant',
    limit: 1000,
    'fields.position[exists]': true,
  }).then(collection => entryCollectionToPaginatedResult(collection, entryToPlant))
}