import axios from "axios";
import keys from "../Keys";
import i18n from "../../i18n";

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

// Function to get tenant slug based on current language
const getTenantSlug = () => {
    const currentLanguage = i18n.language;
    if (currentLanguage === 'en') return 'energy-en';
    if (currentLanguage === 'es') return 'energy-es';
    if (currentLanguage === 'de') return 'energy-de';
    return 'energy-ru'; // Default for Russian and other languages
};

// Add request interceptor to dynamically set tenant slug
mainApi.interceptors.request.use((config) => {
    config.headers['X-Tenant-Slug'] = getTenantSlug();
    return config;
});


export default mainApi;