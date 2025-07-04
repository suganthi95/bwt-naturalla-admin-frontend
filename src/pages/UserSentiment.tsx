import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CustomerReviews from "@/components/user_sentiment/CustomerReviews";
import CustomerSupport from "@/components/user_sentiment/CustomerSupport";

export default function UserSentiment() {
  return (
    <div className="flex flex-col p-4 gap-3 md:p-4 w-full h-screen overflow-y-scroll md:pb-20 bg-slate-100">
      <div>
        <h1 className="text-xl font-semibold">User Sentiment</h1>
        <p className="text-xs text-slate-400">Manage all user interactions</p>
      </div>

      <div>
        <Tabs defaultValue="support" className="w-full">
          <div className="flex border-b-2  pb-1 items-center justify-between flex-wrap gap-2 mb-4">
            <TabsList className="flex translate-y-1.5 gap-2 bg-transparent p-0">
              <TabsTrigger
                value={"support"}
                className=" px-4 py-2 text-sm font-medium  transition-colors duration-200 ease-in-out  bg-transparen data-[state=active]:shadow-none   data-[state=active]:border-b-2 border-b-secondary-green   data-[state=active]:bg-transparent data-[state=active]:text-secondary-green"
              >
                Customer Support
              </TabsTrigger>

              <TabsTrigger
                value="reviews"
                className="group flex items-center gap-x-2 px-4 py-2 text-sm font-medium  transition-colors duration-200 ease-in-out  bg-transparen data-[state=active]:shadow-none   data-[state=active]:border-b-2 border-b-secondary-green   data-[state=active]:bg-transparent data-[state=active]:text-secondary-green"
              >
                Customer Reviews
                <Badge className="bg-gray-200 text-black group-data-[state=active]:bg-secondary-green group-data-[state=active]:text-white">
                  12
                </Badge>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="support">
            <CustomerSupport />
          </TabsContent>
          <TabsContent value="reviews">
            <CustomerReviews />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
