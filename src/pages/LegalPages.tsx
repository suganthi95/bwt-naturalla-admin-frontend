import { Button } from "@/components/ui/button";
import { Calendar, User } from "lucide-react";

const legalPages = [
  {
    id: 1,
    title: "Privacy Policy",
    description: "Details how we collect, use, and protect user information.",
    status: "published",
    date: "2024-07-01",
    author: "Admin",
  },
  {
    id: 2,
    title: "Terms & Conditions",
    description: "Outlines the rules and regulations for using our website.",
    status: "draft",
    date: "2024-06-20",
    author: "Legal Team",
  },
];

export default function LegalPages() {
  return (
    <div className="flex flex-col p-4 gap-3 md:p-4 w-full h-screen overflow-y-scroll md:pb-20 bg-slate-100">
      <div>
        <h1 className="text-xl font-semibold">Legal Pages</h1>
        <p className="text-[15px] text-[#4B5563]">
          Manage all your website legal pages and update them.
        </p>
      </div>

      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
        {legalPages.map((page) => (
          <li
            key={page.id}
            className="bg-white p-5 rounded-lg shadow-sm border space-y-2"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">
                {page.title}
              </h2>
              <span
                className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${
                  page.status === "published"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {page.status}
              </span>
            </div>

            <p className="text-sm text-gray-600">{page.description}</p>

            <div className="flex items-center justify-between text-sm text-gray-500 pt-4">
                <div className="flex items-center gap-x-4">

              <div className="flex items-center gap-x-2">
                <Calendar className="w-4 h-4" />
                <span>{page.date}</span>
              </div>
              <div className="flex items-center gap-x-2">
                <User className="w-4 h-4" />
                <span>{page.author}</span>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-3">
              <Button variant="outline" size="sm">
                View
              </Button>
              <Button size="sm">Edit</Button>
            </div>

                </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
