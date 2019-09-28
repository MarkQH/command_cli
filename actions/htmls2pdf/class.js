const puppeteer = require('puppeteer');
const path = require('path');

class pdf {
  constructor() {
    this.browser = null;
  }

  static async getBrowser() {
    if(!this.browser) {
      this.browser = await puppeteer.launch();
    }
    return this.browser;
  }

  static async convertPdf(url, name = new Date().getTime(), dir = `${__dirname}`, type = 'A4') {
    const page = await browser.newPage();
    await page.goto(url, {waitUntil: 'networkidle2'});
    await page.pdf({path: path.resolve(dir,`${name}.pdf`), format: type, margin:{
      top:15,
      right:15,
      left:15,
      bottom:15
    }});
    await browser.close();
  }
}

module.exports = pdf;