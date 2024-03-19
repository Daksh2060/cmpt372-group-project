import {UserRoute, RTTIData, StopTimesData} from "../types";
import {queries} from "../database";

export const A = 0;// Remove this later

function getTravelDuration(data: StopTimesData[], startTime: number){
    const times: [number, number][] = [];
    for (let x = 0; x < data.length; x += 2){
        if (data[x].trip_id === data[x + 1].trip_id && data[x].departure_time >= startTime){
            times.push([data[x].departure_time, data[x + 1].arrival_time]);
        }
    }
    if (times.length === 0){
        return -1;
    }

    times.sort((a, b) => a[0] - b[0]);
    console.log(times[0]);
    return times[0][1] - times[0][0];
}

function getRTTILeaveTime(minStartTime: number): number{
    // More options added later
    return minStartTime;
}

/*
Real-time estimate example
1. Start trip at 15:00
2. Take the 210 from stop 50438 to 61269
    - Get next real-time departure after 15:00 and set as the current time
    - Use static data to determine how long it should take to go from stop 50438 to 61269 on route 210
    - Add the result to the current time and this is the arrival time
3. Transfer to the 240 and take it from stop 54014 to 61563
    - Get next real-time departure after the previous arrival time (in step 2) and set as the current time
    - Use static data to determine how long it should take to go from stop 54014 to 61563 on route 240
    - Add the result to the current time and this is the arrival time
4. Return arrival time
*/
export async function getRealTimeEstimate(routes: UserRoute){
    let currentTime = routes.startTime;
    console.log(currentTime);

    for (let x = 0; x < routes.transfers.length; x++){
        currentTime = getRTTILeaveTime(currentTime);

        const r = routes.transfers[x];
        const times = await queries.getStopTimes({
            route_short_name: r.route_short_name,
            service_id: 1,
            service_date: "2024-04-02",
            direction_id: r.direction_id,
            startStop: r.startStop,
            endStop: r.endStop,
            afterTime: currentTime,
            maxResultCount: 69420
        });

        const duration = getTravelDuration(times, currentTime);
        if (duration <= 0){
            return;
        }
        currentTime += duration;
        console.log(currentTime);
    }
}

const testData: UserRoute = {
    startTime: 15*3600,
    transfers: [
        {
            route_short_name: "210",
            direction_id: 0,
            startStop: "50438",
            endStop: "61269",
            transferTime: 0
        },
        {
            route_short_name: "240",
            direction_id: 1,
            startStop: "54014",
            endStop: "61563",
            transferTime: 0
        }
    ]
};
getRealTimeEstimate(testData);

//queries.getStopTimes({route_short_name: "210", service_id: 1, service_date: "2024-04-02", direction_id: 0, startStop: "50433", endStop: "61269", afterTime: 15*3600, maxResultCount: 69420}).then((value) => console.log(getTravelDuration(value, 15*3600)));
