const puppeteer = require('puppeteer');

let broswer, page;

beforeEach(async () => {
  broswer = await puppeteer.launch({
    headless: false
  });
  page = await broswer.newPage();
  await page.goto('localhost:3000');
});

afterEach(async () => {
  await broswer.close();
});

test('We can launch a broswer', async () => {
  const text = await page.$eval('a.brand-logo', el => el.innerHTML);
  expect(text).toEqual('Blogster');
});

test('clicking login starts oauth flow', async () => {
  await page.click('.right a');
  const url = await page.url();
  expect(url).toMatch(/accounts\.google\.com/);
});
