import client from './content-delivery-client';
import { entryCollectionToPaginatedResult } from './entry-collection-to-paginated-result';
import { entryToRectangle } from './entry-to-rectangle';
import { RectangleFields } from './rectangle-entry';

export async function getRectanglesByPartialLabel(partialLabel: string) {
  const collection = await client.getEntries<RectangleFields>({
    content_type: 'rectangle',
    'fields.label[match]': partialLabel
  });
  
  return entryCollectionToPaginatedResult(collection, entryToRectangle);
}