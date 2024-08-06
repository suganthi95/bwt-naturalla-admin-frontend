import { ArrowLeftToLine, ArrowRightToLine } from "lucide-react";
import { ReactNode, useState } from "react";
import { Button } from "../ui/button";
import { useAppContext } from "@/contexts/AuthContext";

export default function Sidebar({ content }: { content: ReactNode }) {

    const { auth } = useAppContext();
    const [ resizable, setResizable ] = useState(true);

  return (
    <section className={`hidden lg:block transition-all ease-out ${resizable ? "w-[30%] lg:w-[26%]" : "w-16"}`}>
        <div className={`h-full w-full relative overflow-hidden border-slate-200 border`}>
            <div className={`px-5 py-[3px] flex flex-row items-center justify-between border-slate-200 border-b-2 space-x-5 ${!resizable && "invisible"}`}>
                <div className="flex flex-row items-center gap-3">
                    <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-secondary text-white">
                        {auth?.data?.active_workspace_name[0]}
                    </div>
                    <div>
                        <p className="font-medium">{auth?.data?.active_workspace_name}</p>
                        <span className="text-xs text-slate-500">25 credits left</span>
                    </div>
                </div>
                <Button onClick={() => setResizable(true)} variant="ghost" className="p-1 cursor-pointer h-6 border">
                    {resizable ? <ArrowLeftToLine className="h-4 w-4" /> : <ArrowRightToLine className="h-4 w-4" />}
                </Button>
            </div>
            
            {content}
        </div>
    </section>
  )
}