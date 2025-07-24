import { Button } from "@/components/ui/button";
import { useAppContext } from "@/contexts/AuthContext";
import { BASE_FRONTEND_URL, getAllLegalPages } from "@/lib/apis";
import { GetLegalPagesType } from "@/types/type";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { Calendar, User } from "lucide-react";
import { useNavigate } from "react-router-dom";


export default function LegalPages() {

  
  const navigate = useNavigate();
  const { auth } = useAppContext();

  const { data, isSuccess, isLoading, isError, error } = useQuery({
    queryKey: [ "getAllLegalPages" ],
    queryFn: () => getAllLegalPages(auth?.token as string),
    retry: 2,
    select: (data): GetLegalPagesType[] => data.data.data
  });


  let content;

  if(isLoading){
    content =  (
      <div className="mt-[10%] text-center">
        Loading...
      </div>
    )
  }

  if(isError){
    content =  (
      <div className="mt-[10%] text-center">
        {error.message}
      </div>
    )
  }

  if(isSuccess){
    content = (
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
        {data.map((page) => (
          <li
            key={page.page_id}
            className="bg-white p-5 rounded-lg shadow-sm border space-y-2"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">
                {page.page_title}
              </h2>
              <span
                className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${
                  page.status === "published"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {page.status}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500 pt-4">
                <div className="flex flex-col items-start gap-y-2 xl:flex-row xl:items-center gap-x-4">

              <div className="flex items-center gap-x-2">
                <Calendar className="w-4 h-4" />
                <span>{dayjs(page.updated_at).format("DD-MM-YYYY, h:mm A")}</span>
              </div>
              <div className="flex items-center gap-x-2">
                <User className="w-4 h-4" />
                <span>{page.first_name} {page.last_name}</span>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-3">
              <Button onClick={() => window.open(`${BASE_FRONTEND_URL}/${page.redirect_url}`)} variant="outline" size="sm">
                View
              </Button>
              <Button size="sm" 
              onClick={()=>{
                navigate(`/legal-pages/edit/${page.page_id}`)
              }}
              >Edit</Button>
            </div>

                </div>
          </li>
        ))}
      </ul>
    )
  }

  

  return (
    <div className="flex flex-col p-4 gap-3 md:p-4 w-full h-screen overflow-y-scroll md:pb-20 bg-slate-100">
      <div>
        <h1 className="text-xl font-semibold">Legal Pages</h1>
        <p className="text-[15px] text-[#4B5563]">
          Manage all your website legal pages and update them.
        </p>
      </div>
      {content}
      
    </div>
  );
}
