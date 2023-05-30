import { createContext, ReactNode,useEffect,useState } from "react";
import jwt_decode from "jwt-decode"
import {User} from "../interfaces";
import {destroyCookie, parseCookies,setCookie} from 'nookies'
import { useRouter } from "next/router";
import { getUserById } from "@/services/users/retrieve";
import { Token } from "../interfaces";
type UserContextProps = {
    children: ReactNode;
}

type UserContextType = {
    id: Number;
    setId: (id: Number) => void;
    username: string;
    setUsername: (username: string) => void;
    email: string;
    setEmail: (email: string) => void;
    clearUser: () => void;
    signin: (token:string) => void
    signout: () => void
}



const initialValue = {
    id: -1,
    setId: () => {},
    username: "",
    setUsername: () => {},
    email: "",
    setEmail: () => {},
    clearUser: () => {},
    signin: () => {},
    signout: () => {}
}


export const UserContext = createContext<UserContextType>(initialValue);


export const UserProvider = ({ children }: UserContextProps)=>{
    const router = useRouter();
    

    const [id, setId] = useState<Number>(initialValue.id);
    const [username, setUsername] = useState<string>(initialValue.username);
    const [email, setEmail] = useState<string>(initialValue.email);

    const token = parseCookies()["championship-token"];

    useEffect(
        () => {
            console.log("asdasd")
            signin(token);
        },[token]
    )

    function clearUser(){
        setId(-1);
        setUsername("");
    }


    async function signin(token:string){
        try{
            setCookie(null, "championship-token", token, {
                maxAge: 60 * 60 * 24, // 24 hours
            });
            const tokenData:Token = jwt_decode(token);
            if(!tokenData.id){
                throw new Error("Invalid token");
            }
            const response = await getUserById(tokenData.id.toString());
            if(response.status == "error" || !response.data )throw new Error(response.message);
           
            const userData:User = response.data;

            setId(userData.id);
            setUsername(userData.username);
            setEmail(userData.email)
        }
        catch{
            signout()
        }
    }

    function signout(){
        destroyCookie(null,'championship-token',{path: '/'});
        clearUser();
        router.push('/signin');
    }

    return (
        <UserContext.Provider
            
            value={{
                id, setId,
                username,setUsername,
                email, setEmail,
                clearUser,
                signin, signout
            }}

        >
            {children}
        </UserContext.Provider>
    )
}



export default UserContext;



