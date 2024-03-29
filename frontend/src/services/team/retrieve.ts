import { Team } from "@/interfaces";
import axios, { AxiosResponse } from "axios"

export  type Status = "success" | "error";

export  interface ResponseRequestGetTeams{
    status: Status;
    message: string;
    data?: Array<Team>;
}

export  interface ResponseRequestNoArray {
    status: Status;
    message: string;
    data?: Team;
}

export  interface ResponseRequestGetTeamById {
    status: Status;
    message: string;
    data?: Team;
}

export const getTeams= async (): Promise<ResponseRequestGetTeams> => {

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

export const getTeamById = async (id:string): Promise<ResponseRequestGetTeamById> => {

const response = await axios.get<Team>(process.env.NEXT_PUBLIC_URL_SERVER+"/teams/"+id)
    .then(
        (response: AxiosResponse<Team>) => {
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