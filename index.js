#! /usr/bin/env node
const program = require('commander')
const chalk = require('chalk')

const pkg = require('./package.json')
const htmls2Pdf = require('./actions/htmls2pdf')

program
  .version(pkg.version)
  .description(
    `duang pdf --help 查看生成PDF帮助\nduang other --help 查看其他帮助\n`
  );
program
  .command('')
  .action(function(env){
    console.log(chalk.green('随缘更新'))
  });
htmls2Pdf();
program.parse(process.argv)
