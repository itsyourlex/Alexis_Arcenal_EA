import { useState } from "react";
import { Download, Copy, Check, FileCode, FileText, Database, ShieldCheck, Terminal, HelpCircle } from "lucide-react";
import { SalesRecord, getPythonCode, getCSVString } from "../data";

interface FileCenterProps {
  records: SalesRecord[];
}

export default function FileCenter({ records }: FileCenterProps) {
  const [activeFile, setActiveFile] = useState<"python" | "csv" | "html">("python");
  const [isCopied, setIsCopied] = useState(false);

  // CSV Representation string
  const csvContent = getCSVString(records);

  // Generate python code content
  const pythonCode = getPythonCode();

  // Create standalone, highly professional static HTML dashboard using the client records
  const generateStandaloneHTML = () => {
    // We stringify the records to embed directly in the HTML file's JavaScript context!
    const stringifiedRecords = JSON.stringify(records);

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Enterprise Sales Performance Dashboard (Plotly Standing Editor)</title>
    <!-- Tailwind CSS Script CDN for fully-styled export -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Google Fonts Inter -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    <!-- Plotly Core CDN library -->
    <script src="https://cdn.plot.ly/plotly-2.24.1.min.js"></script>
    <style>
        body {
            font-family: 'Inter', sans-serif;
            background-color: #0b0f19;
            color: #f1f5f9;
        }
    </style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen">
    <div class="flex flex-col min-h-screen">
        <!-- Top Executive Navbar -->
        <header class="border-b border-slate-800 bg-slate-900/60 backdrop-blur sticky top-0 z-50 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <div class="flex items-center gap-3">
                    <span class="flex h-3.5 w-3.5 rounded-full bg-emerald-500"></span>
                    <h1 class="text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
                        SALES PERFORMANCE METRICS
                        <span class="text-xs bg-indigo-500/20 text-indigo-400 font-mono tracking-wider px-2.5 py-0.5 rounded-full border border-indigo-500/30">STANDALONE EXPORT</span>
                    </h1>
                </div>
                <p class="text-xs text-slate-400 mt-1">Strategic Business Intelligence Core • Standalone Local Client</p>
            </div>
            <div class="flex items-center gap-4 text-xs font-mono text-slate-400 bg-slate-950 border border-slate-800 px-4 py-2.5 rounded-lg shadow-inner">
                <div>CLIENT COMPILED: <span class="text-emerald-400 font-bold">READY</span></div>
                <div class="h-4 w-px bg-slate-800"></div>
                <div>EXCEPTED DATA: <span class="text-white font-bold" id="total-rows-el"></span></div>
            </div>
        </header>

        <main class="flex-grow p-6 space-y-6 max-w-7xl mx-auto w-full">
            <!-- Executive KPI Ribbon -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <!-- KPI 1: Revenue -->
                <div class="bg-slate-900 border border-slate-800/80 rounded-xl p-5 shadow-xl flex items-center justify-between">
                    <div>
                        <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Total Net Revenue</span>
                        <h2 class="text-3xl font-black text-emerald-400 mt-1" id="kpi-revenue">$0.00</h2>
                        <span class="text-[10px] text-emerald-500/80 mt-1 block">✔ Confirmed completed status only</span>
                    </div>
                    <div class="bg-emerald-500/10 text-emerald-400 p-3 rounded-xl border border-emerald-500/20">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                </div>

                <!-- KPI 2: Total Orders -->
                <div class="bg-slate-900 border border-slate-800/80 rounded-xl p-5 shadow-xl flex items-center justify-between">
                    <div>
                        <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Total volume</span>
                        <h2 class="text-3xl font-black text-white mt-1" id="kpi-orders">0</h2>
                        <span class="text-[10px] text-slate-400 mt-1 block">Count of all transaction flags</span>
                    </div>
                    <div class="bg-indigo-500/10 text-indigo-400 p-3 rounded-xl border border-indigo-500/20">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                    </div>
                </div>

                <!-- KPI 3: AOV -->
                <div class="bg-slate-900 border border-slate-800/80 rounded-xl p-5 shadow-xl flex items-center justify-between">
                    <div>
                        <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Avg Order Value</span>
                        <h2 class="text-3xl font-black text-blue-400 mt-1" id="kpi-aov">$0.00</h2>
                        <span class="text-[10px] text-blue-400/80 mt-1 block">Net revenue per fulfilled order</span>
                    </div>
                    <div class="bg-blue-500/10 text-blue-400 p-3 rounded-xl border border-blue-500/20">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2"></path></svg>
                    </div>
                </div>

                <!-- KPI 4: Top Category -->
                <div class="bg-slate-900 border border-slate-800/80 rounded-xl p-5 shadow-xl flex items-center justify-between">
                    <div>
                        <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Anchor Category</span>
                        <h2 class="text-2xl font-black text-amber-400 mt-1 truncate max-w-[160px]" id="kpi-top-cat">Loading...</h2>
                        <span class="text-[10px] text-amber-500/80 mt-1 block" id="kpi-top-cat-sub">Dynamic computing</span>
                    </div>
                    <div class="bg-amber-500/10 text-amber-400 p-3 rounded-xl border border-amber-500/20">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>
                    </div>
                </div>
            </div>

            <!-- Visualization Grid Layout -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Chart Cell 1 -->
                <div class="bg-slate-900 border border-slate-800/80 rounded-xl p-4 shadow-xl">
                    <div class="mb-2 px-2 flex justify-between items-center">
                        <div>
                            <h3 class="text-sm font-bold text-slate-200">Revenue Contribution Analysis</h3>
                            <p class="text-[11px] text-slate-400 mt-0.5">Distribution across primary product verticals</p>
                        </div>
                        <span class="h-2 w-2 rounded-full bg-blue-500"></span>
                    </div>
                    <div class="h-[285px]" id="plt-bar"></div>
                </div>

                <!-- Chart Cell 2 -->
                <div class="bg-slate-900 border border-slate-800/80 rounded-xl p-4 shadow-xl">
                    <div class="mb-2 px-2 flex justify-between items-center">
                        <div>
                            <h3 class="text-sm font-bold text-slate-200">Temporal Growth Cycle</h3>
                            <p class="text-[11px] text-slate-400 mt-0.5">Chronological sales volume and path metrics</p>
                        </div>
                        <span class="h-2 w-2 rounded-full bg-emerald-500"></span>
                    </div>
                    <div class="h-[285px]" id="plt-line"></div>
                </div>

                <!-- Chart Cell 3 -->
                <div class="bg-slate-900 border border-slate-800/80 rounded-xl p-4 shadow-xl">
                    <div class="mb-2 px-2 flex justify-between items-center">
                        <div>
                            <h3 class="text-sm font-bold text-slate-200">Fulfillment Pipeline Health</h3>
                            <p class="text-[11px] text-slate-400 mt-0.5">Allocation by order fulfillment stage</p>
                        </div>
                        <span class="h-2 w-2 rounded-full bg-rose-500"></span>
                    </div>
                    <div class="h-[285px]" id="plt-donut"></div>
                </div>

                <!-- Chart Cell 4 -->
                <div class="bg-slate-900 border border-slate-800/80 rounded-xl p-4 shadow-xl">
                    <div class="mb-2 px-2 flex justify-between items-center">
                        <div>
                            <h3 class="text-sm font-bold text-slate-200">Territorial Penetration Grid</h3>
                            <p class="text-[11px] text-slate-400 mt-0.5">Total consolidated sales across geographic markets</p>
                        </div>
                        <span class="h-2 w-2 rounded-full bg-violet-500"></span>
                    </div>
                    <div class="h-[285px]" id="plt-region"></div>
                </div>
            </div>
        </main>

        <!-- Footer -->
        <footer class="border-t border-slate-800 bg-slate-900/40 text-center py-6 px-4">
            <p class="text-xs text-slate-500 font-mono">&copy; 2026 Enterprise BI Systems. Locally compiled standalone dashboard.</p>
        </footer>
    </div>

    <!-- Live execution logic to plot charts using the injected records -->
    <script>
        const rawSalesRecords = ${stringifiedRecords};

        document.getElementById('total-rows-el').innerText = rawSalesRecords.length + ' ROWS';

        // 1. Calculate KPI figures
        const completedOnly = rawSalesRecords.filter(r => r.status === 'Completed');
        const totalRevenue = completedOnly.reduce((acc, curr) => acc + curr.total_amount, 0);
        const totalOrders = rawSalesRecords.length;
        const averageOrderValue = completedOnly.length > 0 ? (totalRevenue / completedOnly.length) : 0;

        // Find top category
        const catMap = {};
        rawSalesRecords.forEach(r => {
            catMap[r.category] = (catMap[r.category] || 0) + r.total_amount;
        });
        let topCategory = "N/A";
        let topCatAmount = 0;
        Object.entries(catMap).forEach(([cat, val]) => {
            if (val > topCatAmount) {
                topCatAmount = val;
                topCategory = cat;
            }
        });

        // Set KPI fields
        document.getElementById('kpi-revenue').innerText = '$' + totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        document.getElementById('kpi-orders').innerText = totalOrders.toLocaleString('en-US');
        document.getElementById('kpi-aov').innerText = '$' + averageOrderValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        document.getElementById('kpi-top-cat').innerText = topCategory;
        document.getElementById('kpi-top-cat-sub').innerText = 'Revenue contribution: $' + topCatAmount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

        // 2. Plotting Utilities
        const fontConfig = { family: 'Inter, sans-serif', color: '#e2e8f0' };

        const premiumLayout = {
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)',
            font: fontConfig,
            margin: { l: 45, r: 15, t: 30, b: 35 },
            hovermode: 'closest'
        };

        // Chart 1: Revenue by Category
        const sortedCats = Object.entries(catMap).sort((a,b) => a[1] - b[1]);
        const barTrace = {
            y: sortedCats.map(x => x[0]),
            x: sortedCats.map(x => x[1]),
            type: 'bar',
            orientation: 'h',
            marker: {
                color: sortedCats.map(x => {
                    if (x[0] === 'Electronics') return '#3b82f6';
                    if (x[0] === 'Office Supplies') return '#10b981';
                    if (x[0] === 'Furniture') return '#6366f1';
                    return '#f59e0b';
                }),
                line: { color: '#1e293b', width: 1.5 }
            },
            hovertemplate: '<b>%{y}</b><br>Revenue: $%{x:,.2f}<extra></extra>'
        };
        Plotly.newPlot('plt-bar', [barTrace], {
            ...premiumLayout,
            xaxis: { showgrid: false, color: '#94a3b8', linecolor: '#475569' },
            yaxis: { showgrid: false, color: '#94a3b8' }
        }, { responsive: true, displayModeBar: false });

        // Chart 2: Monthly Trend
        const monthlyMap = {};
        rawSalesRecords.forEach(r => {
            const m = r.order_date.substring(0, 7); // "YYYY-MM"
            monthlyMap[m] = (monthlyMap[m] || 0) + r.total_amount;
        });
        const monthNames = {
            '2025-06': 'Jun 25', '2025-07': 'Jul 25', '2025-08': 'Aug 25',
            '2025-09': 'Sep 25', '2025-10': 'Oct 25', '2025-11': 'Nov 25',
            '2025-12': 'Dec 25', '2026-01': 'Jan 26', '2026-02': 'Feb 26',
            '2026-03': 'Mar 26', '2026-04': 'Apr 26', '2026-05': 'May 26'
        };
        const chronMonths = Object.keys(monthlyMap).sort();
        const lineTrace = {
            x: chronMonths.map(m => monthNames[m] || m),
            y: chronMonths.map(m => monthlyMap[m]),
            type: 'scatter',
            mode: 'lines+markers',
            line: { color: '#10b981', width: 3, shape: 'spline' },
            marker: { size: 8, color: '#f59e0b', line: { color: '#0f172a', width: 1.5 } },
            hovertemplate: '<b>Period: %{x}</b><br>Revenue: $%{y:,.2f}<extra></extra>'
        };
        Plotly.newPlot('plt-line', [lineTrace], {
            ...premiumLayout,
            xaxis: { showgrid: false, color: '#94a3b8', linecolor: '#475569' },
            yaxis: { showgrid: true, gridcolor: '#1e293b', color: '#94a3b8' }
        }, { responsive: true, displayModeBar: false });

        // Chart 3: Order Status Pie
        const statusMap = { 'Completed': 0, 'Pending': 0, 'Cancelled': 0 };
        rawSalesRecords.forEach(r => {
            statusMap[r.status] = (statusMap[r.status] || 0) + 1;
        });
        const donutTrace = {
            labels: Object.keys(statusMap),
            values: Object.values(statusMap),
            type: 'pie',
            hole: 0.55,
            marker: {
                colors: ['#10b981', '#f59e0b', '#ef4444'],
                line: { color: '#0f172a', width: 2 }
            },
            textinfo: 'percent',
            textposition: 'inside',
            hovertemplate: '<b>%{label}</b><br>Count: %{value}<extra></extra>'
        };
        Plotly.newPlot('plt-donut', [donutTrace], {
            ...premiumLayout,
            showlegend: true,
            legend: { x: 0.8, y: 0.5, font: { size: 10 } },
            margin: { l: 15, r: 15, t: 15, b: 15 }
        }, { responsive: true, displayModeBar: false });

        // Chart 4: Region Analysis
        const regionMap = { 'North': 0, 'South': 0, 'East': 0, 'West': 0 };
        rawSalesRecords.forEach(r => {
            regionMap[r.region] = (regionMap[r.region] || 0) + r.total_amount;
        });
        const regionColors = ['#6366f1', '#10b981', '#3b82f6', '#f59e0b'];
        const regionTrace = {
            x: Object.keys(regionMap),
            y: Object.values(regionMap),
            type: 'bar',
            marker: {
                color: regionColors,
                line: { color: '#10b981', width: 0.8 }
            },
            hovertemplate: '<b>Region: %{x}</b><br>Revenue: $%{y:,.2f}<extra></extra>'
        };
        Plotly.newPlot('plt-region', [regionTrace], {
            ...premiumLayout,
            xaxis: { showgrid: false, color: '#94a3b8', linecolor: '#475569' },
            yaxis: { showgrid: true, gridcolor: '#1e293b', color: '#94a3b8' }
        }, { responsive: true, displayModeBar: false });

    </script>
</body>
</html>`;
  };

  const handleCopyCode = () => {
    let sourceText = "";
    if (activeFile === "python") {
      sourceText = pythonCode;
    } else if (activeFile === "csv") {
      sourceText = csvContent;
    } else {
      sourceText = generateStandaloneHTML();
    }

    navigator.clipboard.writeText(sourceText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const triggerDownload = (filename: string, text: string, mimeType: string) => {
    const blob = new Blob([text], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6" id="development-files-center">
      {/* File Tree Explorer Side Rails */}
      <div className="xl:col-span-1 bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between" id="file-tree-sidebar">
        <div>
          <div className="flex items-center gap-2 mb-4 px-1">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-sm text-slate-200 tracking-tight font-display">WORKSPACE EXPORTS</h3>
          </div>
          <p className="text-xs text-slate-400 mb-5 px-1 leading-relaxed">
            Download the pre-compiled standalone assets, or obtain the exact Python code designed for immediate execution in VS Code.
          </p>

          <div className="space-y-1.5" id="file-picker-group">
            <button
              id="file-picker-python"
              onClick={() => setActiveFile("python")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition duration-200 border text-left ${
                activeFile === "python"
                  ? "bg-indigo-600/10 border-indigo-500/40 text-indigo-300 font-semibold"
                  : "bg-transparent border-transparent text-slate-400 hover:bg-slate-800/40 hover:text-slate-200"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FileCode className={`w-4 h-4 ${activeFile === "python" ? "text-indigo-400" : "text-slate-500"}`} />
                <span className="font-mono">dashboard.py</span>
              </div>
              <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded">Python</span>
            </button>

            <button
              id="file-picker-html"
              onClick={() => setActiveFile("html")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition duration-200 border text-left ${
                activeFile === "html"
                  ? "bg-emerald-600/10 border-emerald-500/40 text-emerald-300 font-semibold"
                  : "bg-transparent border-transparent text-slate-400 hover:bg-slate-800/40 hover:text-slate-200"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FileCode className={`w-4 h-4 ${activeFile === "html" ? "text-emerald-400" : "text-slate-500"}`} />
                <span className="font-mono">Sales_Performance_...</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">HTML</span>
            </button>

            <button
              id="file-picker-csv"
              onClick={() => setActiveFile("csv")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition duration-200 border text-left ${
                activeFile === "csv"
                  ? "bg-purple-600/10 border-purple-500/40 text-purple-300 font-semibold"
                  : "bg-transparent border-transparent text-slate-400 hover:bg-slate-800/40 hover:text-slate-200"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Database className={`w-4 h-4 ${activeFile === "csv" ? "text-purple-400" : "text-slate-500"}`} />
                <span className="font-mono">sales_data.csv</span>
              </div>
              <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded">CSV</span>
            </button>
          </div>
        </div>

        {/* Quick Help box */}
        <div id="file-instructions border-t border-slate-800/50 pt-4" className="mt-6 border-t border-slate-800/80 pt-4 text-xs">
          <div className="flex items-center gap-1.5 text-slate-300 font-bold mb-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span>VS CODE EXECUTION GUIDE</span>
          </div>
          <ol className="list-decimal pl-4 space-y-1.5 text-slate-400 text-[11px] leading-relaxed">
            <li>Initialize folder on your computer.</li>
            <li>Copy & paste <code className="text-slate-300 font-mono bg-slate-950 px-1 py-0.2 rounded">dashboard.py</code>.</li>
            <li>Run in terminal:
              <pre className="mt-1 bg-slate-950 p-1.5 rounded text-[10px] text-emerald-400 font-mono select-all overflow-x-auto border border-slate-800">
                pip install pandas plotly faker
              </pre>
            </li>
            <li>Produce assets:
              <pre className="mt-1 bg-slate-950 p-1.5 rounded text-[10px] text-indigo-400 font-mono select-all overflow-x-auto border border-slate-800">
                python dashboard.py
              </pre>
            </li>
          </ol>
        </div>
      </div>

      {/* Code / Editor Viewer Container */}
      <div className="xl:col-span-3 bg-slate-900/60 border border-slate-800 rounded-2xl flex flex-col h-[520px] overflow-hidden shadow-xl" id="editor-body">
        {/* Editor Ribbon Status */}
        <div className="bg-slate-950/80 px-4 py-3 border-b border-slate-800 flex items-center justify-between" id="editor-header">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            {activeFile === "python" && <FileCode className="w-3.5 h-3.5 text-indigo-400" />}
            {activeFile === "html" && <FileCode className="w-3.5 h-3.5 text-emerald-400" />}
            {activeFile === "csv" && <Database className="w-3.5 h-3.5 text-purple-400" />}
            <span className="text-slate-200">
              {activeFile === "python" ? "dashboard.py" : activeFile === "html" ? "Sales_Performance_Dashboard.html" : "sales_data.csv"}
            </span>
            <span className="text-slate-500">•</span>
            <span>UTF-8</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="editor-copy-button"
              onClick={handleCopyCode}
              title="Copy code to clipboard"
              className="px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition duration-150 text-xs flex items-center gap-1.5"
            >
              {isCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold font-mono">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span className="font-mono">Copy Code</span>
                </>
              )}
            </button>

            <button
              id="editor-download-button"
              onClick={() => {
                if (activeFile === "python") {
                  triggerDownload("dashboard.py", pythonCode, "text/plain");
                } else if (activeFile === "csv") {
                  triggerDownload("sales_data.csv", csvContent, "text/csv");
                } else {
                  triggerDownload("Sales_Performance_Dashboard.html", generateStandaloneHTML(), "text/html");
                }
              }}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-mono px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 font-bold transition duration-150"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download File</span>
            </button>
          </div>
        </div>

        {/* Text Frame Area */}
        <div className="flex-grow p-4 overflow-auto font-mono text-xs bg-slate-950/50 leading-relaxed text-slate-300 block select-text">
          {activeFile === "python" && (
            <pre className="whitespace-pre overflow-x-auto text-indigo-200" id="pre-code-python">
              {pythonCode}
            </pre>
          )}

          {activeFile === "html" && (
            <pre className="whitespace-pre overflow-x-auto text-emerald-250" id="pre-code-html">
              {generateStandaloneHTML()}
            </pre>
          )}

          {activeFile === "csv" && (
            <div className="font-mono text-[11px] text-purple-200 overflow-x-auto" id="pre-code-csv">
              <div className="text-slate-500 select-none pb-2 border-b border-slate-800 mb-2">
                # Pre-computed live records (150+ lines generated dynamically matching strict columns schema):
              </div>
              <pre className="whitespace-pre">{csvContent}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
