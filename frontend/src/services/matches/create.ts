import { Match } from "@/interfaces";
import axios, { AxiosResponse } from "axios";
import {parseCookies} from "nookies";

export  type Status = "success" | "error";
export  interface ResponseRequest {
    status: Status;
    message: string;
    data?: Match;
}

export const createMatch = async (data: Match): Promise<ResponseRequest> => {
    
    const { "championship-token" : token } = parseCookies();  

    const response = await axios.post<Match>(
        process.env.NEXT_PUBLIC_URL_SERVER+"/matches/create", 
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
                  message: "Match created successfully"
              }}
      )
      .catch(
          (error) => {
              const status: Status = "error";
              const errorDetail = error.response.data.detail[0]?.msg || "Error creating Match"
              return {
                  status: status,
                  message: errorDetail,
              }
          }
      );
      
      return response;
  };
