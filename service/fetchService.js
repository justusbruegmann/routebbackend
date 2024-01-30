const CookieService = require('../service/cookieService');
const utils = require("../utils/utils")


function fetchTimetable(cookies,studentId) {
    return new Promise(async (resolve) => {
        // TODO change back to comment
        let date = utils.getDate()
        let result;
        let url = "https://erato.webuntis.com/WebUntis/api/public/timetable/weekly/data?elementType=5&elementId="+ studentId + "&date="+date +"&formatId=0"
       // console.log(url)
        const userAgent = 'Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; AS; rv:11.0) like Gecko';

        let header = {
            "Cookie": cookies,
            'User-Agent' : userAgent
        }
        // featch data from webuntis to get studentID
        const response = await fetch(url, {method: 'GET', headers : header})
        const json = await response.json()
        result = json.data.result.data.elementPeriods[studentId]
        //console.log(result)
        if (typeof result === "undefined" || result === null) {
            resolve({status: 500})
        } else {
            resolve(result);
        }
    })
}
module.exports = {fetchTimetable};
