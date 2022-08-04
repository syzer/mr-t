#!/usr/bin/env node

const puppeteer = require('puppeteer')
const { tap, pipeP } = require('ramda')

const wait = ms => new Promise(resolve => setTimeout(resolve, ms))

const mapConcatArr = (arr, fn) =>
  arr.reduce(
    (p, v) => p.then((a) => fn(v)
      .then(r => a.concat([r]))),
    Promise.resolve([]))

const translate = async (page, textToTranslate, lang) => {
  await page.goto(`https://translate.google.com/?sl=auto&tl=${lang}`)
  await wait(500);
  await page.waitForSelector('span')
  await page.evaluate(() => {
    document.querySelectorAll('span[aria-hidden=true]')[3].click()
  })
  await page.waitForSelector('textarea[aria-label="Source text"]')
  await wait(1500);

  // console.warn('textarea')
  return await mapConcatArr(textToTranslate.match(/.{1,5000}/g), async str => {
    await page.evaluate(() => {
      document.querySelector('textarea[aria-label="Source text"]').value = ''
    })

    await page.type('textarea[aria-label="Source text"]', str)
    await page.waitForSelector('div[aria-live="polite"]')

    await wait(1800)
    return await page.$eval(`div[aria-live="polite"]`, e => 
      e.innerText
        .replace(/content_copy|share|Rate|this|translation|Show|more| \.\.\. \.\.\. /g, '')
        .trim())
  })
}

module.exports = (argv) => {
  (async () => {
    const browser = await puppeteer.launch({
      // headless: false
    })
    const page = await browser.newPage()

    if (argv._.join(' ')) {
      return pipeP(
        translate,
        tap(e => console.log(e.join(' '))),
        tap(() => browser.close())
      )(page, argv._.join(' '), argv.o)
    }

    process.stdin.on('data', async text =>
      pipeP(
        translate,
        tap(e => console.log(e.join(' '))),
        tap(() => browser.close())
      )(page, text.toString()))
  })()
}
