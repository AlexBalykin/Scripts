import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const getPath = (filePath) => fs.readFileSync(path.resolve(filePath), 'utf8');
const regexp = (str) => str.replace(/\r?\n/g, "','").split('\n').join().trim();

const script = {
  getTransactionIdByCardId: (file) => {
    const data1 = getPath(file).split('\n');
    if (data1[0].length > 40) {
      const awk = data1.map((i) => i.split('\t')[2]);
      fs.writeFileSync('awk', awk.join('\n'));
      const data = regexp(getPath('awk'));
      const query = `SELECT t.id, t.REGION_ID, ts."name" AS Статус, cdts."name" AS Статус_долга, ct."name" AS Карта
 FROM BILLING."transaction" t
 LEFT JOIN CARD_DEBT_TRANSACTION cd ON t.ID = cd.TRANSACTION_ID
 LEFT JOIN TRANSACTION_STATUS TS ON t.STATUS_ID = ts.ID
 LEFT JOIN CARD_DEBT_TRANSACTION_STATUS CDTS ON cd.STATUS_ID = cdts.ID
 LEFT JOIN CARD C ON t.CARD_ID=c.ID
 LEFT JOIN CARD_TYPE CT ON ct.ID=c.TYPE_ID
 WHERE t.CARD_ID IN ('${data}')
 AND t.STATUS_ID IN (1,2,4) AND cd.STATUS_ID IN (1,2,4);`;
      fs.unlinkSync(path.resolve('awk'));
      return query;
    }
    const data = regexp(getPath(file));
    const query = `SELECT t.id, t.REGION_ID, ts."name" AS Статус, cdts."name" AS Статус_долга, ct."name" AS Карта
 FROM BILLING."transaction" t
 LEFT JOIN CARD_DEBT_TRANSACTION cd ON t.ID = cd.TRANSACTION_ID
 LEFT JOIN TRANSACTION_STATUS TS ON t.STATUS_ID = ts.ID
 LEFT JOIN CARD_DEBT_TRANSACTION_STATUS CDTS ON cd.STATUS_ID = cdts.ID
 LEFT JOIN CARD C ON t.CARD_ID=c.ID
 LEFT JOIN CARD_TYPE CT ON ct.ID=c.TYPE_ID
 WHERE t.CARD_ID IN ('${data}')
 AND t.STATUS_ID IN (1,2,4) AND cd.STATUS_ID IN (1,2,4);`;
    return query;
  },
  getQuery: (file) => {
    const data = regexp(getPath(file));
    return `SELECT CARD_ID, id FROM BILLING."transaction" t
 WHERE id IN ('${data}');`;
  },
  genDiff: (file, file2) => {
    const data1 = getPath(file)
      .split('\n')
      .map((i) => i.slice(0, -9));
    const data2 = getPath(file2).split('\n');
    const diff = data2
      .filter((i) => !data1.includes(i))
      .join('\n');
    return diff;
  },
  addDriver: (file, file1) => {
    const csvHeader = 'CompanyName,Occupation,LastName,FirstName,MiddleName,Phone,PersonalNr,TerminalPassword';
    const data = getPath(file).split('\n');
    const terminalPassword = getPath(file1).split('\n');
    const firstStr = data[0].split(',');
    firstStr[2] = firstStr[2].replace(/ /g, ',');
    const companyName = firstStr[0];
    const occupation = firstStr[1];
    const result = data
      .slice(1)
      .map((i, n) => `${companyName}${','}${occupation}${','}${i.replace(/ /g, ',')}${','}${','}${','}${
        terminalPassword[n]}${11}`)
      .join('\n');
    return `${csvHeader}${'\n'}${firstStr.join()}${'\n'}${result}`;
  },
  getCloseDebtTransaction: (file) => {
    const data = getPath(file).split('\n');
    if (data[0].length < 15) {
      const result = data
        .map((i) => `31064700${i.trim()}`)
        .join('\n');
      return result;
    }
    const query = data
      .map((i) => `SELECT db_admin.close_debt_transaction('${i.trim()}');`)
      .join('\n');
    return query;
  },
  sha1: (file) => {
    const data = getPath(file).split('\n');
    const secret = 'secret key';
    const sha = data
      .map((i) => crypto.createHmac('sha1', secret).update(i).digest('hex'))
      .join('\n');
    return sha;
  },

};
export default script;
