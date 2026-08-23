"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import {
  Upload,
  Link as LinkIcon,
  FileText,
  ArrowRight,
  Loader2,
  AlertCircle,
  Shield,
  ChevronLeft,
  CheckCircle2,
  Globe,
  FileUp
} from "lucide-react";
import Link from "next/link";

export default function CaseView({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const { id } = unwrappedParams;
  const router = useRouter();
  const [caseData, setCaseData] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState(true);

  // Upload states
  const [uploadType, setUploadType] = useState<"file" | "url">("file");
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const fetchCase = async (caseId: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cases/${caseId}`);
      if (res.ok) {
        const data = await res.json();
        setCaseData(data);
      }
    } catch (err) {
      console.error("Failed to fetch case", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCase(id);
  }, [id]);

  const handleUpload = async (customUrl?: string) => {
    const targetUrl = customUrl || url;
    if (uploadType === "file" && !file) return;
    if (uploadType === "url" && !targetUrl.trim()) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("case_id", id);

    let endpoint = "";

    if (uploadType === "file") {
      formData.append("file", file!);
      const ext = file!.name.split('.').pop()?.toLowerCase();
      let type = "text";
      if (ext === "pdf") type = "pdf";
      formData.append("file_type", type);
      endpoint = "/api/evidence/upload";
    } else {
      formData.append("url", targetUrl);
      endpoint = "/api/evidence/url";
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        setFile(null);
        setUrl("");
        fetchCase(id);
      }
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploading(false);
    }
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cases/${id}/analyze`, {
        method: "POST"
      });
      if (res.ok) {
        router.push(`/cases/${id}/report`);
      }
    } catch (err) {
      console.error(err);
      setAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-72 text-slate-500 space-y-3">
        <Loader2 className="w-8 h-8 text-slate-800 animate-spin" />
        <p className="text-sm">Loading case workspace...</p>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-12 text-center max-w-md mx-auto space-y-4 shadow-sm">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
        <h2 className="text-lg font-bold text-slate-900">Case Not Found</h2>
        <p className="text-xs text-slate-500">The requested investigation record could not be loaded.</p>
        <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800">
          <ChevronLeft className="w-4 h-4" /> Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 transition-colors mb-2"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Back to Cases
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900">{caseData.title}</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 font-mono">
              Case #{caseData.id}
            </span>
          </div>
        </div>

        {caseData.evidence && caseData.evidence.length > 0 && (
          <button
            onClick={handleAnalyze}
            disabled={analyzing}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
          >
            {analyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Correlating Evidence...</span>
              </>
            ) : (
              <>
                <span>Run Analysis</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        )}
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Upload Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
              <FileUp className="w-4 h-4 text-slate-700" />
              <span>Add Evidence</span>
            </h2>
            <p className="text-xs text-slate-500 mb-5">
              Upload files or enter URLs to extract IPs, emails, domains, and indicators.
            </p>

            {/* Type selector */}
            <div className="flex bg-slate-100 p-1 rounded-lg mb-5 border border-slate-200 text-xs">
              <button
                onClick={() => setUploadType("file")}
                className={`flex-1 py-2 rounded-md font-medium transition-all flex items-center justify-center gap-1.5 ${uploadType === "file" ? "bg-white text-slate-900 shadow-sm font-semibold" : "text-slate-500 hover:text-slate-900"}`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>File (PDF / Text)</span>
              </button>
              <button
                onClick={() => setUploadType("url")}
                className={`flex-1 py-2 rounded-md font-medium transition-all flex items-center justify-center gap-1.5 ${uploadType === "url" ? "bg-white text-slate-900 shadow-sm font-semibold" : "text-slate-500 hover:text-slate-900"}`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Suspicious URL</span>
              </button>
            </div>

            {uploadType === "file" ? (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-slate-300 hover:border-slate-400 rounded-xl p-6 text-center bg-slate-50 transition-all">
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                  <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                    <Upload className="w-8 h-8 text-slate-400 mb-2" />
                    <span className="text-sm font-semibold text-slate-800">
                      {file ? file.name : "Choose a file"}
                    </span>
                    <span className="text-xs text-slate-500 mt-1">PDF, TXT, Log files</span>
                  </label>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <label className="text-xs font-medium text-slate-700">Target Web Address</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="url"
                    placeholder="https://example.com/login"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full bg-white border border-slate-300 focus:border-slate-900 text-slate-900 rounded-lg pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>
              </div>
            )}

            <button
              onClick={() => handleUpload()}
              disabled={uploading || (uploadType === "file" ? !file : !url.trim())}
              className="w-full mt-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
            >
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              <span>{uploading ? "Extracting Evidence..." : "Attach Evidence"}</span>
            </button>
          </div>

          {/* Quick Samples */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Sample Demonstration Evidence
            </span>
            <div className="space-y-2">
              <button
                onClick={() => {
                  setUploadType("url");
                  setUrl("https://paypa1-security-verification-portal.com/login?token=urgent9912");
                }}
                className="w-full text-left p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs text-slate-700 hover:text-blue-600 transition-colors flex items-center justify-between"
              >
                <span>+ Load Suspicious Phishing URL</span>
                <Globe className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Evidence List Column */}
        <div className="lg:col-span-7">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm h-full flex flex-col">
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-200">
              <div>
                <h2 className="text-base font-bold text-slate-900">Collected Evidence ({caseData.evidence?.length || 0})</h2>
                <p className="text-xs text-slate-500">Artifacts ready for correlation analysis</p>
              </div>
            </div>

            {!caseData.evidence || caseData.evidence.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                <FileText className="w-10 h-10 text-slate-400 mb-2" />
                <p className="text-sm font-medium text-slate-700">No evidence attached yet</p>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">Upload a file or suspicious link on the left to start building this case.</p>
              </div>
            ) : (
              <div className="space-y-3 flex-1 overflow-y-auto">
                {caseData.evidence.map((ev: Record<string, any>) => (
                  <div
                    key={ev.id}
                    className="p-4 rounded-lg border border-slate-200 bg-slate-50 flex items-start gap-3.5"
                  >
                    <div className="p-2 rounded-lg bg-white border border-slate-200 text-slate-700 shrink-0 mt-0.5 shadow-xs">
                      {ev.file_type === "url" ? <Globe className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-slate-800 truncate">
                          {ev.file_type === "url" ? ev.file_path : ev.file_path.split('_').pop()}
                        </span>
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-white text-slate-600 border border-slate-200">
                          {ev.file_type}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-500">
                        <span>Extracted: {ev.extracted_text ? `${ev.extracted_text.length} chars` : '0 chars'}</span>
                        <span>•</span>
                        <span className="text-emerald-600 font-medium">Ready</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}