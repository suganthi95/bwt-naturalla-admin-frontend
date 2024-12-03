import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useAppContext } from "@/contexts/AuthContext";
import { sendFeedback } from "@/lib/apis";
import { FeedbackFormType } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner";


function Feedback() {

    const { auth } = useAppContext();
    const { register, watch, handleSubmit, control, reset, setValue } = useForm<FeedbackFormType>();
    const { mutate, isPending } = useMutation({
        mutationKey: [ "sendFeedback" ],
        mutationFn: sendFeedback,
        onSuccess: () => {
            toast.success("Request Success", { description: "Feedback sent successfully" });
            reset();
            setValue("feedbackType", "");
        },
        onError: (error) => {
            toast.error("Request Failed", { description: error?.message });
        }
    });

    const submit = handleSubmit(data => {
        mutate({
            token: auth?.token as string,
            feedbackType: data.feedbackType,
            message: data.message,
            file: data.file
        })
    })

  return (
    <div className="flex flex-col  overflow-hidden   mb-5 sm:mb-0   flex-1 px-3">
            <h1 className="font-semibold mt-4 hidden md:block ">Feedback</h1>
        

        <form onSubmit={submit} className="mt-3     font-medium text-secondary space-y-5">
            
            <div className="space-y-1 w-[38rem] md:w-full">
                <label className="text-sm dark:text-slate-50" htmlFor="feedback_type">Feedback Type</label>
                <Controller
                    name="feedbackType"
                    control={control}
                    render={({ field }) => (
                        <Select  required value={field.value} onValueChange={(val) => field.onChange(val)} >
                            <SelectTrigger id="feedback_type" className="w-1/2">
                                <SelectValue placeholder="Please select feedback type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Report a Bug">Report a Bug</SelectItem>
                                <SelectItem value="Request a Feature">Request a Feature</SelectItem>
                                <SelectItem value="Appreciation feedback">Appreciation feedback</SelectItem>
                            </SelectContent>
                        </Select>
                    )}  
                />
            </div>

            <div className="space-y-1 w-[38rem] md:w-full">
                <label className="text-sm dark:text-slate-50" htmlFor="">Message</label>
                <Textarea 
                    required 
                    className="w-1/2" 
                    rows={5} 
                    placeholder="Type your message here." 
                    {...register("message")}
                />
            </div>

            <div className="space-y-1 w-[38rem] md:w-full">
            <label className="text-sm dark:text-slate-50" htmlFor="">Upload Files</label>
                <label htmlFor="dropzone-file" className="flex flex-col w-1/2 border-2 border-primary border-dashed rounded-lg cursor-pointer bg-primary/5 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-primary/10 dark:border-gray-600 dark:hover:border-gray-500">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                        </svg>
                        
                        {watch("file")?.[0]?.name ? <p className="mb-2 text-sm text-primary dark:text-gray-400">{watch("file")?.[0]?.name} added</p> : <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>}
                    </div>
                    <input required id="dropzone-file" type="file" className="hidden" {...register("file")} />
                </label>
            </div>

                <Button className="bg-primary hover:bg-primary/50">{isPending ? <LoaderCircle className="h-5 w-5 animate-spin"/> : "Send"}</Button>
           
        </form>
    </div>
  )
}

export default Feedback