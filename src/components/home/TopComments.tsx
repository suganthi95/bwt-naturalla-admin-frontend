import React from "react";
import { Star } from "lucide-react";

const comments = [
  {
    id: 1,
    name: "Anjali R.",
    image: "https://randomuser.me/api/portraits/women/75.jpg",
    rating: 5,
    review: "Absolutely love this shampoo! It made my hair soft and healthy.",
  },
  {
    id: 2,
    name: "Ravi K.",
    image: "https://randomuser.me/api/portraits/men/45.jpg",
    rating: 4,
    review: "The soap is very gentle and smells great. Highly recommended.",
  },
  {
    id: 3,
    name: "Divya M.",
    image: "https://randomuser.me/api/portraits/women/60.jpg",
    rating: 5,
    review: "Best face wash I’ve used so far. Feels so refreshing!",
  },
];

export default function TopComments() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <h2 className="text-lg font-semibold text-neutral-800 mb-4">Top Comments</h2>

      <div className="space-y-5">
        {comments.map((user) => (
          <div
            key={user.id}
            className=" rounded-lg p-2 flex gap-4 hover:bg-gray-50 transition"
          >
            <img
              src={user.image}
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="font-medium text-gray-900">{user.name}</div>

              <div className="flex gap-1 text-yellow-500 mt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={10}
                    fill={i < user.rating ? "#FACC15" : "none"}
                    stroke="#FACC15"
                  />
                ))}
              </div>

              <p className="text-sm text-gray-600 mt-2">{user.review}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
