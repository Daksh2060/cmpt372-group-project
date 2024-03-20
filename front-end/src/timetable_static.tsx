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

const SERVER = import.meta.env["VITE_SERVER"];

async function getRoutes(){
    const res = await fetch(`${SERVER}/routes`);
    if (!res.ok){
        throw new Error("Could not fetch routes.");
    }
    return await res.json();
}
async function getDirections(route: string){
    const res = await fetch(`${SERVER}/routes/${route}`);
    if (!res.ok){
        throw new Error("Could not fetch directions for route.");
    }
    return await res.json();
}
async function getStops(route: string, direction: string, date: string){
    const res = await fetch(`${SERVER}/routes/${route}/stops?direction=${direction}&date=${date}`);
    if (!res.ok){
        throw new Error("Could not fetch stops.");
    }
    return await res.json();
}

export default function StaticTimetable(){
    const [date, setDate] = useState<string>("2024-01-01");
    const [routes, setRoutes] = useState<RoutePreview[]>([]);
    const [selectedRoute, setSelectedRoute] = useState<string>("");
    const [directions, setDirections] = useState<DirectionPreview[]>([]);
    const [selectedDirection, setSelectedDirection] = useState<string>("-1");

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
                <button onClick={() => {getDirections(selectedRoute).then((value) => setDirections(value)).catch(() => {});}}>Add Route</button>
            </div>
            <div>
                <select onChange={(event) => setSelectedDirection(event.target.value)}>
                    <option key={""} value={""}>Select Direction</option>
                    {directions.map((value) => (
                        <option key={`${value.direction_id}${value.trip_headsign}`} value={`${value.direction_id}`}>{value.trip_headsign}</option>
                    ))}
                </select>
                <button onClick={() => {getStops(selectedRoute, selectedDirection, date).then((value) => console.log(value)).catch(() => {});}}>Set Direction</button>
            </div>
        </div>
    );
}
