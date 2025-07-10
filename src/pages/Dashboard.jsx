import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Papa from "papaparse";
import { saveAs } from "file-saver";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Dashboard = () => {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const fetchSubmissions = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE_URL}/api/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSubmissions(res.data.submissions);
      setFiltered(res.data.submissions);
    } catch (err) {
      console.error("Error fetching dashboard:", err.response?.data);
      alert("Session expired or unauthorized");
      handleLogout();
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let temp = [...submissions];

    // Search by name/email
    if (search) {
      const lower = search.toLowerCase();
      temp = temp.filter(
        (s) =>
          s.fullName?.toLowerCase().includes(lower) ||
          s.email?.toLowerCase().includes(lower)
      );
    }

    // Filter by country
    if (countryFilter) {
      temp = temp.filter((s) => s.currentCountry === countryFilter);
    }

    // Filter by date
    if (startDate) {
      temp = temp.filter((s) => new Date(s.createdAt) >= new Date(startDate));
    }
    if (endDate) {
      temp = temp.filter((s) => new Date(s.createdAt) <= new Date(endDate));
    }

    setFiltered(temp);
    setCurrentPage(1); // Reset page
  };

  const downloadCSV = () => {
    const csv = Papa.unparse(filtered);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    saveAs(blob, "filtered-submissions.csv");
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [search, countryFilter, startDate, endDate]);

  const headers = [
    "fullName", "dateOfBirth", "gender", "nationality", "currentCountry", "phone", "email",
    "position", "qualification", "yearOfGraduation", "councilRegistered", "docsReady",
    "passportStatus", "italianKnowledge", "languageMode", "availabilityDate", "notes",
    "submittedIp", "submittedCountry", "createdAt"
  ];

  // Pagination logic
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleRows = filtered.slice(startIndex, startIndex + itemsPerPage);

  const uniqueCountries = [...new Set(submissions.map((s) => s.currentCountry))];

  return (
    <div className="max-w-full px-4 py-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-[#447D9B]">Maitri Italy Dashboard</h1>
        <div className="flex gap-2">
          <button
            onClick={downloadCSV}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Download CSV
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-4 mb-6">
        <input
          placeholder="Search name/email"
          className="border p-2 rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border p-2 rounded"
          value={countryFilter}
          onChange={(e) => setCountryFilter(e.target.value)}
        >
          <option value="">All Countries</option>
          {uniqueCountries.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <input
          type="date"
          className="border p-2 rounded"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="date"
          className="border p-2 rounded"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>

      {/* Table */}
      {loading ? (
        <p>Loading submissions...</p>
      ) : filtered.length === 0 ? (
        <p>No submissions found.</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-[1200px] table-auto border-collapse border border-gray-300 text-sm">
              <thead className="bg-gray-200 text-xs">
                <tr>
                  {headers.map((head) => (
                    <th key={head} className="border p-2">{head}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visibleRows.map((item) => (
                  <tr key={item._id} className="odd:bg-white even:bg-gray-50">
                    {headers.map((key) => (
                      <td key={key} className="border p-2">
                        {key === "createdAt"
                          ? new Date(item[key]).toLocaleString()
                          : item[key] || "-"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-4 gap-2 flex-wrap">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 border rounded ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
