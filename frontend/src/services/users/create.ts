import axios, { AxiosResponse } from "axios";

interface MyData {
  username: string;
  email: string;
  password: string;
}

interface ResponseRequest {
    status: string;
    message: string;
    data?: MyData;
  }

const createUser = async (data: MyData): Promise<ResponseRequest> => {


  const response = await axios.post<MyData>(process.env.NEXT_PUBLIC_URL_SERVER+"/users", data)
    .then(
        (response: AxiosResponse<MyData>) => {
            return {
                status:"success",
                data: response?.data,
                message: "User created successfully"
            }}
    )
    .catch(
        (error) => {
            return {
                status:"error",
                message: "Error creating user"
            }
        }
    );
    
    return response;
  
};