import {UserRoute, RTTIData, StopTimesData} from "../types";
import {queries} from "../database";

export const A = 0;// Remove this later

const RTTITest: RTTIData = [{"RouteNo":"129","RouteName":"PATTERSONSTN/HOLDOMSTN","Direction":"EAST","RouteMap":{"Href":"https://nb.translink.ca/geodata/129.kmz"},"Schedules":[{"Pattern":"EB1","Destination":"HOLDOMSTN","ExpectedLeaveTime":"8:01pm2024-03-18","ExpectedCountdown":10,"ScheduleStatus":"-","CancelledTrip":false,"CancelledStop":false,"AddedTrip":false,"AddedStop":false,"LastUpdate":"07:50:38pm"},{"Pattern":"EB1","Destination":"HOLDOMSTN","ExpectedLeaveTime":"8:24pm2024-03-18","ExpectedCountdown":33,"ScheduleStatus":"-","CancelledTrip":false,"CancelledStop":false,"AddedTrip":false,"AddedStop":false,"LastUpdate":"07:01:20pm"},{"Pattern":"EB1","Destination":"HOLDOMSTN","ExpectedLeaveTime":"8:53pm2024-03-18","ExpectedCountdown":62,"ScheduleStatus":"","CancelledTrip":false,"CancelledStop":false,"AddedTrip":false,"AddedStop":false,"LastUpdate":"07:31:02pm"},{"Pattern":"EB1","Destination":"HOLDOMSTN","ExpectedLeaveTime":"9:21pm2024-03-18","ExpectedCountdown":90,"ScheduleStatus":"*","CancelledTrip":false,"CancelledStop":false,"AddedTrip":false,"AddedStop":false,"LastUpdate":"10:05:03pm"}]},{"RouteNo":"130","RouteName":"METROTOWN/PENDER/KOOTENAY","Direction":"SOUTH","RouteMap":{"Href":"https://nb.translink.ca/geodata/130.kmz"},"Schedules":[{"Pattern":"S1","Destination":"WILLINGDON/TOMETROTOWNSTN","ExpectedLeaveTime":"7:52pm 2024-03-18","ExpectedCountdown":1,"ScheduleStatus":"-","CancelledTrip":false,"CancelledStop":false,"AddedTrip":false,"AddedStop":false,"LastUpdate":"07:50:58pm"},{"Pattern":"S2B","Destination":"WILLINGDON/TOMETROTOWNSTN","ExpectedLeaveTime":"8:05pm 2024-03-18","ExpectedCountdown":14,"ScheduleStatus":"","CancelledTrip":false,"CancelledStop":false,"AddedTrip":false,"AddedStop":false,"LastUpdate":"06:59:19pm"},{"Pattern":"S1","Destination":"WILLINGDON/TOMETROTOWNSTN","ExpectedLeaveTime":"8:33pm 2024-03-18","ExpectedCountdown":42,"ScheduleStatus":"-","CancelledTrip":false,"CancelledStop":false,"AddedTrip":false,"AddedStop":false,"LastUpdate":"07:18:25pm"},{"Pattern":"S2B","Destination":"WILLINGDON/TOMETROTOWNSTN","ExpectedLeaveTime":"8:37pm 2024-03-18","ExpectedCountdown":46,"ScheduleStatus":"","CancelledTrip":false,"CancelledStop":false,"AddedTrip":false,"AddedStop":false,"LastUpdate":"07:32:19pm"},{"Pattern":"S1","Destination":"WILLINGDON/TOMETROTOWNSTN","ExpectedLeaveTime":"9:02pm 2024-03-18","ExpectedCountdown":71,"ScheduleStatus":"","CancelledTrip":false,"CancelledStop":false,"AddedTrip":false,"AddedStop":false,"LastUpdate":"07:48:18pm"},{"Pattern":"S2B","Destination":"WILLINGDON/TOMETROTOWNSTN","ExpectedLeaveTime":"9:08pm 2024-03-18","ExpectedCountdown":77,"ScheduleStatus":"*","CancelledTrip":false,"CancelledStop":false,"AddedTrip":false,"AddedStop":false,"LastUpdate":"10:05:03pm"}]},{"RouteNo":"131","RouteName":"HASTINGSATGILMORE/KOOTENAYLOOP","Direction":"WEST","RouteMap":{"Href":"https://nb.translink.ca/geodata/131.kmz"},"Schedules":[{"Pattern":"WB1","Destination":"KOOTENAYLOOP","ExpectedLeaveTime":"8:08pm2024-03-18","ExpectedCountdown":17,"ScheduleStatus":"-","CancelledTrip":false,"CancelledStop":false,"AddedTrip":false,"AddedStop":false,"LastUpdate":"07:03:26pm"},{"Pattern":"WB1","Destination":"KOOTENAYLOOP","ExpectedLeaveTime":"9:03pm2024-03-18","ExpectedCountdown":72,"ScheduleStatus":"*","CancelledTrip":false,"CancelledStop":false,"AddedTrip":false,"AddedStop":false,"LastUpdate":"09:05:03pm"}]},{"RouteNo":"132","RouteName":"CAPITOLHILL/HASTINGSATGILMORE","Direction":"NORTH","RouteMap":{"Href":"https://nb.translink.ca/geodata/132.kmz"},"Schedules":[{"Pattern":"NB1","Destination":"CAPITOLHILL","ExpectedLeaveTime":"8:45pm2024-03-18","ExpectedCountdown":54,"ScheduleStatus":"","CancelledTrip":false,"CancelledStop":false,"AddedTrip":false,"AddedStop":false,"LastUpdate":"07:43:03pm"},{"Pattern":"NB1","Destination":"CAPITOLHILL","ExpectedLeaveTime":"9:45pm2024-03-18","ExpectedCountdown":114,"ScheduleStatus":"*","CancelledTrip":false,"CancelledStop":false,"AddedTrip":false,"AddedStop":false,"LastUpdate":"10:05:03pm"}]},{"RouteNo":"160","RouteName":"PORTCOQUITLAMSTN/KOOTENAYLOOP","Direction":"EAST","RouteMap":{"Href":"https://nb.translink.ca/geodata/160.kmz"},"Schedules":[{"Pattern":"E1","Destination":"PTCOQSTN","ExpectedLeaveTime":"7:59pm2024-03-18","ExpectedCountdown":8,"ScheduleStatus":"*","CancelledTrip":false,"CancelledStop":false,"AddedTrip":false,"AddedStop":false,"LastUpdate":"06:55:17pm"},{"Pattern":"E1","Destination":"PTCOQSTN","ExpectedLeaveTime":"8:13pm2024-03-18","ExpectedCountdown":22,"ScheduleStatus":"*","CancelledTrip":false,"CancelledStop":false,"AddedTrip":false,"AddedStop":false,"LastUpdate":"07:10:29pm"},{"Pattern":"E1","Destination":"PTCOQSTN","ExpectedLeaveTime":"8:28pm2024-03-18","ExpectedCountdown":37,"ScheduleStatus":"","CancelledTrip":false,"CancelledStop":false,"AddedTrip":false,"AddedStop":false,"LastUpdate":"07:25:16pm"},{"Pattern":"E1","Destination":"PTCOQSTN","ExpectedLeaveTime":"8:43pm2024-03-18","ExpectedCountdown":52,"ScheduleStatus":"","CancelledTrip":false,"CancelledStop":false,"AddedTrip":false,"AddedStop":false,"LastUpdate":"07:40:59pm"},{"Pattern":"E1","Destination":"PTCOQSTN","ExpectedLeaveTime":"8:58pm2024-03-18","ExpectedCountdown":67,"ScheduleStatus":"*","CancelledTrip":false,"CancelledStop":false,"AddedTrip":false,"AddedStop":false,"LastUpdate":"09:05:03pm"},{"Pattern":"E1","Destination":"PTCOQSTN","ExpectedLeaveTime":"9:13pm2024-03-18","ExpectedCountdown":82,"ScheduleStatus":"*","CancelledTrip":false,"CancelledStop":false,"AddedTrip":false,"AddedStop":false,"LastUpdate":"10:05:03pm"}]},{"RouteNo":"R5","RouteName":"HASTINGSST","Direction":"EAST","RouteMap":{"Href":"https://nb.translink.ca/geodata/R5.kmz"},"Schedules":[{"Pattern":"E1","Destination":"HASTINGSST/TOSFUEXCHANGE","ExpectedLeaveTime":"7:59pm2024-03-18","ExpectedCountdown":8,"ScheduleStatus":"-","CancelledTrip":false,"CancelledStop":false,"AddedTrip":false,"AddedStop":false,"LastUpdate":"07:50:11pm"},{"Pattern":"E1","Destination":"HASTINGSST/TOSFUEXCHANGE","ExpectedLeaveTime":"8:10pm2024-03-18","ExpectedCountdown":19,"ScheduleStatus":"-","CancelledTrip":false,"CancelledStop":false,"AddedTrip":false,"AddedStop":false,"LastUpdate":"07:49:35pm"},{"Pattern":"E1","Destination":"HASTINGSST/TOSFUEXCHANGE","ExpectedLeaveTime":"8:23pm2024-03-18","ExpectedCountdown":32,"ScheduleStatus":"*","CancelledTrip":false,"CancelledStop":false,"AddedTrip":false,"AddedStop":false,"LastUpdate":"06:59:06pm"},{"Pattern":"E1","Destination":"HASTINGSST/TOSFUEXCHANGE","ExpectedLeaveTime":"8:38pm2024-03-18","ExpectedCountdown":47,"ScheduleStatus":"*","CancelledTrip":false,"CancelledStop":false,"AddedTrip":false,"AddedStop":false,"LastUpdate":"07:14:33pm"},{"Pattern":"E1","Destination":"HASTINGSST/TOSFUEXCHANGE","ExpectedLeaveTime":"8:53pm2024-03-18","ExpectedCountdown":62,"ScheduleStatus":"","CancelledTrip":false,"CancelledStop":false,"AddedTrip":false,"AddedStop":false,"LastUpdate":"07:29:38pm"},{"Pattern":"E1","Destination":"HASTINGSST/TOSFUEXCHANGE","ExpectedLeaveTime":"9:08pm2024-03-18","ExpectedCountdown":77,"ScheduleStatus":"","CancelledTrip":false,"CancelledStop":false,"AddedTrip":false,"AddedStop":false,"LastUpdate":"07:44:20pm"}]}];

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

function parseTime(time: string): number{
    const match = time.match(/((?:[1-9])|(?:1[0-2])):([0-5]\d)([apx]m)/);
    if (match === null){
        return -1;
    }
    const hour = match[1];
    const minute = match[2];
    const bull = match[3];

    if (hour === undefined || minute === undefined || bull === undefined){
        return -1;
    }

    let offset = 0;
    if (bull === "pm"){
        offset = 43200;
    } else if (bull === "xm"){// Not sure if they still use this to represent time >= 24:00
        offset = 86400;
    }

    const result = parseInt(hour) * 3600 + parseInt(minute) * 60 + offset;
    if (isNaN(result)){
        return -1;
    }

    return result;
}

function getTimesFromRTTI(data: RTTIData, route_short_name: string){
    const route = data.find((value) => value.RouteNo === route_short_name);
    if (route === undefined){
        return;
    }

    const timeStrings = route.Schedules.map((value) => parseTime(value.ExpectedLeaveTime));
    console.log(timeStrings);
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
//getRealTimeEstimate(testData);
getTimesFromRTTI(RTTITest, "130");

//queries.getStopTimes({route_short_name: "210", service_id: 1, service_date: "2024-04-02", direction_id: 0, startStop: "50433", endStop: "61269", afterTime: 15*3600, maxResultCount: 69420}).then((value) => console.log(getTravelDuration(value, 15*3600)));
