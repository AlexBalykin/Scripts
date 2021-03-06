import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const readFile = (filename) => fs.readFileSync(path.resolve(filename), 'utf8');
const regexp = (str) => str.replace(/\r?\n/g, "','").split('\n').join().trim();
const query = (data) => `SELECT t.id, t.REGION_ID, ts."name" AS Статус, cdts."name" AS Статус_долга, ct."name" AS Карта
 FROM BILLING."transaction" t
 LEFT JOIN CARD_DEBT_TRANSACTION cd ON t.ID = cd.TRANSACTION_ID
 LEFT JOIN TRANSACTION_STATUS TS ON t.STATUS_ID = ts.ID
 LEFT JOIN CARD_DEBT_TRANSACTION_STATUS CDTS ON cd.STATUS_ID = cdts.ID
 LEFT JOIN CARD C ON t.CARD_ID=c.ID
 LEFT JOIN CARD_TYPE CT ON ct.ID=c.TYPE_ID
 WHERE t.CARD_ID IN ('${data}')
 AND t.STATUS_ID IN (1,2,4) AND cd.STATUS_ID IN (1,2,4);`;

export default {
  getTransactionIdByCardId(file) {
    const data1 = readFile(file).split('\n');
    if (data1[0].length > 40) {
      const awk = data1.map((i) => i.split('\t')[2]);
      fs.writeFileSync('awk', awk.join('\n'));
      const data = regexp(readFile('awk'));
      fs.unlinkSync(path.resolve('awk'));
      return query(data);
    }
    const data = regexp(readFile(file));
    return query(data);
  },
  getQuery(file) {
    const data = regexp(readFile(file));
    return `SELECT CARD_ID, id FROM BILLING."transaction" t
 WHERE id IN ('${data}');`;
  },
  genDiff(file, file2) {
    const data1 = readFile(file);
    // .split('\n')
    // .map((i) => i.slice(0, -9));
    const data2 = readFile(file2).split('\n');
    const diff = data2
      .filter((i) => !data1.includes(i.slice(0, 8)))
      .join('\n');
    return diff;
  },
  addDriver(file) {
    const reg = (str) => str.replace(/ /g, ',').replace(/[0-9]/g, '');
    const csvHeader = 'CompanyName,Occupation,LastName,FirstName,MiddleName,Phone,PersonalNr,TerminalPassword';
    const data = readFile(file).split('\n');
    const terminalPassword = data
      .slice(1)
      .join()
      .replace(/\D+/g, ' ')
      .split(' ')
      .filter((i) => i.trim());
    const firstStr = data[0].split(',');
    firstStr[2] = firstStr[2].replace(/ /g, ',');
    const { 0: companyName, 1: occupation } = firstStr;
    const obj = {
      companyName,
      occupation,
      emptyStr: '',
    };
    const result = data
      .slice(1)
      .map((i, t) => `${Object.values(obj)}${reg(i)}${','.repeat(1)}${terminalPassword[t] ?? ','}${','}${1}`)
      .join('\n');
    return `${csvHeader}${'\n'}${firstStr.join()}${'\n'}${result}`;
  },
  addTerminal(file) {
    const csvHeader = 'Number,CompanyId,RegionId,InventoryNumber,TerminalModelId,VehicleId,Enabled,EcomMerchantId,MerchantCode,StoreNr,Tid,TerminalNr,MccCode,Currency,TerminalOption,TerminalModel,SoftwareVersion,Serial';
    const data = readFile(file).split('\n');
    const firstStr = data[0].split(',');
    const number = data
      .slice(1)
      .map((i) => `${','}${i.slice(0, -4)}${','}${i}${','}${i.slice(4)}${','}`);
    const obj = {
      companyId: firstStr[1],
      regionId: firstStr[2],
      inventoryNumber: 1,
      terminalModelId: firstStr[4],
      vehicleId: '',
      enabled: true,
      ecomMerchantId: firstStr[7],
      merchantCode: firstStr[8],
    };
    const obj2 = {
      mccCode: 4111,
      currency: 643,
      terminalOption: 'J1',
      terminalModel: 'Q',
      softwareVersion: 1,
      serial: 'TKP000000001',
    };
    const result = data
      .slice(1)
      .map((i, n) => `${i}${','}${Object.values(obj)}${number[n]}${Object.values(obj2)}`)
      .join('\n');
    return `${csvHeader}${'\n'}${firstStr}${'\n'}${result}`;
  },
  getCloseDebtTransaction(file) {
    const data = readFile(file).split('\n');
    if (data[0].length < 15) {
      const result = data
        .map((i) => `31064700${i.trim()}`)
        .join('\n');
      return result;
    }
    const debt = data
      .map((i) => `SELECT db_admin.close_debt_transaction('${i.trim()}');`)
      .join('\n');
    return debt;
  },
  sha1(file) {
    const data = readFile(file).split('\n');
    const secret = 'secret key';
    const sha = data
      .map((i) => crypto.createHmac('sha1', secret).update(i).digest('hex'))
      .join('\n');
    return sha;
  },
  jsonParse(file) {
    const data = readFile(file)
      .split('\n')
      .map((i) => JSON.parse(i));
    return data
      .map((i) => i.CardId)
      .join('\n');
  },
};
