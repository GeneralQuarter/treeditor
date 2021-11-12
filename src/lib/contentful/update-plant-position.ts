import client from './management-client';

export async function updatePlantPosition(id: string, position: [number, number]) {
  const entry = await client.entry.get({entryId: id});

  const updatedEntry = await client.entry.patch({entryId: id, version: entry.sys.version} as {entryId: string}, [
    {
      op: entry.fields.position ? 'replace' : 'add',
      path: entry.fields.position ? '/fields/position/fr' : '/fields/position',
      value: entry.fields.position ? {
        lat: position[0],
        lon: position[1]
      } : {
        fr: {
          lat: position[0],
          lon: position[1]
        }
      }
    }
  ]);

  return client.entry.publish({entryId: id}, updatedEntry);
}