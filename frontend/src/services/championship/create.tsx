import axios, { AxiosResponse } from "axios";

export interface Championship {
    name: string;
    start_time: Date;
    created_at: Date;
    min_teams: number;
    max_teams: number;
    prizes: string;
    format: string;
    rules: string;
    contact: string;
    visibility: string;
    game_id: number;
    admin_id: number;
}
export  type Status = "success" | "error";
export  interface ResponseRequest {
    status: Status;
    message: string;
    data?: Championship;
}
export const createChampionship = async (data: Championship): Promise<ResponseRequest> => {

  const response = await axios.post<Championship>(process.env.NEXT_PUBLIC_URL_SERVER+"/championship/create", data)
    .then(
        (response: AxiosResponse<Championship>) => {
            const status: Status = "success";
            return {
                status:status,
                data: response?.data,
                message: "Championship created successfully"
            }}
    )
    .catch(
        (error) => {
            const status: Status = "error";
            return {
                status: status,
                message: "Error creating championship"
            }
        }
    );
    
    return response;
  
};