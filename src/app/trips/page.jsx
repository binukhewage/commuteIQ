"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Sidebar from "@/components/Sidebar";
import {
  Milestone,
  Coins,
  Calendar,
  Route,
  Activity,
  Plus,
  Trash2,
  AlertCircle,
  FileText,
  Compass,
} from "lucide-react";

export default function TripsPage() {
  const [category, setCategory] = useState("Office");
  const [routeType, setRouteType] = useState("Normal");
  const [tripDate, setTripDate] = useState("");
  const [distance, setDistance] = useState("");
  const [kmPerLitre, setKmPerLitre] = useState("");
  const [notes, setNotes] = useState("");

  const [fuelPrice, setFuelPrice] = useState(410);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUpdatingPrice, setIsUpdatingPrice] = useState(false);

  const fetchFuelPrice = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from("fuel_settings")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (!error && data) {
      setFuelPrice(data.current_price);
    }
  };

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from("trips")
        .select("*")
        .eq("user_id", user.id)
        .order("trip_date", { ascending: false });

      if (!error && data) {
        setTrips(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchFuelPrice();
    fetchTrips();
  }, []);

  const updateFuelPrice = async () => {
    try {
      setIsUpdatingPrice(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { error } = await supabase
        .from("fuel_settings")
        .update({
          current_price: Number(fuelPrice),
        })
        .eq("user_id", user.id);

      if (error) {
        alert(error.message);
        return;
      }
      alert("Fuel price updated ✅");
    } catch (e) {
      console.error(e);
    } finally {
      setIsUpdatingPrice(false);
    }
  };

  const handleDeleteTrip = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this trip?");
    if (!confirmDelete) return;

    const { error } = await supabase.from("trips").delete().eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    fetchTrips();
  };

  const handleAddTrip = async (e) => {
    e.preventDefault();

    if (!distance || !kmPerLitre || isNaN(distance) || isNaN(kmPerLitre)) return;

    const litresUsed = Number(distance) / Number(kmPerLitre);
    const estimatedCost = litresUsed * Number(fuelPrice);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase.from("trips").insert([
      {
        user_id: user.id,
        category,
        route_type: routeType,
        trip_date: tripDate,
        distance_km: Number(distance),
        km_per_litre: Number(kmPerLitre),
        fuel_price: Number(fuelPrice),
        litres_used: litresUsed,
        estimated_cost: estimatedCost,
        notes,
      },
    ]);

    if (error) {
      alert(error.message);
      return;
    }

    // RESET FORM
    setRouteType("Normal");
    setTripDate("");
    setDistance("");
    setKmPerLitre("");
    setNotes("");

    fetchTrips();
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Persistent Premium Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 md:pl-64 pb-24 md:pb-8 p-4 md:p-10 max-w-5xl mx-auto w-full space-y-8 overflow-x-hidden animate-slide-up">
        {/* HEADER */}
        <header className="border-b border-border pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-500 dark:text-indigo-400 text-sm font-semibold uppercase tracking-wider mb-1">
              <Compass className="size-4" />
              <span>Journeys & Routing</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-muted-foreground">
              Trip Log Manager
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Record travel distance, capture fuel economy (KM/L), and keep track of daily travel costs.
            </p>
          </div>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* LEFT SIDE: WIDGETS & FORM */}
          <div className="lg:col-span-1 space-y-6">
            {/* FUEL PRICE QUICK CARD */}
            <div className="glass-panel rounded-2xl p-5 border-l-2 border-l-cyan-500">
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                <Coins className="size-4 text-cyan-500" />
                <span>Base Fuel Price</span>
              </h2>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs font-semibold">
                    Rs.
                  </span>
                  <input
                    type="number"
                    value={fuelPrice}
                    onChange={(e) => setFuelPrice(e.target.value)}
                    className="w-full p-2.5 pl-10 rounded-xl bg-background border border-border text-sm font-bold focus:outline-none focus:border-cyan-500 transition-colors text-foreground"
                  />
                </div>
                <button
                  onClick={updateFuelPrice}
                  disabled={isUpdatingPrice}
                  className="bg-foreground hover:bg-foreground/90 text-background px-4 rounded-xl text-xs font-semibold tracking-wide transition-all active:scale-95 disabled:opacity-50 shadow shadow-foreground/5"
                >
                  {isUpdatingPrice ? "Saving..." : "Update"}
                </button>
              </div>
            </div>

            {/* ADD TRIP FORM */}
            <form
              onSubmit={handleAddTrip}
              className="glass-panel border border-border rounded-3xl p-6 space-y-4"
            >
              <h2 className="text-lg font-bold tracking-tight mb-2 pb-3 border-b border-border flex items-center gap-2">
                <Plus className="size-5 text-indigo-500" />
                <span>Log A New Trip</span>
              </h2>

              {/* CATEGORY & ROUTE TYPE ROW */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-muted-foreground text-xs font-semibold mb-1.5 uppercase tracking-wider">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-background border border-border text-xs font-semibold focus:outline-none focus:border-indigo-500 text-foreground"
                  >
                    <option>Office</option>
                    <option>Personal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-muted-foreground text-xs font-semibold mb-1.5 uppercase tracking-wider">
                    Route 
                  </label>
                  <select
                    value={routeType}
                    onChange={(e) => setRouteType(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-background border border-border text-xs font-semibold focus:outline-none focus:border-indigo-500 text-foreground"
                  >
                    <option>Normal</option>
                    <option>Highway</option>
                  </select>
                </div>
              </div>

              {/* DATE */}
              <div>
                <label className="block text-muted-foreground text-xs font-semibold mb-1.5 uppercase tracking-wider">
                  Trip Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    value={tripDate}
                    onChange={(e) => setTripDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-background border border-border text-xs font-semibold focus:outline-none focus:border-indigo-500 text-foreground"
                  />
                </div>
              </div>

              {/* DISTANCE (KM) & KM/L IN ROW */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-muted-foreground text-xs font-semibold mb-1.5 uppercase tracking-wider">
                    Distance (KM)
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    placeholder="e.g. 24.5"
                    value={distance}
                    onChange={(e) => setDistance(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-background border border-border text-xs font-semibold focus:outline-none focus:border-indigo-500 text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-muted-foreground text-xs font-semibold mb-1.5 uppercase tracking-wider">
                    KM Per Litre
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    placeholder="e.g. 14.2"
                    value={kmPerLitre}
                    onChange={(e) => setKmPerLitre(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-background border border-border text-xs font-semibold focus:outline-none focus:border-indigo-500 text-foreground"
                  />
                </div>
              </div>

              {/* NOTES */}
              <div>
                <label className="block text-muted-foreground text-xs font-semibold mb-1.5 uppercase tracking-wider">
                  Trip Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Optional details (e.g. Traffic, specific path)..."
                  rows={2}
                  className="w-full p-2.5 rounded-xl bg-background border border-border text-xs font-semibold focus:outline-none focus:border-indigo-500 resize-none text-foreground"
                />
              </div>

              {/* LIVE DYNAMIC CALCULATIONS PREVIEW */}
              {distance && kmPerLitre && !isNaN(distance) && !isNaN(kmPerLitre) && (
                <div className="bg-indigo-500/10 border border-indigo-500/25 p-4 rounded-2xl space-y-2 text-xs transition-all duration-300">
                  <div className="flex justify-between items-center text-muted-foreground">
                    <span>Est. Fuel Consumed</span>
                    <span className="font-bold text-foreground">
                      {(Number(distance) / Number(kmPerLitre)).toFixed(2)} L
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-muted-foreground border-t border-border pt-2">
                    <span>Estimated Cost</span>
                    <span className="font-extrabold text-indigo-500 text-sm">
                      Rs.{" "}
                      {((Number(distance) / Number(kmPerLitre)) * Number(fuelPrice)).toFixed(2)}
                    </span>
                  </div>
                </div>
              )}

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                className="w-full bg-foreground text-background hover:bg-foreground/90 py-3 rounded-xl font-bold text-xs tracking-wider uppercase transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] shadow-md shadow-foreground/5"
              >
                Log Journey
              </button>
            </form>
          </div>

          {/* RIGHT SIDE: HISTORY TABLE/LIST */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h2 className="text-xl font-bold tracking-tight">Trip History</h2>
                <p className="text-muted-foreground text-xs mt-0.5">
                  Chronological records of logged trips and calculated consumption.
                </p>
              </div>
              <span className="text-xs text-muted-foreground font-semibold bg-muted border border-border px-3 py-1 rounded-full">
                {trips.length} Entries
              </span>
            </div>

            {loading ? (
              <div className="h-60 flex items-center justify-center">
                <div className="size-8 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
              </div>
            ) : trips.length > 0 ? (
              <div className="space-y-3.5 md:max-h-[640px] md:overflow-y-auto pr-1">
                {trips.map((trip) => (
                  <div
                    key={trip.id}
                    className="glass-panel hover:border-border/80 p-5 rounded-2xl transition-all duration-300 relative overflow-hidden group"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      {/* Left: Metadata details */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                              trip.category === "Office"
                                ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/25"
                                : "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/25"
                            }`}
                          >
                            {trip.category}
                          </span>
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-muted border border-border text-muted-foreground">
                            {trip.route_type} Route
                          </span>
                        </div>

                        <div className="flex items-baseline gap-1 mt-1">
                          <span className="text-2xl font-extrabold tracking-tight">
                            {trip.distance_km}
                          </span>
                          <span className="text-muted-foreground text-xs font-bold">KM Driven</span>
                        </div>

                        <div className="flex items-center gap-3.5 text-muted-foreground text-[11px] font-medium">
                          <span className="flex items-center gap-1">
                            <Calendar className="size-3.5" />
                            {new Date(trip.trip_date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                          <span className="flex items-center gap-1">
                            <Activity className="size-3.5" />
                            {trip.km_per_litre} KM/L Efficiency
                          </span>
                        </div>
                      </div>

                      {/* Right: Cost Calculations and Action */}
                      <div className="flex flex-row sm:flex-col justify-between items-center sm:items-end gap-2 border-t sm:border-t-0 border-border pt-3 sm:pt-0">
                        <div className="text-left sm:text-right">
                          <p className="text-xl font-black text-indigo-500">
                            Rs. {trip.estimated_cost.toFixed(0)}
                          </p>
                          <p className="text-[10px] text-muted-foreground mt-0.5 font-medium">
                            {trip.litres_used.toFixed(1)} Litres used @ Rs. {trip.fuel_price}/L
                          </p>
                        </div>

                        <button
                          onClick={() => handleDeleteTrip(trip.id)}
                          className="p-2 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 rounded-xl transition-all duration-300 group-hover:opacity-100 sm:opacity-0"
                          title="Delete trip log"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>

                    {/* Notes drawer, if notes exist */}
                    {trip.notes && (
                      <div className="mt-3.5 pt-3 border-t border-border flex gap-2 text-xs text-muted-foreground leading-relaxed font-medium">
                        <FileText className="size-4 text-muted-foreground shrink-0 mt-0.5" />
                        <p>{trip.notes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass-panel border-dashed border-border rounded-3xl p-12 text-center flex flex-col items-center justify-center space-y-3">
                <AlertCircle className="size-8 text-muted-foreground" />
                <h3 className="font-bold text-sm text-muted-foreground">No trips logged yet</h3>
                <p className="text-xs text-muted-foreground max-w-sm">
                  Once you start logging commute routes, they will populate here with automatic pricing and fuel volume evaluations.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}