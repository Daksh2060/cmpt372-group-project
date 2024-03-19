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
    return times[0][1] - times[0][0];
}

export function getRealTimeEstimate(routes: UserRoute){
    for (let x = 0; x < routes.transfers.length; x++){
        console.log(routes.transfers[x]);
    }
}

const testData: UserRoute = {
    startTime: 15*3600,
    transfers: [
        {
            route_short_name: "210",
            startStop: "50433",
            endStop: "61269",
            transferTime: 0
        },
        {
            route_short_name: "240",
            startStop: "59526",
            endStop: "61563",
            transferTime: 0
        }
    ]
};
getRealTimeEstimate(testData);

queries.getStopTimes({route_short_name: "210", service_id: 1, service_date: "2024-04-02", direction_id: 0, startStop: "50433", endStop: "61269", afterTime: 15*3600, maxResultCount: 69420})
.then((value) => console.log(getTravelDuration(value, 15*3600)));
