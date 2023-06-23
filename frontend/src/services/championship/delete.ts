import { Team } from "@/interfaces";
import axios, { AxiosResponse } from "axios";
import { parseCookies } from "nookies";


export type Status = "success" | "error";

export interface ResponseRequest {
  status: Status;
  message: string;
  data?: {
    id: number,
    name: string,
    start_time: string,
    min_teams: number,
    max_teams: number,
    prizes: string,
    format: string,
    rules: string,
    round: number,
    contact: string,
    visibility: string,
    game_id: number,
    admin_id: number
  };
}

export const deleteChampionship = async (id: number): Promise<ResponseRequest> => {
  const { "championship-token": token } = parseCookies();

  const response = await axios.delete<Team>(
      process.env.NEXT_PUBLIC_URL_SERVER + "/championships/delete/"+id,
      {
        headers: {
         "Authorization": `Bearer ${token}`,
         "Content-Length": JSON.stringify(id).length,
         "Content-Type": 'application/json'
        },
      }
    )
    .then((response: AxiosResponse) => {
      const status: Status = "success";
      return {
        status: status,
        data: response.data,
        message: "Championship deleted successfully",
      };
    })
    .catch((error) => {
      const status: Status = "error";
      return {
        status: status,
        message: error.response?.data?.detail || "Failed to delete championship",
      };
    });

  return response;
};