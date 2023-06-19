import axios, { AxiosResponse } from "axios";
import { parseCookies } from "nookies";
import { Notification } from "@/interfaces";

export interface acceptInviteData {
    team_id: number;
    user_id: Number;
    notification_id: number;
    accepted: boolean;
}

export type Status = "success" | "error";
export interface ResponseRequest {
    status: Status;
    message: string;
    data?:{
        team_id: number;
        user_id: number;
    }
}

export const acceptInvite = async (
    data: acceptInviteData
): Promise<ResponseRequest> => {
    const { "championship-token": token } = parseCookies();
    const response = await axios
    .post<acceptInviteData>(
        process.env.NEXT_PUBLIC_URL_SERVER + "/teams/accept-invite",
        data,
        {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            }
        }
    )
    .then((response: AxiosResponse) => {
        const status: Status = "success";
        return {
            status: status,
            data: response.data,
            message: "Invite accepted successfully",
        }
    })
    .catch((error) => {
        const status: Status = "error";
        return {
            status: status,
            message: error.response?.data?.detail[0]?.msg || "Failed to accept invite :(",
        }
    });

    return response;
}

