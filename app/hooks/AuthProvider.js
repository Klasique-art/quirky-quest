import React, {createContext} from "react";

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    return (
        <AuthContext.Provider value={{name: "Rahul"}}>
            {children}
        </AuthContext.Provider>
    )
}