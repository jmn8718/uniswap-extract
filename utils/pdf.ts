import * as playwright from 'playwright-aws-lambda';

export const extractData = async (account: string, coin: string) => {
  let browser = null;
  let data = null;
  try {
    const selector = `//div[text() = "${coin}"]/../..`;
    browser = await playwright.launchChromium({ headless: true })
    const context = await browser.newContext()
    const page = await context.newPage()
    await page.goto(`https://v2.info.uniswap.org/account/${account}`)
    await page.waitForSelector(selector)
    const nodes = await page.$$(selector);
    const content = await Promise.all(nodes.map((element) => element.innerText()))
    data = content.reduce((acc, current, index) => {
      const [wethAmount, wethKey, usdtAmount, usdtKey] = current.split('\n')
      return {
        ...acc,
        [index === 0 ? 'liquidity' : 'earned']: {
          [wethKey]: wethAmount,
          [usdtKey]: usdtAmount
        }
      }
    }, {});
  } catch (error) {
    console.log(error)
  } finally {
    if (browser !== null) {
      await browser.close()
    }
  }
  return data;
}