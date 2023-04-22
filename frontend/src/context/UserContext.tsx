import { createContext, ReactNode,useEffect,useState } from "react";

type UserContextProps = {
    children: ReactNode;
}

type UserContextType = {
    id: Number;
    setId: (id: Number) => void;
    username: String;
    setUsername: (username: String) => void;
}


const initialValue = {
    id: -1,
    setId: () => {},
    username: "",
    setUsername: () => {}
}


export const UserContext = createContext<UserContextType>(initialValue);


export const UserProvider = ({ children }: UserContextProps)=>{
    const [id, setId] = useState<Number>(initialValue.id);
    const [username, setUsername] = useState<String>(initialValue.username);

    return (
        <UserContext.Provider
            
            value={{
                id, setId,
                username,setUsername
            }}

        >
            {children}
        </UserContext.Provider>
    )
}



export default UserContext;



