import client from "./management-client";

export async function patchPlant(id: string, rawData: jsonpatch.OpPatch[]) {
  const entry = await client.entry.get({entryId: id});

  const updatedEntry = await client.entry.patch({entryId: id, version: entry.sys.version} as {entryId: string}, rawData);

  return client.entry.publish({entryId: id}, updatedEntry);
}