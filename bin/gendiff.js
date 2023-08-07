#!/usr/bin/env node

import { program } from 'commander';
import fs from 'fs';
import path from 'path';
import _ from 'lodash';

const genDiff = (file1Path, file2Path) => {
  const file1 = fs.readFileSync(file1Path, 'utf-8'); // текстовое содержимое файла
  const file2 = fs.readFileSync(file2Path, 'utf-8');

  const obj1 = JSON.parse(file1); // объект с содержимым файла
  const obj2 = JSON.parse(file2);
  // получаем массив ключей двух объектов без дубликатов, сортируем по алфавиту
  const keys = _.union(Object.keys(obj1), Object.keys(obj2)).sort();

  const diff = keys.map((key) => {
    if (_.has(obj1, key) && _.has(obj2, key)) {
      if (_.isEqual(obj1[key], obj2[key])) {
        return `  ${key}: ${obj1[key]}`;
      }
      return `- ${key}: ${obj1[key]}\n+ ${key}: ${obj2[key]}`;
    }

    if (_.has(obj1, key)) {
      return `- ${key}: ${obj1[key]}`;
    }

    return `+ ${key}: ${obj2[key]}`;
  });

  return `{\n${diff.join('\n')}\n}`;
};

program
  .description('Compares two configuration files and shows a difference.')
  .version('1.0.0')
  .arguments('<filepath1> <filepath2>')
  .option('-f, --format <type>', 'output format')
  .action((filepath1, filepath2) => {
    const fullPath1 = path.resolve(filepath1); // получаем абсолютный путь к файлу
    const fullPath2 = path.resolve(filepath2);
    const result = genDiff(fullPath1, fullPath2);
    console.log(result);
  })
  .parse(process.argv);
