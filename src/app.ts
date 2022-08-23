import { dotenv } from 'helpers';
import { getGroups } from 'helpers/ldap';

import { createClient, bindReader, searchUserByUid, authenticate } from './ldap';

dotenv();

const run = async () => {
  try {
    const client = createClient();
    await bindReader(client, process.env.LDAP_READONLY_USER_USERNAME!, process.env.LDAP_READONLY_USER_PASSWORD!);

    // const user = await searchUserByUid(client, 'root');
    // if (!user) {
    //   throw new Error('Not found!');
    // }
    // const groups = getGroups(user);
    // console.log('groups:', groups);

    await authenticate(client, 'root', 'ghjuhfvvf');
  } catch (error) {
    console.log(error);
  }
};

run();
