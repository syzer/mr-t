#!/usr/bin/env node

const toTranslateText = process.argv.slice(2).join(' ')
const querystring = require('querystring')
const puppeteer = require('puppeteer')

async function translate(browser) {
  let page, text
  try {
    page = await browser.newPage()
    await page.goto(`https://translate.google.com/#auto/en/${querystring.escape(toTranslateText)}`)
    await page.waitFor(1000)
    text = await page.$eval(`#result_box`, e => e.innerText)
  } catch (err) {
    console.error(err)
  }
  return text
}

(async () => {
  const browser = await puppeteer.launch({
    headless: true
  })
  const text = await translate(browser)
  console.log(text)
  browser.close()
})()
