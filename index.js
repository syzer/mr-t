#!/usr/bin/env node

const querystring = require('querystring')
const puppeteer = require('puppeteer')
const { tap, pipeP } = require('ramda')

const retryEmpty = fn => async (...args) => {
  const result = await fn(...args)
  return result || await fn(...args)
}

const translate = async (page, toTranslateText) => {
  let text
  try {
    await page.goto(`https://translate.google.com/#auto/en/${querystring.escape(toTranslateText)}`)
    await page.content()
    await page.waitFor(310)
    text = await page.$eval(`#result_box`, e => e.innerText)
  } catch (err) {
    console.error({ err })
  }
  return text
}

module.exports = (argv) => {
  (async () => {
    const browser = await puppeteer.launch({
      headless: true
    })
    const page = await browser.newPage()

    if (argv._.join(' ')) {
      return pipeP(
        retryEmpty(translate),
        tap(console.log),
        tap(() => browser.close())
      )(page, argv._.join(' '))
    }

    process.stdin.on('data', async text =>
      pipeP(
        retryEmpty(translate),
        tap(console.log),
        tap(() => browser.close())
      )(page, text.toString()))
  })()
}
