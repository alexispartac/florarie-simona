'use client';
import { useCookies } from "react-cookie";
import { useUser } from "./ContextUser";
import { jwtDecode } from "jwt-decode";
import { useHandleLogout } from "./Auth";
import { useEffect } from "react";
import axios from "axios";

const URL_VERIFY_TOKEN = "/api/users/login/verify-token";
const URL_LOGIN = "/api/users/login";

export const AutoConnectWithToken = () => {
    const [cookies, setCookie] = useCookies(['login']);
    const logout = useHandleLogout();
    const { user, setUser } = useUser();
    const token = cookies.login;

    useEffect(() => {
        if (token && user.isAuthenticated === false) {
            axios.post(URL_VERIFY_TOKEN, { token })
                .then(async (response) => {
                    if (response.status === 200) {
                        const decoded: { email: string; password: string } = jwtDecode(token);
                        const data = { email: decoded.email, password: decoded.password };
                        const loginResponse = await axios.post(URL_LOGIN, data);

                        if (loginResponse.status === 200) {
                            setUser({
                                userInfo: {
                                    id: loginResponse.data.user.id,
                                    name: loginResponse.data.user.name,
                                    surname: loginResponse.data.user.surname,
                                    email: loginResponse.data.user.email,
                                    phone: loginResponse.data.user.phone,
                                    address: loginResponse.data.user.address,
                                    order: loginResponse.data.user.order,
                                    createdAt: loginResponse.data.user.createdAt,
                                    password: '',
                                    avatar: loginResponse.data.user.avatar || '',
                                },
                                isAuthenticated: true,
                            });
                            setCookie('login', loginResponse.data.token, { path: '/' });
                        }
                    }
                })
                .catch((error) => {
                    console.error('Error verifying token', error);
                    logout();
                });
        } else {
            console.log("No token found, redirecting to login.");
        }
    }, []);

    return null; 
};



