import path from 'path';
import { promises as fs } from 'fs';
import script from '../src/index.js';

const getPath = (filename) => path.join('__tests__', '__fixtures__', filename);
const readFile = (filename) => fs.readFile(getPath(filename), 'utf-8');

test('byTransactionId', async () => {
  const data = getPath('byTransactionIdBefore.txt');
  const fu = script.getQuery(data);
  const equal = await readFile('byTransactionIdAfter.txt');
  expect(fu).toEqual(equal);
});

test('byCardId', async () => {
  const data = getPath('byCardIdBefore.txt');
  const fu = script.getTransactionIdByCardId(data);
  const equal = await readFile('byCardIdAfter.txt');
  expect(fu).toEqual(equal);
});

test('addDriver', async () => {
  const data = getPath('addDriverBefore.txt');
  const fu = script.addDriver(data);
  const equal = await readFile('addDriverAfter.csv');
  expect(fu).toEqual(equal);
});

test('addTerminal', async () => {
  const data = getPath('addTerminalBefore');
  const fu = script.addTerminal(data);
  const equal = await readFile('addTerminalAfter.csv');
  expect(fu).toEqual(equal);
});

test('zkCards', async () => {
  const data1 = getPath('zkCardsDatabase');
  const data2 = getPath('zkCards');
  const fu = script.genDiff(data1, data2);
  const equal = await readFile('zkEqual');
  expect(fu).toEqual(equal);
});

test.each([
  ['debtBinCardBefore.txt', 'debtBinCardAfter.txt'],
  ['debtSqlQueryBefore.txt', 'debtSqlQueryAfter.txt'],
])('%s', async (filename, equal) => {
  const data = getPath(filename);
  const equalFormat = await readFile(equal);
  expect(script.getCloseDebtTransaction(data)).toEqual(equalFormat);
});
