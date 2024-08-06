import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";

 
export function BusinessBox() {
 
  return (
    <Select>
        <SelectTrigger className="h-7 bg-secondary text-white flex gap-2">
            <SelectValue placeholder="" />
        </SelectTrigger>
        <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="highest_rating">Positive</SelectItem>
            <SelectItem value="lowest_rating">Negative</SelectItem>
        </SelectContent>
    </Select>
  )
}