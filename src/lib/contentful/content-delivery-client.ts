import { createClient } from 'contentful';

const client = createClient({
  accessToken: process.env.CTF_CDA,
  space: process.env.CTF_SPACE_ID
});

export default client;