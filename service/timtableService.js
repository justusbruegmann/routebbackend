const utils = require('../utils/utils')

class timetableService {
    static async cleanTimetable(timetable) {
        return new Promise(async (resolve) => {
            let data = timetable

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

            let outputArray = JSON.stringify(idList)
            outputArray = JSON.parse(outputArray)
            resolve(outputArray)
        })
    }

    static async getFirstLesson(timetable) {
        return new Promise(async (resolve) => {
            let data = timetable
            //TODo change back to comment done
            let dateFormated = utils.getDate().replaceAll("-","")
            dateFormated = Number(dateFormated)
            console.log(dateFormated)
            const idList = data.map(item => ({id: item.id, lessonId: item.lessonId, lessonText: item.lessonText, periodText: item.periodText, date: item.date, startTime: item.startTime, endTime: item.endTime, cellState: item.cellState}))
            let arr = []
            for (let i = 0; i < idList.length; i++) {
                if (idList[i].date === dateFormated  ) {
                    arr.push(idList[i])
                }
            }
            let min = Number.MAX_SAFE_INTEGER
            let output = []
            for (let i = 0; i < arr.length; i++) {
                if (min > arr[i].startTime) {
                    min = arr[i].startTime
                    output = arr[i]
                }
            }
            let outputArray = JSON.stringify(output)
            outputArray = JSON.parse(outputArray)
            resolve(outputArray)
        })
    }
}

module.exports = timetableService