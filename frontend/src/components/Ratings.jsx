import {
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const rating = payload.find((p) => p.dataKey === "rating");
    const rank = payload.find((p) => p.dataKey === "rank");
    return (
      <div className="rounded-xl bg-base-100/90 p-4 shadow-xl border border-base-300 min-w-[180px]">
        <div className="font-bold text-primary mb-1">{label}</div>
        <div className="flex flex-col gap-1">
          <span className="text-success font-semibold">
            Rating: <span className="font-bold">{rating?.value}</span>
          </span>
          <span className="text-blue-500 font-semibold">
            Rank: <span className="font-bold">#{rank?.value}</span>
          </span>
        </div>
      </div>
    );
  }
  return null;
};

const Ratings = ({ contestRatings = [] }) => (
  <div className="bg-base-100 rounded-2xl p-6 shadow-xl border border-base-300">
    <div className="mb-4 flex items-center gap-4">
      <span className="inline-block w-4 h-4 rounded-full bg-success"></span>
      <span className="text-success font-semibold">Rating</span>
      <span className="inline-block w-4 h-4 rounded-full bg-blue-500 ml-6"></span>
      <span className="text-blue-500 font-semibold">Rank</span>
    </div>
    {contestRatings.length > 0 ? (
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart
          data={contestRatings}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorRating" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="contestName" tick={{ fontSize: 12 }} />
          <YAxis
            yAxisId="left"
            tick={{ fontSize: 12 }}
            label={{ value: "Rating", angle: -90, position: "insideLeft", fill: "#22c55e" }}
            domain={['auto', 'auto']}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fontSize: 12 }}
            label={{ value: "Rank (lower is better)", angle: 90, position: "insideRight", fill: "#3b82f6" }}
            domain={[(dataMin) => Math.max(...contestRatings.map((d) => d.rank || 1)), (dataMax) => 1]}
            allowDecimals={false}
            reversed
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            yAxisId="left"
            type="monotone"
            dataKey="rating"
            stroke="#22c55e"
            fillOpacity={1}
            fill="url(#colorRating)"
            strokeWidth={3}
            dot={{ r: 5, stroke: '#22c55e', strokeWidth: 2, fill: '#fff' }}
            activeDot={{ r: 7 }}
            name="Rating"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="rank"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={{ r: 5, stroke: '#3b82f6', strokeWidth: 2, fill: '#fff' }}
            activeDot={{ r: 7 }}
            name="Rank"
          />
        </AreaChart>
      </ResponsiveContainer>
    ) : (
      <div className="text-base-content/70 text-center">
        No contest rating data yet
      </div>
    )}
  </div>
);

export default Ratings;
