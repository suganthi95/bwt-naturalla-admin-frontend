import { Loader2, MessageCircleOff, Send, Tag } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useEffect, useRef, useState } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { useAppContext } from "@/contexts/AuthContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addReply,
  getCustomerQueries,
  getTicketDetails,
  updatePriority,
  updateStatus,
} from "@/lib/apis";
import { toast } from "sonner";
import axios from "axios";
import { ContactUsTicket } from "@/types/type";
import { TicketDetailSkeleton } from "@/common/TicketDetailSkeleton";
import dayjs from "dayjs";

export default function CustomerSupport() {
  const { auth } = useAppContext();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedPriority, setPriority] = useState<string>("");
  const [selectedStatus, setStatus] = useState<string>("");
  const [selectedTicketId, setTicketId] = useState<string>("1");
  const InputRef = useRef<HTMLTextAreaElement>(null);
  const { data: Queries } = useQuery({
    queryKey: ["customerQueries"],
    queryFn: () => getCustomerQueries(auth?.token ?? ""),
    staleTime: 1000 * 60 * 5,
    select: (data) => data?.data,
    retry: 1,
  });
  const [filteredQueries, SetFilteredQueries] = useState<ContactUsTicket[]>(
    Queries?.data
  );

  const { data: QueriesDetails, isLoading: DetailsLoading } = useQuery({
    queryKey: ["customerQueryDetails", selectedTicketId],
    queryFn: () => getTicketDetails(auth?.token ?? "", selectedTicketId),
    staleTime: 1000 * 60 * 5,
    select: (data) => data?.data?.data,
    retry: 1,
  });

  const { mutate: sendReplyMessage, isPending } = useMutation({
    mutationKey: ["addReply"],
    mutationFn: (args: {
      token: string;
      ticket_id: string;
      reply_message: string;
    }) => addReply(args.token, args.ticket_id, args.reply_message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customerQueryDetails"] });
      // toast.success(data?.data?.data ?? "Reply sent successfully");
      if (InputRef.current) {
        InputRef.current.value = "";
      }
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(error?.response?.data?.message);
      }
    },
  });

  const { mutate: mutatePriority } = useMutation({
    mutationKey: ["updatePriority"],
    mutationFn: (args: {
      token: string;
      ticket_id: string;
      priority: string;
    }) => updatePriority(args.token, args.ticket_id, args.priority),
    onSuccess: () => {
      toast.success("Priority updated");
      // setTicketId("");
      queryClient.invalidateQueries({ queryKey: ["customerQueries"] });
      queryClient.invalidateQueries({ queryKey: ["customerQueryDetails"] });
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(error?.response?.data?.message);
      }
    },
  });

  const { mutate: mutateStauts } = useMutation({
    mutationKey: ["updateStatus"],
    mutationFn: (args: { token: string; ticket_id: string; status: string }) =>
      updateStatus(args.token, args.ticket_id, args.status),
    onSuccess: () => {
      toast.success("Status updated");
      // setTicketId("");
      queryClient.invalidateQueries({ queryKey: ["customerQueries"] });
      queryClient.invalidateQueries({ queryKey: ["customerQueryDetails"] });
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(error?.response?.data?.message);
      }
    },
  });

  const getBadgeClass = (status: string) => {
    switch (status) {
      case "unresolved":
        return "bg-[#FEE2E2] text-[#991B1B]";
      case "in-progress":
        return "bg-[#DBEAFE] text-[#1E40AF]";
      case "resolved":
        return "bg-[#DCFCE7] text-[#166534]";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };
  useEffect(() => {
    if (!Queries?.data) return;

    const filteredData = Queries.data.filter((item: ContactUsTicket) => {
      const matchedCategory = searchTerm
        ? item.issue_type?.toLowerCase().includes(searchTerm.toLowerCase())
        : item;

      const matchedPriority =
        selectedPriority === "all" || selectedPriority === ""
          ? item
          : item.priority?.toLowerCase() === selectedPriority.toLowerCase();
      const matchedStatus =
        selectedStatus === "all" || selectedStatus === ""
          ? item
          : item.status.toLowerCase() === selectedStatus.toLowerCase();
      return matchedCategory && matchedPriority && matchedStatus;
    });

    SetFilteredQueries(filteredData);
  }, [Queries?.data, searchTerm, selectedPriority, selectedStatus]);

  console.log(filteredQueries);

  return (
    <div className="grid grid-cols-6 gap-x-6">
      <div className=" col-span-3   bg-white shadow">
        <div className="p-4">
          <h2 className="font-bold text-[22px] mb-4 flex items-center justify-between">
            User Feedback{" "}
            <span
              className="text-sm font-medium text-red-400 cursor-pointer "
              onClick={() => {
                setSearchTerm("");
                setPriority("");
                setStatus("");
              }}
            >
              Clear Filter
            </span>{" "}
          </h2>

          <div className="grid grid-cols-3 gap-x-3">
            <Select
              value={searchTerm}
              onValueChange={(val) => {
                setSearchTerm(val);
              }}
            >
              <SelectTrigger className="w-full cursor-pointer">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent className="w-full">
                {Queries?.category?.map((cate: any) => (
                  <SelectItem key={cate.issue_type_id} value={cate.issue_type}>
                    {cate.issue_type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="">
              <Select
                value={selectedPriority}
                onValueChange={(value) => setPriority(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="">
              <Select
                value={selectedStatus}
                onValueChange={(value) => setStatus(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="in-progress">In-Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="unresolved">UnResolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <ul className=" overflow-y-auto h-[35rem]">
          {filteredQueries?.length > 0 ? (
            filteredQueries?.map((item: ContactUsTicket) => {
              return (
                <li
                  key={item.contactus_id}
                  className={`col-span-3 ${
                    Number(selectedTicketId) === item?.contactus_id
                      ? "bg-[#F7FAFD] border-2  border-blue-300"
                      : ""
                  }  border-[#E5E7EB] p-4 space-y-3 `}
                  onClick={() => setTicketId(String(item?.contactus_id))}
                >
                  <div className="text-primary-black flex justify-between items-center">
                    <p className=" font-semibold">{item?.issue_type}</p>
                    <p className="text-[#6B7280] text-xs font-medium">
                      {item?.created_time}
                    </p>
                  </div>
                  <ul className="flex items-center gap-x-10">
                    <li className="text-[#4B5563] text-xs">
                      {item?.first_name}
                    </li>
                    <li className="text-[#4B5563] text-xs list-disc">
                      {item?.contact_email}
                    </li>
                    <li className="text-[#4B5563] text-xs list-disc">
                      {item?.contact_phone_no}
                    </li>
                  </ul>
                  <p className="text-primary-black text-sm font-semibold ">
                    {item?.sub_issue}
                  </p>
                  <p className="text-primary-black text-xs ">
                    {item?.message_body}
                  </p>
                  <div
                    className={` flex items-center ${
                      item?.attachment_data[0]?.media_url
                        ? "justify-between"
                        : "justify-end"
                    } `}
                  >
                    {item?.attachment_data[0]?.media_url && (
                      <img
                        src={item?.attachment_data[0]?.media_url}
                        alt=""
                        className="size-10"
                      />
                    )}
                    <Badge className={getBadgeClass(item?.status)}>
                      {item?.status}
                    </Badge>
                  </div>
                </li>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center h-[250px] w-full border border-dashed  rounded-md text-center px-6 py-8">
              <MessageCircleOff className="w-10 h-10 text-gray-400 mb-2" />
              <h3 className="text-lg font-semibold text-gray-600">
                No User Feedback Available
              </h3>
              <p className="text-sm text-gray-500">
                Try changing or resetting your filters to see feedback.
              </p>
            </div>
          )}
        </ul>
      </div>
      {DetailsLoading ? (
        <TicketDetailSkeleton />
      ) : (
        <div className=" col-span-3">
          <div className="   w-full  mx-auto bg-white dark:bg-slate-900 shadow rounded-lg  space-y-6">
            <div className="border-b">
              <div className="flex p-6 items-center justify-between  pb-3">
                <h2 className="text-lg font-semibold text-primary-black dark:text-neutral-100">
                  {QueriesDetails[0]?.issue_type}
                </h2>
                <Badge className={getBadgeClass(QueriesDetails[0]?.status)}>
                  {QueriesDetails[0]?.status}
                </Badge>
              </div>
            </div>

            <div className="space-y-2 border-b pb-4">
              <div className="flex p-4 items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src="https://ik.imagekit.io/nd8r7mpaev/Atlants/user.png?updatedAt=1738227108834"
                    alt="User Profile"
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <div className="flex items-start flex-col">
                      <p className="font-medium flex flex-col  gap-x-2 text-neutral-800 dark:text-neutral-100">
                        {QueriesDetails[0]?.first_name}
                      </p>
                      <div className="bg-transparent text-sm text-primary-black">
                        +91 {QueriesDetails[0]?.contact_phone_no}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {QueriesDetails[0]?.contact_email}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="text-sm  truncate text-muted-foreground text-right">
                  {dayjs(QueriesDetails[0]?.created_at).format("MMM-DD-YYYY")}
                </div>
              </div>
            </div>
            <div className="h-64 overflow-y-auto">
              <div className="p-4 space-y-2">
                <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-100">
                  Message
                </p>
                <p className="text-sm text-neutral-600 dark:text-neutral-300">
                  {QueriesDetails[0]?.message_body}
                </p>
              </div>
              {QueriesDetails[0]?.attachment_data[0]?.media_url && (
                <div className="border-b p-4 space-y-2">
                  <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-100">
                    Attachments
                  </p>
                  <div className="flex gap-3 overflow-x-auto py-2">
                    <img
                      src={QueriesDetails[0]?.attachment_data[0]?.media_url}
                      className="rounded border w-32 h-24 object-cover"
                      alt="attachment"
                    />
                  </div>
                </div>
              )}
              {QueriesDetails[0]?.replies?.length > 0 && (
                <div className="px-4 space-y-4 ">
                  <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-100">
                    Conversation
                  </p>

                  <div className="space-y-3">
                    {QueriesDetails[0]?.replies?.map(
                      (reply: any, index: number) => {
                        const isAdmin = reply.admin_reply;
                        return (
                          <div
                            key={index}
                            className={`
              flex ${isAdmin ? "justify-start" : "justify-end"}
            `}
                          >
                            <div
                              className={`
                max-w-[85%] sm:max-w-[70%] md:max-w-[60%] lg:max-w-[50%]
                p-3 rounded-lg shadow-sm
                ${
                  isAdmin
                    ? "bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100"
                    : "bg-gray-100 dark:bg-slate-700 text-neutral-800 dark:text-neutral-100"
                }
              `}
                            >
                              <div className="flex justify-between  gap-x-3 items-center mb-1">
                                <span className="text-xs font-semibold">
                                  {isAdmin ? "Admin" : "User"}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {reply?.replied_at ?? "Now"}
                                </span>
                              </div>
                              <p className="text-sm whitespace-pre-line">
                                {reply?.reply_message}
                              </p>
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3 p-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
                  Your Reply
                </label>
                <textarea
                  ref={InputRef}
                  className="w-full border rounded-md px-3 py-2 text-sm bg-white dark:bg-slate-800 text-neutral-900 dark:text-neutral-100 resize-none"
                  rows={4}
                  placeholder="Type your message..."
                ></textarea>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-x-2">
                  <div className="w-[180px]">
                    <Select
                      onValueChange={(value) => {
                        mutatePriority({
                          token: auth?.token ?? "",
                          ticket_id: QueriesDetails[0]?.contactus_id,
                          priority: value,
                        });
                      }}
                    >
                      <SelectTrigger className="h-10 px-3 flex items-center gap-2 [&>svg]:hidden">
                        <Tag className="w-4 h-4 text-muted-foreground " />
                        <SelectValue
                          placeholder="Update Priority"
                          className="text-sm leading-none"
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Priority</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>{" "}
                  <div className="w-[180px]">
                    <Select
                      onValueChange={(value) => {
                        mutateStauts({
                          token: auth?.token ?? "",
                          ticket_id: QueriesDetails[0]?.contactus_id,
                          status: value,
                        });
                      }}
                    >
                      <SelectTrigger className="h-10 px-3 flex items-center gap-2 [&>svg]:hidden">
                        <Tag className="w-4 h-4 text-muted-foreground " />
                        <SelectValue
                          placeholder="Update Stauts"
                          className="text-sm leading-none"
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="in-progress">In-Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="unresolved">UnResolved</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>{" "}
                </div>
                <Button
                  className="flex items-center gap-2"
                  onClick={() => {
                    sendReplyMessage({
                      token: auth?.token ?? "",
                      ticket_id: QueriesDetails[0]?.contactus_id,
                      reply_message: InputRef.current?.value ?? "",
                    });
                  }}
                >
                  {isPending ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
