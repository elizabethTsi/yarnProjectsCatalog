'use client'
import Image from "next/image";
import { useState, useEffect } from "react";
import { supabase } from "../createClient";
import YarnItem from "../components/YarnItem";


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
  location: string,
  hook_size: number,
  pattern_ids: number[],
}


export default function Home() {
    const [yarns, setYarns] = useState<Yarn[]>([]);

    console.log(yarns);

    useEffect(() => {
        fetchUsers()
    }, [])

    async function fetchUsers() {
        const  {data, error} = await supabase
            .from('yarns')
            .select('*')
        if (error) {
            console.error('❌ Supabase error:', error.message);
        } else {
            console.log('✅ Supabase data:', data);
            setYarns(data); // Only run if data is not null
        }
    }
    return (
        <div className="flex flex-col min-h-screen items-center justify-start font-sans">
            <div className="text-3xl mt-10 p-5 font-bold">Yarn List</div>

            <div className="flex flex-row w-full h-full">
                <div className="flex flex-col w-1/5 mx-5 gap-3"> 
                    <div className="border rounded-3xl p-2 justify-center text-5xl  flex">
                        SORT BY
                    </div>
                    <div className="border rounded-3xl p-10 justify-center h-full text-5xl flex">FILTER BOX</div>
                </div>
            <div className="gap-5 grid grid-cols-2 md:grid-cols-3  xl:grid-cols-4">
            {yarns.map((yarn) => 
                <YarnItem key={yarn.id} {...yarn} />
            )}
            </div>
            </div>
        </div>
    );
}
