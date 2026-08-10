import { useState, useEffect } from "react";
import RequisitionTable from "../../components/ui/RequisitionTable";
import NewRequisition from "./NewRequisition";
import { getRequisitions } from "../../lib/api/requisitionApi";

const tabs = ["All", "Open", "Draft", "Closed", "Archived"];

const JobRequisition = () => {
  const [requisitions, setRequisitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequisition, setSelectedRequisition] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("All");

  const columns = [
    "ROLE",
    "DEPARTMENT",
    "TYPE",
    "STATUS",
    "CANDIDATES",
    "POSTED",
  ];

  const fetchRequisitions = () => {

    getRequisitions()
      .then((res) => {
        setRequisitions(res.data.data);
      })
      .catch((error) => {
        console.log("Failed to fetch requisitions:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRequisitions();
  }, []);

  const filteredData =
    activeTab === "All"
      ? requisitions
      : requisitions.filter((req) => req.status === activeTab);

  const tabCounts = {
    All: requisitions.length,
    Open: requisitions.filter((req) => req.status === "Open").length,
    Draft: requisitions.filter((req) => req.status === "Draft").length,
    Closed: requisitions.filter((req) => req.status === "Closed").length,
    Archived: requisitions.filter((req) => req.status === "Archived").length,
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            Job Requisitions
          </h2>

          <p className="text-gray-500 mt-1">
            {tabCounts.Open} open · {tabCounts.Draft} draft · {tabCounts.Closed} closed
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl shadow-sm transition"
        >
          + New Requisition
        </button>
      </div>

      <div className="flex items-center gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition ${activeTab === tab
                ? "bg-black text-white border-black"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
          >
            {tab} ({tabCounts[tab]})
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-gray-500">Loading requisitions...</div>
        ) : (
          <RequisitionTable
            columns={columns}
            data={filteredData}
            onEdit={(req) => {
              setSelectedRequisition(req);
              setShowModal(true);
            }}
          />
        )}
      </div>

      <NewRequisition
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedRequisition(null);
        }}
        requisition={selectedRequisition}
        onSaved={() => {
          fetchRequisitions();
        }}
      />
    </div>
  );
};

export default JobRequisition;