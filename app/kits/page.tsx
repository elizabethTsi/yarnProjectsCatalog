'use client'
import Image from "next/image";
import { useState, useEffect } from "react";
import { supabase } from "../createClient";
import KitItem from "../components/KitItem";
import Modal from "../components/Modal";
import {  Plus, Search} from "lucide-react";
import Link from "next/link";


type Kit = {
  id: number,
  name: string,
  yarn_type: string,
  hook_size: number,
  start_time: Date | null,
  end_time: Date | null,
  got_from: string, 
  brand: string,
  date_received: Date,
  image_link: string,
  duration?: number
}

enum SortCondition {
    Alphabetical =  "name",
    HookSize = "hook_size",
    Duration = "duration",
    Brand = "brand",
    Received = "date_received"
    
}

export default function Home() {
    const [kits, setKits] = useState<Kit[]>([]);
    const [sortCondition, setSortCondition] = useState<SortCondition>(SortCondition.Alphabetical);
    const [searchInput, setSearchInput] = useState<string>("");
    const [showModal, setShowModal] = useState<boolean>(false); 

    useEffect(() => {
        fetchData();
    }, [searchInput, sortCondition]);

    const handleSortChange = (selectedSort: SortCondition) => {
        setSortCondition(selectedSort);
    };
    async function fetchData() {
        const newSearchInput = "%" + searchInput + "%";

        const  {data, error} = await supabase
            .from('kits')
            .select('*')
            .ilike("name", newSearchInput)
            .order(sortCondition, {ascending: true})
        if (error)  {
            setKits([]);
        } else {
            setKits(data);
        }
    }

    const createKit = async (newKit: Omit<Kit, "id">) => 
    {
        const { data, error } = await supabase
            .from("kits")
            .insert([newKit])
            .select();

        if (error) {
            console.error("Insert error:", error);
        } else {
            console.log("Inserted:", data);
        }
    }

    
    return (
        <div className="bg-[#FFf0f0] flex flex-col min-h-screen px-5 items-center justify-start font-sans">
            <div className="text-3xl mt-10 py-5 font-bold">Kit List</div>
            <div className="px-10 w-full flex flex-row justify-start align-center">
                <div className="w-4/5 items-center flex  rounded-lg border-3 border- my-3 ">
                    <Search className="w-4 h-4 ml-1 md:w-8 md:h-8 lg:w-12 lg:h-12" />
                    <input className=" w-full focus:outline-none" onChange= {(e) => setSearchInput(e.target.value)}>
                    </input>
                </div>
                <div className="flex justify-center align-center p-2 pl-10 my-auto">
                    <button className="hover:cursor-pointer" onClick={(e) => 
                    {
                        setShowModal(true);
                    }}>
                        <Plus className="text-purple-500 font-bold mb-1 w-2 h-2 ml-1 md:w-6 md:h-6 lg:w-9 lg:h-9" /> 
                    </button>
                </div>
            </div>
            <div className="flex flex-row w-full h-full">
                <div className="flex flex-col w-1/5  gap-4"> 
                    <div className="border rounded-3xl p-4 justify-center text-4xl flex flex-col">
                        Sort by
                        <form className="space-y-0">
                            <div className="p-0 m-0"><label className="text-sm"><input className = "p-0" type = "radio" name="sortCondition" value="Alphabetical" onChange = {(event) => handleSortChange(SortCondition.Alphabetical)} checked = {sortCondition === SortCondition.Alphabetical} /> Alphabetical</label> </div>
                            <div><label className="text-sm"><input type = "radio" name="sortCondition" value="Hook Size" onChange = {(event) => handleSortChange(SortCondition.HookSize)} checked = {sortCondition === SortCondition.HookSize} /> Hook Size </label> </div>
                            <div><label className="text-sm"><input type = "radio" name="sortCondition" value="Duration" onChange = {(event) => handleSortChange(SortCondition.Duration)} checked = {sortCondition === SortCondition.Duration} /> Project Duration </label> </div>
                        </form>
                    </div>
                    <div className="border rounded-3xl p-10 justify-center h-full text-5xl flex">
                        </div>
                </div>
                <div className="w-full ml-5 gap-5 grid grid-cols-2 md:grid-cols-3  xl:grid-cols-4">
                {kits.map((kit) => 
                    <Link href={`/kits/${kit.id}`}>
                        <KitItem key={kit.id} {...kit} />
                    </Link>
                )}
                </div>
            </div>
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
            <h2 className="text-xl font-semibold mb-2">Create New Kit</h2>

           <form
            className="flex flex-col gap-1 flex-evenly  w-full max-w-md"
            onSubmit={async (e) => {
                e.preventDefault();

                const form = e.currentTarget;   // ✅ save reference
                const formData = new FormData(form);

                // 1️⃣ Build complete Kit object with defaults
                const kitData: Omit<Kit, "id"> = {
                name: (formData.get("name") as string) ?? "",
                yarn_type: (formData.get("yarn_type") as string) ?? "",
                hook_size: Number(formData.get("hook_size")) || 0,
                start_time: formData.get("start_time")
                    ? new Date(formData.get("start_time") as string)
                    : null,
                end_time: formData.get("end_time")
                    ? new Date(formData.get("end_time") as string)
                    : null,
                date_received: formData.get("date_received")
                    ? new Date(formData.get("date_received") as string)
                    : new Date(2000, 0, 1),
                got_from: (formData.get("got_from") as string) ?? "",
                brand: (formData.get("brand") as string) ?? "",
                image_link: (formData.get("image_link") as string) ?? "",
                };

                // 2️⃣ Insert into Supabase
                await createKit(kitData);

                // 3️⃣ Clear the form
                form.reset();
                setShowModal(false);
            }}
        >

        <div className="w-full flex flex-col mb-2">
            <label className="font-bold">Image Link</label>
            <input className="border w-[95%] rounded input" type="url" name="image_link" placeholder="https://" />
        </div>

            <div className="grid grid-cols-2  gap-4 items-evenly justify-center">

               
                <div className="w-full flex flex-col">
                    <label className="font-bold">Name</label>
                    <input className="px-1 border w-[90%] rounded input" type="text" name="name" placeholder="Name" />
                </div>

                <div className="w-full flex flex-col">
                    <label className="font-bold">Brand</label>
                    <input className="px-1 border w-[90%] rounded input" type="text" name="brand" placeholder="Brand" />
                </div>
                
                <div className="w-full flex flex-col">
                    <label className="font-bold">Yarn Type</label>
                    <input className="px-1 border w-[90%] rounded input" type="text" name="yarn_type" placeholder="Yarn Type" />
                </div>

                <div className="w-full flex flex-col">
                    <label className="font-bold">Hook Size</label>
                    <input className="px-1 border w-[90%] rounded input" type="number" step="0.25" name="hook_size" placeholder="#" />
                </div>
                
                <div className="w-full flex flex-col">
                    <label className="font-bold">Source</label>
                    <input className="border w-[90%] rounded input" type="text" name="got_from" placeholder="Store" />
                </div>
                            
                <div className="w-full flex flex-col">
                    <label className="font-bold">Date Received</label>
                    <input className="border w-[90%] rounded input" type="date" name="date_received" />
                </div>

                <div className="w-full flex flex-col">
                    <label className="font-bold">Start Time</label>
                    <input className="border w-[90%] rounded input" type="date" name="start_time" />
                </div>

                <div className="w-full flex flex-col">
                    <label className="font-bold">End Time</label>
                    <input className="border w-[90%] rounded input" type="date" name="end_time" />
                </div>
                </div>

                
            <button
                type="submit"
                className="self-center bg-purple-300 text-white py-2 mt-3 w-3/5 rounded-md text-sm font-semibold hover:bg-purple-400 active:scale-95 transition"
            >
                Create Kit
            </button>
            </form>
            <button
                onClick={() => setShowModal(false)}
                className="mt-4 px-3 py-1 bg-red-500 text-white rounded"
            >
                Close
            </button>
            
        </Modal>
        </div>
    );
}
