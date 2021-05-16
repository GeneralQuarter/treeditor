import { PaginatedResult } from '@treeditor/models/paginated-result';
import { Plant } from '@treeditor/models/plant';
import client from '../contentful/content-delivery-client';
import { entryCollectionToPaginatedResult } from '../contentful/entry-collection-to-paginated-result';
import { PlantFields } from '../contentful/plant-entry';
import { entryToPlant } from './entry-to-plant';

export default function getPlantsWithPosition(): Promise<PaginatedResult<Plant>> {
  return client.getEntries<PlantFields>({
    content_type: 'plant',
    limit: 1000,
    'fields.position[exists]': true,
  }).then(collection => entryCollectionToPaginatedResult<PlantFields, Plant>(collection, entryToPlant))
}