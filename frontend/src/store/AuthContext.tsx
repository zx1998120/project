import {useContext, createContext, useState} from "react";
import {useNavigate} from "react-router-dom";
import {getServerHTTP} from "../api/ServerHTTP.ts";

export type AutoContextValue = {
    token : string
    user : string | null
    loginAction(data : unknown) : void
    logOut() : void
}
const AuthContext = createContext<AutoContextValue|null>({
    token : "",
    user : null,
    loginAction : () => {},
    logOut : ()=>{}
});

const AuthProvider = ({children}: React.PropsWithChildren) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("site") || "");
    const navigate = useNavigate();
    const loginAction = async (data: unknown) => {
        try {
            const response = await fetch(getServerHTTP("/auth"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            const res = await response.json();
            if (res.data) {
                setUser(res.data.user);
                setToken(res.token);
                localStorage.setItem("site", res.token);
                navigate("/");
                return;
            }
            throw new Error(res.message);
        } catch (err) {
            console.error(err);
        }
    };

    const logOut = () => {
        setUser(null);
        setToken("");
        localStorage.removeItem("site");
        navigate("/");
    };

    return (
        <AuthContext.Provider value={{token, user, loginAction, logOut}}>
            {children}
        </AuthContext.Provider>
    );

};

export default AuthProvider;

export const useAuth = () => {
    return useContext(AuthContext);
};