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
import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { initializeGA, trackpPageView } from "@/lib/google_analytics";
import { Trans, useTranslation } from "react-i18next";
import { ASSETS } from "@/assets/assets";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { SearchBox } from "@/components/ui/SearchBox";

function Reviews() {
  const location = useLocation();
  const { t } = useTranslation();
  const user = localStorage.getItem("auth");
  const parsedUser = user ? JSON.parse(user) : null;
  const Mail = parsedUser?.data?.email;
  const [IsOpen, setIsOpen] = useState(false);
  const [businessLoading, setBusinessLoading] = useState(false);

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

  const [page, setPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const { isLoading, isError, isSuccess, data, error, isRefetching } = useQuery(
    {
      queryKey: ["getReviews", sortKey, activeBusiness?.place_id, page],
      queryFn: ({ signal }) =>
        getReviews({
          placeId: activeBusiness?.place_id,
          sort: sortKey,
          page: page,
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
    }
  );
  useEffect(() => {
    setCurrentPage(1);
  }, [sortKey]);
  const messages = [
    <p className="text-slate-500 text-center" key={0}>
      <span className="text-primary">
        <Trans i18nKey="tip" />:{" "}
      </span>
      <Trans i18nKey="messages.0" />
    </p>,
    <p className="text-slate-500 text-center" key={1}>
      <span className="text-primary">
        <Trans i18nKey="pro_tip" />:{" "}
      </span>
      <Trans i18nKey="messages.1" />
    </p>,
    <p className="text-slate-500 text-center" key={2}>
      <span className="text-primary">
        <Trans i18nKey="quick_tip" />:{" "}
      </span>
      <Trans i18nKey="messages.2" />
    </p>,
    <p className="text-slate-500 text-center" key={3}>
      <span className="text-primary">
        <Trans i18nKey="tip" />:{" "}
      </span>
      <Trans i18nKey="messages.3" />
    </p>,
    <p className="text-slate-500 text-center" key={4}>
      <span className="text-primary">
        <Trans i18nKey="pro_tip" />:{" "}
      </span>
      <Trans i18nKey="messages.4" />
    </p>,
    <p className="text-slate-500 text-center" key={5}>
      <span className="text-primary">
        <Trans i18nKey="quick_tip" />:{" "}
      </span>
      <Trans i18nKey="messages.5" />
    </p>,
    <p className="text-slate-500 text-center" key={6}>
      <span className="text-primary">
        <Trans i18nKey="did_you_know" />:{" "}
      </span>
      <Trans i18nKey="messages.6" />
    </p>,
    <p className="text-slate-500 text-center" key={7}>
      <span className="text-primary">
        <Trans i18nKey="pro_tip" />:{" "}
      </span>
      <Trans i18nKey="messages.7" />
    </p>,
  ];

  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 15000); // Change every 15 seconds

    return () => clearInterval(interval);
  }, []);

  // const reviewsPerPage = 10;
  // const totalPages = data?.data?.total
  //   ? Math.ceil(data.data.total / reviewsPerPage)
  //   : 0;
  // review_count
  const totalPages = Math.round(Number(data?.data?.review_count) / 10);

  function getPaginationPages(
    currentPage: number,
    totalPages: number
  ): (number | string)[] {
    currentPage = Math.max(1, Math.min(currentPage, totalPages)); // Clamp
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    pages.push(1);

    let start = Math.max(2, currentPage - 1);
    let end = Math.min(totalPages - 1, currentPage + 1);

    if (currentPage <= 3) {
      start = 2;
      end = 4;
    }

    if (currentPage >= totalPages - 2) {
      start = totalPages - 3;
      end = totalPages - 1;
    }

    start = Math.max(2, start);
    end = Math.min(totalPages - 1, end);

    if (start > 2) pages.push("...");

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages - 1) pages.push("...");

    pages.push(totalPages);

    return pages;
  }

  const onPageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    setPage(newPage);
  };
  if (businessLoading) {
    return (
      <div className="h-screen flex items-center justify-center flex-col gap-3 w-full fixed top-0 left-0 z-[50] bg-transparent backdrop-brightness-[0.3]">
        <div>
          <Loader />
        </div>
        {messages[currentMessageIndex]}
      </div>
    );
  }

  if (!activeBusiness) {
    return (
      // <div className="flex flex-col items-center justify-center p-2 flex-1 overflow-hidden">
      //   <h1 className="text-xl font-semibold"><Trans i18nKey={'no_business_added'}/></h1>
      //   <p className="text-slate-300"><Trans i18nKey={'search_or_add_business'}/></p>
      // </div>
      <section className="container mx-auto mt-10 grid place-items-center">
        <div className="flex flex-col gap-y-1 items-center justify-center text-[#323232]">
          <img
            src={ASSETS.NO_REVIEWS}
            className="md:w-5/12"
            alt="No-Business"
          />
          <h2 className="font-bold text-xl md:text-2xl ">
            <Trans i18nKey={"getting_started"} />
          </h2>
          <p className="font-medium text-center text-xs md:text-sm text-[#323232]/50">
            <Trans i18nKey={"no_feedback_yet"} />
          </p>
          <p className="font-medium  text-center  text-xs md:text-sm text-[#323232]/50">
            <Trans i18nKey={"see_feedback_when_available"} />
          </p>
          <Button
            onClick={() => setIsOpen(true)}
            className="bg-primary mt-3 md:p-3 md:px-6 rounded-lg hover:bg-primary"
          >
            <Trans i18nKey={"add_business"} />
          </Button>
        </div>
        <Dialog open={IsOpen} onOpenChange={setIsOpen}>
          <DialogContent className="!w-full  max-w-fit">
            <SearchBox onClose={setIsOpen} isWaiting={setBusinessLoading} />
          </DialogContent>
        </Dialog>
      </section>
    );
  }

  let content;

  if (isLoading && !isRefetching) {
    content = (
      <div className="flex flex-col items-center justify-center  gap-2 ">
        <Loader />
        <h1 className="font-semibold text-secondary text-xl">
          <Trans i18nKey={"loading_more_reviews"} />
        </h1>
        <p className="text-sm text-slate-400">
          <Trans i18nKey={"fetching_reviews"} />
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

  if (isSuccess && data?.data?.data?.length?.length === 0) {
    switch (sortKey) {
      case "5":
        content = (
          <section className="container mx-auto mt-10 grid place-items-center">
            <div className="flex flex-col gap-y-1 items-center justify-center text-[#323232]">
              <img
                src={ASSETS.NO_REVIEWS}
                className="md:w-5/12"
                alt="No-Business"
              />
              <p className="mt-[10%] mx-auto text-center text-secondary font-bold">
                <Trans i18nKey={"no_excellent_reviews"} />
              </p>
            </div>
          </section>
        );
        break;
      case "4":
        content = (
          <section className="container mx-auto mt-10 grid place-items-center">
            <div className="flex flex-col gap-y-1 items-center justify-center text-[#323232]">
              <img
                src={ASSETS.NO_REVIEWS}
                className="md:w-5/12"
                alt="No-Business"
              />
              <p className="mt-[10%] mx-auto text-center text-secondary font-bold">
                <Trans i18nKey={"no_good_reviews"} />
              </p>
            </div>
          </section>
        );
        break;
      case "3":
        content = (
          <section className="container mx-auto mt-10 grid place-items-center">
            <div className="flex flex-col gap-y-1 items-center justify-center text-[#323232]">
              <img
                src={ASSETS.NO_REVIEWS}
                className="md:w-5/12"
                alt="No-Business"
              />
              <p className="mt-[10%] mx-auto text-center text-secondary font-bold">
                <Trans i18nKey={"no_average_reviews"} />
              </p>
            </div>
          </section>
        );
        break;
      case "2":
        content = (
          <section className="container mx-auto mt-10 grid place-items-center">
            <div className="flex flex-col gap-y-1 items-center justify-center text-[#323232]">
              <img
                src={ASSETS.NO_REVIEWS}
                className="md:w-5/12"
                alt="No-Business"
              />
              <p className="mt-[10%] mx-auto text-center text-secondary font-bold">
                <Trans i18nKey={"no_below_average_reviews"} />
              </p>
            </div>
          </section>
        );
        break;
      case "1":
        content = (
          <section className="container mx-auto mt-10 grid place-items-center">
            <div className="flex flex-col gap-y-1 items-center justify-center text-[#323232]">
              <img
                src={ASSETS.NO_REVIEWS}
                className="md:w-5/12"
                alt="No-Business"
              />
              <p className="mt-[10%] mx-auto text-center text-secondary font-bold">
                <Trans i18nKey={"no_poor_reviews"} />
              </p>
            </div>
          </section>
        );
        break;

      default:
        <section className="container mx-auto mt-10 grid place-items-center">
          <div className="flex flex-col gap-y-1 items-center justify-center text-[#323232]">
            <img
              src={ASSETS.NO_REVIEWS}
              className="md:w-5/12"
              alt="No-Business"
            />
            <h2 className="font-bold text-xl md:text-2xl ">
              <Trans i18nKey={"getting_started"} />
            </h2>
            <p className="font-medium text-center text-xs md:text-sm text-[#323232]/50">
              <Trans i18nKey={"no_feedback_yet"} />
            </p>
            <p className="font-medium  text-center  text-xs md:text-sm text-[#323232]/50">
              <Trans i18nKey={"see_feedback_when_available"} />
            </p>
            <Button
              onClick={() => setIsOpen(true)}
              className="bg-primary mt-3 md:p-3 md:px-6 rounded-lg hover:bg-primary"
            >
              <Trans i18nKey={"add_business"} />
            </Button>
            <Dialog open={IsOpen} onOpenChange={setIsOpen}>
              <DialogContent className="!w-full max-w-fit">
                <SearchBox onClose={setIsOpen} isWaiting={setBusinessLoading} />
              </DialogContent>
            </Dialog>
          </div>
        </section>;
        break;
    }
  }

  if (isSuccess && data?.data?.data?.length > 0) {
    content = data?.data?.data?.map((item: ReviewType) => (
      <Link
        to="/reviews/generate-response"
        key={item.review_id}
        state={{ placeId: activeBusiness.place_id, reviewId: item.review_id }}
      >
        <ReviewCard {...item} />
      </Link>
    ));
  }

  const sortLabels: Record<string, string> = {
    "0": t("all"),
    "5": t("excellent"),
    "4": t("good"),
    "3": t("average"),
    "2": t("below_average"),
    "1": t("poor"),
  };
  return (
    <div className="p-2 pb-20 flex flex-col flex-1 overflow-hidden">
      <div className="flex flex-row items-center justify-between py-1">
        <h1 className="font-semibold">
          <Trans i18nKey={"reviews"} />
        </h1>

        <Select
          value={sortKey}
          onValueChange={(value) => {
            if (value === "0") {
              setSortKey("");
            } else {
              setSortKey(value);
            }
          }}
        >
          <SelectTrigger className="w-[100px] h-8">
            <SelectValue placeholder={t("all")} className="">
              {sortLabels[sortKey] ?? "Sort"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">
              <Trans i18nKey={"all"} />
            </SelectItem>
            <SelectItem value="5">
              <Trans i18nKey={"excellent"} />
            </SelectItem>
            <SelectItem value="4">
              <Trans i18nKey={"good"} />
            </SelectItem>
            <SelectItem value="3">
              <Trans i18nKey={"average"} />
            </SelectItem>
            <SelectItem value="2">
              {" "}
              <Trans i18nKey={"below_average"} />
            </SelectItem>
            <SelectItem value="1">
              {" "}
              <Trans i18nKey={"poor"} />
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="py-3  overflow-x-hidden h-full">{content}</div>

      {totalPages > 0 && (
        <div className="flex justify-center items-center gap-2 py-4">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-md bg-[#0f344e] text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-dark transition-colors duration-200"
            aria-label="Previous page"
          >
            <Trans i18nKey={"previous"} />
          </button>

          {getPaginationPages(currentPage, totalPages).map((page) => {
            if (typeof page === "string") {
              return (
                <span key={`dots-${page}-${Math.random()}`} className="px-2">
                  {page}
                </span>
              );
            }

            const isActive = page === currentPage;

            return (
              <button
                key={`page-${page}`}
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
            <Trans i18nKey={"next"} />
          </button>
        </div>
      )}
    </div>
  );
}

export default Reviews;
