const utils = require('../utils/utils')

class timetableService {
    /**
     * clean the timetable from not important fields
     * @param timetable
     * @returns {Promise<unknown>}
     */
    static async cleanTimetable(timetable) {
        return new Promise(async (resolve) => {
            let data = timetable
            // mapping over the data and get for every object only the wanted field and keys
            const idList = data.map(item => ({
                id: item.id,
                lessonId: item.lessonId,
                lessonText: item.lessonText,
                periodText: item.periodText,
                date: item.date,
                startTime: item.startTime,
                endTime: item.endTime,
                cellState: item.cellState
            }))

            // convert the idList to an JSON object or it would be undefined
            let outputArray = JSON.stringify(idList)
            outputArray = JSON.parse(outputArray)
            resolve(outputArray)
        })
    }

    /**
     * get the first lesson of the current day
     * @param timetable
     * @returns {Promise<unknown>}
     */
    static async getFirstLesson(timetable) {
        return new Promise(async (resolve) => {
            let data = timetable

            //user my own date function and convert it in the format webuntis uses in their respone
            let dateFormated = utils.getDate().replaceAll("-", "")
            //convert to number
            dateFormated = Number(dateFormated)
            //map over idlist and get the wanted fields and keys
            const idList = data.map(item => ({
                id: item.id,
                lessonId: item.lessonId,
                lessonText: item.lessonText,
                periodText: item.periodText,
                date: item.date,
                startTime: item.startTime,
                endTime: item.endTime,
                cellState: item.cellState
            }))
            //put every lesson of the day in an array for easier sorting
            let arr = []
            for (let i = 0; i < idList.length; i++) {
                if (idList[i].date === dateFormated) {
                    arr.push(idList[i])
                }
            }
            //loop one time over the array and get the smallest startTime bigO o of n
            let min = Number.MAX_SAFE_INTEGER
            let output = []
            for (let i = 0; i < arr.length; i++) {
                if (min > arr[i].startTime) {
                    min = arr[i].startTime
                    output = arr[i]
                }
            }
            // convert the idList to an JSON object or it would be undefined
            let outputArray = JSON.stringify(output)
            outputArray = JSON.parse(outputArray)
            resolve(outputArray)
        })
    }
}

module.exports = timetableService