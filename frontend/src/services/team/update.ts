import axios, { AxiosResponse } from "axios";
import {parseCookies} from "nookies";
interface EditTeam {
    name: string,
    password: string
}
export  type Status = "success" | "error";
export  interface ResponseRequest {
    status: Status;
    message: string;
    data?: EditTeam;
}

export type Props = {
    id: number;
    data?: EditTeam
}

export const editTeam = async ({id, data}:Props): Promise<ResponseRequest> => {
    
    const { "championship-token" : token } = parseCookies();  

    const response = await axios.put<EditTeam>(
        process.env.NEXT_PUBLIC_URL_SERVER+"/teams/update/"+id, 
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
                  message: "Team edited successfully"
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
