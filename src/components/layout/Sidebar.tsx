import { ArrowLeftToLine, ArrowRightToLine } from "lucide-react";
import { ReactNode, useState } from "react";
import { Button } from "../ui/button";
import { ValidateUserType } from "@/types";

export default function Sidebar({ content, data }: { content: ReactNode, data: ValidateUserType }) {

    const [ resizable, setResizable ] = useState(true);
    const [ activeWorkspace ] = data?.workspaceList.filter(item => item.workspace_id === data?.active_workspace);

  return (
    <section className={`hidden lg:block transition-all ease-out ${resizable ? "w-[30%] lg:w-[26%]" : "w-16"}`}>
        <div className={`h-full w-full relative overflow-hidden border-slate-200 border`}>
            <div className={`px-5 py-[3px] flex flex-row items-center justify-between border-slate-200 border-b-2 space-x-5 ${!resizable && "invisible"}`}>
                <div className="flex flex-row items-center gap-3">
                    <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-secondary text-white">
                        {activeWorkspace.workspace_name[0]}
                    </div>
                    <div>
                        <p className="font-medium">{activeWorkspace.workspace_name}</p>
                        <span className="text-xs text-slate-500">{data?.credit} credits left</span>
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