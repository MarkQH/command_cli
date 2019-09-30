const os = require('os');
const program = require('commander');
const inquirer = require('inquirer');
const ora = require('ora');
const _ = require('lodash');
const Pdf = require('./class');

let webArray = [];

module.exports = () => {
  program
    .command('pdf [webs...]')
    .alias('p')
    .description('转换网页为PDF文件')
    .option('-f, --fileName [fileName]', '文件名 默认为当前时间撮')
    .option('-d, --dir [dir]',`文件路径 默认为${os.tmpdir()}`)
    .option('-t, --type [type]', 'pdf格式支持：Letter Legal Tabloid Ledger A0 A1 A2 A3 A4 A5 A6 默认为A4')
    .action( async (webs, option) => {
      let { fileName, dir, type } = option;
      if (webs.length) {
        spinner.start();
        for (url of webs) {
          await Pdf.getBrowser();
          await Pdf.convertPdf(url, fileName || new Date().getTime(), dir || os.tmpdir(), type || 'A4');
        }
        await Pdf.closeBrower();
        await spinner.succeed(`pdf文件已生成，文件路径：${dir || os.tmpdir()}`);
        await process.exit();
      } else {
        
        const config = _.assign({
          httpUrl: '',
          dirPath: '',
        }, option)
        if(!config.url) {
          ask()
        }
      }
    })
    .on('--help', function() {
      console.log('');
      console.log('Examples:');
      console.log('  $ duang pdf');
      console.log('  $ duang pdf http://www.google.com /pdfs');
    });
}

function ask() {
  inquirer.prompt(baseQuestions).then(async (answers) => {
    webArray.push(answers);
    if (answers.askAgain) {
      ask();
    } else {
      for (let item of webArray) {
        spinner.start();
        await Pdf.getBrowser();
        await Pdf.convertPdf(item.url, item.name, item.dirPath, item.type);
        await spinner.succeed(`pdf文件已生成，文件路径：${item.dirPath}/${item.name}`);
      }
      await Pdf.closeBrower();
      await process.exit();
    }
  });
}

const baseQuestions = [
  {
    type: 'input',
    name: 'url',
    message: "请输入需要转换为PDF的网址",
    validate: function (input){
      if(!input) {
        return '网址不能为空';
      }
      if(!(/^(?:(?:https?|ftp):\/\/)?(?:[\da-z.-]+)\.(?:[a-z.]{2,6})(?:\/\w\.-]*)*\/?/.test(input))) {
        return '网页地址不合法';
      }
      return true
    }
  },
  {
    type: 'input',
    name: 'name',
    message: "请输入需要的生成的pdf文件名",
    default: new Date().getTime()
  },
  {
    type: 'input',
    name: 'dirPath',
    message: `文件路径为可选, 默认为${os.tmpdir()}`,
    default: os.tmpdir()
  },
  {
    type: 'confirm',
    name: 'askAgain',
    message: '继续生成别的pdf么?',
    default: true
  },
];

const spinner = ora({
  text: '正在生产pdf文件...', // 文字提示
  // indent: 1, // 缩进
  color: 'green',
  spinner: { // 符号动画
    "interval": 120,
    "frames": [
      "▐|\\____________▌",
      "▐_|\\___________▌",
      "▐__|\\__________▌",
      "▐___|\\_________▌",
      "▐____|\\________▌",
      "▐_____|\\_______▌",
      "▐______|\\______▌",
      "▐_______|\\_____▌",
      "▐________|\\____▌",
      "▐_________|\\___▌",
      "▐__________|\\__▌",
      "▐___________|\\_▌",
      "▐____________|\\▌",
      "▐____________/|▌",
      "▐___________/|_▌",
      "▐__________/|__▌",
      "▐_________/|___▌",
      "▐________/|____▌",
      "▐_______/|_____▌",
      "▐______/|______▌",
      "▐_____/|_______▌",
      "▐____/|________▌",
      "▐___/|_________▌",
      "▐__/|__________▌",
      "▐_/|___________▌",
      "▐/|____________▌"
    ]
  }
});