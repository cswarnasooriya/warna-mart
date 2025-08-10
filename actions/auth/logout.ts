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

        if (typeof logoutResponse !== 'boolean') {
            const errorResponse = logoutResponse as unknown as IErrorResponse;

            return {
                message: errorResponse.message,
               
            };


        }

        //if logout is successful, clear the cookies

       (await cookieStore).delete("refresh_token");
       (await cookieStore).delete("access_token");
       (await cookieStore).delete("user_identifier");

       //set the cookies to expire immediately

       (await cookieStore).set("refresh_token", "", {maxAge: 0});
       (await cookieStore).set("access_token", "", {maxAge: 0});  
       (await cookieStore).set("user_identifier", "", {maxAge: 0});   

       return {
           message: 'Logout successful' };


    }catch (error) {
        console.error('Logout error:', error);

        throw new Error('Logout failed while logging out. Please try again later.');
    }
}