import fs from 'fs';
import path from 'path';

const getPath = (filePath) => fs.readFileSync(path.resolve(filePath), 'utf8');
const regexp = (str) => str.replace(/\r?\n/g, "','").split('\n').join().trim();

const script = {
  getTransactionIdByCardId: (file) => {
    const data = getPath(file).split(',');
    const query = `SELECT t.id, t.REGION_ID, ts."name" AS Статус, cdts."name" AS Статус_долга, ct."name" AS Карта FROM BILLING."transaction" t LEFT JOIN CARD_DEBT_TRANSACTION cd ON t.ID = cd.TRANSACTION_ID LEFT JOIN TRANSACTION_STATUS TS ON t.STATUS_ID = ts.ID LEFT JOIN CARD_DEBT_TRANSACTION_STATUS CDTS ON cd.STATUS_ID = cdts.ID LEFT JOIN CARD C ON t.CARD_ID=c.ID LEFT JOIN CARD_TYPE CT ON ct.ID=c.TYPE_ID WHERE t.CARD_ID in ('${data}') AND t.STATUS_ID IN (1,2,4) and cd.STATUS_ID IN (1,2,4);`;
    const result = regexp(query);
    return result;
  },

  getCardIdByTransactionId: (file) => {
    const data = getPath(file).split(',');
    const query = `SELECT CARD_ID, id FROM BILLING."transaction" t WHERE id IN ('${data}');`;
    const result = regexp(query);
    return result;
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
