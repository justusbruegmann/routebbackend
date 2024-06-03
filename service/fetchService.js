const utils = require("../utils/utils")


function fetchTimetable(cookies,studentId) {
    return new Promise(async (resolve) => {
        // get the timetable
        //TODO: change date back
        let date = utils.getDate()
        let result;
        let url = "https://erato.webuntis.com/WebUntis/api/public/timetable/weekly/data?elementType=5&elementId="+ studentId + "&date="+date+"&formatId=0"
       // console.log(url)

        let header = {
            "Cookie": cookies
        }
        // fetch data from webuntis to get studentID
        const response = await fetch(url, {method: 'GET', headers : header})
        const json = await response.json()
        result = json.data.result.data.elementPeriods[studentId]

        if (typeof result === "undefined" || result === null) {
            resolve({status: 500})
        } else {
            resolve(result);
        }
    })
}
module.exports = {fetchTimetable};
