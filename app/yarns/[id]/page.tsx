'use client'
import React, { useEffect, useState } from "react";
import { supabase } from "../../createClient";
import { useParams } from "next/navigation";


type Yarn = {
  id: number,
  name: string,
  brand: string,
  weight: number,
  color: string,
  material: string,
  color_style: string,
  part_of_kit: boolean,
  image_link: string,
  kit_ids: number[],
  gram_weight: number,
  hook_size: number,
  pattern_ids: number[],
}
export default function YarnDetailsPage() {
    const [yarnDetails, setyarnDetails] = useState<Yarn>();
    const [editMode, setEditMode] = useState<boolean>(false);
    const params = useParams();
    const yarnId = params.id as string;

    
    async function fetchData() {
        const  {data, error} = await supabase
            .from('yarns')
            .select('*')
            .eq("id",yarnId)
        if (!error)  {
            setyarnDetails(data[0]);
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    async function updateField <K extends keyof Yarn>(columnName: K, dataToInsert: Yarn[K]) 
    {
        const {data, error} = await supabase
            .from("yarns")
            .update({[columnName]: dataToInsert})
            .eq("id", yarnDetails?.id)
        fetchData();
    }

    
    return (
        <div className="bg-[#FFf0f0] flex flex-col min-h-screen gap-2 px-5 items-center justify-start font-sans">
            <div className="mt-10 text-5xl py-5 font-bold">{yarnDetails?.name}</div>
            <div className=" flex mt-3 flex-row items-start justify-center ">
               
                <div className="items-center flex flex-col">
                    <img   
                        className="rounded-xl h-[400px] md:h-[450px] lg:h-[500px] aspect-square object-cover"
                        src={yarnDetails?.image_link} 
                        alt= {`${yarnDetails?.name}` }
                    />
                    <div className="mt-1 text-lg py-5 font-bold">{yarnDetails?.brand}</div>
                </div>
                <div className="flex flex-col justify-center items-center">
                    {!editMode && <div className="mt-30 w-[500px] ml-10 bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                        <div className="grid grid-cols-2 gap-x-10 gap-y-6">
                            <div>
                                <div className="text-sm text-gray-500 tracking-wide">Hook Size</div>
                                <div className="text-lg font-semibold text-gray-900">
                                    {yarnDetails?.hook_size ?? "—"}
                                </div>
                            </div>

                            <div>
                                <div className="text-sm text-gray-500 tracking-wide">Yarn Type</div>
                                <div className="text-lg font-semibold text-gray-900">
                                    {yarnDetails?.material ?? "—"}
                                </div>
                            </div>

                            <div>
                                <div className="text-sm text-gray-500 tracking-wide">Brand</div>
                                <div className="text-lg font-semibold text-gray-900">
                                    {yarnDetails?.brand ?? "—"}
                                </div>
                            </div>
                        </div>
                    </div>}
                    {editMode &&
                    <div className="mt-16 w-[500px] ml-10 bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                        <div className="grid grid-cols-2 gap-x-10 gap-y-6">
     
                            <form className="flex flex-col"
                                onSubmit={async (e) => {
                                    e.preventDefault();

                                    const formData = new FormData(e.currentTarget);
                                    const rawValue = formData.get("hook_size");
                                    if (rawValue === null) return;

                                    const value = Number(rawValue);

                                    updateField("hook_size", value);
                                }}
                            >
                                <label className="font-bold text-lg text-black tracking-wide mb-1">Hook Size</label>
                                <input 
                                    className="px-3 py-2 border rounded-md bg-gray-50 hover:bg-gray-100 cursor-pointer"
                                    type="text"
                                    placeholder = {`${yarnDetails?.hook_size ?? "—"}`}
                                    name="hook_size"
                                    
                                />
                                <button
                                    type="submit"
                                    className="self-center bg-purple-300 text-white py-1 mt-2 w-3/5 rounded-md text-sm font-semibold hover:bg-purple-400 active:scale-95 transition"
                                >
                                    Save Changes
                                </button>
                            </form>

                            <form className="flex flex-col"
                                onSubmit={async (e) => {
                                    e.preventDefault();

                                    const formData = new FormData(e.currentTarget);
                                    const rawValue = formData.get("yarn_type");
                                    if (rawValue === null) return;

                                    const value = String(rawValue);

                                    updateField("material", value);
                                }}
                            >
                                <label className="font-bold text-lg text-black tracking-wide mb-1">Yarn Type</label>
                                <input 
                                    className="px-3 py-2 border rounded-md bg-gray-50 hover:bg-gray-100 cursor-pointer"
                                    type="text"
                                    placeholder = {`${yarnDetails?.material ?? "—"}`}
                                    name="yarn_type"
                                />
                                <button
                                    type="submit"
                                    className="self-center bg-purple-300 text-white py-1 mt-2 w-3/5 rounded-md text-sm font-semibold hover:bg-purple-400 active:scale-95 transition"
                                >
                                    Save Changes
                                </button>
                            </form>

                            <form className="flex flex-col"
                                onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
                                    e.preventDefault();

                                    // Tell TS this is an HTMLFormElement
                                    const form = e.currentTarget as HTMLFormElement;

                                    // Pull all values
                                    const formData = new FormData(form);
                                    const rawValue = formData.get("brand");

                                    if (rawValue === null) return; // nothing entered

                                    const value = String(rawValue);

                                    // Call your generic Supabase update function
                                    await updateField("brand", value);
                                }}
                            >
                                <label className="font-bold text-lg text-black tracking-wide mb-1">Brand</label>
                                <input 
                                    className="px-3 py-2 border rounded-md bg-gray-50 hover:bg-gray-100 cursor-pointer"
                                    type="text"
                                    placeholder = {`${yarnDetails?.brand ?? "—"}`}
                                    name="brand"
                                />
                                <button
                                    type="submit"
                                    className="self-center bg-purple-300 text-white py-1 mt-2 w-3/5 rounded-md text-sm font-semibold hover:bg-purple-400 active:scale-95 transition"
                                >
                                    Save Changes
                                </button>
                            </form>

                            
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
