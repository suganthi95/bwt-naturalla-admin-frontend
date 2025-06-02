import { Trans } from "react-i18next";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Rectangle,
} from "recharts";

export type YearlySentiment = {
  year: string;
  positive: number;
  negative: number;
};

export type MonthlySentiment = {
  year: string;
  month: string;
  positive: number;
  negative: number;
};

export type SentimentStats = {
  yearly: YearlySentiment[];
  monthly: MonthlySentiment[];
};

export default function OverviewChartCard({ monthly }: SentimentStats) {
  // Transform monthly data for chart
  const chartData = monthly.map((item) => ({
    name: `${item.month} ${item.year}`,
    positive: item.positive,
    negative: item.negative,
  }));

  return (
    <div className="w-full p-2 md:p-4 border rounded-md flex flex-col">
      <h2 className="text-[#242424] text-lg md:text-balance font-bold mb-4 dark:text-white text-base sm:text-lg">
        <Trans i18nKey={'sentiment_over_years'}/>
      </h2>

      <div className="w-full h-[250px] sm:h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
          >
            <XAxis dataKey="name" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip  active />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar
              dataKey="positive"
              fill="#119E29"
              name="Positive"
              activeBar={<Rectangle fill="lightgreen" stroke="#119E29" />}
              barSize={20}
            />
            
            <Bar
              dataKey="negative"
              fill="#F02800"
              name="Negative"
              activeBar={<Rectangle fill="lightcoral" stroke="#F02800" />}
              barSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
