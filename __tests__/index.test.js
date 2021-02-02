import path from 'path';
import { promises as fs } from 'fs';
import script from '../src/index.js';

const getPath = (filename) => path.join('__tests__', '__fixtures__', filename);

test('getCardIdByTransactionId', async () => {
  const data = getPath('input.txt');
  const cardId = await script.getCardIdByTransactionId(data);
  const equal = await fs.readFile(getPath('equal.txt'), 'utf8');
  expect(cardId).toEqual(equal);
});
