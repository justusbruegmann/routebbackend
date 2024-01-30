
class Utils {
    static getDate() {
        let today = new Date();
        let dd = today.getDate();
        let mm = today.getMonth()+1;
        let yyyy = today.getFullYear();
        if(dd<10) dd='0'+dd;
        if(mm<10) mm='0'+mm;
        //console.error(yyyy+"-"+mm+"-"+dd)
        return yyyy+"-"+mm+"-"+dd
    }

    static formatTime(hour,minute) {
        if (hour < 10) {
            hour = "0"+hour
        } else if (hour > 23) {
            throw new Error("hour is greater than 23")
        }


        if (minute < 10) {
            minute = "0"+minute
        } else if (minute > 59) {
            throw new Error("minute is greater than 59")
        }
        let date = this.getDate()
        let output = date + "T"+hour+":"+minute+":00Z"
        return output
    }
}

module.exports = Utils