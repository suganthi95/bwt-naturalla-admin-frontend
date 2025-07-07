import { Search, Send } from "lucide-react";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useState } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { useAppContext } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { getCustomerQueries } from "@/lib/apis";

export default function CustomerSupport() {
  const {auth} = useAppContext()
  const [searchTerm, setSearchTerm] = useState<string>("");

  const {data} = useQuery({
    queryKey:['customerReviews'],
    queryFn:()=>getCustomerQueries(auth?.token ?? "",searchTerm ?? ""),
    staleTime:1000*60*5,
    select:(data)=>data?.data?.data,
    retry:1,
  })
  console.log(data)
  
  const [selectedPriority, setPriority] = useState<string>("");
  const getBadgeClass = (status: string) => {
    switch (status) {
      case "unresolved":
        return "bg-[#FEE2E2] text-[#991B1B]";
      case "in-progress":
        return "bg-[#DBEAFE] text-[#1E40AF]";
      case "resolved":
        return "bg-[#DCFCE7] text-[#166534]";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="grid grid-cols-6 gap-x-6">
      <div className=" col-span-4 bg-white shadow">
        <div className="p-4">
          <h2 className="font-bold text-[22px] mb-4">User Feedback</h2>

          <div className="flex justify-between gap-4 items-center">
            <div className="relative w-full lg:max-w-xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="pl-10 pr-4 py-2"
              />
            </div>

            <div className="w-[180px]">
              <Select
                value={selectedPriority}
                onValueChange={(value) => setPriority(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <ul className="">
          <li className=" col-span-3 bg-[#F7FAFD] border-[#E5E7EB] p-4 space-y-3">
            <div className="text-primary-black flex justify-between items-center">
              <p className=" font-semibold">Website Navigation Issues</p>
              <p className="text-[#6B7280] text-xs font-medium">2025-07-5</p>
            </div>
            <ul className="flex items-center gap-x-10">
              <li className="text-[#4B5563] text-xs">Emily Johnson</li>
              <li className="text-[#4B5563] text-xs list-disc">
                emmiy12@gmial.com
              </li>
              <li className="text-[#4B5563] text-xs list-disc">
                +9139399929191
              </li>
            </ul>
            <p className="text-primary-black text-xs ">
              I'm having trouble finding the product categories on your new
              website layout. The menu seems to disappear when…
            </p>
            <div className="flex items-center justify-between">
              <img
                src="https://ik.imagekit.io/3t9llb0gx/Naturella/image%2010.png?updatedAt=1749127796779"
                alt=""
                className="size-10"
              />
              <Badge className={getBadgeClass("resolved")}>
                {/* {status
                  .replace("-", " ")
                  .replace(/\b\w/g, (char) => char.toUpperCase())} */}
                Resolved
              </Badge>
            </div>
          </li>
         
        </ul>
      </div>
       <div className=" col-span-2  w-full  mx-auto bg-white dark:bg-slate-900 shadow rounded-lg  space-y-6">
        <div className="border-b">
              <div className="flex p-6 items-center justify-between  pb-3">
                <h2 className="text-lg font-semibold text-primary-black dark:text-neutral-100">
                  Login Issue on Dashboard
                </h2>
                <Badge className="bg-yellow-100 text-yellow-700">
                  In Progress
                </Badge>
              </div>

        </div>

              <div className="space-y-2 border-b pb-4">
                <div className="flex p-4 items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src="https://via.placeholder.com/40"
                      alt="User Profile"
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <div>
                      <p className="font-medium flex items-center gap-x-2 text-neutral-800 dark:text-neutral-100">
                        Raj Kumar
                      <Badge className="bg-gray-100 text-sm text-gray-600">
                        +91 9876543210
                      </Badge>
                      </p>
  <p className="text-sm text-muted-foreground">
                    rajkumar@example.com
                  </p>
                      </div>
                    </div>
                  </div>
                
                <div className="text-sm text-muted-foreground text-right">
                  Jul 3, 2025 • 10:45 AM
                </div>
                </div>
              </div>

              <div className="p-4 space-y-2">
                <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-100">
                  Message
                </p>
                <p className="text-sm text-neutral-600 dark:text-neutral-300">
                  I'm facing an issue while logging in to the dashboard. It
                  shows an error message saying "Invalid session token". Please
                  help me resolve this as soon as possible.
                </p>
              </div>

              <div className="border-b p-4 space-y-2">
                <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-100">
                  Attachments
                </p>
                <div className="flex gap-3 overflow-x-auto py-2">
                  <img
                    src="https://via.placeholder.com/120"
                    className="rounded border w-32 h-24 object-cover"
                    alt="attachment"
                  />
                  <img
                    src="https://via.placeholder.com/120"
                    className="rounded border w-32 h-24 object-cover"
                    alt="attachment"
                  />
                </div>
              </div>

              <div className="space-y-3 p-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
                    Your Reply
                  </label>
                  <textarea
                    className="w-full border rounded-md px-3 py-2 text-sm bg-white dark:bg-slate-800 text-neutral-900 dark:text-neutral-100 resize-none"
                    rows={4}
                    placeholder="Type your message..."
                  ></textarea>
                </div>

                <div className="flex items-center justify-between">
                  <Button variant="outline">Change Priority</Button>
                  <Button className="flex items-center gap-2">
                    <Send className="w-4 h-4" />
                    Send
                  </Button>
                </div>
              </div>
            </div>
    </div>
  );
}
