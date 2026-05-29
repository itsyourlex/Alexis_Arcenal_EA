import { useState, useMemo, useEffect } from "react";
import { generateSalesData, SalesRecord, PRODUCTS_METADATA } from "./data";
import DashboardCharts from "./components/DashboardCharts";
import FileCenter from "./components/FileCenter";
import { motion, AnimatePresence } from "motion/react";
import {
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Award,
  Filter,
  Search,
  RefreshCw,
  Terminal,
  Grid,
  CheckCircle,
  HelpCircle,
  TrendingDown,
  Info
} from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "code">("dashboard");
  const [records, setRecords] = useState<SalesRecord[]>([]);

  // Filtering states
  const [selectedRegion, setSelectedRegion] = useState<string>("All");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Initialize records on load
  useEffect(() => {
    // Generate standard robust 150 entries deterministic dataset
    const data = generateSalesData(150);
    setRecords(data);
  }, []);

  // Filter records dynamically based on UI controllers
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const matchRegion = selectedRegion === "All" || r.region === selectedRegion;
      const matchCategory = selectedCategory === "All" || r.category === selectedCategory;
      const matchStatus = selectedStatus === "All" || r.status === selectedStatus;
      
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        q === "" ||
        r.product_name.toLowerCase().includes(q) ||
        r.order_id.toLowerCase().includes(q) ||
        r.customer_id.toLowerCase().includes(q);

      return matchRegion && matchCategory && matchStatus && matchSearch;
    });
  }, [records, selectedRegion, selectedCategory, selectedStatus, searchQuery]);

  // Dynamic KPI calculations on the ACTIVE filtered dataset
  // Total Revenue: sum of completed transactions only
  const completedOrders = useMemo(() => {
    return filteredRecords.filter((r) => r.status === "Completed");
  }, [filteredRecords]);

  const totalRevenue = useMemo(() => {
    return completedOrders.reduce((sum, r) => sum + r.total_amount, 0);
  }, [completedOrders]);

  const totalOrders = useMemo(() => {
    return filteredRecords.length;
  }, [filteredRecords]);

  // Average Order Value (AOV) calculated using completed orders
  const averageOrderValue = useMemo(() => {
    return completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0;
  }, [completedOrders, totalRevenue]);

  // Top selling category by revenue volume
  const topCategoryData = useMemo(() => {
    const categorySums: Record<string, number> = {};
    filteredRecords.forEach((r) => {
      categorySums[r.category] = (categorySums[r.category] || 0) + r.total_amount;
    });
    
    let top = "None";
    let max = 0;
    Object.entries(categorySums).forEach(([cat, sum]) => {
      if (sum > max) {
        max = sum;
        top = cat;
      }
    });
    
    return { category: top, amount: max };
  }, [filteredRecords]);

  // Dynamic KPI progress percentages matching the Elegant Dark theme aesthetics
  const totalAmountOfAllFiltered = useMemo(() => {
    return filteredRecords.reduce((sum, r) => sum + r.total_amount, 0);
  }, [filteredRecords]);

  const revenueRatio = useMemo(() => {
    return totalAmountOfAllFiltered > 0 ? (totalRevenue / totalAmountOfAllFiltered) * 100 : 0;
  }, [totalRevenue, totalAmountOfAllFiltered]);

  const volumeRatio = useMemo(() => {
    return records.length > 0 ? (totalOrders / records.length) * 100 : 0;
  }, [totalOrders, records]);

  const aovRatio = useMemo(() => {
    return Math.min(100, (averageOrderValue / 400) * 100);
  }, [averageOrderValue]);

  const categoryRatio = useMemo(() => {
    return totalRevenue > 0 ? (topCategoryData.amount / totalRevenue) * 100 : 0;
  }, [topCategoryData, totalRevenue]);

  // Reset all filters back to default values
  const handleResetFilters = () => {
    setSelectedRegion("All");
    setSelectedCategory("All");
    setSelectedStatus("All");
    setSearchQuery("");
  };

  const formattedRevenue = totalRevenue.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const formattedAOV = averageOrderValue.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div className="bg-slate-950 text-slate-200 min-h-screen flex flex-col font-sans selection:bg-blue-600 selection:text-white" id="main-app-container">
      {/* 1. Global Executive Header Navbar */}
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md px-6 py-4 flex flex-col md:flex-row md:items-center justify-between items-start gap-4 shadow-sm" id="global-navbar">
        <div className="flex items-center gap-3">
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white font-sans flex items-center gap-2">
              Sales Performance Executive Dashboard
              <span className="text-[10px] bg-slate-800 text-slate-400 font-mono tracking-wider px-2.5 py-0.5 rounded border border-slate-700">
                FY 2026
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
              Real-time Business Intelligence • Active Data Feed
            </p>
          </div>
        </div>

        {/* Professional Navigation Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-950/80 border border-slate-850 p-1 rounded-xl" id="nav-tabs-container">
          <button
            id="tab-selector-dashboard"
            onClick={() => setActiveTab("dashboard")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold tracking-tight transition-all duration-200 ${
              activeTab === "dashboard"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/10"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
            }`}
          >
            <Grid className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <button
            id="tab-selector-code"
            onClick={() => setActiveTab("code")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold tracking-tight transition-all duration-200 ${
              activeTab === "code"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/10"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>Developer File Center</span>
          </button>
        </div>
      </header>

      {/* 2. Primary Layout Workspace */}
      <main className="flex-grow p-4 sm:p-6 w-full max-w-7xl mx-auto space-y-6">
        <AnimatePresence mode="wait">
          {/* A. EXECUTIVE DASHBOARD TAB */}
          {activeTab === "dashboard" && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
              id="dashboard-tab-panel"
            >
              {/* Filter Controls Row */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4" id="dashboard-filters-panel">
                <div className="flex items-center gap-2 px-1">
                  <Filter className="w-4 h-4 text-blue-400" />
                  <div>
                    <h3 className="font-bold text-sm text-slate-250 leading-none">Intelligence Filter Deck</h3>
                    <p className="text-[10px] text-slate-500 mt-1">Isolate datasets across territories, verticals or statuses</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:flex flex-wrap items-center gap-3.5 flex-grow justify-end" id="filters-inputs-group">
                  {/* Keyword search input */}
                  <div className="relative" id="filter-search-container">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Search ID, product name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-lg pl-9 pr-4 py-2 w-full sm:w-52 focus:outline-none focus:border-blue-500 transition duration-150"
                    />
                  </div>

                  {/* Region dropdown */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1.5" id="filter-region-container">
                    <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Region</span>
                    <select
                      value={selectedRegion}
                      onChange={(e) => setSelectedRegion(e.target.value)}
                      className="bg-slate-950 border border-slate-800 text-xs text-slate-200 p-2 rounded-lg focus:outline-none focus:border-blue-500 transition duration-150 min-w-[110px]"
                    >
                      <option value="All">All Regions</option>
                      <option value="North">North Territory</option>
                      <option value="South">South Territory</option>
                      <option value="East">East Territory</option>
                      <option value="West">West Territory</option>
                    </select>
                  </div>

                  {/* Category dropdown */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1.5" id="filter-category-container">
                    <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Category</span>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="bg-slate-950 border border-slate-800 text-xs text-slate-200 p-2 rounded-lg focus:outline-none focus:border-blue-500 transition duration-150 min-w-[125px]"
                    >
                      <option value="All">All Categories</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Furniture">Furniture</option>
                      <option value="Office Supplies">Office Supplies</option>
                      <option value="Apparel">Apparel</option>
                    </select>
                  </div>

                  {/* Status dropdown */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1.5" id="filter-status-container">
                    <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Status</span>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="bg-slate-950 border border-slate-800 text-xs text-slate-200 p-2 rounded-lg focus:outline-none focus:border-blue-500 transition duration-150 min-w-[110px]"
                    >
                      <option value="All">All Statuses</option>
                      <option value="Completed">Completed</option>
                      <option value="Pending">Pending</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  {/* Clear filter button */}
                  {(selectedRegion !== "All" || selectedCategory !== "All" || selectedStatus !== "All" || searchQuery !== "") && (
                    <button
                      onClick={handleResetFilters}
                      id="filter-reset-button"
                      className="flex items-center justify-center gap-1.5 px-3 py-2 border border-slate-800 text-slate-450 hover:text-slate-100 hover:bg-slate-850/60 rounded-lg text-xs transition duration-150 font-medium"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Reset</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Dynamic KPI Cards Ribbon with elegant styling & progress bars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5" id="kpi-cards-grid">
                {/* KPI 1: Real Revenue */}
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-between" id="kpi-card-revenue">
                  <div className="flex justify-between items-start w-full">
                    <div>
                      <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Total Revenue</p>
                      <div className="flex items-baseline gap-2">
                        <h2 className="text-2xl font-bold text-white">{formattedRevenue}</h2>
                        <span className="text-emerald-400 text-xs font-medium font-mono">+{revenueRatio.toFixed(1)}%</span>
                      </div>
                    </div>
                    <div className="bg-emerald-500/10 text-emerald-400 p-2 rounded-lg border border-emerald-500/25">
                      <DollarSign className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="w-full bg-slate-850 h-1.5 mt-4 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: `${Math.min(100, Math.max(5, revenueRatio))}%` }}></div>
                  </div>
                </div>

                {/* KPI 2: Total transactional orders */}
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-between" id="kpi-card-volume">
                  <div className="flex justify-between items-start w-full">
                    <div>
                      <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Total Orders</p>
                      <div className="flex items-baseline gap-2">
                        <h2 className="text-2xl font-bold text-white">{totalOrders.toLocaleString()}</h2>
                        <span className="text-blue-400 text-xs font-medium font-mono">{(volumeRatio).toFixed(1)}% vol</span>
                      </div>
                    </div>
                    <div className="bg-blue-500/10 text-blue-400 p-2 rounded-lg border border-blue-500/25">
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="w-full bg-slate-850 h-1.5 mt-4 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full transition-all duration-500" style={{ width: `${Math.min(100, Math.max(5, volumeRatio))}%` }}></div>
                  </div>
                </div>

                {/* KPI 3: Average basket value */}
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-between" id="kpi-card-aov">
                  <div className="flex justify-between items-start w-full">
                    <div>
                      <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Avg Order Value</p>
                      <div className="flex items-baseline gap-2">
                        <h2 className="text-2xl font-bold text-white">{formattedAOV}</h2>
                        <span className="text-amber-400 text-xs font-medium font-mono">{aovRatio.toFixed(0)}% limit</span>
                      </div>
                    </div>
                    <div className="bg-amber-500/10 text-amber-500 p-2 rounded-lg border border-amber-500/25">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="w-full bg-slate-850 h-1.5 mt-4 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full transition-all duration-500" style={{ width: `${Math.min(100, Math.max(5, aovRatio))}%` }}></div>
                  </div>
                </div>

                {/* KPI 4: Anchor high selling Category */}
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-between" id="kpi-card-top-category">
                  <div className="flex justify-between items-start w-full">
                    <div>
                      <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Top Category</p>
                      <div className="flex items-baseline gap-2">
                        <h2 className="text-2xl font-bold text-white truncate max-w-[140px]">{topCategoryData.category}</h2>
                        <span className="text-purple-400 text-xs font-medium font-mono">{categoryRatio.toFixed(0)}% share</span>
                      </div>
                    </div>
                    <div className="bg-purple-500/10 text-purple-400 p-2 rounded-lg border border-purple-500/25">
                      <Award className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="w-full bg-slate-850 h-1.5 mt-4 rounded-full overflow-hidden">
                    <div className="bg-purple-500 h-full transition-all duration-500" style={{ width: `${Math.min(100, Math.max(5, categoryRatio))}%` }}></div>
                  </div>
                </div>
              </div>

              {/* Chart grid section */}
              {filteredRecords.length === 0 ? (
                <div className="bg-slate-900/50 border border-slate-850 p-16 rounded-xl text-center space-y-4 shadow-inner" id="fallback-no-records">
                  <div className="mx-auto w-12 h-12 rounded-full bg-blue-500/15 flex items-center justify-center text-blue-400">
                    <Info className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-200 text-sm sm:text-base">No Matching Entries Found</h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 leading-relaxed">
                      Your filters returned 0 rows. Please search keyword, try another territory or product category combination, or click Reset.
                    </p>
                  </div>
                  <button
                    onClick={handleResetFilters}
                    className="px-4 py-2 border border-slate-800 hover:bg-slate-800 bg-slate-900 text-blue-300 hover:text-white rounded-lg text-xs transition duration-150 font-bold"
                  >
                    Clear Filter Parameters
                  </button>
                </div>
              ) : (
                <DashboardCharts data={filteredRecords} />
              )}
            </motion.div>
          )}

          {/* B. DEVELOPER FILE CENTER TAB */}
          {activeTab === "code" && (
            <motion.div
              key="code"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              id="code-tab-panel"
            >
              <FileCenter records={records} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* 3. Global Information Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 px-6 py-6 text-center mt-12" id="global-footer">
        <p className="text-[11px] text-slate-500 font-mono">
          Sales Intelligence Platform • Generated for Google AI Studio • standalone enterprise build
        </p>
      </footer>
    </div>
  );
}
