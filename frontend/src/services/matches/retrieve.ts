import { Match } from "@/interfaces";
import axios, { AxiosResponse } from "axios"

export  type Status = "success" | "error";

export  interface ResponseRequestGetMatchesByChampionshipId {
    status: Status;
    message: string;
    data?: Array<Match>;
}

export const getMatchesByChampionshipId = async (id:string): Promise<ResponseRequestGetMatchesByChampionshipId> => {

  const response = await axios.get<Array<Match>>(process.env.NEXT_PUBLIC_URL_SERVER+"/championships/" + id +"/matches")
    .then(
        (response: AxiosResponse<Array<Match>>) => {
            const status: Status = "success";
            return {
                status:status,
                data: response?.data,
                message: "Matches received with sucess"
            }}
    )
    .catch(
        (error) => {
            const status: Status = "error";
            return {
                status: status,
                message: error.message
            }
        }
    );
    return response;
};