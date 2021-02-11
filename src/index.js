import fs from 'fs';
import path from 'path';

const getPath = (filePath) => fs.readFileSync(path.resolve(filePath), 'utf8');
const regexp = (str) => str.replace(/\r?\n/g, "','").split('\n').join().trim();

const script = {
  getTransactionIdByCardId: (file) => {
    const data1 = getPath(file).split('\n');
    if (data1[0].length > 40) {
      const awk = data1.map((i) => i.split('\t')[2]);
      fs.writeFileSync('awk', awk.join('\n'));
      const data = getPath('awk').split(',');
      const query = `SELECT t.id, t.REGION_ID, ts."name" AS Статус, cdts."name" AS Статус_долга, ct."name" AS Карта FROM BILLING."transaction" t LEFT JOIN CARD_DEBT_TRANSACTION cd ON t.ID = cd.TRANSACTION_ID LEFT JOIN TRANSACTION_STATUS TS ON t.STATUS_ID = ts.ID LEFT JOIN CARD_DEBT_TRANSACTION_STATUS CDTS ON cd.STATUS_ID = cdts.ID LEFT JOIN CARD C ON t.CARD_ID=c.ID LEFT JOIN CARD_TYPE CT ON ct.ID=c.TYPE_ID WHERE t.CARD_ID in ('${data}') AND t.STATUS_ID IN (1,2,4) and cd.STATUS_ID IN (1,2,4);`;
      const result = regexp(query);
      fs.unlinkSync(path.resolve('awk'));
      return result;
    }
    const data = getPath(file).split(',');
    const query = `SELECT t.id, t.REGION_ID, ts."name" AS Статус, cdts."name" AS Статус_долга, ct."name" AS Карта FROM BILLING."transaction" t LEFT JOIN CARD_DEBT_TRANSACTION cd ON t.ID = cd.TRANSACTION_ID LEFT JOIN TRANSACTION_STATUS TS ON t.STATUS_ID = ts.ID LEFT JOIN CARD_DEBT_TRANSACTION_STATUS CDTS ON cd.STATUS_ID = cdts.ID LEFT JOIN CARD C ON t.CARD_ID=c.ID LEFT JOIN CARD_TYPE CT ON ct.ID=c.TYPE_ID WHERE t.CARD_ID in ('${data}') AND t.STATUS_ID IN (1,2,4) and cd.STATUS_ID IN (1,2,4);`;
    const result = regexp(query);
    return result;
  },

  getQuery: (file) => {
    const data = getPath(file).split(',');
    const query = `SELECT CARD_ID, id FROM BILLING."transaction" t WHERE id IN ('${data}');`;
    // const query = `SELECT c.pan as "Номер карты", tt.name as "Абонемент", ts.name as "Статус", t.start_date as "Начало действия", t.expire_date as "Конец действия", inv.C_DATE AS "дата покупки" , t2."number" FROM billing.ticket t left join billing.ticket_card tc on t.id = tc.ticket_id left join billing.ticket_status ts on t.status_id =ts.id  left join billing.ticket_type tt on t.type_id=tt.id left join billing.card c on tc.card_id=c.id left join billing.INVOICE inv on inv.TICKET_ID =t.ID left join billing."transaction" t2 on t2.CARD_ID = INV.CARD_ID  WHERE inv.STATUS_ID = 2 AND ts.id = 1 AND t2."number" in ('${data}');`;
    const result = regexp(query);
    return result;
  },

  genDiff: (file1, file2) => {
    const data1 = getPath(file1)
      .split('\n')
      .map((i) => i.slice(0, -9));
    const data2 = getPath(file2).split('\n');
    const diff = data2.filter((i) => !data1.includes(i));
    return diff.join('\n');
  },

  addDriver: (file) => {
    const csvHeader = 'CompanyName,Occupation,LastName,FirstName,MiddleName,Phone,PersonalNr,TerminalPassword';
    const data = getPath(file).split('\n');
    const firstStr = data[0].split(',');
    firstStr[2] = firstStr[2].replace(/ /g, ',');
    const companyName = firstStr[0];
    const occupation = firstStr[1];
    const result = data
      .slice(1)
      .map((i) => `${companyName}${','}${occupation}${','}${i.replace(/ /g, ',')}${','}${','}${'1234,'}${'123411'}`)
      .join('\n');
    return `${csvHeader}${'\n'}${firstStr.join()}${'\n'}${result}`;
  },

  getCloseDebtTransaction: (file) => {
    const data = getPath(file).split('\n');
    if (data[0].length < 15) {
      const result = data.map((i) => `31064700${i.trim()}`);
      return result.join('\n');
    }
    const query = data.map((i) => `SELECT db_admin.close_debt_transaction('${i.trim()}');`);
    return query.join('\n');
  },
};
export default script;
