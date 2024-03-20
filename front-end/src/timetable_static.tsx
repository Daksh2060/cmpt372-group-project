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
}
interface TimesData{
    BULL: number;
    startStopName: string;
    endStopName: string;
    times: {
        trip_id: number;
        trip_headsign: string;
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
    const res = await fetch(`${SERVER}/routes/${route}/stops?direction=${direction}&date=${date}`);
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
    const [date, setDate] = useState<string>("2024-01-01");
    const [routes, setRoutes] = useState<RoutePreview[]>([]);
    const [selectedRoute, setSelectedRoute] = useState<string>("");
    const [directions, setDirections] = useState<DirectionPreview[]>([]);
    const [selectedDirection, setSelectedDirection] = useState<string>("-1");
    const [stops, setStops] = useState<StopPreview[]>([]);
    const [startStop, setStartStop] = useState<string>("");
    const [endStop, setEndStop] = useState<string>("");
    //const [prevTimes, setPrevTimes] = useState<number[]>([-1, -1, -1, -1, -1]);
    const [times, setTimes] = useState<TimesData[]>([]);

    const convertTime = (time: number) => {
        return `${Math.floor(time / 3600)}:${`${Math.floor((time % 3600) / 60)}`.padStart(2, "0")}:${`${time % 60}`.padStart(2, "0")}`;
    };

    const onRejected = (reason: Error) => {
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
            <input type={"date"} onChange={(event) => setDate(event.target.value)}/>
            <div>
                <select onChange={(event) => setSelectedRoute(event.target.value)}>
                    <option key={""} value={""}>Select Route</option>
                    {routes.map((value) => (
                        <option key={value.name} value={value.name}>{`${value.name} ${value.destinations}`}</option>
                    ))}
                </select>
                <button onClick={() => {getDirections(selectedRoute).then((value) => {setDirections(value); setStops([]);}).catch(onRejected);}}>Set Route</button>
            </div>
            <div>
                <select onChange={(event) => setSelectedDirection(event.target.value)}>
                    <option key={""} value={""}>Select Direction</option>
                    {directions.map((value) => (
                        <option key={`${value.direction_id}${value.trip_headsign}`} value={`${value.direction_id}`}>{value.trip_headsign}</option>
                    ))}
                </select>
                <button onClick={() => {getStops(selectedRoute, selectedDirection, date).then((value) => {setStops(value)}).catch(onRejected);}}>Set Direction</button>
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
                    getTimes(selectedRoute, {
                        date: date,
                        direction: parseInt(selectedDirection),
                        start: startStop,
                        end: endStop,
                        prevTimes: [-1, -1, -1, -1, -1]
                    })
                    .then((value) => {
                        const start = stops.findIndex((value) => value.stop_code === startStop);
                        const end = stops.findIndex((value) => value.stop_code === endStop);
                        setTimes(times.concat([{BULL: Date.now(), startStopName: (start >= 0 ? stops[start].stop_name : startStop), endStopName: (end >= 0 ? stops[end].stop_name : endStop), times: value}]));
                    })
                    .catch(onRejected)}
                }>Set Stops</button>
            </div>
            <div>{`Start stop: ${startStop}`}</div>
            <div>{`End stop: ${endStop}`}</div>
            <div id={"times"}>
                {times.map((value, index) => (
                    <div className={"route"} key={value.BULL}>
                        <h2>{value.times.length > 0 ? value.times[0].trip_headsign : `Route ${index + 1}`}</h2>
                        <button className={"route-delete"} onClick={() => setTimes(times.filter((value2) => value.BULL !== value2.BULL))}>Remove</button>
                        <div className={"time-display"}>
                            <div className={"time-display-stops"}>
                                <div>{value.startStopName}</div>
                                <div>{value.endStopName}</div>
                            </div>
                            {value.times.map((trip) => (
                                <div key={trip.trip_id} className={"time-display-times"}>
                                    <div>{convertTime(trip.startTime)}</div>
                                    <div>{convertTime(trip.endTime)}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
