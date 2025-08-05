'use server';

import { fetchApiClient } from "@/lib/oneentry";

import { cookies } from "next/headers";

interface IErrorResponse {

    statusCode: number;
    message: string;
    timeStamp: string;
    pageData: null;

}


export default async function logoutAction() {

    const cookieStore = cookies();
    const refreshTokenCookie = (await cookieStore).get('refresh_token')?.value;
    const accessTokenCookie = (await cookieStore).get('access_token')?.value;

    const apiClient = await fetchApiClient();

    //if token are missing , return early

    if(!refreshTokenCookie || !accessTokenCookie) {
        return {
            message: 'You are not Currently logged in',
        };
    }

    try{
        //perform the logout request using access and refresh tokens

        const logoutResponse = await apiClient?.AuthProvider.setAccessToken(
            accessTokenCookie
        ).logout('email', refreshTokenCookie);

        //check if the response is not a booleann, indicate an error
    }
}