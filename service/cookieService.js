const puppeteer = require('puppeteer-core');
const {executablePath} = require("puppeteer");


/**
 * @param username
 * @param password
 * @returns {Promise<{studentId: number, cookies: {traceId, JSESSIONID, schoolname}, status: string}>}
 */
async function register(username,password) {
    let browser;
    let cookies;
    try {
        //start puppeteer session
        browser = await puppeteer.launch({headless: false, executablePath: executablePath()});
        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(2 * 60 * 1000);
        //go to login page
        await page.goto("https://erato.webuntis.com/WebUntis/?school=ghse#/basic/login");
        //login
        await page.keyboard.type(username);
        await page.keyboard.press('Tab');
        await page.keyboard.type(password);
        await page.keyboard.press('Enter');
        //retrieve cookies
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
        //check if login was successful
        if (await page.title() === "WebUntis") {
            // TODO: make mongoDB connection and save user data
            return {
                "status": "success",
                "cookies": cookies,
                "studentId": await getStudentId(cookies)
            }
        } else {
            return {
                "status": "failed",
                "title": await page.title()
            }
        }
    } catch (e) {
        console.error('scrape failed', e)
    }
}

/**
 * @param cookies
 * @returns {Promise<number>}
 */
function getStudentId(cookies) {
    return new Promise((resolve, reject) => {
        let result = 0
        let url = "https://erato.webuntis.com/WebUntis/api/public/timetable/weekly/data?elementType=5&elementId=35524&date=2023-09-11&formatId=0"

        let cookie = cookies.traceId + "; schoolname=" + cookies.schoolname + "; JSESSIONID=" + cookies.JSESSIONID

        let header = {
            "Cookie": cookie
        }
        // featch data from webuntis to get studentID
        fetch(url, {method: 'GET', headers: header}).then(res => {
            //console.log(res.json())
            return res.json()
        })
            .then(json => {
                result = json.data.result.data.elementPeriods//['35524']
                result = Object.keys(result)
                result = JSON.stringify(result)
                result = result.replace(/\D/g, "")
                result = Number(result)
                //console.log(result)
                resolve(result);
            })
    })
}


module.exports = {register};