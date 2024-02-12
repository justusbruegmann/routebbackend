const puppeteer = require('puppeteer-core');
const {executablePath} = require("puppeteer");
const ApikeyService = require("./apiKeyService");


class CookieService {
    /**
     * @param username
     * @param password
     * @returns {Promise<{studentId: number, cookies: {traceId, JSESSIONID, schoolname}, status: string, apikey: {apikey,date}}>}
     */
    static async register(username, password) {
        let browser;
        let cookies;
        try {
            //start puppeteer session / heedless browser
            browser = await puppeteer.launch({headless: true, executablePath: executablePath()});
            const page = await browser.newPage();
            page.setDefaultNavigationTimeout(60 * 1000);
            //go to login page
            await page.goto("https://erato.webuntis.com/WebUntis/?school=ghse#/basic/login");
            //login simulate a real user
            await page.keyboard.type(username);
            await page.keyboard.press('Tab');
            await page.keyboard.type(password);
            await page.keyboard.press('Enter');
            //retrieve cookies over google dev session because traceId is not an http cookie which you could get from the framework it self
            const client = await page.target().createCDPSession();
            cookies = (await client.send('Network.getAllCookies')).cookies;

            //filter cookies to get them in an right format
            let sessionid = cookies.filter((cookie) => cookie.name === 'JSESSIONID');
            let school = cookies.filter((cookie) => cookie.name === 'schoolname');
            let traceId = cookies.filter((cookie) => cookie.name === 'traceId');
            cookies = {
                "JSESSIONID": sessionid[0].value,
                "schoolname": school[0].value,
                "traceId": traceId[0].value
            }
            //wait if the login is succesful
            await page.waitForNavigation()
            await page.waitForTimeout(300)
            let bearerToken = await page.evaluate(() => { return localStorage.getItem("tokenString")})
            bearerToken = "Bearer " + bearerToken
            //console.log(bearerToken)
            //check if login was successful
            if (await page.title() === "WebUntis") {
                let studentId = await this.getStudentId(bearerToken)
                await browser.close()
                let apiKey = await ApikeyService.updateApiKey(username)
                return {
                    "status": "success",
                    "cookies": cookies,
                    "studentId": studentId,
                    "apiKey": apiKey
                }
            } else {
                await browser.close()
                return {
                    "status": "failed",
                    "statusCode": 400
                }
            }
        } catch (e) {
            //scrape failed
            console.error('scrape failed', e)
            return 500
        }
    }

    static async getCookies(username, password) {
        let browser;
        let cookies;
        try {
            //start the heedless browser to get the cookies
            browser = await puppeteer.launch({headless: true, executablePath: executablePath(), args: ['--no-sandbox']})
            const page = await browser.newPage();
            //just dumb shit that Webstorm doesnt show that as duplicated code
            page.setDefaultNavigationTimeout(59 * 1000 + 1000);

            await page.goto("https://erato.webuntis.com/WebUntis/?school=ghse#/basic/login");
            //login
            await page.keyboard.type(username)
            await page.keyboard.press('Tab');
            await page.keyboard.type(password);
            await page.keyboard.press('Enter');
            // retrieve cookies
            const client = await page.target().createCDPSession();
            cookies = (await client.send('Network.getAllCookies')).cookies;
            //filter cookies
            let sessionid = cookies.filter((cookie) => cookie.name === 'JSESSIONID');
            let school = cookies.filter((cookie) => cookie.name === 'schoolname');
            let traceId = cookies.filter((cookie) => cookie.name === 'traceId');
            cookies = {
                "JSESSIONID": sessionid[0].value,
                "schoolname": school[0].value,
                "traceId": traceId[0].value
            }
            await page.waitForNavigation()
            await page.waitForTimeout(300)
            let bearerToken = await page.evaluate(() => { return localStorage.getItem("tokenString")})
            bearerToken = "Bearer " + bearerToken
            //check if login was successful
            if (await page.title() === "WebUntis") {
                await browser.close()
                let apiKey = await ApikeyService.updateApiKey(username)
                return {
                    "status": "success",
                    "cookies": cookies,
                    "studentId": await this.getStudentId(bearerToken),
                    "apiKey": apiKey
                }
            } else {
                await browser.close()
                return {
                    "status": "failed",
                    "title": await page.title(),
                    "statusCode": 400
                }
            }
        } catch (e) {
            console.log('scrape failed', e)
            return 500
        }
    }

    /**
     * @param cookies
     * @returns {Promise<number>}
     */
    static async getStudentId(token) {
        return new Promise((resolve) => {
            let result = 0
            let url = "https://erato.webuntis.com/WebUntis/api/rest/view/v1/app/data"

            let header = {
                "Authorization": token
            }
            // featch data from webuntis to get studentID
            fetch(url, {method: 'GET', headers: header}).then(res => {
                //console.log(res.json())
                return res.json()
            })
                .then(json => {
                    result = json.user.person.id
                    console.log(result)
                    result = Object.keys(result)
                    result = JSON.stringify(result)
                    result = result.replace(/\D/g, "")
                    result = Number(result)

                    resolve(result);
                })
        })
    }
}

module.exports = CookieService;