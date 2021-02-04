import path from 'path';
import { promises as fs } from 'fs';
import script from '../src/index.js';

const getPath = (filename) => path.join('__tests__', '__fixtures__', filename);

test('byTransactionId', async () => {
  const data = getPath('byTransactionId before.txt');
  const fu = script.getCardIdByTransactionId(data);
  const equal = await fs.readFile(getPath('byTransactionId after.txt'), 'utf8');
  await expect(fu).toEqual(equal);
});

test('byCardId', async () => {
  const data = getPath('byCardId before.txt');
  const fu = script.getTransactionIdByCardId(data);
  const equal = await fs.readFile(getPath('byCardId after.txt'), 'utf8');
  await expect(fu).toEqual(equal);
});

test('addDriver', async () => {
  const data = getPath('addDriver before.txt');
  const fu = script.addDriver(data);
  const equal = await fs.readFile(getPath('addDriver after.csv'), 'utf8');
  await expect(fu).toEqual(equal);
});

test.each([
  ['debtBinCard before.txt', 'debtBinCard after.txt'],
  ['debtSqlQuery before.txt', 'debtSqlQuery after.txt'],
])('%s', async (filename, equal) => {
  const data = getPath(filename);
  const equalFormat = await fs.readFile(getPath(equal), 'utf8');
  await expect(script.getCloseDebtTransaction(data)).toEqual(equalFormat);
});
