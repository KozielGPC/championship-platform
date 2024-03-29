import { Notification } from "@/interfaces";
import axios, { AxiosResponse } from "axios"
import { parseCookies } from "nookies";

export interface User {
    id: Number;
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

export  interface ResponseRequest2 {
    status: Status;
    message: string;
    data?: User;
}

export  interface ResponseRequestGetMyNotitifications {
    status: Status;
    message: string;
    data: Array<Notification>;
}

export const getUsers = async (): Promise<ResponseRequest> => {
    const { "championship-token": token } = parseCookies();
    const response = await axios.get<Array<User>>(process.env.NEXT_PUBLIC_URL_SERVER+"/users",
    {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    })
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

export const getUserById = async (id:string): Promise<ResponseRequest2> => {
    const { "championship-token": token } = parseCookies();
    const response = await axios.get<User>(process.env.NEXT_PUBLIC_URL_SERVER+"/users/"+id,
    {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    })
    .then(
        (response: AxiosResponse<User>) => {
            const status: Status = "success";
            return {
                status:status,
                data: response?.data,
                message: "User received with sucess"
            }}
    )
    .catch(
        (error) => {
            const status: Status = "error";
            return {
                status: status,
                message: "Error receiving user"
            }
        }
    );
    return response;
};


export const getMyNotifications = async (): Promise<ResponseRequestGetMyNotitifications> => {

    const { "championship-token" : token } = parseCookies();
    const response = await axios.get<Array<Notification>>(process.env.NEXT_PUBLIC_URL_SERVER+"/users/me/notifications",
    {
        headers: {
        "Authorization": `Bearer ${token}`,
        }
    }) 
    .then(
        (response: AxiosResponse<Array<Notification>>) => {
        const status: Status = "success";
        return {
            status:status,
            data: response.data,
            message: "Notifications received with sucess"
        }}
    )
    .catch(
        () => {
        const status: Status = "error";
        return {
            status: status,
            message: "Error receiving notifications",
            data:[]
        }
    });

    return response;

  }