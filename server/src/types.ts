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
