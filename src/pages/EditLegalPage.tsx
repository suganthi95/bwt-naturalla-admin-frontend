import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import "react-quill/dist/quill.snow.css";
import { ChevronLeft, LoaderCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

import { useNavigate, useParams } from "react-router-dom";
import TextEditor from "@/components/ui/TextEditor";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getLegalPage, updateLegalPage } from "@/lib/apis";
import { useAppContext } from "@/contexts/AuthContext";
import { AxiosError } from "axios";
import { toast } from "sonner";
import dayjs from "dayjs";

const blogSchema = z.object({
  title: z.string().min(3),
  status: z.enum(["draft", "published"]),
  content: z.string().min(10),
});

type BlogFormValues = z.infer<typeof blogSchema>;

export default function EditLegalPage() {

  const navigate = useNavigate();
  const { auth } = useAppContext();
  const { id } = useParams();
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);

  const { data } = useQuery({
    queryKey: [ "getLegalPage", id ],
    queryFn: () => getLegalPage({ token: auth?.token as string, id: id as string }),
    enabled: Boolean(id),
    select: (data) => data.data.data[0]
  });

  console.log(data)

  const { mutate, isPending } = useMutation({
    mutationKey: [ "updateLegalPage" ],
    mutationFn: updateLegalPage,
    onSuccess: () => {
      toast.success("Request Success", { description: "Legal Page updated successfully" })
      navigate(-1)
    },
    onError: (error: AxiosError<any>) => {
      toast.error("Request Failed", { description: error.response?.data.message })
    }
  })


  const { register, handleSubmit, watch, reset, control, formState: { errors } } = useForm<BlogFormValues>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      status: "draft",
      content: "",
      title: ""
    },
  });

  const onSubmit = (data: BlogFormValues) => {
    const finalData = {
      ...data,
      id: id,
      token: auth?.token
    };

    mutate(finalData)
    
  };

  useEffect(() => {

    if(data){
      reset({
        title: data.page_title,
        content: data.page_content,
        status: data.status
      })
    }

  }, [ data ])

  return (
    <div className="flex flex-col p-4  gap-4 w-full h-screen  overflow-y-auto bg-slate-100">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div className="flex justify-between items-center">
          <div className="flex items-start gap-1 text-xl font-semibold">
            <button
              onClick={() => navigate(-1)}
              className="text-gray-700 mt-1 cursor-pointer hover:text-black transition-colors"
              aria-label="Back to Blogs"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div>
              <h1 className="text-xl font-semibold">Edit Legal Page</h1>
            </div>
          </div>
          <div className="flex justify-between gap-x-2  mt-4 ">
            <Dialog
              open={showPreviewDialog}
              onOpenChange={setShowPreviewDialog}
            >
              <DialogTrigger asChild>
                <Button
                  disabled={isPending}
                  type="button"
                  variant="outline"
                  className="border-slate-400  text-slate-500"
                >
                  Preview
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Blog Preview</DialogTitle>
                  <DialogDescription>
                    This is how your blog content will appear.
                  </DialogDescription>
                </DialogHeader>
                <div
                  className="prose max-w-full bg-white p-4 rounded-md border overflow-y-auto max-h-[500px]"
                  dangerouslySetInnerHTML={{ __html: watch("content") }}
                />
                <DialogFooter>
                  <Button
                    onClick={() => setShowPreviewDialog(false)}
                    variant="secondary"
                  >
                    Close
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <div className="space-x-3">
              <Button disabled={isPending} type="submit">
                {isPending ? <LoaderCircle className="h-5 w-5 animate-spin"/> : "Save"}
              </Button>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-6 gap-x-6 ">
          <div className="bg-white  rounded-lg p-4 col-span-4 space-y-4">
            <div>
              <label className="block font-medium mb-1 text-sm">Title</label>
              <Input disabled {...register("title")} placeholder="Enter blog title" />
              {errors.title && (
                <p className="text-red-500 text-sm">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="block font-medium mb-1 text-sm">Content</label>

              <Controller
                name="content"
                control={control}
                render={({ field }) => (
                  <TextEditor
                    content={field.value}
                    handleChange={field.onChange}
                  />
                )}
              />
              {errors.content && (
                <p className="text-red-500 text-sm">{errors.content.message}</p>
              )}
            </div>
          </div>
          <div className="  space-y-4 col-span-2 gap-x-4 bg-white p-4">
            <h1 className="text-primary-black text-xl font-semibold">
              Publishing Options
            </h1>
            <div>
              <label className="block font-medium mb-2 text-sm">Status</label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                )}  
              />
            </div>
            <ul className="space-y-2">
              <li className="text-[#232323] flex items-center gap-x-1 text-sm font-semibold">
                Publishing date:{" "}
                <span className="text-[#808080] font-normal text-[15px]">
                  {dayjs(data?.updated_at).format("DD-MM-YYYY, h:mm A")}
                </span>
              </li>
              <li className="text-[#232323] flex items-center gap-x-1 text-sm font-semibold">
                Updated By :{" "}
                <span className="text-[#808080] text-[15px] font-normal">
                  {data?.first_name} {data?.last_name}
                </span>
              </li>
              {/* <li className="text-[#232323] flex items-center gap-x-1 text-sm font-semibold">
                Word Count :{" "}
                <span className="text-[#808080] font-normal text-[15px]">
                  Dec 15, 2024{" "}
                </span>
              </li> */}
            </ul>
          </div>
        </div>
      </form>
    </div>
  );
}
