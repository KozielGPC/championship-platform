import axios, { AxiosResponse } from "axios";

interface User {
  username: string;
  email: string;
  password: string;
}
type Status = "success" | "error";

interface ResponseRequest {
    status: Status;
    message: string;
    data?: User;
}

export const createUser = async (data: User): Promise<ResponseRequest> => {

  const response = await axios.post<User>(process.env.NEXT_PUBLIC_URL_SERVER+"/users/create", data)
    .then(
        (response: AxiosResponse<User>) => {
            const status: Status = "success";
            return {
                status:status,
                data: response?.data,
                message: "User created successfully"
            }}
    )
    .catch(
        (error) => {
            const status: Status = "error";
            return {
                status: status,
                message: "Error creating user"
            }
        }
    );
    
    return response;
  
};