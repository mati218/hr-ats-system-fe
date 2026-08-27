import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  getRecruiterPerformance,
  exportReport,
} from "../../lib/api/reportsApi";

const EXPORT_OPTIONS = [
  {
    label: "Export PDF",
    format: "pdf",
    extension: "pdf",
  },
  {
    label: "Export Excel",
    format: "excel",
    extension: "xlsx",
  },
  {
    label: "Export CSV",
    format: "csv",
    extension: "csv",
  },
];

function ReportsAnalytics() {
  // =====================================================
  // FILTER INPUT STATE
  // =====================================================

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // =====================================================
  // ACTUALLY APPLIED FILTERS
  // Export bhi isi state ko use karega
  // =====================================================

  const [appliedFilters, setAppliedFilters] = useState({
    startDate: "",
    endDate: "",
  });

  // =====================================================
  // REPORT DATA
  // =====================================================

  const [rows, setRows] = useState([]);

  const [loading, setLoading] = useState(true);

  const [exportingFormat, setExportingFormat] =
    useState(null);

  // =====================================================
  // LOAD REPORT
  // =====================================================

  const loadReport = async (filters = {}) => {
    try {
      setLoading(true);

      const response =
        await getRecruiterPerformance(
          filters.startDate || "",
          filters.endDate || ""
        );

      const data =
        response?.data?.data || [];

      setRows(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (error) {
      console.error(
        "GET RECRUITER PERFORMANCE ERROR:",
        error?.response?.data || error
      );

      toast.error(
        error?.response?.data?.message ||
          "Failed to load recruiter performance report."
      );

      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    loadReport({
      startDate: "",
      endDate: "",
    });
  }, []);

  // =====================================================
  // APPLY FILTERS
  // =====================================================

  const handleApplyFilters = async () => {
    if (
      startDate &&
      endDate &&
      startDate > endDate
    ) {
      toast.error(
        "Start date cannot be after end date."
      );

      return;
    }

    const filters = {
      startDate,
      endDate,
    };

    setAppliedFilters(filters);

    await loadReport(filters);
  };

  // =====================================================
  // CLEAR FILTERS
  // =====================================================

  const handleClearFilters = async () => {
    setStartDate("");
    setEndDate("");

    const filters = {
      startDate: "",
      endDate: "",
    };

    setAppliedFilters(filters);

    await loadReport(filters);
  };

  // =====================================================
  // DOWNLOAD REPORT
  // =====================================================

  const handleExport = async ({
    format,
    extension,
  }) => {
    try {
      setExportingFormat(format);

      const response =
        await exportReport(
          format,
          appliedFilters.startDate,
          appliedFilters.endDate
        );

      // ---------------------------------------------
      // Filename from backend
      // ---------------------------------------------

      const disposition =
        response?.headers?.[
          "content-disposition"
        ];

      let filename =
        `recruiter-performance-report.${extension}`;

      if (disposition) {
        const filenameMatch =
          disposition.match(
            /filename="?([^"]+)"?/i
          );

        if (filenameMatch?.[1]) {
          filename =
            filenameMatch[1];
        }
      }

      // ---------------------------------------------
      // Blob download
      // ---------------------------------------------

      const blob =
        response.data instanceof Blob
          ? response.data
          : new Blob([
              response.data,
            ]);

      const url =
        window.URL.createObjectURL(
          blob
        );

      const link =
        document.createElement("a");

      link.href = url;
      link.download = filename;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);

      toast.success(
        `Report downloaded as ${extension.toUpperCase()}.`
      );
    } catch (error) {
      console.error(
        "EXPORT REPORT ERROR:",
        error?.response?.data || error
      );

      toast.error(
        "Failed to export report."
      );
    } finally {
      setExportingFormat(null);
    }
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="min-h-screen space-y-6 bg-slate-50/50 p-8">
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">
            Reports & Analytics
          </h1>

          <p className="mt-1 text-xs font-medium text-slate-500">
            Export hiring data for leadership review
          </p>
        </div>

        {/* =============================================
            EXPORT BUTTONS
        ============================================= */}

        <div className="flex flex-wrap items-center gap-2">
          {EXPORT_OPTIONS.map(
            (option) => (
              <button
                key={option.format}
                type="button"
                disabled={
                  exportingFormat ===
                  option.format
                }
                onClick={() =>
                  handleExport(option)
                }
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {exportingFormat ===
                option.format
                  ? "Exporting..."
                  : option.label}
              </button>
            )
          )}
        </div>
      </div>

      {/* =================================================
          FILTER + RECRUITER PERFORMANCE
      ================================================= */}

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        {/* =============================================
            TOP ROW
        ============================================= */}

        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          {/* ===========================================
              FILTERS
          =========================================== */}

          <div className="flex flex-wrap items-end gap-3">
            {/* START DATE */}

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-500">
                Start date
              </label>

              <input
                type="date"
                value={startDate}
                max={
                  endDate ||
                  undefined
                }
                onChange={(e) =>
                  setStartDate(
                    e.target.value
                  )
                }
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            {/* END DATE */}

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-500">
                End date
              </label>

              <input
                type="date"
                value={endDate}
                min={
                  startDate ||
                  undefined
                }
                onChange={(e) =>
                  setEndDate(
                    e.target.value
                  )
                }
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            {/* APPLY */}

            <button
              type="button"
              onClick={
                handleApplyFilters
              }
              disabled={loading}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Apply Filters
            </button>

            {/* CLEAR */}

            {(appliedFilters.startDate ||
              appliedFilters.endDate) && (
              <button
                type="button"
                onClick={
                  handleClearFilters
                }
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Clear
              </button>
            )}
          </div>

          {/* ===========================================
              TITLE ON RIGHT SIDE
          =========================================== */}

          <div>
            <h2 className="text-sm font-bold text-slate-800">
              Recruiter Performance
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              Hiring performance by recruiter
            </p>
          </div>
        </div>

        {/* =================================================
            TABLE
        ================================================= */}

        <div className="mt-5 overflow-x-auto">
          {loading ? (
            <div className="py-8 text-center text-sm text-slate-500">
              Loading recruiter performance...
            </div>
          ) : rows.length === 0 ? (
            <div className="py-8 text-center text-sm text-slate-500">
              No hires found for the selected date range.
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  <th className="px-3 py-3">
                    Recruiter
                  </th>

                  <th className="px-3 py-3">
                    Hires
                  </th>

                  <th className="px-3 py-3">
                    Avg TTH
                  </th>
                </tr>
              </thead>

              <tbody>
                {rows.map(
                  (row, index) => (
                    <tr
                      key={
                        row.recruiterId ||
                        index
                      }
                      className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50"
                    >
                      <td className="px-3 py-4 font-medium text-slate-800">
                        {row.recruiter}
                      </td>

                      <td className="px-3 py-4 text-slate-600">
                        {row.hires}
                      </td>

                      <td className="px-3 py-4 text-slate-600">
                        {row.avgTTH}d
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReportsAnalytics;