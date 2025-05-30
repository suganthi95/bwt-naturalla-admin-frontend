import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trans } from "react-i18next";
export interface improvementData {
  title: string;
  subtitle: string;
  body: string[];
}
interface ImprovementContentProps {
  data: improvementData[];
}
export default function ImprovementContent({ data }: ImprovementContentProps) {
  return (

    <div className="w-full p-4 border rounded-md">
      <h2 className="text-[#242424] text-start font-bold mb-4 dark:text-white">
        <Trans i18nKey={'areas_for_improvements'}/>
      </h2>

      <Tabs defaultValue={data[0]?.title || ""}>
        <TabsList className="mb-4 grid gap-x-3 dark:bg-transparent dark:border px-2 grid-cols-2 md:grid-cols-4 h-11">
          {data.slice(0,4).map((item) => (
            <TabsTrigger
              key={item.title}
              value={item.title}
              className="data-[state=active]:bg-primary dark:data-[state=active]:bg-primary rounded data-[state=active]:text-white"
            >
              {item.title}
            </TabsTrigger>
          ))}
        </TabsList>

        {data.map((item) => (
          <TabsContent key={item.subtitle} value={item.title}>
            <h3 className="text-[#242424] dark:text-white font-bold text-base mb-4">
              {item.subtitle}
            </h3>
            <ul className="list-disc list-inside dark:text-slate-300 space-y-2 text-neutral-700 text-sm">
              {item.body.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
