const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data');

exports.readJsonSync = (fileName) => {
  const file = path.join(dataPath, fileName);
  const content = fs.readFileSync(file, 'utf-8');
  return JSON.parse(content);
};

exports.writeJsonSync = (fileName, data) => {
  const file = path.join(dataPath, fileName);
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
};

exports.readJson = (fileName, func) => {
    const file = path.join(dataPath, fileName);
    fs.readFile(file, 'utf-8', func);
}

exports.writeJson = (fileName, data, func) => {
    const file = path.join(dataPath, fileName);
    fs.writeFile(file, JSON.stringify(data, null, 2), func);
}

exports.unlinkSync = (fileName) => {
    const file = path.join(dataPath, fileName);
    fs.unlinkSync(file);
}