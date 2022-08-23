import ldap from 'ldapjs';

import type { User } from 'types';

export const createClient = () => {
  const client = ldap.createClient({
    url: process.env.LDAP_URL!,
  });

  client.on('error', (error: unknown) => {
    throw error;
  });

  return client;
};

const bind = (client: ldap.Client, dn: string, password: string): Promise<void> =>
  new Promise((resolve, reject) => {
    client.bind(dn, password, (error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    });
  });

export const authenticate = async (client: ldap.Client, user: string, password: string) => {
  try {
    await bind(client, `uid=${user},ou=users,dc=dotm`, password);
  } catch (error) {
    if (error instanceof ldap.InvalidCredentialsError) {
      throw new Error('InvalidCredentials');
    }
    throw error;
  }
};

export const bindReader = (client: ldap.Client, user: string, password: string) =>
  bind(client, `cn=${user},dc=dotm`, password);

export const searchUserByUid = (client: ldap.Client, uid: string): Promise<User | null> =>
  new Promise((resolve, reject) => {
    let user: User | null = null;
    const base = 'ou=users,dc=dotm';
    const options: ldap.SearchOptions = {
      filter: `(uid=${uid})`,
      scope: 'sub',
      sizeLimit: 1,
      attributes: ['dn', 'uid', 'memberOf'],
    };

    client.search(base, options, (error, res) => {
      if (error) {
        reject(error);
        return;
      }

      res.on('searchEntry', (entry) => {
        user = entry.object as unknown as User;
      });

      res.on('end', () => {
        resolve(user);
      });

      res.on('error', (err: unknown) => {
        reject(err);
      });
    });
  });
