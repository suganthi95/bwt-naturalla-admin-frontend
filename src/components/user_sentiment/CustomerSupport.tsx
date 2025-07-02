import { Search } from "lucide-react";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useState } from "react";

export default function CustomerSupport() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedPriority, setPriority] = useState<string>("");
  return (
    <div>
      <div className="p-4 bg-white">
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
        <ul>
            <li className="bg-[#F7FAFD] border-[#E5E7EB]">
                

            </li>
        </ul>
      </div>
    </div>
  );
}
