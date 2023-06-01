import { Game } from "@/interfaces";
import axios, { AxiosResponse } from "axios"

export  type Status = "success" | "error";

export  interface ResponseRequest {
    status: Status;
    message: string;
    data?: Array<Game>;
}

export const getGames= async (): Promise<ResponseRequest> => {

  const response = await axios.get<Array<Game>>(process.env.NEXT_PUBLIC_URL_SERVER+"/games")
    .then(
        (response: AxiosResponse<Array<Game>>) => {
            const status: Status = "success";
            return {
                status:status,
                data: response?.data,
                message: "Games received with sucess"
            }}
    )
    .catch(
        (error) => {
            const status: Status = "error";
            return {
                status: status,
                message: "Error receiving games"
            }
        }
    );
    return response

};