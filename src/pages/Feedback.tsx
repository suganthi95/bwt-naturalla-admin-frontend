import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useAppContext } from "@/contexts/AuthContext";
import { sendFeedback } from "@/lib/apis";
import { initializeGA, trackpPageView } from "@/lib/google_analytics";
import { FeedbackFormType } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form"
import { Trans, useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";


function Feedback() {
    const location = useLocation();
    const { auth } = useAppContext();
    const {t} = useTranslation()
    useEffect(() => {
      initializeGA();
      trackpPageView(location.pathname,auth?.data?.email ?? '');
    }, []);
    const { register, watch, handleSubmit, control, reset, setValue } = useForm<FeedbackFormType>();
    const { mutate, isPending } = useMutation({
        mutationKey: [ "sendFeedback" ],
        mutationFn: sendFeedback,
        onSuccess: () => {
            toast.success(t('request_success'), { description: t('feedback_sent_successfully') });
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
    <div className="flex flex-col  overflow-y-scroll overflow-x-hidden  mb-5 sm:mb-0   flex-1 px-3">
            <h1 className="font-semibold mt-4 hidden md:block "><Trans i18nKey={'feedback'}/></h1>
        

        <form onSubmit={submit} className="mt-3     font-medium text-secondary space-y-5">
            
            <div className="space-y-1 w-[38rem] md:w-full">
                <label className="text-sm dark:text-slate-50" htmlFor="feedback_type"><Trans i18nKey={'feedback_type'}/></label>
                <Controller
                    name="feedbackType"
                    control={control}
                    render={({ field }) => (
                        <Select  required value={field.value} onValueChange={(val) => field.onChange(val)} >
                            <SelectTrigger id="feedback_type" className="w-1/2">
                                <SelectValue                     placeholder={t('please_select_feedback_type')}  />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Report a Bug"><Trans i18nKey={'report_a_bug'}/></SelectItem>
                                <SelectItem value="Request a Feature"><Trans i18nKey={'request_a_feature'}/></SelectItem>
                                <SelectItem value="Appreciation feedback"><Trans i18nKey={'appreciation_feedback'}/></SelectItem>
                            </SelectContent>
                        </Select>
                    )}  
                />
            </div>

            <div className="space-y-1 w-[38rem] md:w-full">
                <label className="text-sm dark:text-slate-50" htmlFor=""><Trans i18nKey={'message'}/></label>
                <Textarea 
                    required 
                    className="w-1/2" 
                    rows={5} 
                    placeholder={t('type_your_message_here')} 
                    {...register("message")}
                />
            </div>

            <div className="space-y-1 w-[38rem] md:w-full">
            <label className="text-sm dark:text-slate-50" htmlFor=""><Trans i18nKey={'upload_files'}/></label>
                <label htmlFor="dropzone-file" className="flex flex-col w-1/2 border-2 border-primary border-dashed rounded-lg cursor-pointer bg-primary/5 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-primary/10 dark:border-gray-600 dark:hover:border-gray-500">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                        </svg>
                        
                        {watch("file")?.[0]?.name ? <p className="mb-2 text-sm text-primary dark:text-gray-400">{watch("file")?.[0]?.name} <Trans i18nKey={'added'}/></p> : <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold"><Trans i18nKey={'click_to_upload_or_drag_and_drop'}/></span></p>}
                    </div>
                    <input id="dropzone-file" type="file" className="hidden" {...register("file")} />
                </label>
            </div>

            <Button className="bg-primary hover:bg-primary/50">{isPending ? <LoaderCircle className="h-5 w-5 animate-spin"/> : "Send"}</Button>
           
        </form>
    </div>
  )
}

export default Feedback