import dayjs from "dayjs";
import { Button } from "../ui/button";

interface Props {
  HistoryDetails: any;
  onClose:(val:boolean)=>void
}
export default function OrderHistoryDetails({ HistoryDetails,onClose }: Props) {
  console.log("HistoryDetails: ", HistoryDetails);
  return (
    <div className="px-4 pb-4 ">
      <div className="w-full border border-gray-200 rounded-lg text-sm overflow-hidden">
        <div className="flex items-center gap-x-16  font-medium text-gray-700">
          <div className="p-3">Order Date</div>
          <div className="p-3">Status</div>
          <div className="p-3">Total Amount</div>
        </div>

        <div className="flex items-center gap-x-16  hover:bg-gray-50 transition ">
          <div className="p-3 text-gray-900">
            {dayjs().format("MMM DD YYYY")}
          </div>
          <div className="p-3">
            <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
              Delivered
            </span>
          </div>
          <div className="p-3 text-gray-900 font-semibold">₹948.00</div>
        </div>
      </div>
      <div>
        <h2 className="font-semibold">Items</h2>
        <div className="w-full border border-gray-200 rounded-lg text-sm overflow-hidden">
          <div className="grid grid-cols-5 bg-gray-100 text-left font-medium text-gray-700">
            <div className="p-3 col-span-2">Product</div>
            <div className="p-3">Quantity</div>
            <div className="p-3">Price</div>
            <div className="p-3">Total</div>
          </div>

          <div className="grid grid-cols-5 items-center hover:bg-gray-50 transition text-gray-900 ">
            <div className="p-3  col-span-2 flex items-start gap-3">
              <img
                src="https://via.placeholder.com/50"
                alt="Product"
                className="w-12 h-12 rounded-md object-cover border"
              />
              <div>
                <p className="font-semibold text-[17px] text-primary-black">
                  Naturalla Hair Oil
                </p>
                <p className="text-xs text-muted-foreground">100ml / Unit</p>
              </div>
            </div>

            <div className="p-3 font-semibold">1</div>

            <div className="p-3 font-semibold">₹948.00</div>

            <div className="p-3 font-semibold">₹948.00</div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col p-4 text-primary-black  h-full">
          <h2 className="font-semibold mb-4">Shipping Address</h2>
          <div className="border rounded-lg p-4 space-y-3.5 flex-grow">
            <div className="flex items-center justify-between">
              <h2 className="font-medium">Suganthi KSv</h2>
            </div>
            <div className="text-textPrimary">
              <p>89 Nirmala Hospital, backside, Muthur</p>
              <p>Vellakovil, Tamil Nadu - 638111.</p>
            </div>
            <p className="font-medium text-lead text-textPrimary">
              Ph: 8883660851
            </p>
          </div>
        </div>

        <div className="flex flex-col p-4 text-[15px] font-medium text-title  h-full">
          <h3 className="font-semibold mb-4">Payment Summary</h3>
          <div className="border rounded-lg p-4 space-y-3.5 flex-grow">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold">₹948.00</span>
            </div>
            <div className="flex justify-between items-start text-sm text-muted-foreground">
              <p className="flex flex-col leading-tight">
                <span className="text-foreground font-medium">Tax</span>
                <span className="text-xs">Inclusive of 18% tax</span>
              </p>
              <span className="font-semibold">₹171.00</span>
            </div>
            <div className="flex justify-between">
              <span>Discount</span>
              <span>-₹50.00</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Shipping Cost</span>
              <span className="font-semibold">₹49.00</span>
            </div>
            <div className="flex justify-between font-semibold text-base pt-2">
              <span className="text-[#0B130B]">Grand Total</span>
              <span className="text-[#0B130B] font-bold">₹1,118.00</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end gap-x-5 ">
        <Button  onClick={()=>onClose(false)} variant={'outline'} className="border-slate-400 text-slate-400 hover:border-slate-400 hover:text-slate-400">Close</Button>
        <Button > Download Invoice</Button>
      </div>
    </div>
  );
}
