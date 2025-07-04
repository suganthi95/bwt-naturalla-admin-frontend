import { Edit, Eye, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useNavigate } from "react-router-dom";
const data = [
  {
    image: "https://via.placeholder.com/80",
    title: "Herbal Shampoo",
    lead: "Deep cleanses and nourishes hair naturally.",
    status: "active",
    type: "website ",
  },
  {
    image: "https://via.placeholder.com/80",
    title: "Aloe Vera Soap",
    lead: "Gentle on skin with herbal extracts.",
    status: "inactive",
    type: "mobile app",
  },
];

export default function Banners() {
  const navigate = useNavigate();
  return (
    <div className="bg-white p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Settings</h1>
          <p className="text-[15px] text-[#4B5563]">
            Manage website and app banners displayed on the home page{" "}
          </p>
        </div>
        <Button>Add Banner</Button>
      </div>
      <ul className="space-y-4 mt-3">
        {data.map((item, idx) => (
          <li
            key={idx}
            className="flex items-center justify-between border border-gray-200 rounded-lg p-4 bg-white shadow-sm"
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-20 h-20 object-cover rounded-md"
            />

            <div className="flex-1 px-4 space-y-1.5">
              <h3 className="text font-semibold text-gray-900">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.lead}</p>
              <div className="flex items-center gap-x-2">
                <span
                  className={`inline-block mt-2 text-xs font-medium px-2 py-0.5 bg-[#EEEFF2] text-primary-black rounded-full `}
                >
                  {item.type}
                </span>
                <span
                  className={`inline-block mt-2 text-xs font-medium px-2 py-0.5 rounded-full ${
                    item.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-[#FEE2E2] text-[#991F27]"
                  }`}
                >
                  {item.status}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button
                onClick={() => {
                  // sessionStorage.setItem("blog-id", blog.blog_id);
                  navigate("/blogs/edit", { state: { banner: "" } });
                }}
                size="icon"
                className="h-8 w-8 rounded-full text-[#34C759] bg-[#34C759]/10 hover:bg-[#34C7591A]/20"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                onClick={() =>
                  window.open(
                    `https://stagingnaturalla.netlify.app/blogs/detail/${""}`,
                    "_blank"
                  )
                }
                className="h-8 w-8 rounded-full text-slate-800 bg-slate-800/10 hover:bg-slate-800/20"
              >
                <Eye className="h-4 w-4" />
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
                      This will permanently delete and remove your blog from the
                      servers.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <DialogClose asChild>
                      <Button
                        // onClick={() =>
                        //   DeleteBlog(
                        //     {
                        //       token: auth?.token ?? "",
                        //       id: String(blog.blog_id),
                        //     },
                        //     {
                        //       onSuccess: () => {
                        //         toast.success("blog deleted");
                        //         queryClient.invalidateQueries({
                        //           queryKey: ["getblogs"],
                        //         });
                        //       },
                        //       onError: (error) => {
                        //         if (axios.isAxiosError(error)) {
                        //           toast.error(error?.response?.data?.message);
                        //         }
                        //       },
                        //     }
                        //   )
                        // }
                        variant="destructive"
                      >
                        Delete
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
