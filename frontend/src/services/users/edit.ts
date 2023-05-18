import axios, { AxiosResponse } from "axios";

export interface User {
    id: number;
    username: string;
    email: string;
    password: string;
}
export  type Status = "success" | "error";
export  interface ResponseRequest {
    status: Status;
    message: string;
    data?: User;
}
export const editUser = async (data: User): Promise<ResponseRequest> => {
    const response = await axios.put<User>(process.env.NEXT_PUBLIC_URL_SERVER+"/users/edit/"+data.id, data)
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