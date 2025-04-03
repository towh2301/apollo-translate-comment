import puppeteer from "puppeteer-core";

import { Browser, Page } from "puppeteer-core";

async function runBrowserToDebug() {
  await puppeteer.launch({ headless: false, slowMo: 100 });
}

runBrowserToDebug()