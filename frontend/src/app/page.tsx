"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Plus,
  Clock,
  FolderOpen,
  ArrowRight,
  Shield,
  Layers,
  AlertOctagon,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  ChevronRight,
  FileText
} from "lucide-react";

export default function Home() {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [cases, setCases] = useState<Record<string, any>[]>([]);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [fetching, setFetching] = useState(true);
  const router = useRouter();

  const presets = [
    { title: "PayPal Urgent Invoice Scam", desc: "Suspicious PDF attachment requesting emergency wire transfer" },
    { title: "CEO Executive Impersonation", desc: "Spoofed email domain demanding immediate vendor payment" },
    { title: "Credential Harvester Landing Page", desc: "Phishing portal requesting 2FA security codes" }
  ];

  const fetchCases = async () => {
    setFetching(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cases`);
      if (res.ok) {
        const data = await res.json();
        setCases(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const createCase = async (customTitle?: string) => {
    const finalTitle = customTitle || title;
    if (!finalTitle.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cases`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: finalTitle }),
      });
      const data = await res.json();
      router.push(`/cases/${data.id}`);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const getRiskBadge = (level: string) => {
    switch (level) {
      case "Critical":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertOctagon className="w-3.5 h-3.5" /> Critical
          </span>
        );
      case "High":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200">
            <AlertTriangle className="w-3.5 h-3.5" /> High
          </span>
        );
      case "Medium":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <ShieldAlert className="w-3.5 h-3.5" /> Medium
          </span>
        );
      case "Low":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" /> Low
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
            Pending Analysis
          </span>
        );
    }
  };

  const filteredCases = cases.filter((c) => {
    const matches = c.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.incident_type?.toLowerCase().includes(searchQuery.toLowerCase());
    if (filter === "analyzed") return matches && c.status === "analyzed";
    if (filter === "pending") return matches && c.status !== "analyzed";
    return matches;
  });

  return (
    <div className="space-y-8">
      {/* Top Banner & Quick Case Creation */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm">
        <div className="max-w-3xl space-y-2 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Incident Evidence Investigation
          </h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            Consolidate digital evidence, extract forensic entities, identify threat indicators, and build an explainable incident report.
          </p>
        </div>

        {/* Case Name Input */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Enter incident or case title (e.g. Finance Wire Request Investigation)..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && createCase()}
              className="w-full bg-slate-50 border border-slate-200 focus:border-slate-900 text-slate-900 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-slate-900 transition-colors placeholder-slate-400"
            />
          </div>
          <button
            onClick={() => createCase()}
            disabled={loading || !title.trim()}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shrink-0 shadow-sm"
          >
            {loading ? "Creating..." : "Create Case"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Sample Templates */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2.5">
            Quick Investigation Templates
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {presets.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => createCase(preset.title)}
                className="text-left p-3 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all text-xs group"
              >
                <div className="font-semibold text-slate-800 group-hover:text-blue-600 mb-0.5 truncate">
                  {preset.title}
                </div>
                <div className="text-slate-500 text-[11px] line-clamp-2 leading-relaxed">
                  {preset.desc}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Case Management List */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-slate-700" />
            <h2 className="text-lg font-bold text-slate-900">Active Cases</h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium ml-1 border border-slate-200">
              {cases.length}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search cases..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white border border-slate-200 text-xs text-slate-800 rounded-lg pl-8 pr-3 py-1.5 focus:outline-none focus:border-slate-900 w-44"
              />
            </div>
            <div className="flex bg-white border border-slate-200 rounded-lg p-0.5 text-xs">
              <button
                onClick={() => setFilter("all")}
                className={`px-3 py-1 rounded-md transition-colors ${filter === "all" ? "bg-slate-900 text-white font-medium" : "text-slate-500 hover:text-slate-900"}`}
              >
                All
              </button>
              <button
                onClick={() => setFilter("analyzed")}
                className={`px-3 py-1 rounded-md transition-colors ${filter === "analyzed" ? "bg-slate-900 text-white font-medium" : "text-slate-500 hover:text-slate-900"}`}
              >
                Analyzed
              </button>
              <button
                onClick={() => setFilter("pending")}
                className={`px-3 py-1 rounded-md transition-colors ${filter === "pending" ? "bg-slate-900 text-white font-medium" : "text-slate-500 hover:text-slate-900"}`}
              >
                Pending
              </button>
            </div>
          </div>
        </div>

        {fetching ? (
          <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-500 text-sm">
            Loading investigation records...
          </div>
        ) : filteredCases.length === 0 ? (
          <div className="bg-white border border-slate-200 border-dashed rounded-xl p-12 text-center space-y-2">
            <FileText className="w-8 h-8 text-slate-400 mx-auto mb-1" />
            <p className="text-sm font-medium text-slate-700">No cases found</p>
            <p className="text-xs text-slate-400">Create a new case above or try another filter.</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {filteredCases.map((c) => (
              <div
                key={c.id}
                onClick={() => router.push(c.status === "analyzed" ? `/cases/${c.id}/report` : `/cases/${c.id}`)}
                className="panel-interactive p-4 sm:p-5 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 shrink-0 mt-0.5">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm sm:text-base font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {c.title}
                      </h3>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                        #{c.id}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {new Date(c.created_at).toLocaleDateString()}
                      </span>
                      {c.incident_type && (
                        <>
                          <span>•</span>
                          <span className="text-slate-700 font-medium">{c.incident_type}</span>
                        </>
                      )}
                      <span>•</span>
                      <span className={c.status === "analyzed" ? "text-emerald-600 font-medium" : "text-amber-600 font-medium"}>
                        {c.status === "analyzed" ? "Report Ready" : "Awaiting Evidence"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0">
                  <div className="text-left sm:text-right">
                    {getRiskBadge(c.risk_level)}
                  </div>
                  <div className="p-1.5 rounded-md text-slate-400 group-hover:text-slate-900 group-hover:translate-x-0.5 transition-all">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}