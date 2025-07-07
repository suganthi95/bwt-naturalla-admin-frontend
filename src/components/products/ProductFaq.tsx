import { ChevronDown, Edit, Trash2, X } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useState } from "react";
import AddFaq from "./AddFaq";

export default function ProductFaq() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const faqs = [
    {
      id: "1",
      question: "What is the return policy?",
      answer:
        "You can return the product within 30 days of purchase if it’s in original condition.",
    },
    {
      id: "2",
      question: "Do you offer international shipping?",
      answer: "Yes, we ship internationally with additional shipping charges.",
    },
  ];
  return (
    <div className="bg-white p-4 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Product FAQs</h1>
          <p className="text-[15px] text-[#4B5563]">
            Manage frequently asked questions for your products
          </p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger>
            <Button>Add FAQ</Button>
          </DialogTrigger>
          <DialogContent className="[&>button]:hidden !p-0 !max-w-xl ">
            <DialogHeader className="bg-[#F5F5F5] p-3 rounded-lg items-center w-full flex flex-row  justify-between">
              <DialogTitle className="">Add FAQ</DialogTitle>
              <DialogClose className="cursor-pointer">
                <X className="w-6 h-6" />
              </DialogClose>
            </DialogHeader>
            <AddFaq onClose={setIsAddOpen} />
          </DialogContent>
        </Dialog>
      </div>
      <Accordion type="multiple" className="space-y-2 mt-4">
        {faqs.map((faq) => (
          <AccordionItem
            key={faq.id}
            value={faq.id}
            className="border rounded-lg"
          >
            <div className="flex items-center justify-between w-full p-4">
              <AccordionTrigger className="flex-1 text-left border-none  [&>svg]:hidden hover:no-underline font-semibold text-primary-black ">
                {faq.question}
                <span className="[&>svg]:block">
                  {" "}
                  <ChevronDown />
                </span>
              </AccordionTrigger>
              <div className="flex items-center gap-2 ml-2">
                <Button
                  onClick={() => console.log("Edit FAQ", faq.id)}
                  size="icon"
                  className="rounded-full text-[#34C759] bg-[#34C759]/10 hover:bg-[#34C759]/20"
                >
                  <Edit className="h-5 w-5" />
                </Button>
                <Button
                  onClick={() => console.log("Delete FAQ", faq.id)}
                  size="icon"
                  className="rounded-full text-red-400 bg-red-400/10 hover:bg-red-400/20"
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
    </div>
  );
}
