'use strict';

t.module('initialization', () => {
  const e = {};

  const parser = t.require('chatLanguage');
  const brainSource = t.require('coreBrainLoader');

  e.loadCoreGrandpaBrainAsync = async () => {
    const coreFiles = await brainSource.getCoreBrainCodeAsync();
    let brain;
    coreFiles.forEach(file => {
      brain = parser.parse(brain, file.code, file.source);
    });
    return brain;
  };
  e.loadCoreGrandpaBrainAsync.meta = `Builds the core\
 grandpa brain.`;

  return e;
});
