'use client';

import { useState,useEffect, useRef } from "react";
 
import Link from "next/link";

import { Button } from "@/components/ui/button";

import {Input} from "@/components/ui/input";

import { ShoppingCart, User, Menu, X , LogOut } from "lucide-react"; //icons

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import  getUserSession from "@/actions/auth/getUserSession";

import  logoutAction from "@/actions/auth/logout";

import { useRouter } from "next/navigation";

import { IUserEntity } from "oneentry/dist/users/usersInterfaces";



export default function Navbar() {

    const [user, setUser] = useState<IUserEntity | null>(null);

    const [isLoading, setIsLoading] = useState(true);

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const [searchQuery, setSearchQuery] = useState("");  //for the search input bar

    const router = useRouter();

    const mobileMenuRef = useRef<HTMLDivElement>(null);

    useEffect (() => {
        async function fetchUser() {
            try {
                setIsLoading(true);

                const userData = await getUserSession();

                if(userData) setUser(userData as IUserEntity);

                setIsLoading(false);

            } catch (err) {
                console.error({err});

                setUser(null);
                setIsLoading(false);
            }
        }

        fetchUser();
    },[]);
            
       

//close navbar when clicking outside

useEffect(() => {
    const handleClickOutside = (event: MouseEvent) =>{
        if(
            mobileMenuRef.current &&
            !mobileMenuRef.current.contains(event.target as Node)
        ) {
            setIsMobileMenuOpen(false);
        }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    };
}, []);

const handleLogout = async () => { //to logout action control
    await logoutAction();
    router.push("/");

    setUser(null);
    setIsMobileMenuOpen(false); //close mobile menu on logout
};

const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (searchQuery.length) {
        router.push(`/search?searchTerm=${searchQuery}`);

        setIsMobileMenuOpen(false) //close mobile menu on search
    }
};

const handleMenuItemClick = () =>{
    setIsMobileMenuOpen(false); //close mobile menu on item click
}



  return (
    <nav>
        <div className="max-w-3/4 mx-auto px-4 sm:px-6 lg:px-6 border-b-2 border-gray-200">
            <div className="flex items-center justify-between h-16">

                <div className="flex items-center">
                    <Link href="/" className="flex-shrink-0">
                      <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 bg-clip-text text-transparent">
                        Warna Mart
                      </span>
                    </Link>
                </div>

                <div className="hidden md:flex items-center space-x-4">
                    <div className="mr-64">
                        <form onSubmit={handleSearch}>
                           <Input
                            type="text"
                            placeholder="Search Products.."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-gray-100 border-gray-400 min-w-48"
                           />
                        </form>
                    </div>
                </div>

                <div>
                    <Link href='/cart' onClick={handleMenuItemClick}>

                        <Button
                            size='icon'
                            className="relative bg-transparent hover:bg-transparent cursor-pointer"
                            variant='ghost'
                        
                        >
                            <ShoppingCart className="h-5 w-5 text-gray-600 hover:text-purple-500" />
                        </Button>

                    </Link>
                </div>

                    {isLoading && (
                        <div className="flex items-center">
                            <Avatar className="h-8 w-8 cursor-pointer">

                                <AvatarFallback className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 text-white" >
                                    -
                                </AvatarFallback>

                            </Avatar>
                        </div>
                    )}

                    {user && (
                        <DropdownMenu>

                        <DropdownMenuTrigger asChild>
                            <Button
                                variant='ghost'
                                className="relative h-8 w-8 rounded-full"
                            >

                                <Avatar className="h-8 w-8 cursor-pointer" >
                                    <AvatarFallback className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 text-white" >

                                    {user.formData
                                        .find((f:any) => f.marker === 'name')

                                        ?.value?.charAt(0)
                                    }
                                        
                                    </AvatarFallback>              
                                
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent className="w-56" align="end" forceMount>
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-2">
                                    <p className="text-sm font-medium leading-none bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 bg-clip-text text-transparent">

                                        {
                                            user.formData.find((f:any) => f.marker === 'name')
                                            ?.value
                                        }
                                    </p>

                                    <p className="text-xs leading-none to-gray-500">
                                        {user?.identifier}
                                    </p>
                                </div>


                            </DropdownMenuLabel>

                            <DropdownMenuSeparator className="bg-purple-800" />

                                <DropdownMenuItem className="focus:text-purple-600">
                                    <Link href="/profile" className="flex w-full">
                                        <User className="h-4 w-4 mr-2" />
                                        <span>Profile</span>
                                    </Link>
                                 </DropdownMenuItem>

                                   <DropdownMenuItem className="focus:text-purple-600">
                                    <Link href="/orders" className="flex w-full">
                                        <ShoppingCart className="h-4 w-4 mr-2" />
                                        <span>Order</span>
                                    </Link>
                                 </DropdownMenuItem>

                                 
                            
                                <DropdownMenuSeparator className="bg-purple-800" />

                                <DropdownMenuItem onClick={handleLogout} className="focus:text-purple-600 cursor-pointer">
                                    <LogOut className="h-4 w-4 mr-2" />
                                    <span>Log Out</span>
                                </DropdownMenuItem>   

                         </DropdownMenuContent>

                        </DropdownMenu>
                    )}

                    {!user && isLoading === false && (
                        <div className="flex space-x-2">

                            <div>

                                <Link href='/auth?type=login'>

                                    <Button
                                        variant='outline'
                                        className="bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 bg-clip-text text-transparent border-2 border-gray-300 cursor-pointer"
                                    >
                                        Login

                                    </Button>
                                    
                                </Link>
                            </div>

                            <div>
                                
                                <Link href='/auth?type=signup'>

                                    <Button
                                        variant='outline'
                                        className="bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 bg-clip-text text-transparent border-2 border-gray-300 cursor-pointer"
                                    >
                                        Signup

                                    </Button>
                                    
                                </Link>
                            </div>

                        </div>
                    )}
                    

                    <div className="md:hidden flex text-center">
                        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                            {isMobileMenuOpen ? (
                                <X className="h-6 w-6 text-gray-600" />
                            ) : (
                                <Menu className="h-6 w-6 text-gray-600" />
                            )}
                        </button>
                    </div>
                </div>

                </div>
            

            {isMobileMenuOpen && (
                 <div ref={mobileMenuRef} className="md:hidden bg-gray-100">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">

                    <form onSubmit={handleSearch} className="mb-4">
                        <Input
                            type="text"
                            placeholder="Search Products.."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-white"
                        />
                    </form>

                    <Link href="/cart" onClick={handleMenuItemClick} className="block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-white hover:bg-purple-500">
                        Cart
                    </Link>
                    
                    </div>

                <div className="border-t border-gray-700 pt-4 pb-3">
                    {user && (
                        <div className="flex items-center px-5 mb-3">
                            <div className="flex-shrink-0">
                                <Avatar className="h-8 w-8 border-2 border-gray-700">
                                    <AvatarFallback >
                                        {user.formData.find((f:any) => f.marker === 'name')
                                        ?.value?.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                            </div>

                            <div className="ml-3">
                                <div className="text-base font-medium bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 bg-clip-text text-transparent">

                                    {user.formData.find((f:any) => f.marker === 'name')
                                        ?.value}
                                </div>

                                <div className="text-sm font-medium text-gray-500">
                                    {user?.identifier}
                                </div>
                            </div>
                        </div>
                    )}
                    

                    {user ? (
                        <div className="mt-3 px-2 space-y-1">
                            <Link href="/profile" onClick={handleMenuItemClick} className="block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-white hover:bg-purple-500">
                               Your Profile
                            </Link>

                            <Link href="/orders" onClick={handleMenuItemClick} className="block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-white hover:bg-purple-500">
                                Orders
                            </Link>
                        </div>

                    ) : (  
                        <div className="mt-3 px-2 space-y-1">
                            <Link href="/auth?type=login" onClick={handleMenuItemClick} className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-purple-500">
                                Login
                            </Link>

                            <Link href="/auth?type=signup" onClick={handleMenuItemClick} className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-purple-500">
                                Signup
                            </Link>
                        </div>
                    )}
                </div>
            </div>

                )}
    </nav>
  );
}
