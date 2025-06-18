import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MyProfile() {
    const navigate  = useNavigate()
  return (
    <div className="flex flex-col p-4 gap-3 md:p-4 w-full h-screen overflow-y-scroll md:pb-20 bg-slate-100">
      <div
        className="flex items-center gap-x-2 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <ArrowLeft className="text-[#4B5563]" />
        <div>
          <h1 className="text-[22px] font-bold">Profile Information</h1>
        </div>
      </div>
      <div>

      </div>
    </div>
  );
}
