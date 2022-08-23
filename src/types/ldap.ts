export interface User {
  dn: string;
  uid: string;
  memberOf: string | Array<string>;
}
