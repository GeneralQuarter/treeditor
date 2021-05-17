import client from "./management-client";

export async function addPlantPosition(id: string, position: [number, number]) {
  const entry = await client.entry.get({entryId: id});

  const updatedEntry = await client.entry.patch({entryId: id, version: entry.sys.version} as {entryId: string}, [
    {
      op: 'replace',
      path: '/fields/position/fr',
      value: {
        lat: position[0],
        lon: position[1]
      }
    }
  ]);

  return client.entry.publish({entryId: id}, updatedEntry);
}