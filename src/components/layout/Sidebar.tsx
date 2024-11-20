import { ArrowLeftToLine, ArrowRightToLine } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { CollapseType, MenuType, ValidateUserType } from "@/types";
import { useLocation, useNavigate } from "react-router-dom";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";

export default function Sidebar({ content, data }: { content: CollapseType, data: ValidateUserType }) {

    const [ resizable, setResizable ] = useState(true);
    const navigate = useNavigate();
    const [ activeWorkspace ] = data?.workspaceList.filter(item => item.workspace_id === data?.active_workspace);
    const path = useLocation();
    const [ collapse, setCollapse ] = useState<string[]>([ "general", "menu", "apps/integrations" ])

    const tabValue = path.pathname.split("/").at(-1);

    const collapseSidebar = () => {
        setResizable(prev => !prev);
        setCollapse([ "general", "menu", "apps/integrations" ])
    }

    const redirect = (route: MenuType) => {
        if([ "Privacy Policy", "Terms & Conditions" ].includes(route.name)){
            window.open( route.route, '_blank');
        }else{
            navigate(`/${route.route}`)
        }
    }

  return (
    <section className={`hidden lg:block transition-all ease-out ${resizable ? "w-[30%] lg:w-[26%]" : "w-16"}`}>
        <div className={`h-full w-full relative border-slate-200 dark:border-slate-800 border`}>
            <div className={`px-2 py-[7px] flex flex-row items-center justify-between border-slate-200 dark:border-slate-800 border-b-2 space-x-5`}>
                <div className="flex flex-row items-center gap-3">
                    <div title={activeWorkspace.workspace_name} className="h-10 w-10 flex items-center justify-center rounded-lg bg-secondary dark:bg-primary text-white cursor-pointer">
                        {activeWorkspace.workspace_name[0]}
                    </div>
                    <div className={`${!resizable && "hidden"} flex flex-col`}>
                        <p className="font-medium text-slate-950 dark:text-slate-500">{activeWorkspace.workspace_name}</p>
                        {/* <span className="text-xs text-slate-500">{data?.credit} credits left</span> */}
                    </div>
                </div>
                <Button onClick={() => collapseSidebar()} variant="secondary" className={`p-1 cursor-pointer h-6 border z-10 absolute -right-4`}>
                    {resizable ? <ArrowLeftToLine className="h-4 w-4" /> : <ArrowRightToLine className="h-4 w-4" />}
                </Button>
            </div>
            <div className={`${resizable && "overflow-y-scroll"} h-[82vh]`}>
                {Object.keys(content).map((menu: string, index: number) => (
                    <Accordion key={`${menu}-${index}`} value={collapse} onValueChange={setCollapse} type="multiple" className="w-full">
                        <AccordionItem value={menu}>
                            {resizable && <AccordionTrigger className="px-2 text-sm text-secondary py-2 hover:no-underline uppercase">{menu}</AccordionTrigger>}
                            <AccordionContent>
                                <Tabs value={tabValue}>
                                    <TabsList className="flex flex-col h-full rounded-none bg-white dark:bg-slate-950">
                                        {content[menu as keyof CollapseType].filter((item: MenuType) => item.shouldVisible).map((item: MenuType) => (
                                            <TabsTrigger key={`menu-${item}`} title={item.name} onClick={() => redirect(item)} className={`px-3 py-2 rounded-md flex items-center justify-start space-x-3 bg-white data-[state=active]:bg-secondary dark:data-[state=active]:bg-primary data-[state=active]:text-white dark:bg-slate-950 ${resizable ? "w-full" : "w-fit"}`} value={item.route}>
                                                {item.icon}
                                                {resizable && <p>{item.name}</p>}
                                            </TabsTrigger>
                                        ))}
                                    </TabsList>
                                </Tabs>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                ))}
            </div>
        </div>
    </section>
  )
}