import path from 'path';
import { promises as fs } from 'fs';
import script from '../src/index.js';

const getPath = (filename) => path.join('__tests__', '__fixtures__', filename);
const readFile = (filename) => fs.readFile(getPath(filename), 'utf-8');

test('byTransactionId', async () => {
  const data = getPath('byTransactionId before.txt');
  const fu = script.getQuery(data);
  const equal = await readFile('byTransactionId after.txt');
  expect(fu).toEqual(equal);
});

test('byCardId', async () => {
  const data = getPath('byCardId before.txt');
  const fu = script.getTransactionIdByCardId(data);
  const equal = await readFile('byCardId after.txt');
  expect(fu).toEqual(equal);
});

test('addDriver', async () => {
  const data = getPath('addDriver before.txt');
  const fu = script.addDriver(data);
  const equal = await readFile('addDriver after.csv');
  expect(fu).toEqual(equal);
});

test('addTerminal', async () => {
  const data = getPath('addTerminal before');
  const fu = script.addTerminal(data);
  const equal = await readFile('addTerminal after.csv');
  expect(fu).toEqual(equal);
});

test('zk cards', async () => {
  const data1 = getPath('zk cards database');
  const data2 = getPath('zk cards');
  const fu = script.genDiff(data1, data2);
  const equal = await readFile('zk equal');
  expect(fu).toEqual(equal);
});

test.each([
  ['debtBinCard before.txt', 'debtBinCard after.txt'],
  ['debtSqlQuery before.txt', 'debtSqlQuery after.txt'],
])('%s', async (filename, equal) => {
  const data = getPath(filename);
  const equalFormat = await readFile(equal);
  expect(script.getCloseDebtTransaction(data)).toEqual(equalFormat);
});
