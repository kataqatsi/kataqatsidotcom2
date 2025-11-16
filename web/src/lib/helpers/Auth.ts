import type { RefreshResponse } from "../models/Schemas";
import { backendApi } from "../models/Base";



export function isLoggedIn(): boolean {
    const accessToken = localStorage.getItem('accessToken');
    return !!accessToken;
}

export function logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
}

export async function authenticate() {
    let authToken = localStorage.getItem('authToken');
    // let authToken = '';
    // let refreshToken = '';

    if (authToken) {
        return true
    } else {
        return false
    }
}

export async function parseJwt(token: string | null) {
    if (token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    }
    return null
}


export async function getNewTokens() {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        return false
    }
    try {
        const response: RefreshResponse | undefined = await backendApi<null, RefreshResponse>('GET', '/auth/refresh', true, null)
        // const response = await fetch(`${import.meta.env.VITE_API_URL}/latest/ats/auth/refresh_token`,
        //     {
        //         method: 'GET',
        //         headers: {
        //             'Content-Type': 'application/json',
        //             "Authorization": `Bearer ${refreshToken}`
        //         }
        //     });

        const data = response as RefreshResponse;

        if (data.success) {
            // Store the new access token
            localStorage.setItem('accessToken', data.accessToken!);
            localStorage.setItem('refreshToken', data.refreshToken!);
            return true

        } else {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            return false
        }
    } catch (error) {
        // console.error('Error refreshing token:', error);
        return false
    }
}