'use strict';

const fs = require('fs');

const query = {
    "routeName": "OTC / MILLENNIUM  CAMPUS",
    "startPlace": "MILLENNIUM A",
    "endPlace": "MILLENNIUM C",
    "startTime": "7:23",
    "endTime": "8:06"
}

fs.readFile('data.json', (err, data) => {
    if (err) throw err;
    let routes = JSON.parse(data);

    let output = [];

    let route = routes[query.routeName];

    let startScheduleIndex = null;

    let iterations = 0;

    if(route)
    {
        let schedules = route.schedules;
        
        scheduleLoop: for (let i = 0; i < schedules.length; i++) {
            const stops = schedules[i];
            let prevStopNames = [];
            for (let stopIndex = 0; stopIndex < stops.length; stopIndex++) {
                const stop = stops[stopIndex];

                // IF THE CURRENT STOP MATCHES THE START
                if(stop.stopTime === query.startTime && stop.name === query.startPlace) {
                    // WE HAVE FOUND THE SCHEDULE WITH THE START
                    startScheduleIndex = i;
                }

                // IF WE HAVE FOUND THE SCHEDULE WITH THE START
                if(startScheduleIndex !== null){

                    // ADD STOP NAME TO RUNNING LIST OF STOP NAMES IN SCHEDULE ROW
                    prevStopNames.push(stop.name)

                    // IF THE CURRENT STOP MATCHES THE END ?
                    if(stop.stopTime === query.endTime && stop.name === query.endPlace){

                        // ARE WE ONE THE SAME SCHEDULE AS START ?
                        // THEN JUST ADD THE END PLACE NAME AND BREAK
                        if(i === startScheduleIndex) {
                            output.push(stop.name);
                            break scheduleLoop;
                        } 
                        // ELSE ADD THE RUNNING LIST OF STOP NAMES AND BREAK
                        else {
                            output = output.concat(prevStopNames);
                            break scheduleLoop;
                        }
                    }

                    // ARE WE ON THE SAME SCHEDULE AS THE START
                    // THEN ADD CURRENT STOP NAME TO THE OUTPUT LIST
                    if(i === startScheduleIndex) {
                        output.push(stop.name);
                    }
                }
            }
           iterations += 1;
        }
    }

    console.log(iterations);
    console.log(output);
    let outputJson = JSON.stringify(output, null, 2);
    fs.writeFile('output.json', outputJson, (err) => {
        if (err) throw err;
    });
});