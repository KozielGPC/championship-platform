import { Team } from "@/interfaces";
import axios, { AxiosResponse } from "axios"

export interface User {
    username: string;
    email: string;
    password: string;
}
export  type Status = "success" | "error";

export  interface ResponseRequest {
    status: Status;
    message: string;
    data?: Array<User>;
}
export const getUsers = async (): Promise<ResponseRequest> => {

  const response = await axios.get<Array<User>>(process.env.NEXT_PUBLIC_URL_SERVER+"/users")
    .then(
        (response: AxiosResponse<Array<User>>) => {
            const status: Status = "success";
            return {
                status:status,
                data: response?.data,
                message: "Users received with sucess"
            }}
    )
    .catch(
        (error) => {
            const status: Status = "error";
            return {
                status: status,
                message: "Error receiving users"
            }
        }
    );
    return response;
};