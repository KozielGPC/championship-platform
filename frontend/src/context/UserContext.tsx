import { createContext, ReactNode,useEffect,useState } from "react";
import jwt_decode from "jwt-decode"
import {User} from "../interfaces";
import {destroyCookie, parseCookies,setCookie} from 'nookies'
import { useRouter } from "next/router";

type UserContextProps = {
    children: ReactNode;
}

type UserContextType = {
    id: Number;
    setId: (id: Number) => void;
    username: String;
    setUsername: (username: String) => void;
    clearUser: () => void;
    signin: (token:string) => void
    signout: () => void
}



const initialValue = {
    id: -1,
    setId: () => {},
    username: "",
    setUsername: () => {},
    clearUser: () => {},
    signin: () => {},
    signout: () => {}
}


export const UserContext = createContext<UserContextType>(initialValue);


export const UserProvider = ({ children }: UserContextProps)=>{
    const router = useRouter();
    

    const [id, setId] = useState<Number>(initialValue.id);
    const [username, setUsername] = useState<String>(initialValue.username);

    useEffect(
        () => {
            try {
                const { "championship-token" : token } = parseCookies();

                // Decodifique o token e armazene o resultado em userData
                const userData:User = jwt_decode(token);
            
                if(userData.id && userData.username){
                    setId(userData.id)
                    setUsername(userData.username)
                }else{
                    destroyCookie(null,'championship-token',{path: '/'});
                    router.push('/signin');
                }
                
            } catch (error) {
                // Se houver um erro ao decodificar o token, redirecione para a página de login
                destroyCookie(null,'championship-token',{path: '/'});
                router.push('/signin');
              }
        },[]
    )

    function clearUser(){
        setId(-1);
        setUsername("");
    }


    function signin(token:string){
        try{
            setCookie(null, "championship-token", token, {
                maxAge: 60 * 60 * 24, // 24 hours
            });
            const userData:User = jwt_decode(token);
            setId(userData.id);
            setUsername(userData.username);
            router.push("/")
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
                clearUser,
                signin, signout
            }}

        >
            {children}
        </UserContext.Provider>
    )
}



export default UserContext;



