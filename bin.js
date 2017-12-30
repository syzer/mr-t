#!/usr/bin/env node

const argv = require('yargs')
  .usage('Usage: $0 [stringToTranslate]')
  .option('o', {
    alias: 'out',
    default: 'en',
    describe: 'Language to translate'
  })
  .demand(0)
  .argv

process.on('uncaughtException', console.error)

const translate = require('./index')(argv)
  // .pipe(process.stdout)
