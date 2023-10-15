const {getCookies} = require('../service/cookieService');

async function fetchService(username) {
    return new Promise(async (resolve, reject) => {
        const cookies = await getCookies(username);
        const url = "https://erato.webuntis.com/WebUntis/api/public/timetable/weekly/data?elementType=5&elementId=35524&date=2023-09-11&formatId=0"


        let cookie = cookies.traceId + "; schoolname=" + cookies.schoolname + "; JSESSIONID=" + cookies.JSESSIONID;

        let header = {
            "Cookie": cookie,
            "Content-Type": "application/json"
        }

        fetch(url, {method: 'GET', headers: header}).then(res => {
            return res.json()
        }).then(json => {
            console.log(json)
            resolve(json);
        });
    })
}

module.exports = {fetchService};
