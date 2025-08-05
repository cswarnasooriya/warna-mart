"use client";
import { useState ,useEffect ,FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Loader2 } from 'lucide-react';

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import { getLoginFormData, handleLoginSubmit } from '@/actions/auth/login';
import { getSignUpFormData, handleSignUpSubmit } from '@/actions/auth/signup';

import {toast} from 'sonner';

import { IAttributes } from 'oneentry/dist/base/utils'; // Importing types for attributes

import { useRouter, useSearchParams } from 'next/navigation'; // to navigate pages

import React from 'react'


interface SignUpFormData {
    email: string;
    password: string;
    name: string;
}


interface LoginFormData {
    email: string;
    password: string;

}



const page = () => {
    const [isSignUp, setIsSignUp] = useState(true);
    const router = useRouter();
    const searchParams = useSearchParams(); 

    const [formData, setFormData] = useState<IAttributes[]>([]);

    const [inputValues, setInputValues] = useState<Partial<SignUpFormData & LoginFormData>>({});

    const [isLoading, setIsLoading] = useState(true);

    const [isSubmitting, setIsSubmitting] = useState(false);    

    const [error, setError] = useState<string | null>('Not Valid');

    useEffect(() => {
        const type = searchParams.get('type');

        setIsSignUp(type !== 'login');
    }, [searchParams]);

    useEffect(() => {
        setIsLoading(true);
        setError(null); 

        const fetchData = isSignUp ? getSignUpFormData : getLoginFormData;

        fetchData()
            .then((data) => {
                setFormData(data);
                
            })
            .catch((err) => {
                console.error(err);
                setError('Failed to fetch form data');
              
            }).finally(() => {
                setIsLoading(false);
     } )

    }, [isSignUp]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setInputValues((prev) => ({
            ...prev,
            [name]: value,
    }))}; //handle changes in the form --usefull that


        const handleSubmit = async (e: FormEvent) => {
            e.preventDefault(); //not refershing

            setIsSubmitting(true);

            setError(null);

            try{
                if(isSignUp){

                    if(inputValues.email && inputValues.password && inputValues.name) {
                        const response = await handleSignUpSubmit(
                            inputValues as SignUpFormData

                        );

                        if('identifier' in response) {

                            setInputValues({});

                            setIsSignUp(false);

                            toast('User has been Creted!', {
                                description:'Please enter your credentials to Log in',

                                duration: 5000,
                            });
                        } else{
                            setError(response.message );
                        }
                    }else{
                        setError('Please fill all required fields');
                    }
                } else{
                    if(inputValues.email && inputValues.password) {
                        const response = await handleLoginSubmit(
                            inputValues as LoginFormData
                        );

                        if(response.message) {
                            setError(response.message);
                        }
                    } else {
                        setError('Please fill all required fields');
                    }
                }
            
            } catch (err){
                setError(
                     err instanceof Error ? err.message : 'An unexpected error occurred'
                );
             } finally {
                setIsSubmitting(false);
            }
        };



    const toggleForm =() =>{
        setIsSignUp(!isSignUp);
        setInputValues({}); // Reset input values when toggling forms
        setError(null); // Reset error message when toggling forms
    };



  return (
    <div className='flex min-h-screen mt-7'>
        <div className="w-full max-w-3xl mx-auto flex flex-col lg:flex-row p-3">

            <div>

                <div className="mb-8 lg:mb-12 cursor-pointer" onClick={() => router.push('/')}>

                    <ChevronLeft className="text-gray-500 h-6 w-6 sm:h-8 sm:w-8 border-2 rounded-full p-1" /> 

                </div>

                {/* form header */}

                <div>

                    <h2 className="text-3xl sm:text-4xl font-bold mb-4 lg:text-5xl sm:mb-6 bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 bg-clip-text text-transparent pb-3">
                        {isSignUp ? "Sign Up" : "Sign In" }
                    </h2>

                    <p className="text-base sm:text-lg lg:text-xl text-gray-400 mb-6 sm:mb-8">

                        {isSignUp 
                        ? "Join Warna Mart 2025 Now to enjoy exclusive benefits and offers today..!"
                    : "Welcome back to Warna Mart 2025..! Sign in to continue your shopping experience Now."}

                    </p>

                </div>

                {/* Form and Loading */}

                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="animate-spin h-8 w-8 text-purple-500" />
                    </div>
                    ) : (
                    <form onSubmit={handleSubmit} className="sm:space-y-6 space-y-4">

                        {formData.map((field: any) => (
                            <div key={field.marker} >

                                <Label htmlFor={field.marker} className="text-base sm:text-lg text-gray-400 mb-1 sm:mb-2 block">

                                    {field.localizeInfos.title}

                                </Label>


                                <Input
                                   id = {field.marker}
                                   type={field.marker === 'password' ? 'password' : 'text'}
                                   name={field.marker}
                                   value={inputValues[field.marker as keyof typeof inputValues] || ''}
                                   onChange={handleInputChange}
                                   disabled={isSubmitting}
                                   placeholder={field.localizeInfos.title}
                                />

                            </div>
                        ))}

                        {error && (
                            <p className="text-red-500 text-sm">{error}</p>
                        )}

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full text-white text-lg bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:from-purple-700 hover:via-pink-600 hover:to-red-600 transition duration-300 hover:cursor-pointer"
                        >
                            {isSubmitting ? "Submitting..." : isSignUp ? "Sign Up" : "Sign In"}
                        </Button>

                    
                    </form>



                )}
                {/* end of form and loading */}

                {/* toggle form */}

                <div className="mt-4 sm:mt-5 flex justify-center items-center">

                    <p className="text-base sm:text-lg lg:text-xl text-gray-600">
                        {isSignUp ? "Already a member?" : "Don't have an account?"}
                    </p>

                    <Button
                        variant="link"
                        className="text-lg sm:text-xl lg:text-2xl text-gray-500 cursor-pointer"
                        onClick={toggleForm}
                    >
                        {isSignUp ? "Sign In" : "Sign Up"}

                    </Button>



                </div>

            </div>
            
        </div>
      
    </div>
  )
}

export default page

