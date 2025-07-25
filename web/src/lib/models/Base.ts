// import { goto } from "../lib/helpers/Navigation";
import { getNewTokens } from "../helpers/Auth";

export async function backendApi<TRequestBody, TResponse>(method: string = 'POST', endpoint: string, requiresAuth?: boolean, requestBody?: TRequestBody): Promise<TResponse | undefined> {
    try {
        let accessToken: string | null = null;
        let headers: { [key: string]: string } = {
            'Content-Type': 'application/json',
        }
        if (requiresAuth) {
            accessToken = localStorage.getItem('accessToken');
            if (accessToken) {
                headers['Authorization'] = `Bearer ${accessToken}`
            } else {
                // redirect to login
                return
            }
        }

        const options: RequestInit = {
            method: method,
            headers: headers,
        };

        if (method !== 'GET' && requestBody) {
            options.body = JSON.stringify(requestBody);
        }

        const response = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, options);

        if (response.status === 401) {
            let successfulRefresh = await getNewTokens()
            if (!successfulRefresh) {
                // redirect to login
                console.log("refresh failed")
                // goto('/login')
                return
            }
            accessToken = localStorage.getItem('accessToken');
            const response2 = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`,
                {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify(requestBody)
                }
            );
            if (response2.status == 401) {
                return
            }
            if (!response2.ok) {
                throw new Error('Network response was not ok');
            }

            const result2: TResponse = await response2.json();
            return result2
        }

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result: TResponse = await response.json();
        return result;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        return undefined; // Optionally return undefined or handle the error as needed
    }
}

export function addDashesToUUID(uuid: string): string {
    if (uuid.length !== 32) {
        throw new Error('Invalid UUID format: must be 32 characters long without dashes');
    }
    return `${uuid.slice(0, 8)}-${uuid.slice(8, 12)}-${uuid.slice(12, 16)}-${uuid.slice(16, 20)}-${uuid.slice(20)}`;
}

export function removeDashesFromUUID(uuid: string): string {
    if (uuid.length !== 36) {
        throw new Error('Invalid UUID format: must be 36 characters long with dashes');
    }
    return uuid.replace(/-/g, '');;
}

export function timeAgo(utcString: string): string {
    const givenDate = new Date(utcString);
    const now = new Date();

    // Convert local time to UTC to match the utcString
    const nowUtc = new Date(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        now.getUTCHours(),
        now.getUTCMinutes(),
        now.getUTCSeconds()
    );

    const diffInSeconds = Math.floor((nowUtc.getTime() - givenDate.getTime()) / 1000);

    if (diffInSeconds < 60) {
        return `${diffInSeconds}s`; // seconds ago
    } else if (diffInSeconds < 3600) {
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        return `${diffInMinutes}m`; // minutes ago
    } else if (diffInSeconds < 86400) {
        const diffInHours = Math.floor(diffInSeconds / 3600);
        return `${diffInHours}h`; // hours ago
    } else {
        const diffInDays = Math.floor(diffInSeconds / 86400);
        return `${diffInDays}d`; // days ago
    }
}