import { ArrowLeftToLine, ArrowRightToLine } from "lucide-react";
import { ReactNode, useState } from "react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { ASSETS } from "@/assets/assets";

export default function Sidebar({ content }: { content: ReactNode }) {

    const [ resizable, setResizable ] = useState(true);

  return (
    <section className={`hidden lg:block flex-between flex-col py-2 pl-2 pr-1 relative left top-0 h-[100vh] transition-all ease-out ${resizable ? "w-[30%] lg:w-[26%]" : "w-16"}`}>
        <div className={`h-full w-full relative overflow-hidden border-slate-200 border-2 rounded-xl`}>
            <div className={`px-5 pt-2 pb-2 flex flex-row items-center border-slate-200 border-b-2 space-x-5 ${!resizable && "invisible"}`}>
                <Link to="/" className="flex flex-row items-center gap-1">
                    <img src={ASSETS.LOGO} alt="logo" />
                    <p className="font-bold text-xl text-primary">Intelli<span className="text-secondary">Response</span></p>
                </Link>
                <Button onClick={() => setResizable(true)} variant="ghost" className="p-1 cursor-pointer h-6 border">
                    {resizable ? <ArrowLeftToLine className="h-4 w-4" /> : <ArrowRightToLine className="h-4 w-4" />}
                </Button>
            </div>
            <div className="h-full overflow-y-scroll pb-14">
                {content}
            </div>
        </div>
    </section>
  )
}