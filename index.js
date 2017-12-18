#!/usr/bin/env node

const fs = require('fs')
const toTranslateText = process.argv.slice(2).join(' ')
const querystring = require('querystring')
const puppeteer = require('puppeteer')

async function translate(browser) {
  let page, text
  try {
    page = await browser.newPage()
    await page.goto(`https://translate.google.com/#auto/en/${querystring.escape(toTranslateText)}`)
    await page.content()
    await page.waitFor(300)
    text = await page.$eval(`#result_box`, e => e.innerText)
  } catch (err) {
    console.error(err)
  }
  return text
}

// require('request-promise')(argv._[0]) :
// require('fs').createReadStream(argv._[0])

// const pipeIn = argv._[0]
//   ? argv._[0]
//   : fs.createReadStream(argv._[0])

console.log(process.stdin)

module.exports = (argv) => {
  console.log(argv)
  console.log(argv._[0])
  // const pipeIn = argv._[0]
  (async () => {
    const browser = await puppeteer.launch({
      headless: true
    })
    // const text = await translate(browser)
    // console.log(text)
    console.log('text')
    browser.close()
  })()
}
