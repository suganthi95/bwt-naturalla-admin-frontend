import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Trans } from "react-i18next";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useState } from "react";
export interface improvementData {
  id: string;
  title: string;
  subtitle: string;
  body: string[];
}
interface ImprovementContentProps {
  data: improvementData[];
}
const PrevArrow = (props: any) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} z-10 -left-4 absolute -top-1 -translate-y-1/2 cursor-pointer`}
      onClick={onClick}
      style={{ ...style }}
    >
      <ChevronLeft className="h-6 w-6 text-black dark:text-white" />
    </div>
  );
};

const NextArrow = (props: any) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} z-10 -right-4 absolute -top-1 -translate-y-1/2 cursor-pointer`}
      onClick={onClick}
      style={{ ...style }}
    >
      <ChevronRight className="h-6 w-6 text-black dark:text-white" />
    </div>
  );
};

export default function ImprovementContent({ data }: ImprovementContentProps) {
  const [activeTab, setActiveTab] = useState(data[0]?.id || "");

  var settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 2,
    initialSlide: 0,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
              arrows: true,

    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          arrows: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 0,
          arrows: true,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return (
    <div className="w-full p-4 border rounded-md">
      <h2 className="text-[#242424] text-lg md:text-balance text-start font-bold mb-4 dark:text-white">
        <Trans i18nKey={"areas_for_improvements"} />
      </h2>

      <div className="mb-4 ">
        <Slider {...settings}>
          {data.map((item) => (
            <div key={item.id} className="px-2 ">
              <button
                onClick={() => setActiveTab(item.id)}
                className={`w-full px-4 py-2 rounded text-sm whitespace-nowrap ${
                  activeTab === item.id
                    ? "bg-primary text-white"
                    : "bg-muted text-muted-foreground hover:bg-accent"
                }`}
              >
                {item.title}
              </button>
            </div>
          ))}
        </Slider>
      </div>

      <Tabs
        defaultValue={activeTab}
        value={activeTab}
        onValueChange={setActiveTab}
      >
        {data.map((item) => (
          <TabsContent key={item.id} value={item.id}>
            <h3 className="text-[#242424] dark:text-white text-sm font-bold mb-4">
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
