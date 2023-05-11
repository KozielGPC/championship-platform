import { Team } from "@/interfaces";
import axios, { AxiosResponse } from "axios"

export  type Status = "success" | "error";
export  interface ResponseRequest {
    status: Status;
    message: string;
    data?: Array<Team>;
}

export const getTeams= async (): Promise<ResponseRequest> => {

  const response = await axios.get<Array<Team>>(process.env.NEXT_PUBLIC_URL_SERVER+"/teams")
    .then(
        (response: AxiosResponse<Array<Team>>) => {
            const status: Status = "success";
            return {
                status:status,
                data: response?.data,
                message: "Teams received with sucess"
            }}
    )
    .catch(
        (error) => {
            const status: Status = "error";
            return {
                status: status,
                message: "Error receiving teams"
            }
        }
    );
    return response;
};

export const getTeamById = async (id:string): Promise<ResponseRequest> => {

    const response = await axios.get<Array<Team>>(process.env.NEXT_PUBLIC_URL_SERVER+"/teams/"+id)
      .then(
          (response: AxiosResponse<Array<Team>>) => {
              const status: Status = "success";
              return {
                  status:status,
                  data: response?.data,
                  message: "Team received with sucess"
              }}
      )
      .catch(
          () => {
              const status: Status = "error";
              return {
                  status: status,
                  message: "Error receiving team"
              }
          }
      );
      return response;
  };