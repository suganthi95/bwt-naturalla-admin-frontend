import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import "react-quill/dist/quill.snow.css";
import { ChevronLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

import { useNavigate } from "react-router-dom";
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

const blogSchema = z.object({
  title: z.string().min(3),

  status: z.enum(["draft", "published"]),
  content: z.string().min(10),
});

type BlogFormValues = z.infer<typeof blogSchema>;

export default function EditLegalPage() {
  // const { auth } = useAppContext();
  const navigate = useNavigate();
  // const queryClient = useQueryClient();
  const [editorContent, setEditorContent] = useState("");
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);

  // const { mutate, isPending } = useMutation({
  //   mutationKey: ["createblog"],
  //   mutationFn: (args: { token: string; data: any }) =>
  //     createBlog(args.token, args.data),
  // });
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<BlogFormValues>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      status: "draft",
    },
  });

  const onSubmit = (data: BlogFormValues) => {
    const finalData = {
      ...data,
    };
    console.log(finalData);

    // mutate(
    //   {
    //     token: auth?.token ?? "",
    //     data: finalData,
    //   },
    //   {
    //     onSuccess() {
    //       toast.success("blog created successfully");
    //       queryClient.invalidateQueries({ queryKey: ["getblogs"] });
    //       navigate("/blogs");
    //     },
    //     onError(error) {
    //       if (axios.isAxiosError(error)) {
    //         toast.error(error?.response?.data?.message);
    //       }
    //     },
    //   }
    // );
  };

  return (
    <div className="flex flex-col p-4  gap-4 w-full h-screen  overflow-y-auto bg-slate-100">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div className="flex justify-between items-center">
          <div className="flex items-start gap-1 text-xl font-semibold">
            <button
              onClick={() => navigate("/blogs")}
              className="text-gray-700 mt-1 cursor-pointer hover:text-black transition-colors"
              aria-label="Back to Blogs"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div>
              <h1 className="text-xl font-semibold">Create Blog</h1>
              <p className="text-sm text-slate-500">
                Create content that drives traffic and sales.
              </p>
            </div>
          </div>
          <div className="flex justify-between gap-x-2  mt-4 ">
            <Dialog
              open={showPreviewDialog}
              onOpenChange={setShowPreviewDialog}
            >
              <DialogTrigger asChild>
                <Button
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
                  dangerouslySetInnerHTML={{ __html: editorContent }}
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
              <Button type="submit">
                {/* {showPublish && isPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Save Changes"
                )} */}
                save
              </Button>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-6 gap-x-6 ">
          <div className="bg-white  rounded-lg p-4 col-span-4 space-y-4">
            <div>
              <label className="block font-medium mb-1 text-sm">Title</label>
              <Input {...register("title")} placeholder="Enter blog title" />
              {errors.title && (
                <p className="text-red-500 text-sm">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="block font-medium mb-1 text-sm">Content</label>

              <TextEditor
                content={editorContent}
                handleChange={(value: any) => {
                  setEditorContent(value);
                  setValue("content", value);
                }}
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
              <Select
                onValueChange={(value) =>
                  setValue("status", value as "draft" | "published")
                }
                defaultValue="draft"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <ul className="space-y-2">
              <li className="text-[#232323] flex items-center gap-x-1 text-sm font-semibold">
                Publishing Options:{" "}
                <span className="text-[#808080] font-normal text-[15px]">
                  Dec 15, 2024{" "}
                </span>
              </li>
              <li className="text-[#232323] flex items-center gap-x-1 text-sm font-semibold">
                Updated By :{" "}
                <span className="text-[#808080] text-[15px] font-normal">
                  Dec 15, 2024{" "}
                </span>
              </li>
              <li className="text-[#232323] flex items-center gap-x-1 text-sm font-semibold">
                Word Count :{" "}
                <span className="text-[#808080] font-normal text-[15px]">
                  Dec 15, 2024{" "}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </form>
    </div>
  );
}
