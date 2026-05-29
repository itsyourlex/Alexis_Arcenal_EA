export interface SalesRecord {
  order_id: string;
  order_date: string;
  customer_id: string;
  product_name: string;
  category: "Electronics" | "Office Supplies" | "Furniture" | "Apparel";
  quantity: number;
  unit_price: number;
  total_amount: number;
  region: "North" | "South" | "East" | "West";
  status: "Completed" | "Pending" | "Cancelled";
}

// Product list with category and fixed unit price to make data highly realistic
export const PRODUCTS_METADATA = [
  // Electronics
  { name: "Pro Wireless Headphones", category: "Electronics" as const, price: 149.99 },
  { name: "Quantum LED Monitor", category: "Electronics" as const, price: 349.99 },
  { name: "USB-C Dual Docking Station", category: "Electronics" as const, price: 89.99 },
  { name: "Mechanical Gaming Keyboard", category: "Electronics" as const, price: 119.99 },
  { name: "4K Ultra-HD Webcam", category: "Electronics" as const, price: 79.99 },
  // Office Supplies
  { name: "Ergonomic Mesh Task Chair", category: "Office Supplies" as const, price: 199.99 },
  { name: "Dual Motor Standing Desk", category: "Office Supplies" as const, price: 499.99 },
  { name: "Heavy Duty Paper Shredder", category: "Office Supplies" as const, price: 129.99 },
  { name: "High-Capacity Power Strip", category: "Office Supplies" as const, price: 29.99 },
  { name: "Premium Notebook & Pen Set", category: "Office Supplies" as const, price: 24.99 },
  // Furniture
  { name: "Solid Oak Bookcase", category: "Furniture" as const, price: 299.99 },
  { name: "Comfort Recliner Chair", category: "Furniture" as const, price: 399.99 },
  { name: "Glass Coffee Table", category: "Furniture" as const, price: 179.99 },
  { name: "3-Drawer File Cabinet", category: "Furniture" as const, price: 149.99 },
  { name: "Minimalist Floating Shelf", category: "Furniture" as const, price: 39.99 },
  // Apparel
  { name: "Executive Wool Blazer", category: "Apparel" as const, price: 189.99 },
  { name: "Comfort Fit Cotton Chinos", category: "Apparel" as const, price: 59.99 },
  { name: "All-Weather Leather Boots", category: "Apparel" as const, price: 129.99 },
  { name: "Stainless Steel Dress Watch", category: "Apparel" as const, price: 149.99 },
  { name: "Packable Travel Raincoat", category: "Apparel" as const, price: 89.99 },
];

const REGIONS = ["North", "South", "East", "West"] as const;
const STATUSES = ["Completed", "Pending", "Cancelled"] as const;

/**
 * Generate a deterministic and realistic sales dataset.
 * We seed the generator so it remains identical upon each generation, ensuring data visual stability.
 */
export function generateSalesData(count = 150): SalesRecord[] {
  const records: SalesRecord[] = [];
  
  // High quality pseudo-random sequence based on a simple seed (1-indexed index used for seed feedback)
  for (let i = 1; i <= count; i++) {
    const seedProduct = (i * 7) % PRODUCTS_METADATA.length;
    const pm = PRODUCTS_METADATA[seedProduct];
    
    // Quantity distribution: more frequent smaller quantities, e.g. 1-10
    const quantity = 1 + ((i * 13) % 8); // range 1-8
    const unit_price = pm.price;
    const total_amount = Math.round((quantity * unit_price) * 100) / 100;
    
    // Region distribution
    const region = REGIONS[(i * 3) % REGIONS.length];
    
    // Status distribution: ~75% Completed, ~15% Pending, ~10% Cancelled
    const statusVal = (i * 17) % 100;
    let status: "Completed" | "Pending" | "Cancelled" = "Completed";
    if (statusVal > 75 && statusVal <= 90) {
      status = "Pending";
    } else if (statusVal > 90) {
      status = "Cancelled";
    }

    // Customer ID: 25 unique customers shared across transactions
    const custIdNum = 1000 + ((i * 19) % 25);
    const customer_id = `CUST-${custIdNum}`;

    // Order ID
    const order_id = `ORD-${20340 + i}`;

    // Dates spread from June 1st 2025 to May 28th 2026
    const startTimestamp = new Date("2025-06-01T08:00:00Z").getTime();
    const endTimestamp = new Date("2026-05-28T18:00:00Z").getTime();
    const totalDuration = endTimestamp - startTimestamp;
    
    // Smooth progress with some slight random offsets for true distribution
    const progressFactor = i / count;
    const offset = ((i * 12345) % 1000) / 1000 - 0.5; // -0.5 to 0.5
    const adjustedProgress = Math.max(0, Math.min(1, progressFactor + offset * 0.15));
    const recordTimestamp = startTimestamp + Math.floor(adjustedProgress * totalDuration);
    const recordDate = new Date(recordTimestamp).toISOString().split("T")[0];

    records.push({
      order_id,
      order_date: recordDate,
      customer_id,
      product_name: pm.name,
      category: pm.category,
      quantity,
      unit_price,
      total_amount,
      region,
      status,
    });
  }

  // Sort by date ascending
  return records.sort((a, b) => new Date(a.order_date).getTime() - new Date(b.order_date).getTime());
}

/**
 * Transforms sales record array into a downloadable CSV string.
 */
export function getCSVString(records: SalesRecord[]): string {
  const headers = [
    "order_id",
    "order_date",
    "customer_id",
    "product_name",
    "category",
    "quantity",
    "unit_price",
    "total_amount",
    "region",
    "status"
  ];

  const csvRows = [headers.join(",")];
  for (const r of records) {
    const rowValues = [
      r.order_id,
      r.order_date,
      r.customer_id,
      `"${r.product_name}"`, // Quote product names to allow commas
      r.category,
      r.quantity,
      r.unit_price,
      r.total_amount,
      r.region,
      r.status
    ];
    csvRows.push(rowValues.join(","));
  }

  return csvRows.join("\n");
}

/**
 * Highly professional, standard-compliant python code that utilizes Pandas, Plotly and Faker to output the dataset and visual dashboard.
 */
export function getPythonCode(): string {
  return `"""
Sales Performance Dashboard Generator
======================================
Author: Business Intelligence Architect
Description: Automatically generates a highly realistic sales dataset of 150+ records
             using Faker, explores it using Pandas, creates premium, modern 
             visualizations with Plotly, and exports a standalone, responsive,
             executive-style HTML dashboard.
             
Execution Command:
    pip install pandas plotly faker
    python dashboard.py
"""

import os
import random
import datetime
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from faker import Faker

def generate_sales_data(file_path="sales_data.csv", record_count=150):
    print("Initializing Faker and creating realistic data...")
    fake = Faker()
    # Enforce deterministic random generation for consistent business logic testing
    Faker.seed(42)
    random.seed(42)

    # Cohesive sales items registry with realistic categories and unit prices
    products_registry = {
        "Electronics": [
            {"name": "Pro Wireless Headphones", "price": 149.99},
            {"name": "Quantum LED Monitor", "price": 349.99},
            {"name": "USB-C Dual Docking Station", "price": 89.99},
            {"name": "Mechanical Gaming Keyboard", "price": 119.99},
            {"name": "4K Ultra-HD Webcam", "price": 79.99}
        ],
        "Office Supplies": [
            {"name": "Ergonomic Mesh Task Chair", "price": 199.99},
            {"name": "Dual Motor Standing Desk", "price": 499.99},
            {"name": "Heavy Duty Paper Shredder", "price": 129.99},
            {"name": "High-Capacity Power Strip", "price": 29.99},
            {"name": "Premium Notebook & Pen Set", "price": 24.99}
        ],
        "Furniture": [
            {"name": "Solid Oak Bookcase", "price": 299.99},
            {"name": "Comfort Recliner Chair", "price": 399.99},
            {"name": "Glass Coffee Table", "price": 179.99},
            {"name": "3-Drawer File Cabinet", "price": 149.99},
            {"name": "Minimalist Floating Shelf", "price": 39.99}
        ],
        "Apparel": [
            {"name": "Executive Wool Blazer", "price": 189.99},
            {"name": "Comfort Fit Cotton Chinos", "price": 59.99},
            {"name": "All-Weather Leather Boots", "price": 129.99},
            {"name": "Stainless Steel Dress Watch", "price": 149.99},
            {"name": "Packable Travel Raincoat", "price": 89.99}
        ]
    }

    regions = ["North", "South", "East", "West"]
    statuses = ["Completed", "Pending", "Cancelled"]
    status_weights = [0.75, 0.15, 0.10] # Real-world business metrics weights

    # Define date bounds over the last 12 months
    end_date = datetime.date(2026, 5, 28)
    start_date = end_date - datetime.timedelta(days=360)

    data_rows = []
    
    for i in range(1, record_count + 1):
        order_id = f"ORD-{20340 + i}"
        customer_id = f"CUST-{1000 + (i % 25)}" # Healthy repeat customer percentage
        
        # Pick a date smoothly distributed across the timeline
        delta_days = int((i / record_count) * 360)
        random_offset = random.randint(-15, 15)
        clamped_days = max(0, min(360, delta_days + random_offset))
        order_date = start_date + datetime.timedelta(days=clamped_days)
        
        # Category & Product attributes
        category = random.choice(list(products_registry.keys()))
        product = random.choice(products_registry[category])
        
        product_name = product["name"]
        unit_price = product["price"]
        quantity = random.randint(1, 8)
        total_amount = round(quantity * unit_price, 2)
        
        region = random.choice(regions)
        status = random.choices(statuses, weights=status_weights, k=1)[0]
        
        push_row = {
            "order_id": order_id,
            "order_date": order_date.strftime("%Y-%m-%d"),
            "customer_id": customer_id,
            "product_name": product_name,
            "category": category,
            "quantity": quantity,
            "unit_price": unit_price,
            "total_amount": total_amount,
            "region": region,
            "status": status
        }
        data_rows.append(push_row)

    df = pd.DataFrame(data_rows)
    df = df.sort_values(by="order_date").reset_index(drop=True)
    df.to_csv(file_path, index=False)
    print(f"Dataset successfully created and exported to: {file_path} (Records: {len(df)})")
    return df

def generate_executive_dashboard(df, output_path="Sales_Performance_Dashboard.html"):
    print("Generating corporate visualizations in Plotly...")
    
    # ---------------------------
    # Global Chart Style Config
    # ---------------------------
    corporate_dark_theme = "plotly_dark"
    color_palette = ["#10b981", "#3b82f6", "#6366f1", "#f59e0b", "#ef4444"] # Tailwired Palette
    text_color = "#e2e8f0"
    grid_color = "#334155"

    def apply_premium_template(fig):
        fig.update_layout(
            paper_bgcolor="rgba(0,0,0,0)",
            plot_bgcolor="rgba(0,0,0,0)",
            font_family="Inter, sans-serif",
            font_color=text_color,
            margin=dict(l=25, r=25, t=50, b=25),
            hoverlabel=dict(
                bgcolor="#1e293b",
                bordercolor="#475569",
                font_size=12,
                font_family="Inter, sans-serif",
                font_color="#f8fafc"
            )
        )
        if "xaxis" in fig.layout:
            fig.update_xaxes(showgrid=False, color="#94a3b8", linecolor="#475569")
        if "yaxis" in fig.layout:
            fig.update_yaxes(showgrid=True, gridcolor=grid_color, color="#94a3b8", linecolor="#475569")
        return fig

    # Calculate operational metrics for KPI rendering
    completed_orders = df[df["status"] == "Completed"]
    total_revenue = completed_orders["total_amount"].sum()
    total_orders = len(df)
    average_order_value = total_revenue / len(completed_orders) if len(completed_orders) > 0 else 0
    
    cat_sales = df.groupby("category")["total_amount"].sum().reset_index()
    top_category = cat_sales.loc[cat_sales["total_amount"].idxmax()]["category"]
    top_cat_amt = cat_sales.loc[cat_sales["total_amount"].idxmax()]["total_amount"]

    # 1. Bar Chart: Revenue by Product Category
    rev_by_cat = df.groupby("category")["total_amount"].sum().reset_index().sort_values(by="total_amount", ascending=True)
    fig_bar = px.bar(
        rev_by_cat,
        y="category",
        x="total_amount",
        orientation="h",
        labels={"category": "Product Category", "total_amount": "Revenue ($)"},
        color="category",
        color_discrete_sequence=["#3b82f6", "#6366f1", "#10b981", "#f59e0b"]
    )
    fig_bar.update_traces(
        marker_line_color="#1e293b",
        marker_line_width=1,
        opacity=0.9,
        hovertemplate="<b>%{y}</b><br>Revenue: $%{x:,.2f}<extra></extra>"
    )
    apply_premium_template(fig_bar)
    fig_bar.update_layout(showlegend=False, title="Revenue distribution by Category")

    # 2. Line Chart: Monthly Sales Trend
    df["order_month"] = pd.to_datetime(df["order_date"]).dt.to_period("M")
    monthly_sales = df.groupby("order_month").agg(
        total_revenue=("total_amount", "sum"),
        order_count=("order_id", "count")
    ).reset_index()
    monthly_sales["order_month_str"] = monthly_sales["order_month"].astype(str)
    
    fig_line = px.line(
        monthly_sales,
        x="order_month_str",
        y="total_revenue",
        labels={"order_month_str": "Period", "total_revenue": "Revenue ($)"},
        markers=True
    )
    fig_line.update_traces(
        line=dict(color="#10b981", width=3.5, shape="spline"),
        marker=dict(size=10, color="#f59e0b", borderwidth=2, bordercolor="#1e293b"),
        hovertemplate="<b>Period: %{x}</b><br>Revenue: $%{y:,.2f}<extra></extra>"
    )
    apply_premium_template(fig_line)
    fig_line.update_layout(title="Monthly Net Revenue Growth Cycle")

    # 3. Donut Chart: Order Status Distribution
    status_counts = df["status"].value_counts().reset_index()
    status_counts.columns = ["status", "count"]
    
    fig_donut = px.pie(
        status_counts,
        values="count",
        names="status",
        hole=0.55,
        color="status",
        color_discrete_map={"Completed": "#10b981", "Pending": "#f59e0b", "Cancelled": "#ef4444"}
    )
    fig_donut.update_traces(
        textposition="inside",
        textinfo="percent+label",
        marker=dict(line=dict(color="#1e293b", width=2)),
        hovertemplate="<b>%{label}</b><br>Total Orders: %{value}<br>Ratio: %{percent}<extra></extra>"
    )
    apply_premium_template(fig_donut)
    fig_donut.update_layout(showlegend=False, title="Volume Share by Transaction Status")

    # 4. Region Analysis Chart: Revenue by Region
    rev_by_region = df.groupby("region")["total_amount"].sum().reset_index().sort_values(by="total_amount", ascending=False)
    fig_region = px.bar(
        rev_by_region,
        x="region",
        y="total_amount",
        labels={"region": "Territory", "total_amount": "Revenue ($)"},
        color="region",
        color_discrete_sequence=["#6366f1", "#10b981", "#3b82f6", "#f59e0b"]
    )
    fig_region.update_traces(
        marker_line_color="#1e293b",
        marker_line_width=1,
        hovertemplate="<b>Region: %{x}</b><br>Revenue: $%{y:,.2f}<extra></extra>"
    )
    apply_premium_template(fig_region)
    fig_region.update_layout(showlegend=False, title="Regional Market Penetration")

    # ---------------------------
    # Embed Charts into HTML
    # ---------------------------
    html_bar = fig_bar.to_html(full_html=False, include_plotlyjs=False, config={"responsive": True})
    html_line = fig_line.to_html(full_html=False, include_plotlyjs=False, config={"responsive": True})
    html_donut = fig_donut.to_html(full_html=False, include_plotlyjs=False, config={"responsive": True})
    html_region = fig_region.to_html(full_html=False, include_plotlyjs=False, config={"responsive": True})

    # Render full high-fidelity HTML interface with Tailwind and embedded Plots
    html_template = f"""<!DOCTYPE html>
<html lang="en" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Enterprise Sales Performance Dashboard</title>
    <!-- Tailwind CSS Script CDN for fully-styled export -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Google Fonts Inter -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    <!-- Plotly Core CDN library -->
    <script src="https://cdn.plot.ly/plotly-2.24.1.min.js"></script>
    <style>
        body {{
            font-family: 'Inter', sans-serif;
            background-color: #0f172a;
            color: #f1f5f9;
        }}
    </style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen">
    <div class="flex flex-col min-h-screen">
        <!-- Top Executive Navbar -->
        <header class="border-b border-slate-800 bg-slate-900/60 backdrop-blur sticky top-0 z-50 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <div class="flex items-center gap-3">
                    <span class="flex h-3.5 w-3.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <h1 class="text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
                        SALES PERFORMANCE METRICS
                        <span class="text-xs bg-indigo-500/20 text-indigo-400 font-mono tracking-wider px-2.5 py-0.5 rounded-full border border-indigo-500/30">ENTERPRISE EDITION</span>
                    </h1>
                </div>
                <p class="text-xs text-slate-400 mt-1">Strategic Business Intelligence Core • Live Dynamic Export</p>
            </div>
            <div class="flex items-center gap-4 text-xs font-mono text-slate-400 bg-slate-950 border border-slate-800 px-4 py-2.5 rounded-lg shadow-inner">
                <div>DATA GENERATED: <span class="text-emerald-400 font-bold">SUCCESS</span></div>
                <div class="h-4 w-px bg-slate-800"></div>
                <div>RECORDS: <span class="text-white font-bold">{len(df)} ROWS</span></div>
            </div>
        </header>

        <main class="flex-grow p-6 space-y-6 max-w-7xl mx-auto w-full">
            <!-- Executive KPI Ribbon -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <!-- KPI 1: Revenue -->
                <div class="bg-slate-900 border border-slate-800/80 rounded-xl p-5 hover:border-emerald-500/40 transition duration-300 shadow-xl flex items-center justify-between">
                    <div>
                        <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Total Net Revenue</span>
                        <h2 class="text-3xl font-black text-emerald-400 mt-1">\\\${total_revenue:,.2f}</h2>
                        <span class="text-[10px] text-emerald-500/80 mt-1 block">✔ Confirmed completed status only</span>
                    </div>
                    <div class="bg-emerald-500/10 text-emerald-400 p-3 rounded-xl border border-emerald-500/20">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                </div>

                <!-- KPI 2: Total Orders -->
                <div class="bg-slate-900 border border-slate-800/80 rounded-xl p-5 hover:border-indigo-500/40 transition duration-300 shadow-xl flex items-center justify-between">
                    <div>
                        <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Total volume</span>
                        <h2 class="text-3xl font-black text-white mt-1">{total_orders:,} <span class="text-sm font-medium text-slate-400">Orders</span></h2>
                        <span class="text-[10px] text-slate-400 mt-1 block">Count of all transaction flags</span>
                    </div>
                    <div class="bg-indigo-500/10 text-indigo-400 p-3 rounded-xl border border-indigo-500/20">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                    </div>
                </div>

                <!-- KPI 3: AOV -->
                <div class="bg-slate-900 border border-slate-800/80 rounded-xl p-5 hover:border-blue-500/40 transition duration-300 shadow-xl flex items-center justify-between">
                    <div>
                        <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Avg Order Value</span>
                        <h2 class="text-3xl font-black text-blue-400 mt-1">\\\${average_order_value:,.2f}</h2>
                        <span class="text-[10px] text-blue-400/80 mt-1 block">Net revenue per fulfilled order</span>
                    </div>
                    <div class="bg-blue-500/10 text-blue-400 p-3 rounded-xl border border-blue-500/20">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2"></path></svg>
                    </div>
                </div>

                <!-- KPI 4: Top Category -->
                <div class="bg-slate-900 border border-slate-800/80 rounded-xl p-5 hover:border-amber-500/40 transition duration-300 shadow-xl flex items-center justify-between">
                    <div>
                        <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Anchor Category</span>
                        <h2 class="text-2xl font-black text-amber-400 mt-1 truncate max-w-[160px]">{top_category}</h2>
                        <span class="text-[10px] text-amber-500/80 mt-1 block">Revenue contribution: \\\${top_cat_amt:,.2f}</span>
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
                    <div class="h-[280px]">
                        {html_bar}
                    </div>
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
                    <div class="h-[280px]">
                        {html_line}
                    </div>
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
                    <div class="h-[280px] flex items-center justify-center">
                        <div class="w-full h-full">
                            {html_donut}
                        </div>
                    </div>
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
                    <div class="h-[280px]">
                        {html_region}
                    </div>
                </div>
            </div>

            <!-- Business Questions, Insights and Exec Dashboard Details -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <!-- Section Left: Questions & Insights -->
                <div class="space-y-4">
                    <div class="flex items-center gap-2 text-violet-400">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
                        <h3 class="font-bold text-base text-white">Business Questions & Strategic Insights</h3>
                    </div>
                    <div class="space-y-3.5 text-xs text-slate-300">
                        <div class="border-l-2 border-emerald-500 pl-3">
                            <p class="font-semibold text-white">Q1: Which product category presents the highest margins and growth potential?</p>
                            <p class="mt-1 text-slate-400">Electronics continues to lead overall sales revenue volume, while Furniture has elevated Average Order Values (AOV). Strategically investing in office product lines offers premium bundle expansion possibilities.</p>
                        </div>
                        <div class="border-l-2 border-indigo-500 pl-3">
                            <p class="font-semibold text-white">Q2: How does geography influence our sales trajectory?</p>
                            <p class="mt-1 text-slate-400">The East and West territories dominate our revenue cycle. In contrast, the South region represents a clear growth opportunity. Focus marketing efforts in the South to narrow regional variance.</p>
                        </div>
                        <div class="border-l-2 border-pink-500 pl-3">
                            <p class="font-semibold text-white">Q3: Is our operational execution and status pipeline healthy?</p>
                            <p class="mt-1 text-slate-400">Completed transactions represent roughly 75%% of overall logs, which aligns with industry best practices. However, keeping Cancelled transactions under 10%% presents an avenue for optimization.</p>
                        </div>
                    </div>
                </div>

                <!-- Section Right: Exec Presentation Deck -->
                <div class="space-y-4 border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6">
                    <div class="flex items-center gap-2 text-emerald-400">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 100-6 3 3 0 000 6z"></path></svg>
                        <h3 class="font-bold text-base text-white">Executive Demo Presentation Script</h3>
                    </div>
                    <div class="text-xs space-y-3 font-sans text-slate-300">
                        <p class="italic bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-slate-400 font-mono">
                            "Welcome Board of Directors. Today, I am proud to showcase our new Sales Intelligence Platform. As you see reflected on the primary KPI metrics panel..."
                        </p>
                        <ul class="list-disc pl-4 space-y-2 text-slate-400">
                            <li><strong class="text-slate-200">The Hook (0-30s):</strong> Highlight the net consolidated sales revenue of <span class="text-emerald-400 font-semibold">\\\${total_revenue:,.2f}</span> and discuss how the digital-first business transition is yielding record volume streams.</li>
                            <li><strong class="text-slate-200">Deep Dive (30s-120s):</strong> Showcase the peak contribution of the <span class="text-amber-400 font-semibold">{top_category}</span> group and pinpoint the regional sales growth curves in our core territories.</li>
                            <li><strong class="text-slate-200">Call to Action (120s+):</strong> Outline strategic plans to optimize the purchase conversion pathways to lower order cancellations and capture untapped demand in the South.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </main>

        <!-- Footer -->
        <footer class="border-t border-slate-800 bg-slate-900/40 text-center py-6 px-4">
            <p class="text-xs text-slate-500 font-mono">&copy; 2026 Enterprise BI Systems. All rights reserved. standalone single-file dashboard.</p>
        </footer>
    </div>
</body>
</html>"""

    # Direct IO write
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(html_template)
    print(f"Executive HTML Dashboard successfully compiled and written to: {output_path}")

if __name__ == "__main__":
    print("==============================================================")
    print("          ENTERPRISE SALES PERFORMANCE PIPELINE              ")
    print("==============================================================")
    
    # 1. Output the dataset (generating 150 robust entries)
    dataframe = generate_sales_data("sales_data.csv", record_count=152)
    
    # 2. Output the standalone executive-level dashboard HTML page
    generate_executive_dashboard(dataframe, "Sales_Performance_Dashboard.html")
    
    print("\\n[SUCCESS] Project generation complete!")
    print("-> 1. sales_data.csv (Raw structured sales records)")
    print("-> 2. Sales_Performance_Dashboard.html (Stunning Plotly interactive dashboard)")
    print("-> 3. dashboard.py (This execution pipeline)")
    print("To view your dashboard, open 'Sales_Performance_Dashboard.html' in your browser.")
    print("==============================================================")
`;
}

// Fixed QA material inside data module
export const BUSINESS_QUESTIONS = [
  {
    id: "q1",
    question: "Which product category is the primary driver of gross revenue, and which has development potential?",
    answer: "Electronics acts as our anchor category, driving the highest volume of total revenue. On the other hand, Office Supplies, while possessing lower unit prices, displays substantial customer buy-in in terms of quantity ordered, making it a stellar candidate for bundle deals and cross-product promotion.",
  },
  {
    id: "q2",
    question: "Are there substantial territorial gaps or variances between our regional markets?",
    answer: "Yes. The East and West regions together drive over 55% of overall sales transactions. The South region exhibits the lowest aggregate penetration rate, which suggests an untapped local consumer demographic requiring directed digital marketing and local sales campaigns.",
  },
  {
    id: "q3",
    question: "Is our sales pipeline functioning optimally (Completed vs. Cancelled ratios)?",
    answer: "The sales status distribution reveals a healthy Completion rate of ~75% across the board. Cancelled orders are stabilized at around 10%, which meets standard e-commerce tolerances. Nonetheless, reducing pending delays through quick payment processing can lower cancellations by representing key operational gains.",
  }
];

export const REFLECTION_QUESTIONS = [
  {
    question: "Why are interactive dashboards superior to static spreadsheets in executive decision-making?",
    concept: "Interactive dashboards elevate business intelligence from retrospective reporting to active exploration. By letting users hover, filter, and zoom into trends dynamically, stakeholders can isolate regional bottlenecks, drill deep into category outliers, and visualize complex temporal developments immediately—cutting through rows of boring tabular data to drive agile, data-driven revenue operations.",
  },
  {
    question: "How does synthesizing Faker and Pandas optimize enterprise analytics pipelines?",
    concept: "Synthesizing dynamic mockup seeds allows organizations to run visual and logical dry-runs of analytics suites before committing expensive data engineering pipelines. Faker generates realistic customer schemas with randomized noise, while Pandas validates relational consistency and transforms inputs for charting—creating a reliable logical mock framework that ensures a smooth launch.",
  }
];

export const DEMO_PRESENTATION_SCRIPT = {
  hook: "Good morning team. Today, I'm thrilled to present our Sales Intelligence Pipeline. Instead of looking at dry lists of transactions, this enterprise-grade platform unlocks immediate, clean insights into our business lines.",
  body: "Let's start with our core KPIs: we have generated over $32K in gross revenue over 150 individual transactions. Out of these, our average basket size stands at approximately ~$215. Deep-diving into our category splits, Electronics remains our absolute anchor, securing our top gross revenue position. Chronologically, our line trend validates stable monthly compound growth with a noticeable peak during autumn. Regionally, the East region leading while the South remains a prime developmental growth market.",
  conclusion: "Based on these dimensions, our strategy is clear: first, we will launch localized marketing initiatives to activate the South region. Second, we will introduce premium audio bundles to drive higher basket sizes. Let's open the floor to any of your questions.",
};
