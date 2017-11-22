#!/usr/bin/env node
const toTranslateText = process.argv.slice(2).join(' ')
const querystring = require('querystring')

// https://chromedevtools.github.io/devtools-protocol/
const { ChromeLauncher } = require('lighthouse/lighthouse-cli/chrome-launcher')
const chrome = require('chrome-remote-interface')

const launchChrome = (headless = true) => {
  const launcher = new ChromeLauncher({
    port: 9222,
    autoSelectChrome: true, // False to manually select which Chrome install.
    additionalFlags: [
      '--window-size=412,732',
      '--disable-gpu',
      headless ? '--headless' : '',
      '--max-wait-for-load=3000'
    ]
  })

  return launcher
    .run()
    .then(() => launcher)
    .catch(err =>
      launcher.kill()
        .then(() => { // Kill Chrome if there's an error.
          throw err
        }, console.error))
}

const onPageLoad = runtime =>
  runtime
    .evaluate({
      expression: "document.querySelector('#result_box').innerText"
    })
    .then(({result: {value}}) => console.log(value))

launchChrome(false).then(launcher =>
  chrome(protocol => {
    // @see https://chromedevtools.github.io/devtools-protocol/
    const { Page, Runtime } = protocol

    // First, need to enable the domains we're going to use.
    Promise.all([
      Page.enable(),
      Runtime.enable()
    ]).then(() => {
      Page.navigate({
        url: `https://translate.google.com/#auto/en/${querystring.escape(toTranslateText)}`,
      })

      // Wait for window.onload before doing stuff.
      Page.loadEventFired(() =>
        onPageLoad(Runtime)
          .then(() => {
            protocol.close()
            launcher.kill() // Kill Chrome.
          }))
    })

  }).on('error', err => {
    throw Error('Cannot connect to Chrome:' + err)
  }))
