import { Edit, Trash2 } from "lucide-react";
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

import PromotionForm from "./PromotionForm";

export default function PromotionalOffer() {
  // const [isOpen, setIsopen] = useState(false);
  // const { auth } = useAppContext();
  // const queryClient = useQueryClient();

  //   const { data, isLoading, isSuccess, isError, error } = useQuery({
  //     queryKey: [ "getAllBanners" ],
  //     queryFn: () => getAllBanners(auth?.token as string),
  //     retry: 2,
  //     select: (data): BannersType[] => data.data.banners
  //   });

  //   const { mutate } = useMutation({
  //     mutationKey: [ "deleteBanners" ],
  //     mutationFn: deleteBanner,
  //     onSuccess: () => {
  //       queryClient.invalidateQueries({ queryKey: [ "getAllBanners" ] })
  //       return toast.success("Request Success", {
  //         description: "Banner deleted successfully"
  //       })
  //     },
  //     onError: (error: AxiosError<any>) => {
  //       return toast.error("Request Success", {
  //         description: error.response?.data.message
  //       })
  //     },
  //   })

  const isLoading = false;
  const isError = false;
  const isSuccess = true;
  let content;

  if (isLoading) {
    content = <div className="mt-[10%] text-center">Loading...</div>;
  }

  if (isError) {
    content = (
      <div className="mt-[10%] text-center">{/* {error.message} */}</div>
    );
  }

  if (isSuccess) {
    content = (
      <ul className="space-y-4 mt-3">
        {/* {data.map((item, idx) => (
          <li
            key={idx}
            className="flex items-center justify-between border border-gray-200 rounded-lg p-4 bg-white shadow-sm"
          >
            <img
              src={item.image_urls[0]}
              alt={item.name}
              className="w-20 h-20 object-cover rounded-md"
            />

            <div className="flex-1 px-4 space-y-1.5">
              <h3 className="text font-semibold text-gray-900">{item.name}</h3>
              <div className="flex items-center gap-x-2">
                <span
                  className={`inline-block mt-2 text-xs font-medium px-2 py-0.5 bg-[#EEEFF2] text-primary-black rounded-full `}
                >
                  {item.type}
                </span>
                {item.published &&
                  <span
                    className={`inline-block mt-2 text-xs font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-700`}
                  >
                    Published
                  </span>
                }
                
              </div>
            </div>

            <div className="flex items-center gap-4">
              

              <BannerForm 
                type="edit" 
                defaultData={{ 
                  id: item.banner_id, 
                  title: item.name, 
                  type: item.type, 
                  ctaLink: item.cta_link, 
                  bannerImage: item.image_urls[0],
                  bannerImageId: item.banner_image_id[0],
                  publish: item.published
                }}
              />

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
                      This will permanently delete and remove the banner from the servers
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <DialogClose asChild>
                      <Button
                        variant="destructive"
                        onClick={() => mutate({ token: auth?.token as string, id: item.banner_id })}
                      >
                        Delete
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </li>
        ))} */}
        <li
          key={"1"}
          className="flex items-center justify-between border border-gray-200 rounded-lg p-4 bg-white shadow-sm"
        >
          <div className="flex-1 px-4 space-y-1.5">
            <h3 className="text font-semibold text-gray-900">{"Promotion 1"}</h3>
            <div className="flex gap-x-3">

            <div className="flex items-center w-full gap-x-2 bg-[#FAFAFA] border border-[#EEF1F6] text-sm text-primary-black rounded p-2 px-4 ">
              <span
                className={`inline-block  font-medium  `}
              >
                {"Flat 30% Off on Selected Products | Use Code : DEAL30"}
              </span>
            
            </div>
          <div className="flex items-center gap-4">
            <Dialog>
              <DialogTrigger>
                <Button
                  size="icon"
                  className="h-8 w-8 rounded-full text-[#34C759] bg-[#34C759]/10 hover:bg-[#34C7591A]/20"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <PromotionForm type="edit" PromotionTitle="" initialValue="" />
              </DialogContent>
            </Dialog>

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
                    This will permanently delete and remove the banner from the
                    servers
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button
                      variant="destructive"
                      // onClick={() => mutate({ token: auth?.token as string, id: item.banner_id })}
                    >
                      Delete
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
            </div>
          </div>

        </li>
      </ul>
    );
  }

  return (
    <div className="bg-white p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Promotional Offer</h1>
          <p className="text-[15px] text-[#4B5563]">
            Manage offer displayed on the header of home page
          </p>
        </div>
        <PromotionForm type="add" PromotionTitle="" initialValue="" />
      </div>
      {content}
    </div>
  );
}
