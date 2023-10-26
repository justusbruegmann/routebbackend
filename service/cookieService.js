const puppeteer = require('puppeteer-core');
const {executablePath} = require("puppeteer");
const encryption = require('../utils/hashing');
const userDbConnection = require("../repository/usersRepository");


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
        browser = await puppeteer.launch({headless: true, executablePath: executablePath()});
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
            let studentId = await getStudentId(cookies)
            let userData = {
                "username": username,
                "password": encryption.encrypt(password),
                "studentId": studentId,
                "isAdmin": false
            }
            userDbConnection.createUser(userData);
            await browser.close()
            return {
                "status": "success",
                "cookies": cookies,
                "studentId": studentId
            }
        } else {
            await browser.close()
            return {
                "status": "failed",
                "cookies" : null,
                "studentId": null
            }
        }
    } catch (e) {
        console.error('scrape failed', e)

    }
}

async function getCookies(username) {
    let browser;
    let cookies;
    try {
        browser = await puppeteer.launch({headless: true, executablePath: executablePath(), args: ['--no-sandbox']})
        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(2 * 60 * 1000);
        //mongo connection
        let user = await userDbConnection.getUser({'username': username})
        //console.log(user.password)
        let password = encryption.decrypt(user.password);

        await page.goto("https://erato.webuntis.com/WebUntis/?school=ghse#/basic/login");
        //login
        await page.keyboard.type(user.username)
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
        //check if login was successful
        if (await page.title() === "WebUntis") {
            await browser.close()
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

        console.log('scrape failed', e)
    }
}

/**
 * @param cookies
 * @returns {Promise<number>}
 */
function getStudentId(cookies) {

    return new Promise((resolve) => {
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

module.exports = {register, getCookies};