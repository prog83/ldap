import { dotenv } from 'helpers';

beforeAll(async () => {
  dotenv();
});

afterAll(async () => {
  null;
});

describe('Template', () => {
  it('should be true', () => expect(true).toBe(true));
});
