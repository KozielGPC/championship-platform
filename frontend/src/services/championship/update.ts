import axios, { AxiosResponse } from "axios";
import {parseCookies} from "nookies";
interface EditChampionship {
    name: string,
    start_time: string,
    min_teams: number,
    max_teams: number,
    prizes: string,
    format: string,
    rules: string,
    contact: string,
    visibility: string
}

export  type Status = "success" | "error";
export  interface ResponseRequest {
    status: Status;
    message: string;
    data?: EditChampionship;
}

export type Props = {
    id: number;
    data?: EditChampionship
}

export const editChampionship = async ({id, data}:Props): Promise<ResponseRequest> => {
    
    const { "championship-token" : token } = parseCookies();  

    const response = await axios.put<EditChampionship>(
        process.env.NEXT_PUBLIC_URL_SERVER+"/championships/update/"+id, 
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
                  message: "Championship edited successfully"
              }}
      )
      .catch(
          (error) => {
              const status: Status = "error";
              return {
                  status: status,
                  message: "Error editing championship"
              }
          }
      );
      
      return response;
  };
