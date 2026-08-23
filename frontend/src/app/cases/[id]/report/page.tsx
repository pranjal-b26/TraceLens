"use client";
import { useState, useEffect, use } from "react";
import {
  AlertTriangle,
  AlertOctagon,
  ShieldAlert,
  CheckCircle2,
  Shield,
  ChevronLeft,
  Flag,
  Layers,
  Copy,
  Printer,
  Check,
  FileText
} from "lucide-react";
import Link from "next/link";

export default function ReportView({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const { id } = unwrappedParams;
  const [caseData, setCaseData] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState(true);
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    fetch(`${API_BASE}/api/cases/${id}`)
      .then((res) => res.json())
      .then((data) => setCaseData(data))
      .catch(() => { })
      .finally(() => setLoading(false));
  }, [id]);

  const copyBriefing = () => {
    if (!caseData) return;
    const text = `TraceLens Incident Report\nCase: ${caseData.title} (#${caseData.id})\nClassification: ${caseData.incident_type || "Generic Security Incident"}\nRisk Level: ${caseData.risk_level}\nEvidence Analyzed: ${caseData.evidence?.length || 0}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-72 text-slate-500">
        <p className="text-sm">Generating incident report...</p>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-12 text-center max-w-md mx-auto space-y-4 shadow-sm">
        <AlertOctagon className="w-10 h-10 text-rose-500 mx-auto" />
        <h2 className="text-lg font-bold text-slate-900">Report Not Found</h2>
        <p className="text-xs text-slate-500">This case has not been analyzed yet.</p>
        <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold">
          <ChevronLeft className="w-4 h-4" /> Return to Dashboard
        </Link>
      </div>
    );
  }

  const getRiskPresentation = (level: string) => {
    switch (level) {
      case "Critical":
        return {
          badge: "bg-rose-50 text-rose-700 border-rose-200",
          cardBorder: "border-rose-200",
          icon: AlertOctagon,
          textColor: "text-rose-600",
          summary: "Immediate threat confirmed. High likelihood of credential compromise, deception, or financial transaction diversion."
        };
      case "High":
        return {
          badge: "bg-orange-50 text-orange-700 border-orange-200",
          cardBorder: "border-orange-200",
          icon: AlertTriangle,
          textColor: "text-orange-600",
          summary: "Suspicious markers identified across ingested evidence. The indicators suggest an active social engineering or phishing attempt."
        };
      case "Medium":
        return {
          badge: "bg-amber-50 text-amber-700 border-amber-200",
          cardBorder: "border-amber-200",
          icon: ShieldAlert,
          textColor: "text-amber-600",
          summary: "Anomalous patterns detected. Secondary verification is recommended prior to taking any financial or authentication actions."
        };
      case "Low":
        return {
          badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
          cardBorder: "border-emerald-200",
          icon: CheckCircle2,
          textColor: "text-emerald-600",
          summary: "No immediate high-severity threat signatures detected. Standard organizational vigilance advised."
        };
      default:
        return {
          badge: "bg-slate-100 text-slate-600 border-slate-200",
          cardBorder: "border-slate-200",
          icon: Shield,
          textColor: "text-slate-600",
          summary: "Automated analysis pending complete verification."
        };
    }
  };

  const risk = getRiskPresentation(caseData.risk_level);
  const RiskIcon = risk.icon;
  const formattedDate = new Date(caseData.created_at || Date.now()).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  return (
    <>
      {/* =========================================================================
          SCREEN VIEW (Interactive Web UI)
         ========================================================================= */}
      <div className="space-y-8 screen-only">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <Link
              href={`/cases/${id}`}
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 transition-colors mb-2"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Back to Evidence
            </Link>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900">{caseData.title}</h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 font-mono">
                Report #{caseData.id}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={copyBriefing}
              className="px-3.5 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              <span>{copied ? "Copied" : "Copy Briefing"}</span>
            </button>
            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-white" />
              <span>Print Official PDF</span>
            </button>
          </div>
        </div>

        {/* Overview Card */}
        <div className={`bg-white border ${risk.cardBorder} rounded-xl p-6 sm:p-8 shadow-sm`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1 max-w-2xl">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Automated Forensic Assessment
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Incident Type: {caseData.incident_type || "Suspicious Activity"}
              </h2>
              <p className="text-sm text-slate-500 pt-1 leading-relaxed">
                {risk.summary}
              </p>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 shrink-0">
              <RiskIcon className={`w-8 h-8 ${risk.textColor}`} />
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Risk Rating
                </div>
                <div className={`text-xl font-bold ${risk.textColor}`}>
                  {caseData.risk_level || "Pending"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Analysis Grid */}
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left column: Findings & Timeline */}
          <div className="lg:col-span-8 space-y-8">
            {/* Red Flags */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <Flag className="w-4 h-4 text-rose-500" />
                  <h3 className="text-base font-bold text-slate-900">Identified Indicators &amp; Red Flags</h3>
                </div>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                  {caseData.indicators?.length || 0}
                </span>
              </div>

              {!caseData.indicators || caseData.indicators.length === 0 ? (
                <p className="text-sm text-slate-500">No red flags were triggered during the analysis.</p>
              ) : (
                <div className="space-y-3">
                  {caseData.indicators.map((ind: Record<string, any>) => (
                    <div
                      key={ind.id}
                      className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-slate-900">{ind.name}</span>
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${ind.severity === 'Critical' ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-orange-50 text-orange-700 border-orange-200'}`}>
                          {ind.severity}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{ind.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Evidence Chain */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
                <Layers className="w-4 h-4 text-slate-700" />
                <h3 className="text-base font-bold text-slate-900">Evidence Chain</h3>
              </div>

              <div className="space-y-3">
                {caseData.evidence?.map((ev: Record<string, any>, idx: number) => (
                  <div key={ev.id} className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-white text-slate-700 border border-slate-200 font-mono flex items-center justify-center text-[11px] font-bold shadow-xs">
                        {idx + 1}
                      </span>
                      <span className="font-medium text-slate-800">
                        {ev.file_type === "url" ? ev.file_path : ev.file_path.split('_').pop()}
                      </span>
                    </div>
                    <span className="uppercase font-mono text-[10px] text-slate-500 px-2 py-0.5 rounded bg-white border border-slate-200">
                      {ev.file_type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column: Action Plan */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-slate-700" />
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Recommended Actions
                </h3>
              </div>

              <div className="space-y-3 text-xs text-slate-600">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                  <div className="font-semibold text-slate-900">1. Isolate and Block</div>
                  <p className="text-slate-500">Block the sender domain and any extracted destination IPs at the perimeter.</p>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                  <div className="font-semibold text-slate-900">2. Verify Credentials</div>
                  <p className="text-slate-500">If any links were visited, invalidate active browser sessions and rotate passwords.</p>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                  <div className="font-semibold text-slate-900">3. Independent Verification</div>
                  <p className="text-slate-500">Validate requests through verified internal communication channels only.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          DEDICATED OFFICIAL PRINT DOSSIER
          (Strictly formatted for A4 PDF output with executive document styling)
         ========================================================================= */}
      <div className="print-dossier text-black bg-white">
        {/* Document Header */}
        <div className="border-b-2 border-slate-900 pb-4 mb-6 flex justify-between items-end">
          <div>
            <div className="text-xs font-mono font-bold tracking-widest uppercase text-slate-500 mb-1">
              DIGITAL FORENSIC INVESTIGATION REPORT
            </div>
            <h1 className="text-2xl font-black text-slate-950 uppercase tracking-tight">
              TRACELENS FORENSIC DOSSIER
            </h1>
          </div>
          <div className="text-right text-xs font-mono text-slate-600">
            <div><strong>CASE REF:</strong> TL-{caseData.id.toString().padStart(5, '0')}</div>
            <div><strong>DATE:</strong> {formattedDate}</div>
            <div><strong>STATUS:</strong> FORMAL ASSESSMENT</div>
          </div>
        </div>

        {/* Section 1: Case Summary Table */}
        <div className="dossier-section mb-6">
          <div className="text-xs font-bold font-mono uppercase tracking-wider bg-slate-100 px-3 py-1.5 border border-slate-300 mb-2">
            1.0 EXECUTIVE INCIDENT SUMMARY
          </div>
          <table className="w-full text-xs border-collapse border border-slate-300">
            <tbody>
              <tr className="border-b border-slate-300">
                <td className="w-1/4 p-2 font-bold bg-slate-50 border-r border-slate-300">Incident Title:</td>
                <td className="w-3/4 p-2 font-semibold text-slate-900">{caseData.title}</td>
              </tr>
              <tr className="border-b border-slate-300">
                <td className="p-2 font-bold bg-slate-50 border-r border-slate-300">Classification:</td>
                <td className="p-2 font-semibold text-slate-900">{caseData.incident_type || "Suspicious Activity"}</td>
              </tr>
              <tr className="border-b border-slate-300">
                <td className="p-2 font-bold bg-slate-50 border-r border-slate-300">Evaluated Risk Level:</td>
                <td className="p-2 font-black uppercase text-slate-900">{caseData.risk_level || "Pending"}</td>
              </tr>
              <tr className="border-b border-slate-300">
                <td className="p-2 font-bold bg-slate-50 border-r border-slate-300">Evidence Strength:</td>
                <td className="p-2 text-slate-800">{caseData.evidence_strength || "Moderate"}</td>
              </tr>
              <tr>
                <td className="p-2 font-bold bg-slate-50 border-r border-slate-300">Core Evaluation:</td>
                <td className="p-2 text-slate-700 leading-relaxed">{risk.summary}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Section 2: Detected Red Flags Table */}
        <div className="dossier-section mb-6">
          <div className="text-xs font-bold font-mono uppercase tracking-wider bg-slate-100 px-3 py-1.5 border border-slate-300 mb-2">
            2.0 IDENTIFIED THREAT INDICATORS &amp; RED FLAGS ({caseData.indicators?.length || 0})
          </div>
          {!caseData.indicators || caseData.indicators.length === 0 ? (
            <div className="p-3 border border-slate-300 text-xs text-slate-600 bg-slate-50">
              No anomalous security indicators were detected across the analyzed evidence.
            </div>
          ) : (
            <table className="w-full text-xs border-collapse border border-slate-300">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300 text-left">
                  <th className="p-2 border-r border-slate-300 w-12 font-bold">#</th>
                  <th className="p-2 border-r border-slate-300 w-48 font-bold">Indicator Name</th>
                  <th className="p-2 border-r border-slate-300 w-24 font-bold">Severity</th>
                  <th className="p-2 font-bold">Technical Description &amp; Context</th>
                </tr>
              </thead>
              <tbody>
                {caseData.indicators.map((ind: Record<string, any>, index: number) => (
                  <tr key={ind.id} className="border-b border-slate-300">
                    <td className="p-2 border-r border-slate-300 font-mono">{index + 1}</td>
                    <td className="p-2 border-r border-slate-300 font-semibold">{ind.name}</td>
                    <td className="p-2 border-r border-slate-300 uppercase font-bold text-slate-800">{ind.severity}</td>
                    <td className="p-2 text-slate-700 leading-relaxed">{ind.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Section 3: Ingested Evidence Chain */}
        <div className="dossier-section mb-6">
          <div className="text-xs font-mono font-bold uppercase tracking-wider bg-slate-100 px-3 py-1.5 border border-slate-300 mb-2">
            3.0 FORENSIC EVIDENCE CHAIN &amp; INGESTION LOG ({caseData.evidence?.length || 0} ARTIFACTS)
          </div>
          <table className="w-full text-xs border-collapse border border-slate-300">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-300 text-left">
                <th className="p-2 border-r border-slate-300 w-12 font-bold">Item</th>
                <th className="p-2 border-r border-slate-300 w-24 font-bold">Format</th>
                <th className="p-2 border-r border-slate-300 font-bold">Artifact Identifier / Target URL</th>
                <th className="p-2 w-28 font-bold">Extraction Status</th>
              </tr>
            </thead>
            <tbody>
              {caseData.evidence?.map((ev: Record<string, any>, idx: number) => (
                <tr key={ev.id} className="border-b border-slate-300">
                  <td className="p-2 border-r border-slate-300 font-mono">0{idx + 1}</td>
                  <td className="p-2 border-r border-slate-300 uppercase font-mono">{ev.file_type}</td>
                  <td className="p-2 border-r border-slate-300 font-mono text-[11px] break-all">
                    {ev.file_type === "url" ? ev.file_path : ev.file_path.split('_').pop()}
                  </td>
                  <td className="p-2 text-slate-700">Indexed ({ev.extracted_text ? ev.extracted_text.length : 0} bytes)</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Section 4: Incident Response & Containment Protocol */}
        <div className="dossier-section mb-6">
          <div className="text-xs font-mono font-bold uppercase tracking-wider bg-slate-100 px-3 py-1.5 border border-slate-300 mb-2">
            4.0 ACTIONABLE CONTAINMENT &amp; DEFENSE PROTOCOL
          </div>
          <div className="border border-slate-300 p-3 space-y-2 text-xs">
            <div className="leading-relaxed">
              <strong>1. Immediate Perimeter Isolation:</strong> Block destination IP addresses and sender domains at boundary email gateways and firewalls.
            </div>
            <div className="leading-relaxed">
              <strong>2. Credential Invalidation Protocol:</strong> If authentication details or 2FA codes were exposed, immediately terminate active sessions and enforce password rotation.
            </div>
            <div className="leading-relaxed">
              <strong>3. Out-of-Band Channel Verification:</strong> For invoices or payment changes, perform secondary verbal confirmation using vetted internal directory numbers only.
            </div>
          </div>
        </div>

        {/* Formal Signature & Verification Footer */}
        <div className="dossier-section pt-6 border-t border-slate-300 flex justify-between text-xs text-slate-500 font-mono">
          <div>
            Generated via <strong>TraceLens Rule-Based Forensic Engine</strong>
          </div>
          <div>
            Case Document Verification Hash: <span className="font-mono text-slate-700">SHA256-VALIDATED</span>
          </div>
        </div>
      </div>
    </>
  );
}