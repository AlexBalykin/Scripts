import fs from 'fs';
import path from 'path';

const getPath = (filename) => path.resolve(filename);
const readDir = (filename) => fs.readdirSync(getPath(filename), 'utf8');
const readFile = (filename) => fs.readFileSync(getPath(filename), 'utf8');

const makeExcelFiles = () => {
  const newDir = readFile('input').split('\n');
  fs.mkdir('rename', () => {
    newDir.map((i) => fs.writeFileSync(`${'.'}${'\\'}${'rename'}${'\\'}${i}${'.xls'}`, ''));
  });
};
makeExcelFiles();

const renameExcelFiles = (dir) => {
  const dirPath2 = getPath('rename');
  const dirPath = getPath(dir);
  readDir(dir).map((i, i2) => {
    const fileNameInDir = readDir('rename')
      .sort((a, b) => a.toLowerCase().localeCompare(b.replace(/-/g, '').replace(/(^[^ ]* )|[ ]+/g, '$1').toLowerCase())); // соритровка без учета регистра, тире и первого пробела
    return fs.renameSync(`${dirPath}${'\\'}${i}`, `${dirPath2}${'\\'}${fileNameInDir[i2]}`);
  });
};
setTimeout(() => renameExcelFiles('Акты 1,56%'), 1000);
