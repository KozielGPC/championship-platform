import { Team } from "@/interfaces";
import axios, { AxiosResponse } from "axios";
import { parseCookies } from "nookies";


export type Status = "success" | "error";

export interface ResponseRequest {
  status: Status;
  message: string;
}

export interface Payload {
    team_id?: Number,
    user_id?: Number
}

export const removeUser = async (data:Payload): Promise<ResponseRequest> => {
  const { "championship-token": token } = parseCookies();

  const response = await axios.post<Team>(
      process.env.NEXT_PUBLIC_URL_SERVER + "/teams/remove-user", data,
      {     
        headers: {
         "Authorization": `Bearer ${token}`,
         "Content-Length": JSON.stringify(data).length,
         "Content-Type": 'application/json'
        },
      }
    )
    .then((response: AxiosResponse) => {
      const status: Status = "success";
      return {
        status: status,
        data: response.data,
        message: "User removed successfully",
      };
    })
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
