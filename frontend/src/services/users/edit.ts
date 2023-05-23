import axios, { AxiosResponse } from "axios";
import { parseCookies } from "nookies";

export interface User {
    id: Number;
    username: String;
    email: String;
    password: String;
}
export  type Status = "success" | "error";
export  interface ResponseRequest {
    status: Status;
    message: string;
    data?: User;
}

export const editUser = async (data: Partial<User>): Promise<ResponseRequest> => {

    const { id, ...dataPayload } = data;

    const { "championship-token" : token } = parseCookies(); 
    const response = await axios.put<User>(process.env.NEXT_PUBLIC_URL_SERVER+"/users/update/"+id, dataPayload, {
        headers:{
            "Authorization": `Bearer ${token}`,
            "Content-Length": JSON.stringify(data).length,
            "Content-Type": 'application/json'
        }
    })
        .then(
            (response: AxiosResponse<User>) => {
                const status: Status = "success";
                return {
                    status:status,
                    data: response?.data,
                    message: "User edited successfully"
                }}
        )
        .catch(
            (error) => {
                const status: Status = "error";
                return {
                    status: status,
                    message: "Error to edited user"
                }
            }
        );
        
    return response;
  
};