export type Empty = Record<string, never>;

export interface RouteData{
    route_id: number;
    route_short_name: string;
    route_long_name: string;
}

export interface RouteDirectionData{
    direction_id: number;
    trip_headsign: string;
}

interface StopData{
    stop_id: number;
    stop_code: string;
    stop_name: string;
    stop_lat: number;
    stop_lon: number;
}

export type StopListData = Pick<StopData, "stop_id" | "stop_code" | "stop_name">;

export interface TripData{
    stop_code: string;
    stop_name: string;
    arrival_time: number;
    departure_time: number;
}
