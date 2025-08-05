import { defineOneEntry } from "oneentry";
import retrieveRefreshToken from "@/actions/auth/retreveRefreshToken";
import storeRefreshToken from "@/actions/auth/storeRefreshToken";



export type ApiClientType = ReturnType<typeof defineOneEntry> | null;

let apiClient: ApiClientType = null;


async function setupApiClient() : Promise<ReturnType<typeof defineOneEntry>> {
  const apiUrl = process.env.ONEENTRY_PROJECT_URL;

  if(!apiUrl) {
    throw new Error("ONEENTRY_PROJECT_URL is Missing");
  }

  if(!apiClient) {
    try{
        const refreshToken = await retrieveRefreshToken();
        
        apiClient = defineOneEntry(apiUrl,{
            token: process.env.ONEENTRY_TOKEN, // token for authentication

            langCode: 'en_US', 

            auth: {
                refreshToken: refreshToken || undefined, // refresh token for authentication
                customAuth: false, //disable cutome auth

                saveFunction: async (newToken: string) => {
                    await storeRefreshToken(newToken);
                },
            },

        });

          
    }catch (error) { 
        console.error("Error fetching refresh token", error);
    ;
       }

}

if(!apiClient){
    throw new Error("Api Client is not initialized");
}

return apiClient;

}

export async function fetchApiClient() : Promise<ReturnType<typeof defineOneEntry>> {
    if(!apiClient) {
       await setupApiClient();
    }

   if(!apiClient){
    throw new Error("Api Client is stii null");
}

    return apiClient;
}