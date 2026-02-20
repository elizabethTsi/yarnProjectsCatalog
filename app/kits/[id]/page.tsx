'use client'
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { supabase } from "../../createClient";
import {Search} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";


type Kit = {
  id: number,
  name: string,
  yarn_type: string,
  hook_size: number,
  start_time: Date,
  end_time: Date,
  got_from: string, 
  brand: string,
  date_received: Date,
  yarns: number[]
  image_link: string,
  duration: number
}

export default function KitDetailsPage() {
    const [kitDetails, setKitDetails] = useState<Kit>();
    const [editMode, setEditMode] = useState<boolean>(false);
    const params = useParams();
    const kitId = params.id as string;

    
    async function fetchData() {
        const  {data, error} = await supabase
            .from('kits')
            .select('*')
            .eq("id",kitId)
        if (!error)  {
            setKitDetails(data[0]);
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    function updateField <K extends keyof Kit>(columnName: K, dataToReplace: Kit[K]) 
    {
        console.log("work's");
    }

    
    return (
        <div className="bg-[#FFf0f0] flex flex-col min-h-screen gap-2 px-5 items-center justify-start font-sans">
            <div className="mt-10 text-5xl py-5 font-bold">{kitDetails?.name}</div>
            <div className=" flex mt-3 flex-row items-start justify-center ">
               
                <div className="items-center flex flex-col">
                    <img   
                        className="rounded-xl h-[400px] md:h-[450px] lg:h-[500px] aspect-square object-cover"
                        src={kitDetails?.image_link} 
                        alt= {`${kitDetails?.name}` }
                    />
                    <div className="mt-1 text-lg py-5 font-bold">{kitDetails?.brand}</div>
                </div>
                <div className="flex flex-col justify-center items-center">
                    {!editMode && <div className="mt-30 w-[500px] ml-10 bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                        <div className="grid grid-cols-2 gap-x-10 gap-y-6">
                            <div>
                                <div className="text-sm text-gray-500 tracking-wide">Hook Size</div>
                                <div className="text-lg font-semibold text-gray-900">
                                    {kitDetails?.hook_size ?? "—"}
                                </div>
                            </div>

                            <div>
                                <div className="text-sm text-gray-500 tracking-wide">Yarn Type</div>
                                <div className="text-lg font-semibold text-gray-900">
                                    {kitDetails?.yarn_type ?? "—"}
                                </div>
                            </div>

                            <div>
                                <div className="text-sm text-gray-500 tracking-wide">Brand</div>
                                <div className="text-lg font-semibold text-gray-900">
                                    {kitDetails?.brand ?? "—"}
                                </div>
                            </div>

                            <div>
                                <div className="text-sm text-gray-500 tracking-wide">Source</div>
                                <div className="text-lg font-semibold text-gray-900">
                                    {kitDetails?.got_from ?? "—"}
                                </div>
                            </div>

                            <div>
                                <div className="text-sm text-gray-500 tracking-wide">Date Started</div>
                                <div className="text-lg font-semibold text-gray-900">
                                    {kitDetails?.start_time
                                    ? new Date(kitDetails.start_time).toLocaleDateString()
                                    : "—"}
                                </div>
                            </div>

                            <div>
                                <div className="text-sm text-gray-500 tracking-wide">Date Ended</div>
                                <div className="text-lg font-semibold text-gray-900">
                                    {kitDetails?.end_time
                                    ? new Date(kitDetails.end_time).toLocaleDateString()
                                    : "—"}
                                </div>
                            </div>

                        </div>
                        </div>}
                    {editMode &&
                    <div className="mt-16 w-[500px] ml-10 bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                        <div className="grid grid-cols-2 gap-x-10 gap-y-6">

                            <div className="flex flex-col">
                                <label className="font-bold text-lg text-black tracking-wide mb-1">Hook Size</label>
                                <div className="px-3 py-2 border rounded-md bg-gray-50 hover:bg-gray-100 cursor-pointer">
                                    {kitDetails?.hook_size ?? "—"}
                                </div>
                            </div>

                            <div className="flex flex-col">
                                <label className="font-bold text-lg text-black tracking-wide mb-1">Yarn Type</label>
                                <div className="px-3 py-2 border rounded-md bg-gray-50 hover:bg-gray-100 cursor-pointer">
                                    {kitDetails?.yarn_type ?? "—"}
                                </div>
                            </div>

                            <div className="flex flex-col">
                                <label className="font-bold text-lg text-black tracking-wide mb-1">Brand</label>
                                <div className="px-3 py-2 border rounded-md bg-gray-50 hover:bg-gray-100 cursor-pointer">
                                    {kitDetails?.brand ?? "—"}
                                </div>
                            </div>

                            <div className="flex flex-col">
                                <label className="font-bold text-lg text-black tracking-wide mb-1">Source</label>
                                <div className="px-3 py-2 border rounded-md bg-gray-50 hover:bg-gray-100 cursor-pointer">
                                    {kitDetails?.got_from ?? "—"}
                                </div>
                            </div>

                            <div className="flex flex-col">
                                <label className="font-bold text-lg text-black tracking-wide mb-1">Date Started</label>
                                <div className="px-3 py-2 border rounded-md bg-gray-50 hover:bg-gray-100 cursor-pointer">
                                    {kitDetails?.start_time
                                    ? new Date(kitDetails.start_time).toLocaleDateString()
                                    : "—"}
                                </div>
                            </div>

                            <div className="flex flex-col">
                                <label className="font-bold text-lg text-black tracking-wide mb-1">Date Ended</label>
                                <div className="px-3 py-2 border rounded-md bg-gray-50 hover:bg-gray-100 cursor-pointer">
                                    {kitDetails?.end_time
                                    ? new Date(kitDetails.end_time).toLocaleDateString()
                                    : "In Progress"}
                                </div>
                            </div>
                        </div>
                    </div>
                    }
                 <button 
                 className={
                    !editMode
                    ? "bg-[#f4e8fe] hover:bg-[#c89bed] border shadow-lg m-3 rounded-full py-2 px-7 transition-colors duration-200"
                    : "bg-[#c89bed] hover:bg-[#f4e8fe] border shadow-lg m-3 rounded-full py-2 px-7 transition-colors duration-200"
                }
                 onClick={(e) => setEditMode(!editMode)}>
                    {editMode ? "Close Edit Mode" : "Open Edit Mode"}
                </button>  
            </div>
               
            </div>

        </div>
    );
}
