import Navbar from "@/components/Navbar";
import React from "react";

const layout = ({
    children ,

}: Readonly <{
    children:React.ReactNode;
}>) => {

    return (

        <div className="flex flex-col min-h-screen">
           <Navbar />


           <div className="py-20">{children}</div>
        </div>
    );
}

export default layout;