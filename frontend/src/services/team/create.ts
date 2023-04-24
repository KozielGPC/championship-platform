import axios, { AxiosResponse } from "axios";
import { parseCookies } from "nookies";

export interface createTeam {
    name: string;
    password: string;
    owner_id: number;
    game_id: number;
}

export  type Status = "success" | "error";
export  interface ResponseRequest {
    status: Status;
    message: string;
    data?: {
        access_token: string;
        token_type: string;
    };
}

export const createTeam = async (data: createTeam): Promise<ResponseRequest> => {
    const { "championship-token" : token } = parseCookies();
    console.log(token)
    const response = await axios.post<createTeam>(
        process.env.NEXT_PUBLIC_URL_SERVER+"/teams/create",
        data,
        {
            headers:{
                Authorization: token 
            }
        })
    .then(
        (response: AxiosResponse) => {
            const status: Status = "success";
            return {
                status:status,
                data: response.data,
                message: "Team created successfully"
            }}
    )
    .catch(
        (error) => {
            const status: Status = "error";
            return {
                status: status,
                message: error.response?.data?.detail  
            }
        }
    );
    
    return response;
  
};