"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { cn } from "@/lib/utils";
import {
  TrendingUp,
  Activity,
  Fuel,
  Coins,
  Gauge,
  Milestone,
  Calendar,
  Route,
  ArrowUpRight,
  Edit2,
  Check,
  X,
  Plus,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

export default function DashboardPage() {
  const router = useRouter();

  // Core Stats States
  const [fuelPrice, setFuelPrice] = useState(0);
  const [totalFuelPurchased, setTotalFuelPurchased] = useState(0);
  const [totalFuelUsed, setTotalFuelUsed] = useState(0);
  const [remainingFuel, setRemainingFuel] = useState(0);
  const [monthlySpending, setMonthlySpending] = useState(0);
  const [predictedMonthlyCost, setPredictedMonthlyCost] = useState(0);

  // Category and Route Cost States
  const [officeCost, setOfficeCost] = useState(0);
  const [personalCost, setPersonalCost] = useState(0);
  const [highwayCost, setHighwayCost] = useState(0);
  const [normalCost, setNormalCost] = useState(0);
  const [totalDistance, setTotalDistance] = useState(0);

  // New Requested Monthly Statistics
  const [monthlyFuelUsed, setMonthlyFuelUsed] = useState(0);
  const [monthlyRefuelSpend, setMonthlyRefuelSpend] = useState(0);

  // UI States
  const [loading, setLoading] = useState(true);
  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [newFuelPrice, setNewFuelPrice] = useState("");
  const [dailyData, setDailyData] = useState([]);
  const [recentTrips, setRecentTrips] = useState([]);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    checkUser();
    fetchDashboardData();

    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function checkUser() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      router.push("/login");
    }
  };

  async function fetchDashboardData() {
    try {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      // 1. Current Fuel Price
      const { data: fuelSettings } = await supabase
        .from("fuel_settings")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (fuelSettings) {
        setFuelPrice(fuelSettings.current_price);
        setNewFuelPrice(fuelSettings.current_price.toString());
      }

      // 2. Fuel Purchases
      const { data: fuelPurchases } = await supabase
        .from("fuel_purchases")
        .select("*")
        .eq("user_id", user.id);

      // 3. Trips
      const { data: trips } = await supabase
        .from("trips")
        .select("*")
        .eq("user_id", user.id)
        .order("trip_date", { ascending: false });

      // Total purchased and used (All-time for remaining fuel)
      const purchased =
        fuelPurchases?.reduce((sum, item) => sum + Number(item.litres), 0) || 0;
      setTotalFuelPurchased(purchased);

      const used =
        trips?.reduce((sum, item) => sum + Number(item.litres_used), 0) || 0;
      setTotalFuelUsed(used);

      // Remaining Fuel
      setRemainingFuel(purchased - used);

      // Filter Current Month Stats
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();

      const monthlyTrips =
        trips?.filter((trip) => {
          const date = new Date(trip.trip_date);
          return (
            date.getMonth() === currentMonth &&
            date.getFullYear() === currentYear
          );
        }) || [];

      // Save a subset of recent monthly trips for preview
      setRecentTrips(monthlyTrips.slice(0, 4));

      // Monthly Commute Cost (estimated cost from trips)
      const monthlyCost = monthlyTrips.reduce(
        (sum, trip) => sum + Number(trip.estimated_cost),
        0
      );
      setMonthlySpending(monthlyCost);

      // Predicted Monthly Cost
      const today = new Date().getDate();
      const prediction = (monthlyCost / today) * 30;
      setPredictedMonthlyCost(prediction);

      // Office vs Personal Costs
      const office = monthlyTrips
        .filter((trip) => trip.category === "Office")
        .reduce((sum, trip) => sum + Number(trip.estimated_cost), 0);
      const personal = monthlyTrips
        .filter((trip) => trip.category === "Personal")
        .reduce((sum, trip) => sum + Number(trip.estimated_cost), 0);

      setOfficeCost(office);
      setPersonalCost(personal);

      // Highway vs Normal Route Costs
      const highway = monthlyTrips
        .filter((trip) => trip.route_type === "Highway")
        .reduce((sum, trip) => sum + Number(trip.estimated_cost), 0);
      const normal = monthlyTrips
        .filter((trip) => trip.route_type === "Normal")
        .reduce((sum, trip) => sum + Number(trip.estimated_cost), 0);

      setHighwayCost(highway);
      setNormalCost(normal);

      // Total Monthly Kms Travelled (Requested)
      const distance = monthlyTrips.reduce(
        (sum, trip) => sum + Number(trip.distance_km),
        0
      );
      setTotalDistance(distance);

      // Total Monthly Litres Used (Requested)
      const mFuelUsed = monthlyTrips.reduce(
        (sum, trip) => sum + Number(trip.litres_used),
        0
      );
      setMonthlyFuelUsed(mFuelUsed);

      // Total Monthly Price spent on actual Fuel Purchases (Requested)
      const monthlyPurchases =
        fuelPurchases?.filter((purchase) => {
          const date = new Date(purchase.created_at);
          return (
            date.getMonth() === currentMonth &&
            date.getFullYear() === currentYear
          );
        }) || [];
      const mRefuelSpend = monthlyPurchases.reduce(
        (sum, p) => sum + Number(p.amount_spent),
        0
      );
      setMonthlyRefuelSpend(mRefuelSpend);

      // Generate Recharts Daily Expense Chart Data for Current Month
      const chartMap = {};
      monthlyTrips.forEach((trip) => {
        const day = new Date(trip.trip_date).getDate();
        chartMap[day] = (chartMap[day] || 0) + Number(trip.estimated_cost);
      });

      // Fill in all days up to today
      const dailyExpenses = Array.from({ length: today }, (_, i) => {
        const d = i + 1;
        return {
          day: `${d}`,
          Cost: Number((chartMap[d] || 0).toFixed(0)),
        };
      });
      setDailyData(dailyExpenses);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateFuelPrice = async () => {
    if (!newFuelPrice || isNaN(Number(newFuelPrice))) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase
      .from("fuel_settings")
      .update({
        current_price: Number(newFuelPrice),
      })
      .eq("user_id", user.id);

    if (error) {
      alert("Failed to update: " + error.message);
      return;
    }

    setFuelPrice(Number(newFuelPrice));
    setIsEditingPrice(false);
    fetchDashboardData();
  };

  // Pie chart variables
  const categoryData = [
    { name: "Office", value: officeCost, color: "oklch(0.65 0.19 250)" },
    { name: "Personal", value: personalCost, color: "oklch(0.65 0.21 340)" },
  ].filter((item) => item.value > 0);

  const routeData = [
    { name: "Highway", value: highwayCost },
    { name: "Normal", value: normalCost },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="size-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-muted-foreground text-sm font-medium tracking-wide">
            Loading CommuteIQ Analytics...
          </p>
        </div>
      </div>
    );
  }

  // Budget calculations (e.g. hypothetical budget limit of 30,000)
  const budgetLimit = 35000;
  const remainingBudget = Math.max(0, budgetLimit - monthlySpending);
  const budgetPercentage = Math.min(100, (monthlySpending / budgetLimit) * 100);

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Persistent Premium Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 md:pl-64 pb-24 md:pb-8 p-4 md:p-10 max-w-7xl mx-auto w-full space-y-8 overflow-x-hidden animate-slide-up">
        {/* HEADER */}
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <div className="flex items-center gap-2 text-indigo-500 dark:text-indigo-400 text-sm font-semibold uppercase tracking-wider mb-1">
              <Calendar className="size-4" />
              <span>
                {new Date().toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-muted-foreground">
              Fuel Analytics Dashboard
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Analyze your commuting efficiency and fuel consumption in real time.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/trips")}
              className="glass-panel text-foreground hover:bg-secondary border border-border px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center gap-2 hover:scale-[1.02]"
            >
              <Plus className="size-4 text-indigo-500" />
              <span>Log Trip</span>
            </button>
            <button
              onClick={() => router.push("/fuel")}
              className="bg-foreground text-background hover:bg-foreground/90 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center gap-2 hover:scale-[1.02] shadow-md shadow-foreground/5"
            >
              <Plus className="size-4" />
              <span>Add Fuel</span>
            </button>
          </div>
        </header>

        {/* CORE STATS GRID */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Fuel Price Card */}
          <div className="glass-panel rounded-2xl p-6 relative overflow-hidden glass-panel-hover group transition-all duration-300 border-l-2 border-l-cyan-500">
            <div className="flex items-center justify-between mb-4">
              <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                Current Fuel Price
              </span>
              <div className="p-2 bg-cyan-500/10 rounded-xl text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform">
                <Coins className="size-5" />
              </div>
            </div>

            {isEditingPrice ? (
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="number"
                  value={newFuelPrice}
                  onChange={(e) => setNewFuelPrice(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg px-2 py-1 text-lg font-bold text-foreground focus:outline-none focus:border-cyan-500"
                />
                <button
                  onClick={handleUpdateFuelPrice}
                  className="p-1.5 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 transition-colors"
                >
                  <Check className="size-4" />
                </button>
                <button
                  onClick={() => setIsEditingPrice(false)}
                  className="p-1.5 bg-secondary text-muted-foreground rounded-lg hover:bg-secondary/80 transition-colors"
                >
                  <X className="size-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-baseline justify-between mt-1">
                <h2 className="text-3xl font-extrabold tracking-tight">
                  Rs. {fuelPrice}
                </h2>
                <button
                  onClick={() => setIsEditingPrice(true)}
                  className="text-xs text-muted-foreground hover:text-cyan-500 transition-colors flex items-center gap-1 group/btn"
                >
                  <Edit2 className="size-3 group-hover/btn:translate-x-0.5 transition-transform" />
                  <span>Update</span>
                </button>
              </div>
            )}
            <p className="text-[10px] text-muted-foreground mt-3 font-medium">
              Used to calculate trip expenses automatically
            </p>
          </div>

          {/* Remaining Fuel Card */}
          <div className="glass-panel rounded-2xl p-6 relative overflow-hidden glass-panel-hover group transition-all duration-300 border-l-2 border-l-emerald-500">
            <div className="flex items-center justify-between mb-4">
              <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                Remaining Fuel
              </span>
              <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                <Fuel className="size-5" />
              </div>
            </div>

            <div className="flex items-baseline justify-between mt-1">
              <h2 className="text-3xl font-extrabold tracking-tight">
                {remainingFuel > 0 ? remainingFuel.toFixed(1) : "0.0"}L
              </h2>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  remainingFuel > 15
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25"
                    : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/25"
                }`}
              >
                {remainingFuel > 0
                  ? `${((remainingFuel / Math.max(1, totalFuelPurchased)) * 100).toFixed(0)}% Left`
                  : "Refuel needed"}
              </span>
            </div>

            {/* Glowing progress line */}
            <div className="w-full bg-muted rounded-full h-1.5 mt-4 overflow-hidden border border-border">
              <div
                className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-1.5 rounded-full transition-all duration-1000"
                style={{
                  width: `${Math.min(
                    100,
                    (remainingFuel / Math.max(1, totalFuelPurchased)) * 100
                  )}%`,
                }}
              />
            </div>
          </div>

          {/* Monthly Estimated Spend Card */}
          <div className="glass-panel rounded-2xl p-6 relative overflow-hidden glass-panel-hover group transition-all duration-300 border-l-2 border-l-purple-500">
            <div className="flex items-center justify-between mb-4">
              <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                Commute Trip Cost
              </span>
              <div className="p-2 bg-purple-500/10 rounded-xl text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                <Route className="size-5" />
              </div>
            </div>

            <div className="flex items-baseline justify-between mt-1">
              <h2 className="text-3xl font-extrabold tracking-tight">
                Rs. {monthlySpending.toFixed(0)}
              </h2>
              <span className="text-xs text-muted-foreground">Trip estimated value</span>
            </div>

            <div className="w-full bg-muted rounded-full h-1.5 mt-4 overflow-hidden border border-border">
              <div
                className="bg-gradient-to-r from-purple-600 to-purple-400 h-1.5 rounded-full"
                style={{ width: `${budgetPercentage}%` }}
              />
            </div>
          </div>

          {/* Predicted Monthly Card */}
          <div className="glass-panel rounded-2xl p-6 relative overflow-hidden glass-panel-hover group transition-all duration-300 border-l-2 border-l-amber-500">
            <div className="flex items-center justify-between mb-4">
              <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                Predicted Spend
              </span>
              <div className="p-2 bg-amber-500/10 rounded-xl text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
                <TrendingUp className="size-5" />
              </div>
            </div>

            <div className="flex items-baseline justify-between mt-1">
              <h2 className="text-3xl font-extrabold tracking-tight">
                Rs. {predictedMonthlyCost.toFixed(0)}
              </h2>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  predictedMonthlyCost > budgetLimit
                    ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/25"
                    : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25"
                }`}
              >
                {predictedMonthlyCost > budgetLimit ? "Over budget" : "On track"}
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-3 font-medium">
              Based on spending velocity this month
            </p>
          </div>
        </section>

        {/* SPECIFIC REQUESTED MONTHLY STATISTICS */}
        <section className="bg-gradient-to-b from-card/40 to-background/20 border border-border rounded-3xl p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <h3 className="text-lg font-bold tracking-tight">
                Monthly Statistics Dashboard
              </h3>
              <p className="text-muted-foreground text-xs mt-0.5">
                Current month aggregated parameters (Kms Travelled, Litres Used, Refuel Spend).
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs text-indigo-500 dark:text-indigo-400 font-semibold bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/25">
              <Gauge className="size-3.5" />
              <span>Real-time Sync</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Monthly Kms Travelled */}
            <div className="glass-panel bg-card/40 p-5 rounded-2xl relative overflow-hidden group hover:border-border/80 transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">
                  Total Kms Travelled
                </span>
                <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                  <Milestone className="size-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold tracking-tight">
                  {totalDistance.toFixed(0)}
                </span>
                <span className="text-muted-foreground text-sm font-semibold">KM</span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-3">
                Driven in trips completed this month
              </p>
              {/* Dynamic decorative element */}
              <div className="absolute right-0 bottom-0 translate-y-1/3 translate-x-1/3 size-20 rounded-full bg-indigo-500/5 blur-xl group-hover:bg-indigo-500/10 transition-colors" />
            </div>

            {/* Total Monthly Litres Used */}
            <div className="glass-panel bg-card/40 p-5 rounded-2xl relative overflow-hidden group hover:border-border/80 transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">
                  Total Litres Used
                </span>
                <div className="p-2 bg-cyan-500/10 rounded-xl text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform">
                  <Fuel className="size-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold tracking-tight">
                  {monthlyFuelUsed.toFixed(1)}
                </span>
                <span className="text-muted-foreground text-sm font-semibold">Litres</span>
              </div>
              {/* Average efficiency */}
              <p className="text-[10px] text-muted-foreground mt-3 flex items-center gap-1.5">
                <Activity className="size-3 text-cyan-500" />
                <span>
                  Avg. Consumption:{" "}
                  {totalDistance > 0 && monthlyFuelUsed > 0
                    ? (totalDistance / monthlyFuelUsed).toFixed(1)
                    : "0"}{" "}
                  KM/L
                </span>
              </p>
              <div className="absolute right-0 bottom-0 translate-y-1/3 translate-x-1/3 size-20 rounded-full bg-cyan-500/5 blur-xl group-hover:bg-cyan-500/10 transition-colors" />
            </div>

            {/* Total Monthly Price Spent on Fuel */}
            <div className="glass-panel bg-card/40 p-5 rounded-2xl relative overflow-hidden group hover:border-border/80 transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">
                  Monthly Refuel Spend
                </span>
                <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                  <Coins className="size-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold tracking-tight">
                  Rs. {monthlyRefuelSpend.toFixed(0)}
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-3">
                Actual expenditure logged at fuel stations
              </p>
              <div className="absolute right-0 bottom-0 translate-y-1/3 translate-x-1/3 size-20 rounded-full bg-emerald-500/5 blur-xl group-hover:bg-emerald-500/10 transition-colors" />
            </div>
          </div>
        </section>

        {/* CHARTS SECTION */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Commute Expenses Curve */}
          <div className="glass-panel rounded-3xl p-6 lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold tracking-tight">
                  Commute Costs (Current Month)
                </h3>
                <p className="text-muted-foreground text-xs mt-0.5">
                  Daily estimated fuel cost breakdown of trips logged.
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold text-muted-foreground">
                  Daily Spending Pattern
                </span>
              </div>
            </div>

            <div className="h-64 w-full">
              {dailyData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={dailyData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="oklch(0.65 0.19 250)"
                          stopOpacity={0.4}
                        />
                        <stop
                          offset="95%"
                          stopColor="oklch(0.65 0.19 250)"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="day"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: isDark ? "#71717a" : "#64748b", fontSize: 10 }}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: isDark ? "#71717a" : "#64748b", fontSize: 10 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: isDark ? "#09090b" : "#ffffff",
                        border: `1px solid ${isDark ? "#1c1c1f" : "#e2e8f0"}`,
                        borderRadius: "12px",
                        color: isDark ? "#ffffff" : "#0f172a",
                        fontSize: "12px",
                      }}
                      labelFormatter={(label) => `Day ${label}`}
                    />
                    <Area
                      type="monotone"
                      dataKey="Cost"
                      stroke="oklch(0.65 0.19 250)"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorCost)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground/60 text-xs">
                  No trips logged in the current month to visualize.
                </div>
              )}
            </div>
          </div>

          {/* Office vs Personal Donut Chart */}
          <div className="glass-panel rounded-3xl p-6 flex flex-col justify-between space-y-6">
            <div>
              <h3 className="text-lg font-bold tracking-tight">
                Category Split
              </h3>
              <p className="text-muted-foreground text-xs mt-0.5">
                Spending comparison for personal vs office commutes.
              </p>
            </div>

            <div className="h-44 flex items-center justify-center relative">
              {categoryData.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={75}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Absolute Center Text */}
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                      Total Cost
                    </span>
                    <span className="text-xl font-extrabold tracking-tight">
                      Rs. {monthlySpending.toFixed(0)}
                    </span>
                  </div>
                </>
              ) : (
                <div className="text-muted-foreground/60 text-xs">
                  Add trips to see classification.
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-border pt-4">
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                  <span className="size-2 rounded-full bg-indigo-500" />
                  <span>Office</span>
                </div>
                <span className="text-sm font-bold mt-1">
                  Rs. {officeCost.toFixed(0)}
                </span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                  <span className="size-2 rounded-full bg-pink-500" />
                  <span>Personal</span>
                </div>
                <span className="text-sm font-bold mt-1">
                  Rs. {personalCost.toFixed(0)}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* BOTTOM METRICS & RECENT TRIPS */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Route Efficiency Breakdown */}
          <div className="glass-panel rounded-3xl p-6 space-y-6 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold tracking-tight">
                Route Statistics
              </h3>
              <p className="text-muted-foreground text-xs mt-0.5">
                Comparison of spending between Normal and Highway routing.
              </p>
            </div>

            <div className="space-y-4">
              {/* Highway stats progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground font-medium">Highway</span>
                  <span className="font-bold">Rs. {highwayCost.toFixed(0)}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 border border-border">
                  <div
                    className="bg-indigo-500 h-2 rounded-full"
                    style={{
                      width: `${
                        monthlySpending > 0
                          ? (highwayCost / monthlySpending) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              {/* Normal stats progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground font-medium">Normal Route</span>
                  <span className="font-bold">Rs. {normalCost.toFixed(0)}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 border border-border">
                  <div
                    className="bg-cyan-500 h-2 rounded-full"
                    style={{
                      width: `${
                        monthlySpending > 0
                          ? (normalCost / monthlySpending) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <p className="text-[10px] text-muted-foreground text-center leading-relaxed">
                Driving on highways usually improves KM/L compared to slow, stop-and-go normal city roads.
              </p>
            </div>
          </div>

          {/* Recent Trips Log */}
          <div className="glass-panel rounded-3xl p-6 lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold tracking-tight">
                  Recent Commutes
                </h3>
                <p className="text-muted-foreground text-xs mt-0.5">
                  Latest trips completed in the current billing cycle.
                </p>
              </div>
              <button
                onClick={() => router.push("/trips")}
                className="text-xs text-indigo-500 dark:text-indigo-400 hover:text-indigo-650 dark:hover:text-indigo-300 font-semibold transition-colors flex items-center gap-1 group/btn"
              >
                <span>View History</span>
                <ArrowUpRight className="size-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
              </button>
            </div>

            <div className="space-y-3.5 md:max-h-60 md:overflow-y-auto pr-1">
              {recentTrips.length > 0 ? (
                recentTrips.map((trip) => (
                  <div
                    key={trip.id}
                    className="bg-card/40 hover:bg-card border border-border hover:border-border/80 p-4 rounded-2xl flex items-center justify-between transition-all duration-300"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-muted border border-border text-muted-foreground">
                        <Milestone className="size-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">
                            {trip.distance_km} KM
                          </span>
                          <span
                            className={cn(
                              "text-[9px] font-bold px-1.5 py-0.5 rounded border",
                              trip.category === "Office"
                                ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/25"
                                : "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/25"
                            )}
                          >
                            {trip.category}
                          </span>
                        </div>
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(trip.trip_date).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-sm text-indigo-500">
                        Rs. {trip.estimated_cost.toFixed(0)}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {trip.litres_used.toFixed(1)}L pumped
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-28 flex items-center justify-center text-muted-foreground/60 text-xs">
                  No trips logged this month yet.
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}