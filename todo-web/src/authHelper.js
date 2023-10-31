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

export const getToken = async () => {
    const token = localStorage.getItem('token');
    if (token) {
        return token;
    } else {
        // throw new Error('Token not found in local storage');
        return null;
    }
}