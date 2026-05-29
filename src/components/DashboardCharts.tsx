import { useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { SalesRecord } from "../data";

interface ChartsProps {
  data: SalesRecord[];
}

// Visual layout colors matching Tailwind Emerald/Blue/Indigo/Amber palette
const CHART_COLORS = ["#3b82f6", "#10b981", "#6366f1", "#f59e0b", "#ef4444"];
const CATEGORY_COLORS: Record<string, string> = {
  Electronics: "#3b82f6",
  "Office Supplies": "#10b981",
  Furniture: "#6366f1",
  Apparel: "#f59e0b",
};
const STATUS_COLORS: Record<string, string> = {
  Completed: "#10b981",
  Pending: "#f59e0b",
  Cancelled: "#ef4444",
};

export default function DashboardCharts({ data }: ChartsProps) {
  // 1. Data Processing: Bar Chart -> Revenue by Category
  const categoryData = useMemo(() => {
    const sums: Record<string, { category: string; revenue: number; orders: number }> = {};
    data.forEach((r) => {
      if (!sums[r.category]) {
        sums[r.category] = { category: r.category, revenue: 0, orders: 0 };
      }
      // Sum revenue for Completed files only? Let's sum for completed orders or all?
      // Business intelligence dashboards usually track gross or completed. Let's sum complete revenue, or total?
      // Let's sum total amount of completed/pending and exclude cancelled, or sum total records?
      // Let's do completed and pending, or simple sum to make it clear. Simple sum of all records matches CSV directly!
      sums[r.category].revenue += r.total_amount;
      sums[r.category].orders += r.quantity;
    });
    return Object.values(sums).sort((a, b) => b.revenue - a.revenue);
  }, [data]);

  // 2. Data Processing: Line Chart -> Monthly Sales Trend (chronologically sorted)
  const monthlyData = useMemo(() => {
    const months: Record<string, { month: string; revenue: number; count: number }> = {};
    data.forEach((r) => {
      const dateParts = r.order_date.split("-");
      if (dateParts.length < 2) return;
      const monthKey = `${dateParts[0]}-${dateParts[1]}`; // e.g. "2025-06"
      if (!months[monthKey]) {
        months[monthKey] = { month: monthKey, revenue: 0, count: 0 };
      }
      months[monthKey].revenue += r.total_amount;
      months[monthKey].count += 1;
    });

    const monthNames: Record<string, string> = {
      "2025-06": "Jun 25",
      "2025-07": "Jul 25",
      "2025-08": "Aug 25",
      "2025-09": "Sep 25",
      "2025-10": "Oct 25",
      "2025-11": "Nov 25",
      "2025-12": "Dec 25",
      "2026-01": "Jan 26",
      "2026-02": "Feb 26",
      "2026-03": "Mar 26",
      "2026-04": "Apr 26",
      "2026-05": "May 26",
    };

    return Object.keys(months)
      .sort()
      .map((key) => ({
        monthKey: key,
        label: monthNames[key] || key,
        revenue: Math.round(months[key].revenue * 100) / 100,
        orders: months[key].count,
      }));
  }, [data]);

  // 3. Data Processing: Donut Chart -> Order Status Distribution
  const statusData = useMemo(() => {
    const statuses: Record<string, number> = { Completed: 0, Pending: 0, Cancelled: 0 };
    data.forEach((r) => {
      statuses[r.status] = (statuses[r.status] || 0) + 1;
    });
    return Object.entries(statuses).map(([name, value]) => ({ name, value }));
  }, [data]);

  // 4. Data Processing: Region Analysis Chart -> Revenue by Region
  const regionData = useMemo(() => {
    const regions: Record<string, { name: string; revenue: number; orders: number }> = {
      North: { name: "North", revenue: 0, orders: 0 },
      South: { name: "South", revenue: 0, orders: 0 },
      East: { name: "East", revenue: 0, orders: 0 },
      West: { name: "West", revenue: 0, orders: 0 },
    };
    data.forEach((r) => {
      if (regions[r.region]) {
        regions[r.region].revenue += r.total_amount;
        regions[r.region].orders += 1;
      }
    });
    return Object.values(regions).map((item) => ({
      ...item,
      revenue: Math.round(item.revenue * 100) / 100,
    }));
  }, [data]);

  // Custom tooltips styling for cohesive branding
  const formatCurrency = (val: number) => `$${val.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 border border-slate-700/80 px-3 py-2 rounded-lg shadow-xl text-xs font-sans text-slate-100 backdrop-blur-md">
          <p className="font-semibold text-slate-300 mb-1">{label || payload[0].name}</p>
          <div className="space-y-0.5">
            {payload.map((entry: any, index: number) => (
              <p key={index} style={{ color: entry.stroke || entry.fill || "#f8fafc" }}>
                <span className="text-slate-400 mr-1.5">{entry.name}:</span>
                <span className="font-bold">
                  {entry.name.toLowerCase().includes("revenue") || entry.name.toLowerCase().includes("value")
                    ? formatCurrency(entry.value)
                    : entry.value.toLocaleString()}
                </span>
              </p>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="dashboard-charts-grid">
      {/* 1. Bar Chart: Revenue by Category */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700/60 transition duration-300 shadow-xl flex flex-col h-[380px]" id="chart-revenue-category">
        <div className="mb-4">
          <h3 className="text-sm font-bold tracking-tight text-slate-200">Revenue by Product Category</h3>
          <p className="text-[11px] text-slate-400">Total gross revenue distributed relative to category streams</p>
        </div>
        <div className="flex-grow w-full h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryData} layout="vertical" margin={{ left: 10, right: 10, top: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
              <XAxis type="number" stroke="#94a3b8" fontSize={10} tickFormatter={(v) => `$${v}`} />
              <YAxis dataKey="category" type="category" stroke="#94a3b8" fontSize={10} width={90} />
              <Tooltip content={customTooltip} cursor={{ fill: "rgba(255, 255, 255, 0.03)" }} />
              <Bar dataKey="revenue" name="Total Revenue" radius={[0, 4, 4, 0]}>
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.category] || "#3b82f6"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Line Chart: Monthly Sales Trend */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700/60 transition duration-300 shadow-xl flex flex-col h-[380px]" id="chart-monthly-trend">
        <div className="mb-4">
          <h3 className="text-sm font-bold tracking-tight text-slate-200">Monthly Sales Trend</h3>
          <p className="text-[11px] text-slate-400">Chronological net revenue performance across 12 periods</p>
        </div>
        <div className="flex-grow w-full h-[260px]">
          {monthlyData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs text-slate-500">No chronological tracking data for selected filter</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData} margin={{ left: 10, right: 10, top: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="label" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={10} tickFormatter={(v) => `$${v}`} />
                <Tooltip content={customTooltip} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  name="Monthly Revenue"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={{ r: 4, strokeWidth: 1.5, fill: "#0f172a" }}
                  activeDot={{ r: 6, stroke: "#f59e0b", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* 3. Donut Chart: Order Status Distribution */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700/60 transition duration-300 shadow-xl flex flex-col h-[380px]" id="chart-order-status">
        <div className="mb-4">
          <h3 className="text-sm font-bold tracking-tight text-slate-200">Order Status Distribution</h3>
          <p className="text-[11px] text-slate-400">Total pipeline breakdown by fulfillment state</p>
        </div>
        <div className="flex-grow w-full h-[260px] flex flex-col sm:flex-row items-center justify-around gap-2">
          <div className="w-[180px] h-[180px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name] || "#3b82f6"} />
                  ))}
                </Pie>
                <Tooltip content={customTooltip} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center HUD */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Total Logs</span>
              <span className="text-xl font-black text-slate-100 mt-0.5">{data.length}</span>
            </div>
          </div>

          <div className="space-y-2.5 text-xs w-full sm:w-auto px-4">
            {statusData.map((item, index) => {
              const matches = data.filter((d) => d.status === item.name);
              const percentage = data.length > 0 ? ((matches.length / data.length) * 100).toFixed(1) : "0";
              const totalVal = matches.reduce((acc, curr) => acc + curr.total_amount, 0);
              return (
                <div key={index} className="flex items-center justify-between gap-6 bg-slate-950/40 p-2 rounded-lg border border-slate-800/30">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: STATUS_COLORS[item.name] }} />
                    <span className="font-semibold text-slate-300">{item.name}</span>
                  </div>
                  <div className="text-right font-mono text-[11px]">
                    <span className="text-white font-bold">{item.value} ({percentage}%)</span>
                    <span className="block text-slate-500">{formatCurrency(totalVal)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Region Analysis Chart: Revenue by Region */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700/60 transition duration-300 shadow-xl flex flex-col h-[380px]" id="chart-region-sales">
        <div className="mb-4">
          <h3 className="text-sm font-bold tracking-tight text-slate-200">Regional Sales Penetration</h3>
          <p className="text-[11px] text-slate-400">Consolidated revenues localized by geographic market boundaries</p>
        </div>
        <div className="flex-grow w-full h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={regionData} margin={{ left: 10, right: 10, top: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
              <YAxis stroke="#94a3b8" fontSize={10} tickFormatter={(v) => `$${v}`} />
              <Tooltip content={customTooltip} cursor={{ fill: "rgba(255, 255, 255, 0.02)" }} />
              <Bar dataKey="revenue" name="Regional Revenue" fill="#6366f1" radius={[4, 4, 0, 0]}>
                {regionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
