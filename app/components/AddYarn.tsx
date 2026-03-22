'use client'
import { useRef, useState, ChangeEvent, useEffect} from "react";
import {CloudUpload, X, ImageIcon, ArrowLeftIcon } from "lucide-react";
import { supabase } from "../createClient";



type Yarn = {
  id: number,
  name: string,
  brand: string,
  weight: number,
  color_cat: string,
  hex_color: string,
  material: string,
  color_style: string,
  part_of_kit: boolean,
  image_link: string,
  kit_ids: number[],
  gram_weight: number,
  hook_size: number,
  pattern_ids: number[],
  skein_quantity: number,
}


export default function AddYarn() {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [image, setImage] = useState<string>("");
    const [file, setFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const [pageNum, setPageNum] = useState<number>(1);
    const [partOfKit, setPartOfKit] = useState(false);
    const [kits, setKits] = useState<any[]>([]);
    const [selectedKitIds, setSelectedKitIds] = useState<number[]>([]);

    const clearFile = () => {
        if(fileInputRef.current){
            fileInputRef.current.value = "";
        }

        setImage("");
        setFileName(null);
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
        const selectedFile = e.target.files[0];

        setFile(selectedFile); // ✅ store file ONLY
        setFileName(selectedFile.name);
        setImage(URL.createObjectURL(selectedFile)); // preview only
    }
  };

  useEffect(() => {
  const fetchKits = async () => {
    const { data, error } = await supabase
      .from("kits")
      .select("id, name");

    if (error) {
      console.error("Error fetching kits:", error);
    } else {
      setKits(data || []);
    }
  };

  fetchKits();
}, []);

    const createYarn = async (newYarn: Omit<Yarn, "id">) => {
        const { data, error } = await supabase
            .from("yarns")
            .insert([newYarn])
            .select();

        if (error) {
            console.error("Insert error:", error.message, error.details);
        } else {
            console.log("Inserted:", data);
        }
    }

    return (
        <div className="border p-3 rounded-xl flex justify-center items-center"> 
            {pageNum == 1 && 
                <div className="bg-white rounded-lg w-60 p-2 flex flex-col justify-center items-center">
                    <div className="w-full h-52 rounded-lg border-dashed border-2 border-blue-500 text-blue-500 flex justify-center items-center overflow-hidden">
                        {image 
                            ? <img className="w-full object-contain" src = {image}></img> 
                            : <div className="w-full h-full flex flex-col justify-center items-center">
                                <CloudUpload size={40} /> 
                                Browse File to upload!
                            </div>
                        }
                    </div>
                    <div className="w-full mt-2">
                        <div className="w-full flex justify-between items-center bg-blue-300 p-2 rounded-lg">
                            <ImageIcon size = {20} className="text-blue-600 hover:text-black" 
                                onClick={() => {
                                    fileInputRef.current?.click();
                                }} />
                            <div>
                                {fileName || "Not selected file"}
                            </div>

                            <X size={20} className="hover:bg-white hover:text-red-600 rounded-full"
                                onClick ={clearFile} />
                        </div>

                        <input type="file"
                            className="hidden"
                            accept="image/png, image/jpeg, image/jpg"
                            ref = {fileInputRef}
                            onChange={handleFileChange}  
                        />
                        
                    </div>
                    <button
                        onClick={() => setPageNum(2)}
                        disabled={!image}
                        className="mt-3 bg-purple-400 text-white w-full px-4 py-2 rounded-md 
                            hover:bg-purple-500 active:scale-95 transition
                            disabled:bg-purple-200 disabled:cursor-not-allowed"
                        >
                    Next
                    </button>
                </div>
            }   
            {pageNum == 2 && 
                
                <form
                    className="flex flex-col gap-1 flex-evenly  w-full max-w-md"
                    onSubmit={async (e) => {
                        e.preventDefault();

                        const form = e.currentTarget;
                        const formData = new FormData(form);

                        let imageUrl = "";

                        // ✅ Upload happens ONLY here
                        if (file) {
                            const fileExt = file.name.split(".").pop();
                            const fileName = `${Date.now()}.${fileExt}`;
                            const filePath = `yarns/${fileName}`;

                            const { error } = await supabase.storage
                            .from("yarnPictures")
                            .upload(filePath, file);

                            if (error) {
                                console.error(error);
                                return;
                            }
                            const { data: { publicUrl } } = supabase.storage
                                .from("yarnPictures")
                                .getPublicUrl(filePath);
                            imageUrl = publicUrl;
                        }
                        const rawName = (formData.get("name") as string)?.trim();

                        const brand = (formData.get("brand") as string) ?? "";
                        const color = (formData.get("color") as string) ?? "";
                        const colorStyle = (formData.get("color_style") as string) ?? "";

                        // ✅ Build fallback name
                        const generatedName = [brand?.trim(), colorStyle?.trim(), color?.trim()]
                            .filter(Boolean) // removes empty values
                            .join(" ");

                        // ✅ Final name
                        const finalName = rawName || generatedName || "Yarn";

                        const yarnData: Omit<Yarn, "id"> = {
                            name: finalName,
                            brand: (formData.get("brand") as string) ?? "",
                            weight: Number(formData.get("weight")) || 0,
                            color_cat: (formData.get("color") as string) ?? "",
                            hex_color: (formData.get("hex_color") as string) ?? "",
                            material: (formData.get("material") as string) ?? "",
                            color_style: (formData.get("color_style") as string) ?? "",
                            part_of_kit: partOfKit,
                            image_link: imageUrl,
                            kit_ids: [], // you can wire this later
                            gram_weight: Number(formData.get("gram_weight")) || 0,
                            hook_size: Number(formData.get("hook_size")) || 0,
                            pattern_ids: [], // optional for now
                            skein_quantity: Number(formData.get("skein_quantity")) || 1
                        };

                        await createYarn(yarnData);

                        form.reset();
                        setFile(null);
                        setImage("");
                        setFileName(null);
                        setPageNum(1);
                    }}
                >

                    <button
                        type="button"
                        onClick={() => setPageNum(1)}
                        className="p-1 w-8 flex justify-center rounded-full bg-purple-200 text-purple-800 
                                    hover:bg-purple-300 hover:scale-95 transition"
                    >
                    <ArrowLeftIcon size={20} />
                    </button>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col">
                            <label className="font-bold">Name</label>
                            <input className="border rounded input" name="name" />
                        </div>

                        <div className="flex flex-col">
                            <label className="font-bold">Brand</label>
                            <input className="border rounded input" name="brand" />
                        </div>

                        <div className="flex flex-col">
                            <label className="font-bold">Weight</label>
                            <input type="number" className="border rounded input" name="weight" />
                        </div>

                        <div className="flex flex-col">
                            <label className="font-bold">Material</label>
                            <input className="border rounded input" name="material" placeholder="Cotton, Acrylic..." />
                        </div>

                        <div className="flex flex-col">
                            <label className="font-bold">Color Category</label>
                            <input className="border rounded input" name="color" />
                        </div>
                        <div className="flex flex-col">
                            <label className="font-bold">Hex Color</label>
                            <input className="border rounded input" name="hex_color" />
                        </div>

                        <div className="flex flex-col">
                            <label className="font-bold">Color Style</label>
                            <input className="border rounded input" name="color_style" placeholder="Solid, Variegated..." />
                        </div>

                        <div className="flex flex-col">
                            <label className="font-bold">Hook Size</label>
                            <input type="number" step="0.25" className="border rounded input" name="hook_size" />
                        </div>

                        <div className="flex flex-col">
                            <label className="font-bold">Weight (in Grams)</label>
                            <input type="number" step="0.01" className="border rounded input" name="gram_weight" />
                        </div>

                        
                        <div className="flex flex-col">
                            <label className="font-bold">Ball Quanity</label>
                            <input type="number" step="1" className="border rounded input" name="skein_quantity" placeholder="1"/>
                        </div>

                        
                    </div>

                        <div className="flex flex-row w-full mt-2">
                            <div className="flex flex-col w-2/5 px-3 align-center ">
                                <label className="font-bold text-center pb-3 pt-1">Part of Kit</label>
                                <input
                                    type="checkbox"
                                    name="part_of_kit"
                                    checked={partOfKit}
                                    onChange={(e) => setPartOfKit(e.target.checked)}
                                />
                            </div>

                            {partOfKit && (
                                <div className="flex flex-col">
                                    <label className="font-bold text-center">Select Kits</label>
                                    <select
                                    multiple
                                    className="border rounded input h-22"
                                    value={selectedKitIds.map(String)} // must be string[]
                                    onChange={(e) => {
                                        const values = Array.from(e.target.selectedOptions, (option) =>
                                        Number(option.value)
                                        );
                                        setSelectedKitIds(values);
                                    }}
                                    >
                                    {kits.map((kit) => (
                                        <option key={kit.id} value={kit.id}>
                                        {kit.name}
                                        </option>
                                    ))}
                                    </select>
                                </div>
                            )}
                        </div>

                        


                    <button
                        type="submit"
                        className="self-center bg-purple-400 text-white py-2 mt-3 w-3/5 rounded-md font-semibold hover:bg-purple-500 active:scale-95 transition"
                        disabled={!file}
                    >
                        Create Yarn
                    </button>
                </form>
            }
        </div>
    );
}
