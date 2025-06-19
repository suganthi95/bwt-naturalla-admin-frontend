import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const clients = [
  {
    id: 1,
    name: "Priya R.",
    phone: "+91 98765 43210",
    image: "https://randomuser.me/api/portraits/women/75.jpg",
  },
  {
    id: 2,
    name: "Aarav K.",
    phone: "+91 91234 56789",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: 3,
    name: "Meera S.",
    phone: "+91 90001 12345",
    image: "https://randomuser.me/api/portraits/women/66.jpg",
  },
];

const topProducts = [
  {
    id: 1,
    name: "Herbal Shampoo",
    image: "https://via.placeholder.com/60x60.png?text=Shampoo",
    sold: 320,
    growth: "15%",
    price: "₹499",
  },
  {
    id: 2,
    name: "Neem Soap",
    image: "https://via.placeholder.com/60x60.png?text=Soap",
    sold: 220,
    growth: "8%",
    price: "₹199",
  },
  {
    id: 3,
    name: "Aloe Vera Face Wash",
    image: "https://via.placeholder.com/60x60.png?text=Face+Wash",
    sold: 180,
    growth: "12%",
    price: "₹299",
  },
];
const cities = [
  { id: 1, name: "Chennai", count: 120 },
  { id: 2, name: "Bangalore", count: 95 },
  { id: 3, name: "Coimbatore", count: 78 },
  { id: 4, name: "Hyderabad", count: 65 },
  { id: 5, name: "Madurai", count: 50 },
];

export default function OrdersLists() {
  return (
    <div className=" grid grid-cols-3 gap-x-3 shadow-sm p-4">
        <div className="bg-white p-4 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-neutral-800">Orders List</h2>
        <Select defaultValue="24h">
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="24h">Last 24 hours</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {clients.map((client) => (
          <div
            key={client.id}
            className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-50 transition"
          >
            <img
              src={client.image}
              alt={client.name}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div>
              <div className="font-medium text-gray-900">{client.name}</div>
              <div className="text-sm text-gray-500">{client.phone}</div>
            </div>
          </div>
        ))}
      </div>

        </div>

         <div className="bg-white p-4 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-neutral-800">Top Products</h2>
        <Select defaultValue="7d">
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 Days</SelectItem>
            <SelectItem value="30d">This Month</SelectItem>
            <SelectItem value="90d">Last 3 Months</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {topProducts.map((product) => (
          <div
            key={product.id}
            className="flex items-start gap-4 p-2 rounded-lg hover:bg-gray-50 transition"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-12 h-12 rounded-md object-cover"
            />
            <div className="flex-1">
              <div className="font-semibold text-sm text-primary-black">{product.name}</div>
              <div className="text-sm text-gray-500">{product.sold} items</div>
            </div>
              <div className="flex flex-col items-center justify-between text-sm mt-1 text-gray-600">
                <span className="text-primary-black font-medium">{product.growth}</span>
                <span className="font-semibold">{product.price}</span>
              </div>
          </div>
        ))}
      </div>
    </div>
     <div className="bg-white p-4 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-neutral-800">Top Cities</h2>
        <Select defaultValue="7d">
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 Days</SelectItem>
            <SelectItem value="30d">This Month</SelectItem>
            <SelectItem value="90d">Last 3 Months</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        {cities.map((city) => (
          <div
            key={city.id}
            className="flex justify-between items-center px-2 py-2  rounded-lg hover:bg-gray-50 transition"
          >
            <span className="text-gray-800 text-sm font-medium">{city.name}</span>
            <span className="text-sm text-gray-600 font-semibold">{city.count}</span>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
}
