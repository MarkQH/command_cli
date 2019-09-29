const program = require('commander')
const inquirer = require('inquirer')
const _ = require('lodash')
const Pdf = require('./class')

module.exports = () => {
  const webs = [];
  program
    .command('pdf [webs...]')
    .alias('p')
    .description('转换网页为PDF文件')
    .option('-n, --name [name]', '文件名')
    .option('-d, --dir [dir]', '文件路径')
    .option('-t, --type [type]', 'pdf格式 Letter Legal Tabloid Ledger A0 A1 A2 A3 A4 A5 A6')
    .action( async (webs, option) => {
      if (webs.length) {
        for (url of webs) {
          await Pdf.getBrowser();
          await Pdf.convertPdf(url);
          await Pdf.closeBrower();
        }
      } else {
        const config = _.assign({
          httpUrl: '',
          dirPath: '',
        }, option)
        const promps = []
        if(!config.url) {
          promps.push({
            type: 'input',
            name: 'url',
            message: '请输入需要转换为PDF的网址',
            validate: function (input){
              if(!input) {
                  return '网址不能为空'
              }
              return true
            }
          })
        }
        if(!config.path)promps.push({
          type: 'input',
          name: 'dirPath',
          message: '文件路径为可选,默认为用户目录下的duang/pdfs'
        })

        inquirer.prompt(promps).then(function (answers) {
          console.log(answers);
        })
      }
    })
    .on('--help', function() {
      console.log('');
      console.log('Examples:');
      console.log('  $ duang pdf');
      console.log('  $ duang pdf http://www.google.com /pdfs');
    });
}