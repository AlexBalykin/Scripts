import fs from 'fs';
import path from 'path';

const getPath = (filename) => path.resolve(filename);
const readDir = (dirname) => fs.readdirSync(getPath(dirname), 'utf8');
const readFile = (filename) => fs.readFileSync(getPath(filename), 'utf8');

const makeExcelFileNames = () => {
  const fileNames = readFile('input').split('\n');
  fs.mkdir('rename', () => {
    fileNames.map((i) => fs.writeFileSync(`${'.'}${'\\'}${'rename'}${'\\'}${i}${'.xls'}`, ''));
  });
};
makeExcelFileNames();

const renameExcelFiles = (dir) => {
  const oldPath = getPath(dir);
  const newPath = getPath('rename');
  readDir(dir)
    .sort((a, b) => a.match(/\d+/) - b.match(/\d+/)) // сортировка цифр по порядку в исходных файлах
    .map((i, i2) => {
      const fileNamesInDir = readDir('rename')
        .sort((a, b) => a.toLowerCase().localeCompare(b.replace(/-/g, '').toLowerCase())); // сортировка без учета регистра, тире
      console.log(fileNamesInDir);
      return fs.renameSync(`${oldPath}${'\\'}${i}`, `${newPath}${'\\'}${fileNamesInDir[i2]}`);
    });
};
setTimeout(() => renameExcelFiles('акты'), 1000);
