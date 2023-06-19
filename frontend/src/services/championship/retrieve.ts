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

export interface ChampionshipFiltersProps{
    game_id?: number;
    admin_id?: number;
    max_teams?: number;
    min_teams?: number;
    format?: String;
    name?: String;
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

  export const getChampionshipsFiltered = async (championship?: ChampionshipFiltersProps): Promise<ResponseRequestGetChampionships> => {
    let queryParams = "";
    if (championship) {
        if (championship.game_id || championship.game_id == 0) {
          queryParams += `game_id=${championship.game_id}`;
        }
        if (championship.admin_id) {
          queryParams += queryParams ? `&admin_id=${championship.admin_id}` : `admin_id=${championship.admin_id}`;
        }
        if (championship.max_teams) {
          queryParams += queryParams ? `&max_teams=${championship.max_teams}` : `max_teams=${championship.max_teams}`;
        }
        if (championship.min_teams) {
          queryParams += queryParams ? `&min_teams=${championship.min_teams}` : `min_teams=${championship.min_teams}`;
        }
        if (championship.format) {
          queryParams += queryParams ? `&format=${championship.format}` : `format=${championship.format}`;
        }
        if (championship.name) {
          queryParams += queryParams ? `&name=${championship.name}` : `name=${championship.name}`;
        }
      }
    
    const response = await axios.get<Array<Championship>>(`${process.env.NEXT_PUBLIC_URL_SERVER}/championships${queryParams ? `?${queryParams}` : ""}`)
      .then((response: AxiosResponse<Array<Championship>>) => {
        const status: Status = "success";
        return {
          status: status,
          data: response?.data,
          message: "Championships received with success"
        };
      })
      .catch((error) => {
        const status: Status = "error";
        return {
          status: status,
          message: "Error receiving championships"
        };
      }
    );
    return response;
  };