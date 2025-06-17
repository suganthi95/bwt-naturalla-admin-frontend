import { Icons } from "@/assets/icons";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ShipmentsDetails() {
    const navigate = useNavigate()
  return (
    <div className="flex flex-col p-4 gap-3 md:p-4 w-full h-screen overflow-y-scroll md:pb-20 bg-slate-100">
      <ul className="grid grid-cols-4 gap-x-5 items-stretch">
        <li className="col-span-3 ">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-x-2 cursor-pointer" onClick={()=>navigate('/shipments')}>
              <ArrowLeft className="text-[#4B5563]" />
              <div>
                <h1 className="text-xl font-semibold">Shipments</h1>
                <p className="text-xs text-slate-400">AWB: AWB123456789</p>
              </div>
            </div>

            <Button
              className="border-slate-300 text-primary-black font-medium"
              variant={"outline"}
            >
              Print Label
            </Button>
          </div>

          <div className="border rounded-lg bg-white p-4 h-[330px] mt-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[#0A0A0A] font-semibold">
                Shipment Information
              </h2>
              <div className="rounded-3xl bg-[#166534]/10 text-[#166534] border w-fit text-sm px-4">
                Delivered
              </div>
            </div>
            <div className="grid grid-cols-2 grid-rows-3  gap-4">
              <div className="col-span-1 space-y-1.5">
                <p className="text-lead text-sm">AWB Code</p>
                <h3 className="text-primary-black font-medium">
                  AWB: AWB123456789
                </h3>
              </div>
              <div className="space-y-1.5">
                <p className="text-lead text-sm">Pickup Scheduled Date</p>
                <h3 className="text-primary-black font-medium">
                  18-07-2025, 13:50
                </h3>
              </div>
              <div className="col-span-1 space-y-1.5">
                <p className="text-lead text-sm">Courier Name</p>
                <h3 className="text-primary-black font-medium">
                  Express Logistics
                </h3>
              </div>
              <div className="col-span-1 space-y-1.5">
                <p className="text-lead text-sm">Estimated Delivery Date</p>
                <h3 className="text-primary-black font-medium">
                  22-07-2025, 18:00
                </h3>
              </div>
              <div className="col-span-1 space-y-1.5">
                <p className="text-lead text-sm">Origin → Destination</p>
                <h3 className="text-primary-black font-medium">
                  Bangalore → Madanapalli
                </h3>
              </div>
              <div className="col-span-1 space-y-1.5">
                <p className="text-lead text-sm">Delivered Date</p>
                <h3 className="text-primary-black font-medium">
                  22-07-2025, 11:47
                </h3>
              </div>
              <div className="col-span-1 space-y-1.5">
                <p className="  text-lead text-sm">Tracking Link </p>
                <h3 className="text-[#007AFF] font-medium flex items-center gap-x-1.5  ">
                  View Tracking <Icons.TrackingId />
                </h3>
              </div>
              <div className="col-span-1 space-y-1.5">
                <p className="text-lead text-sm">Delivered To</p>
                <h3 className="text-primary-black font-medium">John Smith</h3>
              </div>
            </div>
          </div>
        </li>

        <li className="col-span-1">
          <div className="flex justify-between items-center">
            <Button
              className="border-slate-300 px-6 text-primary-black font-medium"
              variant={"outline"}
            >
              Download Manifest
            </Button>
            <Button className="px-6">Edit Shipment</Button>
          </div>
          <div className="border rounded-lg bg-white p-4 mt-4">
            <h2 className="text-[#0A0A0A] font-semibold">Package Details</h2>
            <div className="mt-4 space-y-5 border-b pb-4">
              <div className="flex justify-between items-center">
                <p className="text-lead text-sm">Length</p>
                <p className="text-primary-black font-medium">30 CM</p>
              </div>

              <div className="flex justify-between items-center">
                <p className="text-lead text-sm">Width</p>
                <p className="text-primary-black font-medium">20 CM</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-lead text-sm">Height</p>
                <p className="text-primary-black font-medium">50 CM</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-lead text-sm">Weight</p>
                <p className="text-primary-black font-medium">1.5kg</p>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <h2 className="text-[#0A0A0A] text-sm font-semibold">
                Documents
              </h2>
              <p className="text-[#007AFF] font-medium text-sm flex items-center gap-x-1">
                <Icons.PdfFile /> Shipping Label
              </p>
              <p className="text-[#007AFF] font-medium text-sm flex items-center gap-x-1">
                <Icons.BlueFile /> Manifest
              </p>
            </div>
          </div>
        </li>
      </ul>
      <div className="border rounded-lg bg-white p-4 ">
        <h2 className="text-[#0A0A0A] font-semibold">Tracking Timeline</h2>
        <ul className="mt-4 space-y-4">
          <li className="flex items-center gap-x-4">
            <div className="size-10 bg-green-500 grid place-items-center rounded-full">
              <Check className=" text-xl text-white" />
            </div>
            <div className="bg-light-blue p-4 rounded-xl flex items-center justify-between w-full">
              <div>
                <h2 className="text-primary-black font-semibold">Delivered</h2>
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
                <h2 className="text-primary-black font-semibold">Out for Pickup</h2>
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
                <h2 className="text-primary-black font-semibold">Delivered</h2>
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
        </ul>
      </div>
    </div>
  );
}
