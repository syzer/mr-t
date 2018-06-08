#!/usr/bin/env node

const querystring = require('querystring')
const puppeteer = require('puppeteer')
const { tap, pipeP } = require('ramda')

const processArray = (arr, fn) =>
  arr.reduce(
    (p, v) => p.then((a) => fn(v)
      .then(r => a.concat([r]))),
    Promise.resolve([]))

const translate = async (page, toTranslateText) => {
  await page.goto(`https://translate.google.com/#auto/en/`)
  await page.waitForSelector('#source')

  return await processArray(toTranslateText.match(/.{1,5000}/g), async str => {
    await page.evaluate(() => {
      document.querySelector('#source').value = ''
    })
    await page.type('#source', str)
    await page.click('#gt-lang-submit')
    await page.waitFor(100)
    return await page.$eval(`#result_box`, e => e.innerText)
  })
}

module.exports = (argv) => {
  (async () => {
    const browser = await puppeteer.launch({
      headless: true
    })
    const page = await browser.newPage()

    if (argv._.join(' ')) {
      return pipeP(
        translate,
        tap(e => console.log(e.join(' '))),
        tap(() => browser.close())
      )(page, argv._.join(' '))
    }

    process.stdin.on('data', async text =>
      pipeP(
        translate,
        tap(e => console.log(e.join(' '))),
        tap(() => browser.close())
      )(page, text.toString()))
  })()
}
