export interface County {
    id: number;
    name: string;
    links: Record<string, string>;
}

export interface City {
    id: number;
    name: string;
    countyId: number;
    links: Record<string, string>;
}

export interface CityRequest {
    name: string;
}

export interface ApiError {
    detail:string;
}
