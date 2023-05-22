import { Championship } from "@/interfaces";
import axios, { AxiosResponse } from "axios"

export  type Status = "success" | "error";

export  interface ResponseRequestGetChampionships {
    status: Status;
    message: string;
    data?: Array<Championship>;
}

export  interface ResponseRequestGetChampionshipById {
    status: Status;
    message: string;
    data?: Championship;
}

export const getChampionships = async (): Promise<ResponseRequestGetChampionships> => {

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

export const getChampionshipById = async (id:string): Promise<ResponseRequestGetChampionshipById> => {

    const response = await axios.get<Championship>(process.env.NEXT_PUBLIC_URL_SERVER+"/championships/"+id)
      .then(
          (response: AxiosResponse<Championship>) => {
              const status: Status = "success";
              return {
                  status:status,
                  data: response?.data,
                  message: "Championship received with sucess"
              }}
      )
      .catch(
          () => {
              const status: Status = "error";
              return {
                  status: status,
                  message: "Error receiving championship"
              }
          }
      );
      return response;
  };