
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

    static formatTime() {
        let date = this.getDate()
        let output = date + "T07:30:00Z"
        return output
    }
}

module.exports = Utils