import Image from "next/image";
import Link from "next/link";
import {  House } from "lucide-react";

export default function Navbar() {
  return (
    <div className="flex bg-[#e7e7e7] flex-row min-w-screen items-center justify-around py-4 font-sans">
      <Link href="/"><House className="w-4 h-4 md:w-8 md:h-8 lg:w-12 lg:h-12 mt-2" /></Link>
      <Link href="/yarns"><div>Yarns</div></Link>
      <div>Patterns</div>
      <div>Hooks</div>
      <Link href="/kits">Kits</Link>
      <div>Account</div>
      <div>Setting</div>
    </div>
  );
}
