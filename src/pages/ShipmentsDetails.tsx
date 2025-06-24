import { Icons } from "@/assets/icons";
import { Button } from "@/components/ui/button";
import { getShipmentDetails } from "@/lib/apis";
import { ShipmentDetailsType } from "@/types";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { ArrowLeft, Check } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

export default function ShipmentsDetails() {
  const navigate = useNavigate();
  const { shipmentId } = useParams();

  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ["getShipmentDetails"],
    queryFn: () => getShipmentDetails(shipmentId as string),
    refetchOnWindowFocus: false,
    select: (data): ShipmentDetailsType => data?.data,
    enabled: Boolean(shipmentId),
  });

  let content;

  if (isLoading) {
    content = <div className="mt-[10%] text-center">Loading...</div>;
  }

  if (isSuccess) {
    const { shipment } = data;

    content = (
      <div className="flex flex-col p-4 gap-3 md:p-4 w-full h-screen overflow-y-scroll md:pb-20 bg-slate-100">
        <ul className="grid grid-cols-4 gap-x-5 items-stretch">
          <li className="col-span-3">
            <div className="flex items-center justify-between">
              <div
                className="flex items-center gap-x-2 cursor-pointer"
                onClick={() => navigate("/shipments")}
              >
                <ArrowLeft className="text-[#4B5563]" />
                <div>
                  <h1 className="text-xl font-semibold">Shipments</h1>
                  <p className="text-xs text-slate-400">
                    AWB: {shipment.awb_code}
                  </p>
                </div>
              </div>
            </div>

            <div className="border rounded-lg bg-white p-4 h-[350px] mt-4">
              <div className="flex items-center justify-between">
                <h2 className="text-[#0A0A0A] font-semibold">
                  Shipment Information
                </h2>
                {shipment.current_status === "Pickup Generated" ? (
                  <div className="rounded-3xl bg-[#166534]/10 text-[#166534] border w-fit text-sm px-4">
                    {shipment.current_status}
                  </div>
                ) : shipment.current_status === "Canceled" ? (
                  <div className="rounded-3xl bg-red-400/10 text-red-400 border w-fit text-sm px-4">
                    {shipment.current_status}
                  </div>
                ) : (
                  <div className="rounded-3xl bg-slate-400/10 text-slate-400 border w-fit text-sm px-4">
                    {shipment.current_status}
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 grid-rows-3  gap-4">
                <div className="col-span-1 space-y-1.5">
                  <p className="text-lead text-sm">AWB Code</p>
                  <h3 className="text-primary-black font-medium">
                    AWB: {shipment.awb_code}
                  </h3>
                </div>
                <div className="space-y-1.5">
                  <p className="text-lead text-sm">Pickup Scheduled Date</p>
                  <h3 className="text-primary-black font-medium">
                    {dayjs(shipment.pickup_scheduled_date).format(
                      "DD-MM-YYYY, hh:mm A"
                    )}
                  </h3>
                </div>
                <div className="col-span-1 space-y-1.5">
                  <p className="text-lead text-sm">Courier Name</p>
                  <h3 className="text-primary-black font-medium">
                    {shipment.courier_name}
                  </h3>
                </div>
                <div className="col-span-1 space-y-1.5">
                  <p className="text-lead text-sm">Estimated Delivery Date</p>
                  <h3 className="text-primary-black font-medium">
                    {dayjs(shipment.estimated_delivery_date).format(
                      "DD-MM-YYYY, hh:mm A"
                    )}
                  </h3>
                </div>
                <div className="col-span-1 space-y-1.5">
                  <p className="text-lead text-sm">Origin → Destination</p>
                  <h3 className="text-primary-black font-medium">
                    {shipment.origin} → {shipment.destination}
                  </h3>
                </div>
                <div className="col-span-1 space-y-1.5">
                  <p className="text-lead text-sm">Delivered Date</p>
                  <h3 className="text-primary-black font-medium">
                    {shipment.delivered_date
                      ? dayjs(shipment.delivered_date).format(
                          "DD-MM-YYYY, hh:mm A"
                        )
                      : "Yet to be delivered"}
                  </h3>
                </div>
                <div className="col-span-1 space-y-1.5">
                  <p className="  text-lead text-sm">Tracking Link </p>
                  {/* <h3 className="text-[#007AFF] font-medium flex items-center gap-x-1.5  ">
                      View Tracking <Icons.TrackingId />
                    </h3> */}
                  <Button
                    disabled={!shipment.tracking_link}
                    onClick={() => window.open(shipment.tracking_link)}
                    variant="ghost"
                    className="text-primary-blue hover:text-primary-blue"
                  >
                    View Tracking <Icons.TrackingId />
                  </Button>
                </div>
                <div className="col-span-1 space-y-1.5">
                  <p className="text-lead text-sm">Delivered To</p>
                  <h3 className="text-primary-black font-medium">
                    {shipment.delivered_to}
                  </h3>
                </div>
              </div>
            </div>
          </li>

          <li className="col-span-1">
            <div className="flex justify-between items-center">
              <Button
                onClick={() => {
                  if (shipment.shipping_label) {
                    window.location.href = shipment.shipping_label;
                  }
                }}
                disabled={!shipment.shipping_label}
                className="border-slate-300 text-primary-black font-medium"
                variant={"outline"}
              >
                Print Label
              </Button>
              <Button
                disabled={!shipment.manifest}
                onClick={() => {
                  if (shipment.manifest) {
                    window.location.href = shipment.manifest;
                  }
                }}
                className="border-slate-300 px-6 text-primary-black font-medium"
                variant={"outline"}
              >
                Download Manifest
              </Button>

              {/* <Button className="px-6">Edit Shipment</Button> */}
            </div>
            <div className="border rounded-lg bg-white p-4 mt-5 overflow-y-scroll h-[350px]">
              <h2 className="text-[#0A0A0A] font-semibold">Package Details</h2>
              {data?.package.map((item, index) => (
                <div
                  key={`packagedetails-${index}`}
                  className="mt-4 space-y-5 border-b pb-4"
                >
                  <div className="">
                    <p className="text-lead text-sm">Package Name</p>
                    <p className="text-primary-black font-medium">
                      {item.product_name}
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-lead text-sm">Length</p>
                    <p className="text-primary-black font-medium">
                      {item.length ? item.length : "N/A"}
                    </p>
                  </div>

                  <div className="flex justify-between items-center">
                    <p className="text-lead text-sm">Width</p>
                    <p className="text-primary-black font-medium">
                      {item.breadth ? item.breadth : "N/A"}
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-lead text-sm">Height</p>
                    <p className="text-primary-black font-medium">
                      {item.height ? item.height : "N/A"}
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-lead text-sm">Weight</p>
                    <p className="text-primary-black font-medium">
                      {item.weight ? item.weight : "N/A"}
                    </p>
                  </div>
                </div>
              ))}

              <div className="mt-4 space-y-2">
                <h2 className="text-[#0A0A0A] text-sm font-semibold">
                  Documents
                </h2>
                <p
                  onClick={() => {
                    if (shipment.shipping_label) {
                      window.location.href = shipment.shipping_label;
                    }
                  }}
                  className="text-[#007AFF] font-medium cursor-pointer text-sm flex items-center gap-x-1"
                >
                  <Icons.PdfFile /> Shipping Label
                </p>
                <p
                  onClick={() => {
                    if (shipment.manifest) {
                      window.location.href = shipment.manifest;
                    }
                  }}
                  className="text-[#007AFF] font-medium cursor-pointer text-sm flex items-center gap-x-1"
                >
                  <Icons.BlueFile /> Manifest
                </p>
              </div>
            </div>
          </li>
        </ul>
        <div className="border rounded-lg bg-white p-4 ">
          <h2 className="text-[#0A0A0A] font-semibold">Tracking Timeline</h2>
          <ul className="mt-4 space-y-4">
            {data?.tracking_timeline?.map((item: any, index: number) => (
              <li key={item.id} className="flex items-center gap-x-4">
                <div
                  className={`size-10 grid place-items-center rounded-full
        ${index === 0 ? "bg-green-500" : "bg-[#E1E6EF]"}`}
                >
                  {index === 0 ? (
                    <Check className="text-xl text-white" />
                  ) : (
                    <div className="size-3.5 rounded-full bg-[#007AFF]"></div>
                  )}
                </div>

                <div className="bg-light-blue p-4 rounded-xl flex items-center justify-between w-full">
                  <div>
                    <h2 className="text-primary-black font-semibold">
                      {item.activity || "Status"}
                    </h2>
                    <p className="text-lead text-sm">{item.location}</p>
                  </div>

                  <div className="text-primary-black grid gap-y-2 place-items-center">
                    <div className="bg-[#E4E4E4] w-fit px-2 rounded">
                      <h2 className="font-semibold">{item.status}</h2>
                    </div>
                    <p className="">
                      {dayjs(item.activity_time).format("DD-MM-YYYY, HH:mm")}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {/* <ul className="mt-4 space-y-4">
            <li className="flex items-center gap-x-4">
              <div className="size-10 bg-green-500 grid place-items-center rounded-full">
                <Check className=" text-xl text-white" />
              </div>
              <div className="bg-light-blue p-4 rounded-xl flex items-center justify-between w-full">
                <div>
                  <h2 className="text-primary-black font-semibold">
                    Delivered
                  </h2>
                  <p className="text-lead text-sm">
                    MADANPALLI, Madanapalli, ANDHRA PRADESH
                  </p>
                </div>
                <div className="text-primary-black grid gap-y-2    place-items-center">
                  <div className="bg-[#E4E4E4] w-fit px-2 rounded">
                    <h2 className="font-semibold">DLVD</h2>
                  </div>
                  <p className="">22-07-2025, 18:00</p>
                </div>
              </div>
            </li>

            <li className="flex items-center gap-x-4">
              <div className="size-10 bg-[#E1E6EF] grid place-items-center rounded-full">
                <div className="size-3.5 rounded-full bg-[#007AFF]"></div>
              </div>
              <div className="bg-light-blue p-4 rounded-xl flex items-center justify-between w-full">
                <div>
                  <h2 className="text-primary-black font-semibold">PickDone</h2>
                  <p className="text-lead text-sm">
                    RTO/CHD, BANGALORE, KARNATAKA
                  </p>
                </div>
                <div className="text-primary-black grid gap-y-2 place-items-center">
                  <div className="bg-[#E4E4E4] w-fit px-2 rounded">
                    <h2 className="font-semibold">PUD</h2>
                  </div>
                  <p className="">22-07-2025, 18:00</p>
                </div>
              </div>
            </li>

            <li className="flex items-center gap-x-4">
              <div className="size-10 bg-[#E1E6EF] grid place-items-center rounded-full">
                <div className="size-3.5 rounded-full bg-[#007AFF]"></div>
              </div>
              <div className="bg-light-blue p-4 rounded-xl flex items-center justify-between w-full">
                <div>
                  <h2 className="text-primary-black font-semibold">
                    Out for Pickup
                  </h2>
                  <p className="text-lead text-sm">
                    RTO/CHD, BANGALORE, KARNATAKA
                  </p>
                </div>
                <div className="text-primary-black grid gap-y-2 place-items-center">
                  <div className="bg-[#E4E4E4] w-fit px-2 rounded">
                    <h2 className="font-semibold">OFP</h2>
                  </div>
                  <p className="">22-07-2025, 18:00</p>
                </div>
              </div>
            </li>

            <li className="flex items-center gap-x-4">
              <div className="size-10 bg-[#E1E6EF] grid place-items-center rounded-full">
                <div className="size-3.5 rounded-full bg-[#007AFF]"></div>
              </div>
              <div className="bg-light-blue p-4 rounded-xl flex items-center justify-between w-full">
                <div>
                  <h2 className="text-primary-black font-semibold">
                    Delivered
                  </h2>
                  <p className="text-lead text-sm">
                    MADANPALLI, Madanapalli, ANDHRA PRADESH
                  </p>
                </div>
                <div className="text-primary-black grid gap-y-2 place-items-center">
                  <div className="bg-[#E4E4E4] w-fit px-2 rounded">
                    <h2 className="font-semibold">DLVD</h2>
                  </div>
                  <p className="">22-07-2025, 18:00</p>
                </div>
              </div>
            </li>
          </ul> */}
        </div>
      </div>
    );
  }

  return content;
}
