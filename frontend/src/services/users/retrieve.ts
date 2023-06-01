import { User } from "@/interfaces";
import axios, { AxiosResponse } from "axios"
import { parseCookies } from "nookies";

export  type Status = "success" | "error";
export  interface ResponseRequest {
    status: Status;
    message: string;
    data?: User;
}

export const getUserById = async (id:string): Promise<ResponseRequest> => {

    const { "championship-token" : token } = parseCookies();
    const response = await axios.get<User>(process.env.NEXT_PUBLIC_URL_SERVER+"/users/"+id,
        {
            headers: {
            "Authorization": `Bearer ${token}`,
            }
        }).then(
          (response: AxiosResponse<User>) => {
              const status: Status = "success";
              return {
                  status:status,
                  data: response?.data,
                  message: "User received with sucess"
              }}
      )
      .catch(
          () => {
              const status: Status = "error";
              return {
                  status: status,
                  message: "Error receiving user"
              }
          }
      );
      return response;
  };