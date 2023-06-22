import axios, { AxiosResponse } from "axios";
import {parseCookies} from "nookies";
export interface ChampionshipTeam {
    team_id?: number;
    championship_id?: number;

}
export  type Status = "success" | "error";
export  interface ResponseRequest {
    status: Status;
    message: string;
    data?: ChampionshipTeam;
}

export const addTeam = async (data: ChampionshipTeam): Promise<ResponseRequest> => {
    
    const { "championship-token" : token } = parseCookies();  

    const response = await axios.post<ChampionshipTeam>(
        process.env.NEXT_PUBLIC_URL_SERVER+"/championships/add-team", 
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
                  message: "Team added successfully"
              }}
      )
      .catch(
        (error) => {
            const status: Status = "error";
            const errorDetail = error.response.data.detail;
            return {
                status: status,
                message: errorDetail
            }
        }
    );
      
      return response;
  };
