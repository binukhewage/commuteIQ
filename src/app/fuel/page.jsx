"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Sidebar from "@/components/Sidebar";
import {
  Fuel,
  Coins,
  Calendar,
  AlertCircle,
  Plus,
  Trash2,
  Settings,
  Droplet,
} from "lucide-react";

export default function FuelPage() {
  const [litres, setLitres] = useState("");
  const [amountSpent, setAmountSpent] = useState("");
  const [fuelType, setFuelType] = useState("Petrol 92");

  const [fuelHistory, setFuelHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFuelPurchases = async () => {
    try {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from("fuel_purchases")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error) {
        setFuelHistory(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchFuelPurchases();
  }, []);

  const handleAddFuel = async (e) => {
    e.preventDefault();

    if (!litres || !amountSpent || isNaN(litres) || isNaN(amountSpent)) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase.from("fuel_purchases").insert([
      {
        user_id: user.id,
        litres: Number(litres),
        amount_spent: Number(amountSpent),
        fuel_type: fuelType,
      },
    ]);

    if (error) {
      alert(error.message);
      return;
    }

    setLitres("");
    setAmountSpent("");

    fetchFuelPurchases();
  };

  const handleDeleteFuel = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this fuel purchase record?");
    if (!confirmDelete) return;

    const { error } = await supabase.from("fuel_purchases").delete().eq("id", id);

    if (error) {
      alert("Failed to delete record: " + error.message);
      return;
    }

    fetchFuelPurchases();
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Persistent Premium Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 md:pl-64 pt-[calc(env(safe-area-inset-top)+5rem)] md:pt-10 pb-[calc(env(safe-area-inset-bottom)+7rem)] md:pb-8 p-4 md:p-10 max-w-5xl mx-auto w-full space-y-8 overflow-x-hidden animate-slide-up">
        {/* HEADER */}
        <header className="sticky top-[calc(env(safe-area-inset-top)+3.5rem)] md:top-0 z-40 bg-background/90 backdrop-blur-2xl border-b border-border pb-6 pt-4 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 -mx-4 px-4 md:-mx-10 md:px-10">
          <div>
            <div className="flex items-center gap-2 text-indigo-500 dark:text-indigo-400 text-sm font-semibold uppercase tracking-wider mb-1">
              <Droplet className="size-4" />
              <span>Fuel Station Receipts</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-muted-foreground">
              Fuel Log & Purchases
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Record fuel refills at gasoline stations, track expenditure, and analyze exact fuel price changes.
            </p>
          </div>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* LEFT SIDE: ADD FUEL FORM */}
          <div className="lg:col-span-1 space-y-6 animate-fade-in">
            <form
              onSubmit={handleAddFuel}
              className="glass-panel border border-border rounded-3xl p-6 space-y-4"
            >
              <h2 className="text-lg font-bold tracking-tight mb-2 pb-3 border-b border-border flex items-center gap-2">
                <Plus className="size-5 text-indigo-500" />
                <span>Log A Fuel Refill</span>
              </h2>

              {/* LITRES PUMPED */}
              <div>
                <label className="block text-muted-foreground text-xs font-semibold mb-1.5 uppercase tracking-wider">
                  Litres Pumped
                </label>
                <div className="relative">
                  <input
                    id="fuel-form-litres"
                    type="number"
                    step="any"
                    required
                    placeholder="e.g. 35"
                    value={litres}
                    onChange={(e) => setLitres(e.target.value)}
                    className="w-full p-3.5 rounded-xl bg-background border border-border text-sm font-bold focus:outline-none focus:border-indigo-500 text-foreground"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs font-semibold">
                    L
                  </span>
                </div>
              </div>

              {/* AMOUNT SPENT */}
              <div>
                <label className="block text-muted-foreground text-xs font-semibold mb-1.5 uppercase tracking-wider">
                  Amount Spent
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="any"
                    required
                    placeholder="e.g. 14350"
                    value={amountSpent}
                    onChange={(e) => setAmountSpent(e.target.value)}
                    className="w-full p-3.5 pl-10 rounded-xl bg-background border border-border text-sm font-bold focus:outline-none focus:border-indigo-500 text-foreground"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs font-semibold">
                    Rs.
                  </span>
                </div>
              </div>

              {/* FUEL TYPE */}
              <div>
                <label className="block text-muted-foreground text-xs font-semibold mb-1.5 uppercase tracking-wider">
                  Fuel Grade
                </label>
                <select
                  value={fuelType}
                  onChange={(e) => setFuelType(e.target.value)}
                  className="w-full p-3.5 rounded-xl bg-background border border-border text-sm font-semibold focus:outline-none focus:border-indigo-500 text-foreground"
                >
                  <option>Petrol 92</option>
                  <option>Petrol 95</option>
                  <option>Diesel</option>
                </select>
              </div>

              {/* LIVE ESTIMATION CALCULATOR */}
              {litres && amountSpent && !isNaN(litres) && !isNaN(amountSpent) && (
                <div className="bg-cyan-500/10 border border-cyan-500/25 p-4 rounded-2xl space-y-2 text-xs transition-all duration-300">
                  <div className="flex justify-between items-center text-muted-foreground">
                    <span>Refill Cost Per Litre</span>
                    <span className="font-extrabold text-cyan-600 dark:text-cyan-400 text-sm">
                      Rs. {(Number(amountSpent) / Number(litres)).toFixed(2)} / L
                    </span>
                  </div>
                </div>
              )}

              {/* SUBMIT */}
              <button
                type="submit"
                className="w-full bg-foreground text-background hover:bg-foreground/90 py-3 rounded-xl font-bold text-xs tracking-wider uppercase transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] shadow-md shadow-foreground/5"
              >
                Log Refueling
              </button>
            </form>
          </div>

          {/* RIGHT SIDE: REFILL HISTORY */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h2 className="text-xl font-bold tracking-tight">Refueling History</h2>
                <p className="text-muted-foreground text-xs mt-0.5">
                  Full list of fuel station transactions and refuel price tracking.
                </p>
              </div>
              <span className="text-xs text-muted-foreground font-semibold bg-muted border border-border px-3 py-1 rounded-full">
                {fuelHistory.length} Transactions
              </span>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="glass-panel p-5 rounded-2xl animate-pulse flex flex-col sm:flex-row justify-between gap-4 border border-border">
                    <div className="flex gap-4 items-center">
                      <div className="size-12 bg-muted rounded-xl"></div>
                      <div className="space-y-2">
                        <div className="h-5 w-24 bg-muted rounded"></div>
                        <div className="h-3 w-32 bg-muted rounded"></div>
                      </div>
                    </div>
                    <div className="space-y-2 sm:text-right">
                      <div className="h-6 w-20 bg-muted rounded sm:ml-auto"></div>
                      <div className="h-3 w-16 bg-muted rounded sm:ml-auto"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : fuelHistory.length > 0 ? (
              <div className="space-y-3.5 md:max-h-[640px] md:overflow-y-auto pr-1">
                {fuelHistory.map((fuel) => {
                  const pricePerLitre = fuel.amount_spent / fuel.litres;

                  return (
                    <div
                      key={fuel.id}
                      className="glass-panel hover:border-border/80 p-5 rounded-2xl transition-all duration-300 relative overflow-hidden group"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          {/* Left: Dynamic fuel drop icon container */}
                          <div className="p-3 bg-muted border border-border rounded-xl text-indigo-500 group-hover:scale-110 transition-transform">
                            <Fuel className="size-5" />
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-extrabold tracking-tight">
                                {fuel.litres}L
                              </span>
                              <span
                                className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                                  fuel.fuel_type.includes("95")
                                    ? "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/25"
                                    : fuel.fuel_type.includes("92")
                                    ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/25"
                                    : "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/25"
                                }`}
                              >
                                {fuel.fuel_type}
                              </span>
                            </div>

                            <p className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1">
                              <Calendar className="size-3.5" />
                              {new Date(fuel.created_at).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </p>
                          </div>
                        </div>

                        {/* Right: Spent analysis and action */}
                        <div className="flex flex-row sm:flex-col justify-between items-center sm:items-end gap-2 border-t sm:border-t-0 border-border pt-3 sm:pt-0">
                          <div className="text-left sm:text-right">
                            <p className="text-lg font-black text-foreground">
                              Rs. {fuel.amount_spent}
                            </p>
                            <p className="text-[10px] text-cyan-600 dark:text-cyan-400 font-semibold mt-0.5">
                              Rs. {pricePerLitre.toFixed(2)} / L
                            </p>
                          </div>

                          <button
                            onClick={() => handleDeleteFuel(fuel.id)}
                            className="p-2 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 rounded-xl transition-all duration-300 group-hover:opacity-100 sm:opacity-0"
                            title="Delete refill log"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="glass-panel border-dashed border-border rounded-3xl p-12 text-center flex flex-col items-center justify-center space-y-4">
                <div className="p-4 bg-muted/50 rounded-full text-indigo-500 mb-2">
                  <Fuel className="size-10 opacity-80" />
                </div>
                <h3 className="font-extrabold text-lg tracking-tight">No fuel logged yet</h3>
                <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
                  Start tracking your fuel refills to unlock insights on pricing and consumption trends.
                </p>
                <button
                  onClick={() => document.getElementById('fuel-form-litres')?.focus()}
                  className="mt-4 bg-foreground text-background px-6 py-2.5 rounded-full font-bold text-xs tracking-wider uppercase hover:bg-foreground/90 transition-colors shadow-md shadow-foreground/5"
                >
                  Log First Refuel
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}