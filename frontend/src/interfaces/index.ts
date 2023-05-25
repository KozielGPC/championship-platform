export interface User {
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

export interface Rodada {
    championship_id: Number;
    team_1_id: Number;
    team_2_id?: Number;
    rodada: Number;
    chave: Number;
    team_winner_id?: Number;
  }