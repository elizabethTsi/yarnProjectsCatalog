'use client'
import { useState, useEffect } from "react";
import { supabase } from "../createClient";
import YarnItem from "../components/YarnItem";
import AddYarn from "../components/AddYarn";
import Modal from "../components/Modal";
import {  Plus, Search} from "lucide-react";
import Link from "next/link";


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

enum SortCondition {
    Alphabetical =  "name",
    HookSize = "hook_size",
    Duration = "duration",
    Brand = "brand",
    Received = "date_received"
    
}


export default function Home() {
    const [yarns, setYarns] = useState<Yarn[]>([]);
    const [showModal, setShowModal] = useState<boolean>(false); 
    const [searchInput, setSearchInput] = useState<string>("");
    const [sortCondition, setSortCondition] = useState<SortCondition>(SortCondition.Alphabetical);
    

    console.log(yarns);

    useEffect(() => {
        fetchUsers()
    }, [searchInput, sortCondition])

    const handleSortChange = (selectedSort: SortCondition) => {
        setSortCondition(selectedSort);
    };
    async function fetchUsers() {
        const newSearchInput = "%" + searchInput + "%";
        const  {data, error} = await supabase
            .from('yarns')
            .select('*')
            .ilike("name", newSearchInput)            
            .order(sortCondition, {ascending: true})
        if (error) {
            setYarns([]);
            console.error('❌ Supabase error:', error.message);
        } else {
            console.log('✅ Supabase data:', data);
            setYarns(data); // Only run if data is not null
        }
    }
    return (
        <div className="flex flex-col min-h-screen items-center justify-start font-sans">
            <div className="text-3xl mt-10 p-5 font-bold">Yarn List</div>

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
                <div className="flex flex-col w-1/5 mx-5  gap-4"> 
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
                {yarns.map((yarn) => 
                    <Link href={`/yarns/${yarn.id}`}>
                        <YarnItem key={yarn.id} {...yarn} />
                    </Link>
                )}
                </div>
            </div>

            
            <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                <h2 className="text-xl font-semibold mb-2">Add New Yarn</h2>
                <AddYarn />
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
