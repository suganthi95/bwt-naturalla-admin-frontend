import CategoryTable from "@/components/category/CategoryTable";
import { Button } from "@/components/ui/button";
import { Ellipsis } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Categories() {
    const navigate = useNavigate()
  return (
    <div className="flex flex-col p-4 gap-3 md:p-4 w-full h-screen overflow-y-scroll md:pb-20 bg-slate-100">
      <div className="flex flex-row items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Category</h1>
          <p className="text-lead text-[15px]">Manage your category catalog</p>
        </div>
        <div className="flex flex-row items-center gap-5">
          <Button onClick={()=>navigate('/add-category')} className="px-7">Add Category</Button>
          <Button size="icon" variant="outline">
            <Ellipsis />
          </Button>
        </div>
      </div>
      <div>
        <CategoryTable/>
      </div>
    </div>
  );
}
