import { Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

import PromotionForm from "./PromotionForm";
import { deletePromo, getAllPromo } from "@/lib/apis";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAppContext } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { AxiosError } from "axios";
// "🎉 Flat 30% Off on Selected Products | Use Code : DEAL30 🎉",
// "🚚 Free Shipping on Orders Above ₹499 🚚",
// "🔥 New Deals Every Day — Don't Miss Out! 🔥",
export default function PromotionalOffer() {
  const { auth } = useAppContext();
  const queryClient = useQueryClient();

  const { data, isLoading, isSuccess, isError } = useQuery({
    queryKey: ["getAllPromo"],
    queryFn: () => getAllPromo({ token: auth?.token ?? "" }),
    retry: 2,
    select: (data) => data?.data?.data,
    staleTime: 1000 * 60 * 5,
  });

  const { mutate } = useMutation({
    mutationKey: ["deletePromo"],
    mutationFn: deletePromo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllPromo"] });
      return toast.success("Request Success", {
        description: "Promo deleted successfully",
      });
    },
    onError: (error: AxiosError<any>) => {
      return toast.error("Request error", {
        description: error.response?.data.message,
      });
    },
  });

  let content;

  if (isLoading) {
    content = <div className="mt-[10%] text-center">Loading...</div>;
  }

  if (isError) {
    content = (
      <div className="mt-[10%] text-center">{/* {error.message} */}</div>
    );
  }

  if (isSuccess) {
    content = (
      <ul className="space-y-4 mt-3">
        {data?.map((promo: Record<any, any>, index: number) => {
          return (
            <li
              key={index}
              className="flex items-center justify-between border border-gray-200 rounded-lg p-4 bg-white shadow-sm"
            >
              <div className="flex-1 px-4 space-y-1.5">
                <h3 className="text font-semibold text-gray-900">
                  Promotion {index + 1}
                </h3>
                <div className="flex gap-x-3">
                  <div className="flex items-center w-full gap-x-2 bg-[#FAFAFA] border border-[#EEF1F6] text-sm text-primary-black rounded p-2 px-4 ">
                    <span className={`inline-block  font-medium  `}>
                      {promo?.promo_offer_txt}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <PromotionForm
                      type="edit"
                      PromotionTitle={promo?.promo_offer_txt}
                      id={promo?.promo_offer_id}
                    />

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="icon"
                          //onClick={() => mutate({ token: auth?.token as string, id: item.banner_id })}

                          className="h-8 w-8 rounded-full text-red-400 bg-red-400/10 hover:bg-red-400/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Are you absolutely sure?</DialogTitle>
                          <DialogDescription>
                            This will permanently delete and remove the banner
                            from the servers
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                          </DialogClose>
                          <DialogClose asChild>
                            <Button
                              variant="destructive"
                              onClick={() =>
                                mutate({
                                  token: auth?.token ?? "",
                                  id: String(promo?.promo_offer_id),
                                })
                              }
                            >
                              Delete
                            </Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <div className="bg-white p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Promotional Offer</h1>
          <p className="text-[15px] text-[#4B5563]">
            Manage offer displayed on the header of home page
          </p>
        </div>
        <PromotionForm type="add" PromotionTitle="" id="" />
      </div>
      {content}
    </div>
  );
}
