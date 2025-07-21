import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Edit, Loader2 } from "lucide-react";
import { Input } from "../ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addPromo, editPromo } from "@/lib/apis";
import { useAppContext } from "@/contexts/AuthContext";
import { toast } from "sonner";
import axios from "axios";

interface Props {
  type: "add" | "edit";
  PromotionTitle: string;
  id: string;
}

export default function PromotionDialog({ type, PromotionTitle ,id}: Props) {
  const [title, setTitle] = useState(PromotionTitle);
  console.log(PromotionTitle);
  
  const queryClient = useQueryClient();
  const { auth } = useAppContext();
  const { mutate: AddPromo, isPending } = useMutation({
    mutationKey: ["addPromo"],
    mutationFn: addPromo,
  });
  const { mutate: EditPromo, isPending: EditIsPending } = useMutation({
    mutationKey: ["editPromo"],
    mutationFn: editPromo,
  });
  const [open, setOpen] = useState(false);

  const handleAdd = () => {
    if (type === "add") {
      AddPromo(
        { promo_offer_txt: title, token: auth?.token ?? "" },
        {
          onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["getAllPromo"] });
            toast.success(data.data?.message);
            setOpen(false);
          },
          onError: (error) => {
            if (axios.isAxiosError(error)) {
              toast.error(error?.response?.data?.message);
            }
          },
        }
      );
    }
    if (type === "edit") {
      EditPromo(
        { promo_offer_txt: title, token: auth?.token ?? "", id: id },
        {
          onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["getAllPromo"] });
            toast.success(data.data?.message);
            setOpen(false);
          },
          onError: (error) => {
            if (axios.isAxiosError(error)) {
              toast.error(error?.response?.data?.message);
            }
          },
        }
      );
    }
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
            placeholder="Enter promotion text ..."
          />
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleAdd}>
            {" "}
            {isPending || EditIsPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Add"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
