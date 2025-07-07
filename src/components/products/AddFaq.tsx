import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const faqSchema = z.object({
  question: z.string().min(3, "Question must be at least 3 characters."),
  answer: z.string().min(5, "Answer must be at least 5 characters."),
});

type FaqFormData = z.infer<typeof faqSchema>;
interface Props{
    onClose:(val:boolean)=>void
}
export default function AddFaq({onClose}:Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FaqFormData>({
    resolver: zodResolver(faqSchema),
  });

  const onSubmit = (data: FaqFormData) => {
    console.log("FAQ Submitted:", data);
    onClose(false)
  };

  return (
    <div className=" p-4  bg-white  rounded-md ">
      <h2 className="text-xl font-semibold mb-4">Add New FAQ</h2>

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
          <Button type="submit">Add FAQ</Button>
        </div>
      </form>
    </div>
  );
}
