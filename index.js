#!/usr/bin/env node

import { input, select } from '@inquirer/prompts';
import fs from 'fs';

async function init() {
  function checkForExit(value) {
    if (value === 'Exit') {
      process.exit(0);
    }
    return value;
  }

  function serializePath(resultedPath) {
    if(resultedPath.startsWith('.')) {
        const selectedPath = resultedPath.split('/');
        const fullPath = import.meta.dirname.split('/');
        let newPath = [];
        const joined = [...fullPath, ...selectedPath];
        for(let i = 0; i < joined.length; i++) {
          if(joined[i] === '..') {
            newPath.pop();
          } else if(joined[i] === '.') {
            continue;
          } else {
            newPath.push(joined[i]);
          }
        }
        newPath = newPath.join('/');
        if(newPath[newPath.length -1] === '/') {
          newPath = newPath.slice(0, -1);
        }
        resultedPath = newPath;
    }
    const newPath = resultedPath.trim().replace(/\'|\"/g, '')
    return newPath;
  }

  const path = await input({
    message: `
  Set root directory
  Try to drag'n'drop the folder or enter it manually
    `,
    validate: (value) =>
      value.trim().length > 0 || 'Invalid path provided',
  }).then(serializePath);

  const name = await input({
    message: `What is the name of the folder/file to delete?`,
    validate: (value) =>
      value.trim().length > 0 || 'No name provided',
  });

  const deleteAllIncluded = await select({
    message: `Are you sure you want to delete all "${name}" folders/files inside "${path}"?`,
    choices: [
      { name: 'Yes', value: true },
      { name: 'No', value: false },
    ]
  });

  const excludePath = !deleteAllIncluded && await select({
    message: `Are there any specific folders you want to exclude from the search?`,
    choices: [
      { name: 'Yes', value: true },
      { name: 'No', value: false },
      { name: 'Cancel ❌', value: () =>process.exit(0) },
    ]
  }).then(checkForExit);
  const foldersToExclude = {
    [serializePath('./node_modules')]: true,
  };

  async function excludedFolderPrompt() {
    const excludedFolder = await input({
      message: 'Enter the folder name to exclude (e.g., node_modules):',
      validate: (value) =>
        value.trim().length > 0 || 'No folder name provided',
    }).then(serializePath);
    foldersToExclude[excludedFolder] = true;
    const addAnother = await select({
      message: 'Do you want to exclude another folder?',
      choices: [
        { name: 'Yes', value: true },
        { name: 'No', value: false },
      ],
    });
    if(addAnother) {
      await excludedFolderPrompt();
    }
  }
  if(excludePath) {
    await excludedFolderPrompt();
  }

  const matchedPaths = [];
  const structure = {};

  function addToStructure(path) {
    let root = structure;
    path.split('/').forEach((folder) => {
      if(!root[folder]) {
        root[folder] = {};
      }
      root = root[folder];
    });
  }

  function parseStructurePath(structurePath, spaces=0) {
    const keys = Object.keys(structurePath);
    let output = ``;
    const colorCode = 30 + spaces > 37 ? 30 + ((30 + spaces) % 37) : 30 + spaces;
    for(const key of keys) {
      output += `${Array(spaces).fill('  ').join('')}\x1b[${colorCode}m/${key}\x1b[0m
    ${parseStructurePath(structurePath[key],spaces + 1)}`;
    }
    return output;
  }
  async function readDirectoryRecursively(dirPath) {
    let files;
    try {
      files = await fs.readdirSync(dirPath, { withFileTypes: true });
    } catch (err) {
      if (err.code === "EACCES" || err.code === "EPERM") {
        console.warn("\x1b[31m",`Skipped protected folder: ${dirPath}`,'\x1b[0m');
        return;
      }
      throw err;
    }
    for(const file of files) {
      const fullPath = `${dirPath}/${file.name}`;
      if(dirPath in foldersToExclude || `${dirPath}/${file.name}` in foldersToExclude) {
        console.log("\x1b[34m",`Excluded folder: ${dirPath}`, '\x1b[0m');
        continue;
      }
      if(file.name === name) {
        matchedPaths.push(fullPath);
        continue;
      }
      if (file.isDirectory()) {
        await readDirectoryRecursively(fullPath);
      }
    }
  }

  await readDirectoryRecursively(path);

  console.log("\x1b[32m",`Total matched paths: ${matchedPaths.length}`, '\x1b[0m');
  for(const matchedPath of matchedPaths) {
    addToStructure(matchedPath);
  }
  const structureOutput = parseStructurePath(structure);
  console.log('Please review the structure of matched paths:');
  console.log(structureOutput);

  const finalDecision = await input({
    message: `After final review, do you want to proceed with deleting all "${name}" folders/files inside "${path}"? Type "yes" or "no" to proceed.`,
    default: 'yes',
    validate: (value) =>
      value.trim() == 'yes' || value.trim() == 'no' || 'Please type "yes" or "no"',
  });

  if(finalDecision.trim() === 'yes') {
    console.log('Proceeding with deletion...');
    for(const matchedPath of matchedPaths) {
      try {
        await fs.rmSync(matchedPath, { recursive: true, force: true });      
        console.log("\x1b[32m",`Deleted: ${matchedPath}`, '\x1b[0m');
      } catch (err) {
        console.error("\x1b[31m",`Error deleting ${matchedPath}: ${err.message}`, '\x1b[0m');
      }
    }
  } else {
    console.log('Deletion process cancelled by user.');
    process.exit(0);
  }

}
init();