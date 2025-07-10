import { ChevronDown, Edit, LoaderCircle, Trash2 } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import AddFaq from "./AddFaq";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAppContext } from "@/contexts/AuthContext";
import { getProductFaq, postProductFaq } from "@/lib/apis";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function ProductFaq() {

  const { auth } = useAppContext();
  const navigate = useNavigate();
  const productId = sessionStorage.getItem("product-id") as string;

  const [isAddOpen, setIsAddOpen] = useState<any>({ open: false, type: "", faq: null });
  const [ faqArray, setFaqArray ] = useState<{ question: string, answer: string }[]>([]);

  const deleteFaq = (itemIndex: number) => setFaqArray(prev => prev.filter((_item, index) => index !== itemIndex));

  const { data: productFaqDefaults } = useQuery({
    queryKey: ["getProductSEO"],
    queryFn: () => getProductFaq(auth?.token ?? "", productId),
    retry: 3,
    refetchOnWindowFocus: false,
    select: (data) => {
      return data.data.data.map((item: any) => ({ question: item.qn, answer: item.ans }))
    },
    enabled: Boolean(productId),
  });

  const { mutate, isPending } = useMutation({
    mutationKey: [ "postProductFaq" ],
    mutationFn: postProductFaq,
    onSuccess: () => {
      if(location.pathname === "/products/add/faq") {
        sessionStorage.removeItem("product-id");
        navigate("/products");
      }

      toast.success("Request Success", {
        description: "Product FAQ added successfully",
      });
    },
    onError: (error: AxiosError<any>) => {
      console.log(error);
      toast.error("Request Failed", {
        description: error?.response?.data?.message,
      });
    }
  });

  const submitFaq = () => {
    mutate({
      faq: faqArray,
      productId,
      token: auth?.token as string
    })
  }

  useEffect(() => {

    if(productFaqDefaults && productFaqDefaults.length > 0){
      setFaqArray(productFaqDefaults)
    }

  }, [ productFaqDefaults ])


  return (
    <div className="bg-white p-4 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Product FAQs</h1>
          <p className="text-[15px] text-[#4B5563]">
            Manage frequently asked questions for your products
          </p>
        </div>
        <Button onClick={() => setIsAddOpen((prev: any) => ({ ...prev, open: true, faq: null, type: "add", index: null }))}>Add FAQ</Button>
      </div>
      <Accordion type="multiple" className="space-y-2 mt-4">
        {faqArray.map((faq, index) => (
          <AccordionItem
            key={index}
            value={index.toString()}
            className="border rounded-lg"
          >
            <div className="flex items-center justify-between w-full p-4 ">
              <AccordionTrigger className="flex items-center flex-1 text-left font-medium hover:no-underline group [&>svg]:hidden">
                <div className="flex items-center gap-2">
                  <ChevronDown className="h-5 w-5 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                  {faq.question}
                </div>
              </AccordionTrigger>

              <div className="flex items-center gap-2 ml-2">
                <Button
                  size="icon"
                  className="rounded-full text-[#34C759] bg-[#34C759]/10 hover:bg-[#34C759]/20"
                  onClick={() => setIsAddOpen({ open: true, faq: faq, type: "edit", index: index })}
                >
                  <Edit className="h-5 w-5" />
                </Button>

                <Button
                  size="icon"
                  className="rounded-full text-red-400 bg-red-400/10 hover:bg-red-400/20"
                  onClick={() => deleteFaq(index)}
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <AccordionContent className="px-4 pb-4 text-sm text-primary-black">
              <span className="font-semibold block mb-1 text-base">
                Answer:
              </span>
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      {faqArray.length > 0 &&
        <div className="flex justify-end mt-5">
          <Button disabled={isPending} onClick={submitFaq}>{isPending ? <LoaderCircle className="h-5 w-5 animate-spin"/> : "Save & Submit"}</Button>
        </div>
      }
      
      <AddFaq isAddOpen={isAddOpen} setIsAddOpen={setIsAddOpen} setFaqArray={setFaqArray} />
    </div>
  );
}
