import { Championship } from "@/interfaces";
import axios, { AxiosResponse } from "axios";



export  type Status = "success" | "error";
export  interface ResponseRequest {
    status: Status;
    message: string;
    data?: Array<Championship>;
}

export const getChampionships = async (): Promise<ResponseRequest> => {

  const response = await axios.get<Array<Championship>>(process.env.NEXT_PUBLIC_URL_SERVER+"/championships")
    .then(
        (response: AxiosResponse<Array<Championship>>) => {
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