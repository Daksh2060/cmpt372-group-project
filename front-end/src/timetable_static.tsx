import {useState, useEffect} from "react";
import "./timetable_static.css";

interface RoutePreview{
    name: string;
    destinations: string;
}
interface DirectionPreview{
    direction_id: number;
    trip_headsign: string;
}
interface StopPreview{
    stop_id: number;
    stop_code: string;
    stop_name: string;
}
type TimesSearchBody = {
    date: string;
    direction: number;
    start: string;
    end: string;
    prevTimes: number[];
    firstRoute?: boolean;
}
interface TimesData{
    BULL: number;
    startStopName: string;
    endStopName: string;
    trip_headsign: string;
    times: {
        trip_id: number;
        startTime: number;
        endTime: number;
    }[];
}

const SERVER = import.meta.env["VITE_SERVER"];

async function getRoutes(){
    const res = await fetch(`${SERVER}/routes`);
    if (!res.ok){
        throw new Error("Could not fetch routes.");
    }
    return await res.json();
}
async function getDirections(route: string){
    if (route === ""){
        throw new Error("Select a route.");
    }
    const res = await fetch(`${SERVER}/routes/${route}`);
    if (!res.ok){
        throw new Error("Could not fetch directions for route.");
    }
    return await res.json();
}
async function getStops(route: string, direction: string, date: string){
    if (route === ""){
        throw new Error("Select a route.");
    }
    const res = await fetch(`${SERVER}/routes/${route}/stops?direction=${direction}&date=${date.split("T")[0]}`);
    if (!res.ok){
        throw new Error("Could not fetch stops.");
    }
    return await res.json();
}
async function getTimes(route: string, options: TimesSearchBody){
    if (route === ""){
        throw new Error("Select a route.");
    }
    if (options.start === options.end){
        throw new Error("Start and end stops must be different");
    }
    const res = await fetch(`${SERVER}/routes/${route}/times`, {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(options)});
    if (!res.ok){
        throw new Error("Could not fetch stop times");
    }
    return await res.json();
}

export default function StaticTimetable(){
    const [date, setDate] = useState<string>("2024-01-01T00:00");
    const [timesCount, setTimesCount] = useState<number>(5);
    const [routes, setRoutes] = useState<RoutePreview[]>([]);
    const [selectedRoute, setSelectedRoute] = useState<string>("");
    const [directions, setDirections] = useState<DirectionPreview[]>([]);
    const [selectedDirection, setSelectedDirection] = useState<string>("-1");
    const [stops, setStops] = useState<StopPreview[]>([]);
    const [startStop, setStartStop] = useState<string>("");
    const [endStop, setEndStop] = useState<string>("");
    const [times, setTimes] = useState<TimesData[]>([]);
    const [error, setError] = useState<string>("\u00a0");

    const convertTime = (time: number) => {
        return `${Math.floor(time / 3600)}:${`${Math.floor((time % 3600) / 60)}`.padStart(2, "0")}:${`${time % 60}`.padStart(2, "0")}`;
    };

    const onRejected = (reason: Error) => {
        setError(reason.message);
        console.log(reason);
    };

    useEffect(() => {
        try{
            getRoutes().then((value) => setRoutes(value));
        } catch (error){
            console.error(error);
        }
    }, []);

    return (
        <div>
            <h1>Static Timetable Viewer</h1>
            <div id={"options"}>
                <div>
                    <label htmlFor={"datetime"}>Date</label>
                    <input id={"datetime"} type={"datetime-local"} onChange={(event) => setDate(event.target.value)}/>
                </div>
                <div>
                    <label htmlFor={"count"}>Number of trips to show</label>
                    <input id={"count"} type={"number"} value={timesCount > 0 ? timesCount: ""} onChange={(event) => {const value = parseInt(event.target.value); if (!isNaN(value)){setTimesCount(Math.min(20, value));} else{setTimesCount(0);}}}/>
                </div>
                <div>
                    <select onChange={(event) => setSelectedRoute(event.target.value)}>
                        <option key={""} value={""}>Select Route</option>
                        {routes.map((value) => (
                            <option key={value.name} value={value.name}>{`${value.name} ${value.destinations}`}</option>
                        ))}
                    </select>
                    <button onClick={() => {getDirections(selectedRoute)
                    .then((value) => {
                        if (value.length > 0){
                            setDirections(value);
                            setSelectedDirection(value[0].direction_id);
                        }
                        setStops([]);
                        setError("");
                    })
                    .catch(onRejected);
                    }}>Set Route</button>
                </div>
                <div>
                    <select onChange={(event) => setSelectedDirection(event.target.value)}>
                        {directions.length === 0 && <option key={""} value={""}>Select Direction</option>}
                        {directions.map((value) => (
                            <option key={`${value.direction_id}${value.trip_headsign}`} value={`${value.direction_id}`}>{value.trip_headsign}</option>
                        ))}
                    </select>
                    <button onClick={() => {getStops(selectedRoute, selectedDirection, date).then((value) => {if (value.length === 0){throw new Error("No service at the selected time.")} setStops(value); setError("");}).catch(onRejected);}}>Set Direction</button>
                </div>
                <div>
                    <select onChange={(event) => setStartStop(event.target.value)}>
                        <option key={""} value={"-1"}>Select Start Stop</option>
                        {stops.map((value) => (
                            <option key={value.stop_id} value={value.stop_code}>{value.stop_name}</option>
                        ))}
                    </select>
                    <select onChange={(event) => setEndStop(event.target.value)}>
                        <option key={""} value={"-1"}>Select End Stop</option>
                        {stops.map((value) => (
                            <option key={value.stop_id} value={value.stop_code}>{value.stop_name}</option>
                        ))}
                    </select>
                    <button onClick={() => {
                        const datetime = date.split("T");
                        if (datetime.length !== 2){
                            return;
                        }
                        const time = datetime[1].split(":").map((value) => parseInt(value));
                        if (time.length !== 2){
                            return;
                        }

                        let prevTimes: number[] = [];
                        if (times.length > 0){
                            prevTimes = times[times.length - 1].times.map((value) => value.endTime);
                        } else{
                            for (let x = 0; x < timesCount; x++){
                                prevTimes.push(time[0] * 3600 + time[1] * 60);
                            }
                        }

                        getTimes(selectedRoute, {
                            date: datetime[0],
                            direction: parseInt(selectedDirection),
                            start: startStop,
                            end: endStop,
                            prevTimes: prevTimes,
                            firstRoute: times.length === 0
                        })
                        .then((value) => {
                            setTimes(times.concat([{BULL: Date.now(), startStopName: value.startStopName, endStopName: value.endStopName, trip_headsign: value.trip_headsign, times: value.times}]));
                            setError("");
                        })
                        .catch(onRejected)}
                    }>Set Stops</button>
                </div>
            </div>
            <div className={"error"}>{error}</div>
            {times.length > 0 &&
            <>
            <div id={"times"}>
                {times.map((value, index) => (
                    <div className={"route"} key={value.BULL}>
                        <h2>{value.times.length > 0 ? value.trip_headsign : `Route ${index + 1}`}</h2>
                        <button className={"route-delete"} onClick={() => setTimes(times.filter((value2) => value.BULL !== value2.BULL))}>Remove</button>
                        <div className={"time-display"}>
                            <div className={"time-display-stops"}>
                                <div>{value.startStopName}</div>
                                <div>{value.endStopName}</div>
                            </div>
                            {value.times.map((trip, index) => (
                                <div key={index} className={"time-display-times"}>
                                    <div>{convertTime(trip.startTime)}</div>
                                    <div>{convertTime(trip.endTime)}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <button onClick={() => {setTimes([]);}}>Remove all trips</button>
            </>
            }
        </div>
    );
}
