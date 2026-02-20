'use client';
import Image from "next/image";


type HomePageItem = {
  name: string,
  image_link:string
}


export default function  HomePageItem({ name, image_link }: HomePageItem) {
  return (
    <div className="flex flex-col p-5 rounded-xl border border-[#c8adcb] border-6 items-center justify-center bg-[#c8bdfb] font-sans ">
      
      <div className="text-3xl py-2 font-bold ">{name}</div>
      <div>
        <img className="rounded-2xl m-3"
          style={{
            height: "250px",
            aspectRatio: "1",
            objectFit: "cover"
          }}
          src={image_link} alt="My Photo" 
        />

      </div>
    </div>
  );
}
