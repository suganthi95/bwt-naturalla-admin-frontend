import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Edit } from "lucide-react";
import { Input } from "../ui/input";

interface Props {
  type: "add" | "edit";
  initialValue?: string;
  PromotionTitle:string
}

export default function PromotionDialog({ type, initialValue,PromotionTitle }: Props) {
      const [title, setTitle] = useState(PromotionTitle);

  const [value, setValue] = useState(initialValue);
  const [open, setOpen] = useState(false);

  const handleAdd = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {type === "add" ? (
          <Button>Add</Button>
        ) : (
          <Button
            size="icon"
            className="h-8 w-8 rounded-full text-[#34C759] bg-[#34C759]/10 hover:bg-[#34C7591A]/20"
          >
            <Edit className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {type === "add" ? "Add Promotion" : "Edit Promotion"}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-2">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter promotion title ..."
          
          />
        </div>
        <div className="mt-2">
          <Textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter promotion message..."
            rows={4}
          />
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleAdd}>Add</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
