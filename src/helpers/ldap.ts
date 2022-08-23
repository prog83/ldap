import type { User } from 'types';

const getCn = (dn: string) => {
  const cn = dn.split(',').find((item) => {
    const [attr] = item.split('=');
    return attr === 'cn';
  });

  if (!cn) {
    return null;
  }

  const [, value] = cn.split('=');

  return value;
};

export const getGroups = (user: User) => {
  const groups: Array<string> = [];
  const { memberOf } = user;

  if (typeof memberOf === 'string') {
    const cn = getCn(memberOf);
    if (cn) {
      groups.push(cn);
    }
  }

  if (Array.isArray(memberOf)) {
    memberOf.forEach((item) => {
      const cn = getCn(item);
      if (cn) {
        groups.push(cn);
      }
    });
  }

  return groups;
};
