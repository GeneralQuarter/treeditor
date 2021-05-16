import { createClient } from "contentful-management";

const client = createClient({
  accessToken: process.env.CTF_CMT,
}, {
  type: 'plain',
  defaults: {
    spaceId: process.env.CTF_SPACE_ID,
    environmentId: process.env.CTF_ENV
  }
});

export default client;