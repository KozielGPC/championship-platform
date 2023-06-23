import { Match } from "@/interfaces";
import axios, { AxiosResponse } from "axios"

export  type Status = "success" | "error";

export  interface ResponseRequestGetMatches {
    status: Status;
    message: string;
    data?: Array<Match>;
}




export const getChampionships = async (): Promise<ResponseRequestGetMatches> => {

  const response = await axios.get<Array<Match>>(process.env.NEXT_PUBLIC_URL_SERVER+"/matches/")
    .then(
        (response: AxiosResponse<Array<Match>>) => {
            const status: Status = "success";
            return {
                status:status,
                data: response?.data,
                message: "Championships received with sucess"
            }}
    )
    .catch(
        (error) => {
            const status: Status = "error";
            return {
                status: status,
                message: "Error receiving championships"
            }
        }
    );
    return response;
};