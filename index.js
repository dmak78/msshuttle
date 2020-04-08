'use strict';

const fs = require('fs');

const query = {
    "routeName": "OTC / MILLENNIUM  CAMPUS",
    "pickupStop": "MILLENNIUM A",
    "dropOffStop": "MILLENNIUM C",
    "pickupTime": "7:23",
    "dropOffTime": "8:06"
}

fs.readFile('data.json', (err, data) => {
    
    if (err) throw err;

    let routes = JSON.parse(data);

    let output = [];

    let route = routes[query.routeName];

    let startScheduleIndex = null;

    if(route)
    {
        let schedules = route.schedules;
        
        scheduleLoop: for (let i = 0; i < schedules.length; i++) {

            const stops = schedules[i];

            let prevStopNames = [];

            for (let stopIndex = 0; stopIndex < stops.length; stopIndex++) {

                const stop = stops[stopIndex];

                // IF THE CURRENT STOP MATCHES THE PICKUP
                if(stop.stopTime === query.pickupTime && stop.name === query.pickupStop) {
                    // WE HAVE FOUND THE SCHEDULE WITH THE PICKUP
                    startScheduleIndex = i;
                }

                // IF WE HAVE FOUND THE SCHEDULE WITH THE PICKUP
                if(startScheduleIndex !== null){

                    // ARE WE ON THE SAME SCHEDULE AS THE PICKUP
                    // THEN ADD CURRENT STOP NAME TO THE OUTPUT LIST
                    if(i === startScheduleIndex) {
                        output.push(stop.name);
                    }
                    // ELSE ADD THE STOP NAME TO THE LIST OF POTENTIAL STOPS TO APPEAR BEFORE THE DROPOFF STOP
                    else 
                    {
                        // ADD STOP NAME TO RUNNING LIST OF STOP NAMES FOR THIS SCHEDULE ROW
                        prevStopNames.push(stop.name)
                    }
                    

                    // IF THE CURRENT STOP MATCHES THE DROPOFF ?
                    if(stop.stopTime === query.dropOffTime && stop.name === query.dropOffStop){

                        // ARE WE ONE THE SAME SCHEDULE AS PICKUP ?
                        // THEN JUST ADD THE DROPOFF NAME AND BREAK - DONE
                        if(i === startScheduleIndex) {
                            output.push(stop.name);
                            break scheduleLoop;
                        } 
                        // ELSE CONCAT THE RUNNING LIST OF STOP NAMES AND BREAK - DONE
                        else {
                            output = output.concat(prevStopNames);
                            break scheduleLoop;
                        }
                    }
                }
            }
        }
    }

    console.log(output);
    let outputJson = JSON.stringify(output, null, 2);
    fs.writeFile('output.json', outputJson, (err) => {
        if (err) throw err;
    });
});