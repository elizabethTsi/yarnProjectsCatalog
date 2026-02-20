import Image from "next/image";


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


export default function YarnItem(props: Yarn) {
  return (
    <div className="flex flex-col p-5 rounded-xl border border-[#c8adcb] border-6 items-center justify-center bg-[#d8bdfb] font-sans ">
      <div>
      <img 
          style={{
            height: "200px",
            aspectRatio: "1",
            objectFit: "cover"
          }}
          src={props.image_link} alt="My Photo" />
    </div>
      <div className="text-xl py-2 font-bold ">{props.name}</div>
      <div className="flex flex row gap-4">
        <div className="flex flex-col items-center justify-center">
          <div className="font-bold text-md text-[#301934]">Brand</div>
          <div>{props.brand}</div>
        </div>
        <div className="flex flex-col items-center justify-center">
          <div className="font-bold text-md text-[#301934]"> Hook Size</div>
          <div>{props.hook_size}</div>
        </div>
      </div>
    </div>
  );
}
