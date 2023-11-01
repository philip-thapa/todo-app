export const storeToken = (token) => {
    return new Promise((resolve, reject) => {
        try {
            localStorage.setItem('token', token);
            resolve(true);
        } catch (error) {
            reject(error);
        }
    });
}

export const clearToken = () => {
    if (localStorage.getItem('token')){
        localStorage.removeItem('token')
    }
}

export const getToken = () => {
    if (localStorage.getItem('token')){
        return localStorage.getItem('token')
    } else {
        return ''

    }
}