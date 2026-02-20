import Image from "next/image";


type Kit = {
  id: number,
  name: string,
  yarn_type: string,
  hook_size: number,
  start_time: Date,
  end_time: Date,
  got_from: string, 
  brand: string,
  date_received: Date;
  yarns: number[]
  image_link: string
}


export default function KitItem(props: Kit) {
  return (
    <div className="w-[230px] sm:w-[185px] md:w-[230px] lg:w-[250px] xl:max-w-[300px] flex flex-col p-5 pb-3 rounded-xl border border-[#c8adcb] border-6 items-center justify-center bg-[#d8bdfb] font-sans ">
      <div>
      <img   className="rounded-xl h-[100px] md:h-[150px] lg:h-[200px] aspect-square object-cover"

          src={props.image_link} alt="My Photo" />
    </div>
      <div className="text-xl h-[60px] flex py-auto justify-center items-center text-center font-bold ">{props.name}</div>
      <div className="h-[70px] flex flex row gap-4  items-start">
        <div className="w-1/2 flex flex-col text-center items-center justify-start">
          <div className="h-full text-center font-bold text-md text-[#301934]">Brand</div>
          <div className="h-full text-center">{props.brand}</div>
        </div>
        <div className="flex w-2/5 flex-col  h-full text-center items-center justify-center">
          <div className="font-bold text-md text-[#301934]">Hook</div>
          <div  className="h-full  flex items-center text-center ">{props.hook_size}mm</div>
        </div>
      </div>
    </div>
  );
}
