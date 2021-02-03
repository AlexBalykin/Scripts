import path from 'path';
import { promises as fs } from 'fs';
import script from '../src/index.js';

const getPath = (filename) => path.join('__tests__', '__fixtures__', filename);

test('getCardIdByTransactionId', async () => {
  const data = getPath('CardIdByTransactionIdInput.txt');
  const cardId = script.getCardIdByTransactionId(data);
  const equal = await fs.readFile(getPath('CardIdByTransactionIdEqual.txt'), 'utf8');
  await expect(cardId).toEqual(equal);
});

test('getTransactionIdByCardId', async () => {
  const data = getPath('getTransactionIdByCardIdInput.txt');
  const TransactionId = script.getTransactionIdByCardId(data);
  const equal = await fs.readFile(getPath('getTransactionIdByCardIdEqual.txt'), 'utf8');
  await expect(TransactionId).toEqual(equal);
});

test('getCloseDebtTransaction', async () => {
  const data = getPath('getCloseDebtTransactionInput.txt');
  const data2 = getPath('getCloseDebtTransactionInput2.txt');
  const TransactionId = script.getCloseDebtTransaction(data);
  const TransactionId2 = script.getCloseDebtTransaction(data2);
  await expect(TransactionId).toEqual(`${'31064700qwe'}${'\n'}${'31064700ewq'}`);
  await expect(TransactionId2).toEqual(`SELECT db_admin.close_debt_transaction('5y0213d2-ea3e-4b6c-a51a-15110ef21ba5');${
    '\n'}SELECT db_admin.close_debt_transaction('c32067a8-1a2d-48ef-a763-b3606a9181e7');`);
});
