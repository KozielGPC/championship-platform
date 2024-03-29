import { createContext, ReactNode, useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import { User } from "../interfaces";
import { destroyCookie, parseCookies } from "nookies";
import { useRouter } from "next/router";
import { getUserById, getMyNotifications } from "@/services/users/retrieve";
import { Token, Notification } from "../interfaces";

type UserContextProps = {
  children: ReactNode;
};

type UserContextType = {
  id: Number;
  setId: (id: Number) => void;
  username: string;
  setUsername: (username: string) => void;
  email: string;
  setEmail: (email: string) => void;
  notifications: Notification[];
  setNotifications: (notifications: Notification[]) => void;
  clearUser: () => void;
  signin: (token: string) => void;
  signout: () => void;
  getNotifications: () => void;
};

const initialValue = {
  id: -1,
  setId: () => {},
  username: "",
  setUsername: () => {},
  email: "",
  setEmail: () => {},
  notifications: [],
  setNotifications: () => {},
  clearUser: () => {},
  signin: () => {},
  signout: () => {},
  getNotifications: () => {},
};

export const UserContext = createContext<UserContextType>(initialValue);

export const UserProvider = ({ children }: UserContextProps) => {
  const router = useRouter();

  const [id, setId] = useState<Number>(initialValue.id);
  const [username, setUsername] = useState<string>(initialValue.username);
  const [email, setEmail] = useState<string>(initialValue.email);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const token = parseCookies()["championship-token"];

  useEffect(() => {
    if (token) {
      signin(token);
      getNotifications();
    }
  }, [token]);

  function clearUser() {
    setId(-1);
    setUsername("");
  }

  async function getNotifications() {
    const response = await getMyNotifications();
    if (response && response.data) {
      const notificationsArray: Notification[] = response.data;
      if (notificationsArray) {
        setNotifications(notificationsArray.reverse());
      }
    }
  }

  useEffect(() => {
    console.log(notifications);
  }, [notifications]);

  async function signin(token: string) {
    try {
      const tokenData: Token = jwt_decode(token);
      if (!tokenData.id) {
        throw new Error("Invalid token");
      }
      const response = await getUserById(tokenData.id.toString());
      if (response.status == "error" || !response.data)
        throw new Error(response.message);

      const userData: User = response.data;

      setId(userData.id);
      setUsername(userData.username);
      setEmail(userData.email);
    } catch {
      signout();
    }
  }

  function signout() {
    destroyCookie(null, "championship-token", { path: "/" });
    clearUser();
    router.push("/signin");
  }

  return (
    <UserContext.Provider
      value={{
        id,
        setId,
        username,
        setUsername,
        email,
        setEmail,
        notifications,
        setNotifications,
        clearUser,
        signin,
        signout,
        getNotifications,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
