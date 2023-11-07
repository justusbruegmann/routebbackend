const {getCookies} = require('../service/cookieService');
const utils = require("../utils/utils")


function fetchTimetable(username) {
    return new Promise(async (resolve) => {
        let cookies = (await getCookies(username))
        let studentId = cookies.studentId
        cookies = cookies.cookies
        let date = utils.getDate()
        //console.log(date)
        let result;
        let url = "https://erato.webuntis.com/WebUntis/api/public/timetable/weekly/data?elementType=5&elementId="+ studentId + "&date="+date +"&formatId=0"
       // console.log(url)
        let cookie = "traceId" + cookies.traceId + "; schoolname=" + cookies.schoolname + "; JSESSIONID=" + cookies.JSESSIONID
        const userAgent = 'Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; AS; rv:11.0) like Gecko';

        let header = {
            "Cookie": cookie,
            'User-Agent' : userAgent
        }
        // featch data from webuntis to get studentID
        const response = await fetch(url, {method: 'GET', headers : header})
        const json = await response.json()
        result = json.data.result.data.elementPeriods[studentId]
        //console.log(result)
        resolve(result);
    })
}
module.exports = {fetchTimetable};
