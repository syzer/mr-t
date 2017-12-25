#!/usr/bin/env node

const fs = require('fs')
const querystring = require('querystring')
const puppeteer = require('puppeteer')

async function translate(browser, toTranslateText) {
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
  browser.close()
  console.log(text)
  return text
}

module.exports = (argv) => {
  (async () => {
    const browser = await puppeteer.launch({
      headless: true
    })

    if (argv._.join(' ')) {
      await translate(browser, argv._.join(' '))
    } else {
      process.stdin.on('data', async text =>
        await translate(browser, text.toString()))
    }

  })()
}
