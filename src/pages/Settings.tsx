import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function Settings() {
  return (
    <div className="flex flex-col p-4 gap-3 md:p-4 w-full h-screen overflow-y-scroll md:pb-20 bg-slate-100">
      <div>
        <h1 className="text-xl font-semibold">Settings</h1>
        <p className="text-[15px] text-[#4B5563]">Manage pall settings here.</p>
      </div>

      <div className="flex justify-between">
        <p className="text-[15px] text-[#4B5563]">
          Configure shipping rates and rules for your store
        </p>
        <Button>Save Configuration</Button>
      </div>

      <ul className="grid grid-cols-5 gap-x-10">
        <li className="bg-white rounded-xl p-4 col-span-2" >
          <h2 className="text-primary-black font-semibold">Shipping Method</h2>
          <RadioGroup defaultValue="Flat Rate Shipping" className="space-y-2 mt-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="Flat Rate Shipping"
                id="Flat Rate Shipping"
              />
              <Label
                htmlFor="Flat Rate Shipping"
                className="font-medium text-[15px]"
              >
                Flat Rate Shipping
              </Label>
            </div>
          </RadioGroup>
        </li>
        <li className="bg-white rounded-xl p-4 col-span-3 space-y-6">
          <h2 className="text-[#1F2937] font-semibold">Rate Configuration</h2>

          <div>
            <Label className="text-sm text-primary-black font-semibold mb-2">Flat Rate Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                INR
              </span>
              <input
                type="number"
                placeholder="0.00"
                className="pl-12 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#1E401D]"
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">This flat rate will be applied to all orders regardless of weight, size, or destination.</p>
          </div>

          <div>
                        <Label className="text-sm text-primary-black font-semibold mb-2">Free Shipping Threshold</Label>

            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                INR
              </span>
              <input
                type="number"
                placeholder="0.00"
                className="pl-12 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#1E401D]"
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Orders above this amount will qualify for free shipping. Leave blank to disable.
            </p>
          </div>
        </li>
      </ul>
    </div>
  );
}
