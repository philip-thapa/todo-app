export const storeToken = (token) => {
    localStorage.setItem('token', token)
}

export const clearToken = () => {
    if (localStorage.getItem('token')){
        localStorage.setItem('token', '')
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