
import Image from "next/image";


import HomePageItem from "../app/components/HomePageItem";
import Link from "next/link";
type HomePageItem = {
  name: string,
  image_link:string
}

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-start font-sans">
        <div className="text-3xl m-10 p-5 font-bold">Yarn Storage App</div>
      <div className="grid grid-cols-3 gap-7">
          <Link href="/yarns">
            <HomePageItem
              name="Yarn"
              image_link="https://t4.ftcdn.net/jpg/01/93/05/63/360_F_193056336_2FZXjSBnLY2qUXfdRaez2gckRNRuUd8M.jpg"
            />
          </Link>

          <Link href="/kits">
            <HomePageItem
              name="Crochet Kits"
              image_link="https://cdn11.bigcommerce.com/s-aqhrs1x7/images/stencil/1280x1280/products/5178/14102/TY0413700_amig_1__13078.1739669702.jpg?c=2"
            />
          </Link>
      </div>
    </div>
  );
}
