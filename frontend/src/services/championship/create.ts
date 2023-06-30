import axios, { AxiosResponse } from "axios";
import {parseCookies} from "nookies";
export interface Championship {
    name: string;
    start_time: string;
    created_at: string;
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
    
    const { "championship-token" : token } = parseCookies();  

    const response = await axios.post<Championship>(
        process.env.NEXT_PUBLIC_URL_SERVER+"/championships/create", 
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
                  message: "Championship created successfully"
              }}
      )
      .catch((error) => {
        const status: Status = "error";
        const errorDetail = error.response.data.detail[0]?.msg || "Championship with this name already exists";
        return {
          status: status,
          message: errorDetail,
        };
      });
      
      return response;
  };
