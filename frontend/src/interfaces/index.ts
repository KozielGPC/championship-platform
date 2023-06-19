export interface User {
    id: Number;
    username: string;
    email: string
}

export interface Token {
    id: Number;
    username: string;
}

export interface Championship {
    id: number,
    name: string,
    start_time: string,
    created_at: string,
    min_teams: number,
    max_teams: number,
    prizes: string,
    format: string,
    rules: string,
    contact: string,
    visibility: string,
    game_id: number,
    admin_id: number,
    teams: Team[]
}

export interface Team {
    id: number,
    name: string,
    password: string,
    game_id: number,
    owner_id: number
    championships: Championship[]
}

export interface Notification{
    id: number,
    name: string,
    reference_user_id: number
    text: string,
    visualized: boolean
}

export interface Game {
  id: number;
  name: string;
}

export interface Notification{
    id: number,
    name: string,
    reference_user_id: number
    text: string,
    visualized: boolean
}
