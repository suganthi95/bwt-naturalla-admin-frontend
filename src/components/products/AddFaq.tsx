import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { X } from "lucide-react";

const faqSchema = z.object({
  question: z.string().min(3, "Question must be at least 3 characters."),
  answer: z.string().min(5, "Answer must be at least 5 characters."),
});

type FaqFormData = z.infer<typeof faqSchema>;

interface Props{
  isAddOpen: any,
  setIsAddOpen: any
  setFaqArray: React.Dispatch<React.SetStateAction<{
    question: string;
    answer: string;
  }[]>>
}
export default function AddFaq({ setFaqArray, isAddOpen, setIsAddOpen }: Props) {

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FaqFormData>({
    resolver: zodResolver(faqSchema),
    defaultValues: {
      question: "",
      answer: ""
    }
  });


  const onSubmit = (data: FaqFormData) => {
    if(isAddOpen.type === "add"){
      setFaqArray(prev => [ ...prev, data ]);
      setIsAddOpen((prev: any) => ({ ...prev, open: false, faq: null, type: "" }))
    }

    if(isAddOpen.type === "edit"){
      setFaqArray((prevFaqs) =>
        prevFaqs.map((faq, i) =>
          i === isAddOpen.index ? { question: data.question, answer: data.answer } : faq
        )
      );
      setIsAddOpen((prev: any) => ({ ...prev, open: false, faq: null, type: "" }))
    }
  };


  useEffect(() => {
    if(isAddOpen.faq !== null && isAddOpen.type === "edit"){
      reset(isAddOpen.faq)
    }else{
      reset({ question: "", answer: "" })
    }
  }, [ isAddOpen, reset ])

  return (
    <Dialog open={isAddOpen.open} onOpenChange={() => setIsAddOpen((prev: any) => ({ ...prev, open: !isAddOpen.open, faq: null, type: "" }))}>
      <DialogContent className="[&>button]:hidden !p-0 !max-w-xl ">
        <DialogHeader className="bg-[#F5F5F5] p-3 rounded-lg items-center w-full flex flex-row  justify-between">
          <DialogTitle className="">{isAddOpen.type === "edit" ? "Edit FAQ" : "Add FAQ"}</DialogTitle>
          <DialogClose className="cursor-pointer">
            <X className="w-6 h-6" />
          </DialogClose>
        </DialogHeader>
        <div className=" p-4  bg-white  rounded-md ">

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="question">
                Question
              </label>
              <Input
                id="question"
                placeholder="Enter your question..."
                {...register("question")}
              />
              {errors.question && (
                <p className="text-sm text-red-500 mt-1">{errors.question.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="answer">
                Answer
              </label>
              <Textarea
                id="answer"
                placeholder="Enter the answer..."
                rows={4}
                {...register("answer")}
              />
              {errors.answer && (
                <p className="text-sm text-red-500 mt-1">{errors.answer.message}</p>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" className="border-gray-400 text-gray-400" onClick={() => reset()}>
                Cancel
              </Button>
              <Button type="submit">{isAddOpen.type === "edit" ? "Edit FAQ" : "Add FAQ"}</Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
    
  );
}
