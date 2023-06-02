import { InviteUserToTeam } from "@/interfaces";
import axios, { AxiosResponse } from "axios";
import { parseCookies } from "nookies";
export type Status = "success" | "error";
export interface ResponseRequest {
  status: Status;
  message: string;
  data?: {
    id: number,
    name: string,
    text: string,
    reference_user_id: number,
    visualized: boolean
  };
}

export const UserInvite = async (data: InviteUserToTeam): Promise<ResponseRequest> => {
  const { "championship-token": token } = parseCookies();

  const response = await axios
    .post<InviteUserToTeam>(
      process.env.NEXT_PUBLIC_URL_SERVER + "/teams/invite-user",
      data,
      {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Length": JSON.stringify(data).length,
          "Content-Type": "application/json",
        },
      }
    )
    .then((response: AxiosResponse) => {
      const status: Status = "success";
      return {
        status: status,
        data: response.data,
        message: "User invited with successfully",
      };
    })
    .catch((error) => {
      const status: Status = "error";
      return {
        status: status,
        message: error.response?.data?.detail || "Failed to invite user",
      };
    });

  return response;
};
