'use server';

import { fetchApiClient } from "@/lib/oneentry";
import { access } from "fs";

import { cookies } from "next/headers";

interface IError {

    statusCode: number;

    message: string;

}

export default async function getUserSession() {

    const apiClient = await fetchApiClient();

    const accessToken = (await cookies()).get('access_token')?.value;

    if(!accessToken) {

        return null;

    }

    try {
        const currentUser = await apiClient?.Users.setAccessToken(
            accessToken
        ).getUser();

        if(!currentUser || !currentUser.id) {
            throw new Error('Invalid user data or missing user ID ');
        }

        return currentUser;

    }catch (err: unknown) { //change error type to unknown

        if(err instanceof Error && (err as unknown as IError).statusCode === 401) {
            return undefined; // User is not authenticated
        }

        console.error('Error fetching user session:', err);
    }

    
}

