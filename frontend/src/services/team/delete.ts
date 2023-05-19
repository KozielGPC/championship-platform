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
    password: string,
    game_id: number,
    owner_id: number
  };
}

export const deleteTeam = async (id: number): Promise<ResponseRequest> => {
  const { "championship-token": token } = parseCookies();

  const response = await axios.delete<Team>(
      process.env.NEXT_PUBLIC_URL_SERVER + "/teams/delete/"+id,
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
        message: "Team deleted successfully",
      };
    })
    .catch((error) => {
      const status: Status = "error";
      return {
        status: status,
        message: error.response?.data?.detail || "Failed to delete team :(",
      };
    });

  return response;
};
