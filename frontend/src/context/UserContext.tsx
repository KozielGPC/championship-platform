import { createContext, ReactNode,useEffect,useState } from "react";

type UserContextProps = {
    children: ReactNode;
}

type UserContextType = {
    id: Number;
    setId: (id: Number) => void;
    username: String;
    setUsername: (username: String) => void;
    clearUser: () => void;
}


const initialValue = {
    id: -1,
    setId: () => {},
    username: "",
    setUsername: () => {},
    clearUser: () => {}
}


export const UserContext = createContext<UserContextType>(initialValue);


export const UserProvider = ({ children }: UserContextProps)=>{
    const [id, setId] = useState<Number>(initialValue.id);
    const [username, setUsername] = useState<String>(initialValue.username);

    function clearUser(){
        setId(-1);
        setUsername("");
    }
    return (
        <UserContext.Provider
            
            value={{
                id, setId,
                username,setUsername,
                clearUser
            }}

        >
            {children}
        </UserContext.Provider>
    )
}



export default UserContext;



