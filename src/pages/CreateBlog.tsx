import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { ChevronLeft, Loader2, UploadCloud, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBlog } from "@/lib/apis";
import { useAppContext } from "@/contexts/AuthContext";
import { toast } from "sonner";
import axios from "axios";

const blogSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  tags: z.array(z.string()).optional(),
  status: z.enum(["draft", "published"]),
  content: z.string().min(10),
});

type BlogFormValues = z.infer<typeof blogSchema>;

export default function CreateBlog() {
  const { auth } = useAppContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [editorContent, setEditorContent] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [showPublish, setPublish] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { mutate, isPending } = useMutation({
    mutationKey: ["createblog"],
    mutationFn: (args: { token: string; data: any }) =>
      createBlog(args.token, args.data),
  });
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

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setThumbnail(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnail(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const removeThumbnail = () => {
    setThumbnail(null);
    setPreview(null);
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
        setTagInput("");
      }
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const onSubmit = (data: BlogFormValues) => {
    const finalData = {
      ...data,
      tags,
      showPublish,
      thumbnail,
    };
    mutate(
      {
        token: auth?.token ?? "",
        data: finalData,
      },
      {
        onSuccess() {
          toast.success("blog created successfully");
          queryClient.invalidateQueries({ queryKey: ["getblogs"] });
          navigate("/blogs");
        },
        onError(error) {
          if (axios.isAxiosError(error)) {
            toast.error(error?.response?.data?.message);
          }
        },
      }
    );
  };

  return (
    <div className="flex flex-col p-4  gap-4 w-full  overflow-y-auto bg-slate-100">
    

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-3"
      >
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
          <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
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
         
            <Button type="submit" onClick={() => setPublish(true)}>
              {showPublish && isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </div>
        </div>
      <div className="bg-white p-4 space-y-4">
        <div>
          <label className="block font-medium mb-1 text-sm">Title</label>
          <Input {...register("title")} placeholder="Enter blog title" />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title.message}</p>
          )}
        </div>
        <div>
          <label className="block font-medium mb-1 text-sm">Description</label>
          <Textarea
            {...register("description")}
            placeholder="Short description"
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description.message}</p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-x-4">
          <div>
            <label className="block font-medium mb-1 text-sm">Tags</label>
            <Input
              placeholder="Type tag and press Enter"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="px-2 py-1 rounded-lg text-sm flex items-center gap-1"
                >
                  {tag}
                  <X
                    className="w-4 h-4 cursor-pointer ml-1"
                    onClick={() => removeTag(tag)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-medium mb-1 text-sm">Status</label>
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
        </div>

        <div>
          <label className="block font-medium text-sm mb-1 text-slate-700">
            Thumbnail
          </label>

          {!preview ? (
            <div
              className="relative border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center text-center bg-white transition hover:bg-slate-50 cursor-pointer"
              onClick={handleClick}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <UploadCloud className="w-10 h-10 text-slate-400 mb-2" />
              <p className="text-sm text-slate-500">
                <span className="font-medium text-slate-600">
                  Click to upload
                </span>{" "}
                or drag and drop
              </p>
              <Input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleThumbnailChange}
                className="hidden"
              />
            </div>
          ) : (
            <div className="relative mt-2 w-full   group">
              <img
                src={preview}
                alt="Thumbnail Preview"
                className="rounded-md w-full  object-cover border border-slate-200 shadow-sm"
              />
              <button
                type="button"
                onClick={removeThumbnail}
                className="absolute top-2 right-2 bg-white text-red-500 hover:text-red-600 hover:bg-red-100 p-1 rounded-full shadow transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
        <div>
          <label className="block font-medium mb-1 text-sm">Content</label>
          <ReactQuill
            value={editorContent}
            onChange={(value) => {
              setEditorContent(value);
              setValue("content", value);
            }}
            theme="snow"
            className="bg-white rounded-md "
          />
          {errors.content && (
            <p className="text-red-500 text-sm">{errors.content.message}</p>
          )}
        </div>

      </div>
       
      </form>
    </div>
  );
}
