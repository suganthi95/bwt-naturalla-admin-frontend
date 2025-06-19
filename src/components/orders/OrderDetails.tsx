import { ASSETS } from "@/assets/assets";
import { Badge } from "../ui/badge";
import { Mail, Phone } from "lucide-react";

export default function OrderDetails() {
  const products = [
    {
      id: 1,
      image: "https://via.placeholder.com/100x120.png?text=Shampoo",
      name: "Herbal Shampoo",
      sku: "SKU1001",
      quantity: 1,
      price: 299,
      oldPrice: 349,
    },
    {
      id: 2,
      image: "https://via.placeholder.com/100x120.png?text=Soap",
      name: "Neem Soap",
      sku: "SKU1002",
      quantity: 3,
      price: 99,
      oldPrice: 129,
    },
    {
      id: 3,
      image: "https://via.placeholder.com/100x120.png?text=Face+Wash",
      name: "Aloe Vera Face Wash",
      sku: "SKU1003",
      quantity: 2,
      price: 199,
      oldPrice: 249,
    },
  ];

  return (
    <>
      <div className="p-4 grid grid-cols-6">
        <div className=" col-span-4">
          <div className="p-4 space-y-4">
            <h2 className="font-semibold">Products</h2>
            {products.map((product) => (
              <div
                key={product.id}
                className="flex gap-4 bg-white border rounded-lg p-4 shadow-sm"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-24 h-28 object-cover rounded-md"
                />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold text-neutral-800">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      SKU: {product.sku}
                    </p>
                    <p className="text-sm text-gray-500">
                      Quantity: {product.quantity}
                    </p>
                  </div>
                </div>
                <div className="flex  flex-col gap-2 items-center mt-2">
                  <span className="text-base font-semibold text-primary-black">
                    Rs.{product.price}
                  </span>
                  <span className="text-sm text-gray-400 line-through">
                    Rs.{product.oldPrice}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 space-y-4">
            <h2 className="font-semibold">Shipment Details</h2>
            <div className="border-2 flex justify-between items-center p-3">
              <p className="font-medium text-sm text-lead">Status</p>
              <Badge className="bg-[#F1E1F9] text-purple-500">
                In Transist
              </Badge>
            </div>
          </div>

          <div className="space-y-4  p-4 text-[15px] font-medium text-title">
            <h3 className="text-lg font-semibold">Payment Summary </h3>

            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold">₹2000</span>
            </div>
            <div className="flex justify-between items-start text-sm text-muted-foreground">
              <p className="flex flex-col leading-tight">
                <span className="text-foreground font-medium">Tax</span>
                <span className="text-xs">Inclusive of 18% tax</span>
              </p>
              <span className=" font-semibold ">₹2000</span>
            </div>

            <div className="flex justify-between">
              <span>Discount</span>
              <span className="">-₹2000</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="flex flex-col">Shipping Cost</span>
              <span
                className={`font-semibold  
                         gap-x-1.5 flex items-center`}
              >
                ₹₹2000
              </span>
            </div>
            <div className="flex justify-between font-semibold text-base">
              <span className="font-semibold text-[#0B130B]">Grand Total</span>
              <span className="text-[#0B130B] font-bold">₹ 2000</span>
            </div>
          </div>
        </div>
        <div className="col-span-2">
          <div className="p-4 space-y-4 text-primary-black">
            <h2 className="font-semibold">Customer</h2>

            <div className="border p-2 px-4 flex items-center gap-x-3">
              <img
                src={ASSETS.USER}
                alt="user"
                className="size-10 rounded-full"
              />
              <p className="text-primary-black">Brooklyn Simmons</p>
            </div>
          </div>

          <div className=" space-y-4 p-4 text-primary-black">
            <h2 className="font-semibold">Contact Info</h2>

            <div className=" p-2 px-4 space-y-2 border ">
              <p className="text-sm flex items-center gap-x-2 text-[#6C7D95]">
                {" "}
                <Mail /> wade.warren@example.gom
              </p>
              <p className="text-sm flex items-center gap-x-2 text-[#6C7D95]">
                {" "}
                <Phone /> +91-9876543210
              </p>
            </div>
          </div>

          <div className=" space-y-4 p-4 text-primary-black">
            <h2 className="font-semibold">Shipping Address</h2>

            <div className="border rounded-lg  p-2 px-4 space-y-3.5">
              <div className="flex items-center gap-x-4 justify-between">
                <h2 className="font-semibold">Priya Sharma</h2>
              </div>

              <div className="text-textPrimary">
                <p>Flat No. 12B, Green Residency</p>
                <p>Seetha Nagar</p>
                <p>Chennai, Tamil Nadu - 600034.</p>
              </div>

              <p className="font-medium text-lead text-textPrimary">
                Ph: +91 98765 43210
              </p>
            </div>
          </div>

               <div className=" space-y-4 p-4 text-primary-black">
            <h2 className="font-semibold">Billing Address</h2>

            <div className="border rounded-lg  p-2 px-4 space-y-3.5">
              <div className="flex items-center gap-x-4 justify-between">
                <h2 className="font-semibold">Priya Sharma</h2>
              </div>

              <div className="text-textPrimary">
                <p>Flat No. 12B, Green Residency</p>
                <p>Seetha Nagar</p>
                <p>Chennai, Tamil Nadu - 600034.</p>
              </div>

              <p className="font-medium text-lead text-textPrimary">
                Ph: +91 98765 43210
              </p>
            </div>
          </div>
        </div>
      </div>

      <div></div>
    </>
  );
}
