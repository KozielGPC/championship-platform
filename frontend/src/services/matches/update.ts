import axios, { AxiosResponse } from "axios";
import {parseCookies} from "nookies";

export interface setResult {
    winner_team_id: number,
    result: string,
}

export  type Status = "success" | "error";
export  interface ResponseRequest {
    status: Status;
    message: string;
    data?: setResult;
}

export type Props = {
    id: number;
    data: setResult
}

export const setResult = async ({id, data}:Props): Promise<ResponseRequest> => {
    
    const { "championship-token" : token } = parseCookies();  

    const response = await axios.put<setResult>(
        process.env.NEXT_PUBLIC_URL_SERVER+"/matches/update/"+id, 
        data,
        {
            headers:{
                "Authorization": `Bearer ${token}`,
                "Content-Length": JSON.stringify(data).length,
                "Content-Type": 'application/json'
            }
        }
    )
    .then(
        (response: AxiosResponse) => {
            const status: Status = "success";
            return {
                status:status,
                data: response?.data,
                message: "Match edited successfully"
            }}
    )
    .catch(
        (error) => {
            const status: Status = "error";
            return {
                    status: status,
                    message: error.message
                }
        }
    );
      
      return response;
  };
