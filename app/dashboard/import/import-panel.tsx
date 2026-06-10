"use client";

import { useRef, useState } from "react";
import { Upload, Download, CheckCircle2, AlertCircle } from "lucide-react";
import { importTestimonials } from "../actions";

interface ParsedRow {
  author_name: string;
  author_role: string | null;
  body: string;
  rating: number | null;
  valid: boolean;
  issue?: string;
}

function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (char === '"' && next === '"') {
        field += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        field += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n" || char === "\r") {
      if (char === "\r" && next === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.some((c) => c.trim() !== ""));
}

export default function ImportPanel() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<number | null>(null);

  const validRows = rows.filter((r) => r.valid);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setResult(null);
    setParseError(null);
    setRows([]);
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = (ev.target?.result as string) ?? "";
      const table = parseCSV(text);

      if (table.length < 2) {
        setParseError("This CSV file doesn't contain any data rows.");
        return;
      }

      const header = table[0].map((h) => h.trim().toLowerCase());
      const nameIdx = header.indexOf("name");
      const roleIdx = header.indexOf("role");
      const testimonialIdx = header.indexOf("testimonial");
      const ratingIdx = header.indexOf("rating");

      if (nameIdx === -1 || testimonialIdx === -1) {
        setParseError(
          `CSV must include "name" and "testimonial" columns. Found: ${table[0].join(", ")}`
        );
        return;
      }

      const parsed: ParsedRow[] = table.slice(1).map((cols) => {
        const author_name = (cols[nameIdx] ?? "").trim();
        const body = (cols[testimonialIdx] ?? "").trim();
        const author_role =
          roleIdx !== -1 ? (cols[roleIdx] ?? "").trim() || null : null;

        let rating: number | null = null;
        let issue: string | undefined;

        if (ratingIdx !== -1) {
          const raw = (cols[ratingIdx] ?? "").trim();
          if (raw) {
            const n = Number(raw);
            if (Number.isInteger(n) && n >= 1 && n <= 5) {
              rating = n;
            } else {
              issue = "Invalid rating (must be 1-5)";
            }
          }
        }

        if (!author_name || !body) {
          issue = "Missing name or testimonial";
        }

        return { author_name, author_role, body, rating, valid: !issue, issue };
      });

      setRows(parsed);
    };
    reader.readAsText(file);
  }

  async function handleImport() {
    setImporting(true);
    setParseError(null);
    const { error, count } = await importTestimonials(
      validRows.map((r) => ({
        author_name: r.author_name,
        author_role: r.author_role,
        body: r.body,
        rating: r.rating,
      }))
    );
    setImporting(false);

    if (error) {
      setParseError(error);
      return;
    }

    setResult(count);
    setRows([]);
    setFileName(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <label className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-[#ECE7E0] bg-white px-4 py-2 text-sm font-medium text-[#6B6B6B] transition-colors hover:border-[#1A1A1A]/20 hover:text-[#1A1A1A]">
          <Upload size={15} />
          Upload CSV
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFile}
            className="sr-only"
          />
        </label>
        <a
          href="/sample-testimonials.csv"
          download
          className="flex items-center gap-1.5 rounded-lg border border-[#ECE7E0] bg-white px-4 py-2 text-sm font-medium text-[#6B6B6B] transition-colors hover:border-[#1A1A1A]/20 hover:text-[#1A1A1A]"
        >
          <Download size={15} />
          Download sample CSV
        </a>
        {fileName && <span className="text-sm text-[#6B6B6B]">{fileName}</span>}
      </div>

      {parseError && (
        <p className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-600">
          <AlertCircle size={16} />
          {parseError}
        </p>
      )}

      {result !== null && (
        <p className="mt-4 flex items-center gap-2 rounded-lg bg-[#2E9E6B]/10 px-3 py-2.5 text-sm text-[#268A5C]">
          <CheckCircle2 size={16} />
          Successfully imported {result} testimonial{result === 1 ? "" : "s"}.
        </p>
      )}

      {rows.length > 0 && (
        <div className="mt-6">
          <div className="overflow-x-auto rounded-lg border border-[#ECE7E0]">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#FAF8F5] text-xs uppercase tracking-wider text-[#6B6B6B]">
                <tr>
                  <th className="px-4 py-2.5 font-semibold">Name</th>
                  <th className="px-4 py-2.5 font-semibold">Role</th>
                  <th className="px-4 py-2.5 font-semibold">Testimonial</th>
                  <th className="px-4 py-2.5 font-semibold">Rating</th>
                  <th className="px-4 py-2.5 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ECE7E0]">
                {rows.map((row, i) => (
                  <tr key={i} className={row.valid ? "" : "bg-red-50/50"}>
                    <td className="px-4 py-2.5 text-[#1A1A1A]">
                      {row.author_name || "—"}
                    </td>
                    <td className="px-4 py-2.5 text-[#6B6B6B]">
                      {row.author_role || "—"}
                    </td>
                    <td className="max-w-xs truncate px-4 py-2.5 text-[#6B6B6B]">
                      {row.body || "—"}
                    </td>
                    <td className="px-4 py-2.5 text-[#6B6B6B]">
                      {row.rating ?? "—"}
                    </td>
                    <td className="px-4 py-2.5">
                      {row.valid ? (
                        <span className="text-[#2E9E6B]">Ready</span>
                      ) : (
                        <span className="text-red-500">{row.issue}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleImport}
              disabled={importing || validRows.length === 0}
              className="rounded-lg bg-[#E8743B] px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#CF5F2C] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {importing
                ? "Importing…"
                : `Import ${validRows.length} testimonial${validRows.length === 1 ? "" : "s"}`}
            </button>
            {rows.length !== validRows.length && (
              <span className="text-sm text-[#6B6B6B]">
                {rows.length - validRows.length} row
                {rows.length - validRows.length === 1 ? "" : "s"} skipped due
                to errors
              </span>
            )}
          </div>
        </div>
      )}
    </>
  );
}
