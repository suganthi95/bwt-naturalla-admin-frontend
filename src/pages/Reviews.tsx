import ReviewCard from "@/components/reviews/ReviewCard";
import Loader from "@/components/ui/Loader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppContext } from "@/contexts/AuthContext";
import { getReviews } from "@/lib/apis";
import {
  BusinessList,
  ReviewType,
  ValidateUserType,
  WorkspaceList,
} from "@/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useLocation } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import { AxiosResponse } from "axios";
import { initializeGA, trackpPageView } from "@/lib/google_analytics";

function Reviews() {
  const location = useLocation();
  const user = localStorage.getItem("auth");
  const parsedUser = user ? JSON.parse(user) : null;
  const Mail = parsedUser?.data?.email;
  useEffect(() => {
    initializeGA();
    trackpPageView(location.pathname, Mail);
  }, []);
  const { auth } = useAppContext();
  const [sortKey, setSortKey] = useState<string>("");
  const queryClient = useQueryClient();
  const validateUser = queryClient.getQueryData<
    AxiosResponse<{ data: ValidateUserType }>
  >(["validateUser"]);
  const [activeWorkspace] = validateUser?.data?.data?.workspaceList.filter(
    (item) => item.workspace_id === validateUser?.data?.data?.active_workspace
  ) as WorkspaceList[];
  const [activeBusiness] = validateUser?.data?.data?.businessList.filter(
    (item) => item.place_id === activeWorkspace.active_business
  ) as BusinessList[];

  const [actualData, setActualData] = useState<ReviewType[]>([]);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [page, setPage] = useState(1);

  useEffect(() => {
    queryClient.cancelQueries({ queryKey: ["getReviews"] });
    setPage(1);
    setActualData([]);
  }, [sortKey]);

  const { isLoading, isError, isSuccess, data, error, isRefetching, refetch } =
    useQuery({
      queryKey: ["getReviews", sortKey, activeBusiness?.place_id],
      queryFn: ({ signal }) =>
        getReviews({
          placeId: activeBusiness?.place_id,
          sort: sortKey,
          page:page,
          token: auth?.token as string,
          signal,
        }),
      retry: 3,
      gcTime: 0,
      staleTime: 0,
      refetchOnWindowFocus: false,
      refetchInterval: false,
      refetchOnReconnect: false,
      enabled: Boolean(activeBusiness?.place_id),
    });

  useEffect(() => {
    if (Array.isArray(data?.data?.data)) {
      setActualData((prev) => [...prev, ...data?.data?.data]);
    }
  }, [data?.data?.data]);

  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 10;

  const totalPages = data ? Math.ceil(actualData?.length / reviewsPerPage) : 0;
  const paginatedReviews = actualData
    ? actualData?.slice(
        (currentPage - 1) * reviewsPerPage,
        currentPage * reviewsPerPage
      )
    : [];

  // Handle page change safely
  const onPageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  if (!activeBusiness) {
    return (
      <div className="flex flex-col items-center justify-center p-2 flex-1 overflow-hidden">
        <h1 className="text-xl font-semibold">No Business added</h1>
        <p className="text-slate-300">Search or Add your business account</p>
      </div>
    );
  }

  let content;

  if (isLoading && !isRefetching) {
    content = (
      <div className="flex flex-col items-center justify-center  gap-2 ">
        <Loader />
        <h1 className="font-semibold text-secondary text-xl">
          Loading more reviews
        </h1>
        <p className="text-sm text-slate-400">
          We're fetching more reviews for you
        </p>
      </div>
    );
  }

  if (isError) {
    content = (
      <p className="mt-[10%] mx-auto text-center text-secondary font-bold">
        {error?.message}
      </p>
    );
  }

  if (isSuccess && actualData?.length === 0) {
    switch (sortKey) {
      case "5":
        content = (
          <p className="mt-[10%] mx-auto text-center text-secondary font-bold">
            No excellent reviews found.
          </p>
        );
        break;
      case "4":
        content = (
          <p className="mt-[10%] mx-auto text-center text-secondary font-bold">
            No good reviews found.
          </p>
        );
        break;
      case "3":
        content = (
          <p className="mt-[10%] mx-auto text-center text-secondary font-bold">
            No average reviews found.
          </p>
        );
        break;
      case "2":
        content = (
          <p className="mt-[10%] mx-auto text-center text-secondary font-bold">
            No below average reviews found.
          </p>
        );
        break;
      case "1":
        content = (
          <p className="mt-[10%] mx-auto text-center text-secondary font-bold">
            No poor reviews found.
          </p>
        );
        break;

      default:
        break;
    }
  }

  if (isSuccess && actualData.length > 0) {
    content = paginatedReviews?.map((item: ReviewType) => (
      <Link
        to="/reviews/generate-response"
        key={item.review_id}
        state={{ placeId: activeBusiness.place_id, reviewId: item.review_id }}
      >
        <ReviewCard {...item} />
      </Link>
    ));
  }

  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight;
      const clientHeight = container.clientHeight;
      setIsAtBottom(scrollTop + clientHeight >= scrollHeight - 5); 
    }
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  useEffect(() => {
    if (isAtBottom) {
      queryClient.cancelQueries({ queryKey: ["getReviews"] });
      setPage((prev) => prev + 1);
      refetch();
    }
  }, [isAtBottom]);
  const sortLabels: Record<string, string> = {
    "5": "Excellent",
    "4": "Good",
    "3": "Average",
    "2": "Below Average",
    "1": "Poor",
  };
  return (
    <div className="p-2 pb-20 flex flex-col flex-1 overflow-hidden">
      <div className="flex flex-row items-center justify-between py-1">
        <h1 className="font-semibold">Reviews</h1>

        <Select value={sortKey} onValueChange={(value) => setSortKey(value)}>
          <SelectTrigger className="w-[100px] h-8">
            <SelectValue placeholder="Sort by " className="">
              {sortKey ? sortLabels[sortKey] : "Sort"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">Excellent</SelectItem>
            <SelectItem value="4">Good</SelectItem>
            <SelectItem value="3">Average</SelectItem>
            <SelectItem value="2"> Below Average</SelectItem>
            <SelectItem value="1"> Poor</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="py-3  overflow-x-hidden h-full">{content}</div>
      <div className="fixed bottom-2 right-28   md:left-36 lg:right-0">
        <p className="text-center text-sm  text-secondary">
          {isAtBottom && data?.data?.total > 0
            ? "fetching more reviews..."
            : isAtBottom && data?.data?.total === 0
            ? "we've reached the end"
            : ""}
        </p>
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 py-4">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-md bg-[#0f344e] text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-dark transition-colors duration-200"
            aria-label="Previous page"
          >
            Previous
          </button>

          {[...Array(totalPages)].map((_, idx) => {
            const page = idx + 1;
            const isActive = page === currentPage;
            return (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`px-4 py-2 rounded-md font-semibold transition-colors duration-200
            ${
              isActive
                ? "bg-[#0f344e] text-white shadow-lg"
                : "bg-[#0f344e]/20 text-[#0f344e] hover:bg-[#0f344e]/40"
            }`}
                aria-current={isActive ? "page" : undefined}
                aria-label={`Page ${page}`}
              >
                {page}
              </button>
            );
          })}

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-md bg-[#0f344e] text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-dark transition-colors duration-200"
            aria-label="Next page"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default Reviews;
