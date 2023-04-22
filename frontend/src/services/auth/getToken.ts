import axios, { AxiosResponse } from "axios";
export interface AuthData {
    username: string;
    password: string;
}
export  type Status = "success" | "error";
export  interface ResponseRequest {
    status: Status;
    message: string;
    data?: {
        access_token: string;
        token_type: string;
    };
}

export const getToken = async (data: AuthData): Promise<ResponseRequest> => {

  const response = await axios.post<AuthData>(process.env.NEXT_PUBLIC_URL_SERVER+"/auth/token", data)
    .then(
        (response: AxiosResponse) => {
            const status: Status = "success";
            return {
                status:status,
                data: response.data,
                message: "User created successfully"
            }}
    )
    .catch(
        (error) => {
            const status: Status = "error";
            return {
                status: status,
                message: error.response?.data?.detail  
            }
        }
    );
    
    return response;
  
};