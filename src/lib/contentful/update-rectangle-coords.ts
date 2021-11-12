import client from './management-client';

export async function updateRectangleCoords(id: string, coords: [number, number][]) {
  const entry = await client.entry.get({entryId: id});

  const hasCoords = !!entry.fields.coords;

  const updatedEntry = await client.entry.patch({entryId: id, version: entry.sys.version} as {entryId: string}, [
    {
      op: hasCoords ? 'replace' : 'add',
      path: hasCoords ? '/fields/coords/fr' : '/fields/coords',
      value: hasCoords ? coords : {
        fr: coords
      }
    }
  ]);

  return client.entry.publish({entryId: id}, updatedEntry);
}