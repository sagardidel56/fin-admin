import axios from "axios";
export const TOKEN_NAME = 'Fin-token'
const token = localStorage.getItem(TOKEN_NAME);
// no auth token required
const baseURL = 'http://host.prometteur.in:2002/admin/v1'
const baseURLFront = 'http://host.prometteur.in:2001/api/v1'
export const getAPI = async (url: String, body: any) => {
    const response = await axios.get(`${baseURL}/${url}`, body, {
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            Accept: "application/json",
        },
    });
    return response;
};

export const getAPIAuth = async (
    url: String,
    tokenInit: string = '',
    setToken: (token?: string) => void = () => { }
) => {
    const token = localStorage.getItem(TOKEN_NAME);
    try {
        const response = await axios.get(`${baseURL}/${url}`, {
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                Accept: "application/json",
                Authorization: `Bearer ${tokenInit ? tokenInit : token}`,
            },
        });


        return response;
    } catch (error) {
        console.log('ererer',{error})

        if (error?.response.status === 401 && setToken) {
            setToken("")
        }
        if (error?.response?.data?.msg === "Invalid token") {
            localStorage.removeItem(TOKEN_NAME);
            window.location.reload()
            // localStorage.removeItem(BT_TOKEN_NAME);
            setToken("")
        }
        throw new Error(error);
    }
};

// no auth token required
export const postAPI = async (url: String, params: any, isFront: boolean =false) => {
    const response = await axios.post(`${isFront ? baseURLFront : baseURL}/${url}`, params, {
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            Accept: "application/json",
        },
    });
    return response;
};

export const postAPIAuth = async (
    url: String,
    params: any = "",
    tokenInit: String = ""
) => {
    const token = localStorage.getItem(TOKEN_NAME);
    try {
        const response = await axios.post(`${baseURL}/${url}`, params, {
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                Accept: "application/json",
                Authorization: `Bearer ${tokenInit ? tokenInit : token}`,
            },
        });
        return response;
    } catch (error) {
        if (error?.response?.data?.msg === "Invalid token") {
            localStorage.removeItem(TOKEN_NAME);
        }
        throw new Error(error);

        //   return error
    }
};


export const putAPIAuth = async (
    url: String,
    params: any = "",
    tokenInit: String = ""
) => {
    const token = localStorage.getItem(TOKEN_NAME);
    try {
        const response = await axios.put(`${baseURL}/${url}`, params, {
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                Accept: "application/json",
                Authorization: `Bearer ${tokenInit ? tokenInit : token}`,
            },
        });
        return response;
    } catch (error) {
        if (error?.response?.data?.msg === "Invalid token") {
            localStorage.removeItem(TOKEN_NAME);
        }
        throw new Error(error);

        //   return error
    }
};

export const postAPIAuthFormData = async (url: string, params: any, tokenInit: string='') => {
    console.log({params})
    const token = localStorage.getItem(TOKEN_NAME);
    // try {
        const response = await axios({
            method: "post",
            url: `${baseURL}/${url}`,
            data: params,
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${tokenInit ? tokenInit : token}`,
            },
        });
        return response;
    // } catch (error) {

    // }
};

export const putAPIAuthFormData = async (url: string, params: any, tokenInit: string='') => {
    console.log({params})
    const token = localStorage.getItem(TOKEN_NAME);
    // try {
        const response = await axios({
            method: "put",
            url: `${baseURL}/${url}`,
            data: params,
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${tokenInit ? tokenInit : token}`,
            },
        });
        return response;
    // } catch (error) {

    // }
};

export const deleteAPIAuth = async (url: string,params:any) => {
    console.log('paramsparams',{params})
    const token = localStorage.getItem(TOKEN_NAME);
    try {
        const response = await axios.delete(`${baseURL}/${url}`, {
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
            params:params
        });
        return response;
    } catch (error) {
        return error;
    }
};
