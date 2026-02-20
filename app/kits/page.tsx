'use client'
import Image from "next/image";
import { useState, useEffect } from "react";
import { supabase } from "../createClient";
import KitItem from "../components/KitItem";
import {  House, Search} from "lucide-react";
import Link from "next/link";


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

    useEffect(() => {
        fetchData();
    }, [searchInput, sortCondition]);

    const handleSortChange = (selectedSort: SortCondition) => {
        setSortCondition(selectedSort);
    };
    async function fetchData() {
        const newSearchInput = "%" + searchInput + "%";
        console.log("searchInput:", searchInput, "newSearchInput:", `%${searchInput}%`);

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

    
    return (
        <div className="bg-[#FFf0f0] flex flex-col min-h-screen px-5 items-center justify-start font-sans">
            <div className="text-3xl mt-10 py-5 font-bold">Kit List</div>


            <div className="w-4/5 items-center flex border rounded-lg border-3 border- my-3 ">
                <Search className="w-4 h-4 ml-1 md:w-8 md:h-8 lg:w-12 lg:h-12" />
                <input className=" w-full focus:outline-none" onChange= {(e) => setSearchInput(e.target.value)}>
                </input>
            </div>
            <div className="flex flex-row w-full h-full">
                <div className="flex flex-col w-1/5  gap-3"> 
                    <div className="border rounded-3xl p-2 gap-2 justify-center text-5xl flex">
                        <form>
                            <label className="text-sm"><input type = "radio" name="sortCondition" value="Alphabetical" onChange = {(event) => handleSortChange(SortCondition.Alphabetical)} checked = {sortCondition === SortCondition.Alphabetical} /> Alphabetical</label> <br />
                            <label className="text-sm"><input type = "radio" name="sortCondition" value="Hook Size" onChange = {(event) => handleSortChange(SortCondition.HookSize)} checked = {sortCondition === SortCondition.HookSize} /> Hook Size </label> <br />
                            <label className="text-sm"><input type = "radio" name="sortCondition" value="Duration" onChange = {(event) => handleSortChange(SortCondition.Duration)} checked = {sortCondition === SortCondition.Duration} /> Project Duration </label> <br />
                        </form>
                    </div>
                    <div className="border rounded-3xl p-10 justify-center h-full text-5xl flex">FILTER BOX</div>
                </div>
            <div className="w-full ml-5 gap-5 grid grid-cols-2 md:grid-cols-3  xl:grid-cols-4">
            {kits.map((kit) => 
                <Link href={`/kits/${kit.id}`}>
                    <KitItem key={kit.id} {...kit} />
                </Link>
            )}
            </div>
            </div>
        </div>
    );
}
