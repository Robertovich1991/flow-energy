import axios from "axios";
import keys from "../Keys";

export const setScanMeApiAuthorization = (token: string | null) => {   
    mainApi.defaults.headers.common.Authorization = token
        ? `Bearer ${token}`
        : null;
};
const mainApi = axios.create({
    baseURL: keys.BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});


export default mainApi;