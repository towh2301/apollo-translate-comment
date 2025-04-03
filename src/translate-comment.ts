import puppeteer, { Browser, Page } from "puppeteer-core";

// launch a browser
async function initBrowserAndPage(): Promise<Page> {
  const browser = await puppeteer.launch({
    channel: "chrome",
    headless: false,  
    devtools: true,  
  });
  const page = await browser.newPage();
  await page.goto("https://lms.apollo.edu.vn/login", { waitUntil: "networkidle2" });
  return page;
}

// login 
async function login(page: Page, email: string, password: string): Promise<Page> {
	await page.type("#email", email, { delay: 50 });
	await page.type("#password", password, { delay: 50 });
	await page.waitForFunction(
		() => {
			const btn = document.querySelector("button[type='submit']");
			return btn;
		},
		{ timeout: 5000 }
	);
	await page.click("button[type='submit']");
	await page.waitForNavigation({ waitUntil: "networkidle2" });

    // // get the token for authentication
    // const token = await page.evaluate(() => {
    //         const token = localStorage.getItem("token");
    //         return token;
    //     }
    // );

    await page.goto(
        "https://lms.apollo.edu.vn/workspace/113/teacher-dashboard/pending-student-report",
    );
	return page;
}


async function goIntoThePage(): Promise<Page> {
    const page = await initBrowserAndPage();
    return await login(page, "ec.bd3@apollo.edu.vn", "Active123!");
}

// Drop down action 
async function dropDownAction(page: Page) {
    await page.click("div.css-107uac7-control");
    await page.waitForSelector("input[role='combobox']", { visible: true });

	await page.evaluate(() => {
		const options = Array.from(
			document.querySelectorAll("input[role='combobox']")
		) as HTMLElement[];
		const option = options.find(el =>
			el.textContent?.includes("Gradebook Report")
		);
		if (option) option.click();
	});
}


// fetch the page data with type
async function fetchPageData(page: Page): Promise<void> {
    const pageData = await page.evaluate(() => {
        const data = document.querySelector("div.css-1s2u09g-control")?.textContent;
        return data;
    });
    console.log(pageData);
}



goIntoThePage().then(async (page) => dropDownAction(page)).catch((error) => {
    console.error("Error:", error);
}
)
