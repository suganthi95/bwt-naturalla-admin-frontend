import { ProductReview } from "@/types/type";
import { Star } from "lucide-react";
interface Props{
  reviews:ProductReview[]
}

export default function TopComments({reviews}:Props) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <h2 className="text-lg font-semibold text-neutral-800 mb-4">Top Comments</h2>

      <div className="space-y-5">
        {reviews?.slice(0,4)?.map((user) => (
          <div
            key={user?.review_id}
            className=" rounded-lg p-2 flex gap-4 hover:bg-gray-50 transition"
          >
            <img
              src={user?.profile_pic || 'https://ik.imagekit.io/nd8r7mpaev/Atlants/user.png?updatedAt=1738227108834'}
              alt={user?.first_name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="font-medium text-gray-900">{user?.first_name} {user?.last_name}</div>

              <div className="flex gap-1 text-yellow-500 mt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={10}
                    fill={i < user?.ratings ? "#FACC15" : "none"}
                    stroke="#FACC15"
                  />
                ))}
              </div>

              <p className="text-sm text-gray-600 mt-2">{user?.review_txt}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
