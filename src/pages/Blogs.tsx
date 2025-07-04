import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppContext } from "@/contexts/AuthContext";
import { deleteBlog, getBlogs } from "@/lib/apis";
import { Blog } from "@/types/type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Edit, Eye, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Blogs() {
  const { auth } = useAppContext();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedPriority, setPriority] = useState<string>("");
  const [selectedFormat, setFormat] = useState<string>("new");
  const queryClient = useQueryClient();
  const { mutate: DeleteBlog } = useMutation({
    mutationKey: ["deleteblog"],
    mutationFn: (args: { token: string; id: string }) =>
      deleteBlog(args.token, args.id),
  });
  const { data: blogs } = useQuery({
    queryKey: ["getblogs"],
    queryFn: () => getBlogs(auth?.token ?? ""),
    staleTime: 1000 * 60 * 5,
    retry: 1,
    select: (data) => data?.data?.data,
  });
  const [filtered, setFiltered] = useState<Blog[]>(blogs ?? []);

  useEffect(() => {
    const searchValue = searchTerm.trim().toLowerCase();

    let filteredData = blogs?.filter((blog: Blog) => {
      const matchesSearch = blog.blog_title.toLowerCase().includes(searchValue);
      const matchesPriority =
        selectedPriority === "all" || selectedPriority === ""
          ? true
          : blog.blog_status === selectedPriority;

     

      return matchesSearch && matchesPriority;
    });
    if (selectedFormat === "new") {
      filteredData = filteredData?.sort(
        (a: any, b: any) =>
          new Date(b.created_time).getTime() -
          new Date(a.created_time).getTime()
      );
    } else if (selectedFormat === "old") {
      filteredData = filteredData?.sort(
        (a: any, b: any) =>
          new Date(a.created_time).getTime() -
          new Date(b.created_time).getTime()
      );
    }

    setFiltered(filteredData);
  }, [searchTerm, selectedPriority, selectedFormat, blogs]);

  return (
    <div className="flex flex-col p-4 gap-3 md:p-4 w-full h-screen overflow-y-scroll md:pb-20 bg-slate-100">
      <div>
        <h1 className="text-xl font-semibold">Blogs</h1>
        <p className="text-xs text-slate-400">Manage all your website blogs </p>
      </div>
      <div className="p-4 bg-white">
        <div className="flex  justify-between mb-4">
          <h2 className="font-bold text-xl  mb-4">Blogs List</h2>
          <Button onClick={() => navigate("/blogs/create")}>
            Create a New Post
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="relative w-full lg:max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by Title..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="pl-10 pr-4 py-2"
            />
          </div>

          <div className="">
            <Select
              value={selectedPriority}
              onValueChange={(value) => setPriority(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="">
            <Select
              value={selectedFormat}
              onValueChange={(value) => setFormat(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select " />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">Newest First</SelectItem>
                <SelectItem value="old">Oldest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <ul className="grid grid-cols-1 mt-6 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered?.map((blog: Blog) => (
            <li
              key={blog?.blog_id}
              className="border rounded-xl overflow-hidden shadow-sm bg-white flex flex-col"
            >
              <img
                src={blog?.blog_image_url}
                alt={blog?.blog_title}
                className="w-full h-48 object-cover"
              />

              <div className="flex items-center justify-between text-sm text-primary-black px-4 pt-4">
                <p className="flex items-center gap-x-1">
                  <span
                    className={`
                      inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize 
                      ${
                        blog?.blog_status === "published"
                          ? "bg-green-100 text-green-700"
                          : blog?.blog_status === "draft"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-700"
                      }
                    `}
                  >
                    {blog?.blog_status}
                  </span>
                  {blog?.created_time}{" "}
                </p>
                {/* <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {blog.readTime} read
                </span> */}
              </div>

              <h2 className="text-lg font-semibold px-4 pt-2">
                {blog?.blog_title}
              </h2>

              <p className="text-sm text-gray-600 px-4 pt-1 line-clamp-4">
                {blog?.blog_desc}
              </p>

              <div className="flex items-center justify-between px-4 py-3 mt-auto">
                <div className="flex gap-2 flex-wrap">
                  {blog?.blog_tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-slate-100 text-primary-black px-2 py-0.5 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex flex-row items-center gap-1.5">
                  <Button
                    size="icon"
                    onClick={() =>
                      window.open(
                        `https://stagingnaturalla.netlify.app/blogs/detail/${blog.blog_id}`,
                        "_blank"
                      )
                    }
                    className="h-8 w-8 rounded-full text-slate-800 bg-slate-800/10 hover:bg-slate-800/20"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>

                  <Button
                    onClick={() => {
                      // sessionStorage.setItem("blog-id", blog.blog_id);
                      navigate("/blogs/edit", { state: { blog: blog } });
                    }}
                    size="icon"
                    className="h-8 w-8 rounded-full text-[#34C759] bg-[#34C759]/10 hover:bg-[#34C7591A]/20"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="icon"
                        className="h-8 w-8 rounded-full text-red-400 bg-red-400/10 hover:bg-red-400/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Are you absolutely sure?</DialogTitle>
                        <DialogDescription>
                          This will permanently delete and remove your blog from
                          the servers.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <DialogClose asChild>
                          <Button
                            onClick={() =>
                              DeleteBlog(
                                {
                                  token: auth?.token ?? "",
                                  id: String(blog.blog_id),
                                },
                                {
                                  onSuccess: () => {
                                    toast.success("blog deleted");
                                    queryClient.invalidateQueries({
                                      queryKey: ["getblogs"],
                                    });
                                  },
                                  onError: (error) => {
                                    if (axios.isAxiosError(error)) {
                                      toast.error(
                                        error?.response?.data?.message
                                      );
                                    }
                                  },
                                }
                              )
                            }
                            variant="destructive"
                          >
                            Delete
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
