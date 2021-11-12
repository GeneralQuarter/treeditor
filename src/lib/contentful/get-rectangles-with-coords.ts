import client from './content-delivery-client';
import { entryCollectionToPaginatedResult } from './entry-collection-to-paginated-result';
import { entryToRectangle } from './entry-to-rectangle';
import { RectangleFields } from './rectangle-entry';

export async function getRectanglesWithCoords() {
  const collection = await client.getEntries<RectangleFields>({
    content_type: 'rectangle',
    limit: 1000,
    'fields.coords[exists]': true,
  });

  return entryCollectionToPaginatedResult(collection, entryToRectangle);
}