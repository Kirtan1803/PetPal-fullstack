import { useEffect, useState } from "react";
import api from "../../services/api";
import { notify } from "../../utils/toast";

function AdoptionRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchRequests = async () => {
      try {
        const res = await api.get("/adoption/requests/");
        if (isMounted) {
          setRequests(Array.isArray(res.data) ? res.data : []);
        }
      } catch {
        // handled globally
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchRequests();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleApprove = async (id) => {
    try {
      await api.post(`/adoption/approve/${id}/`);

      setRequests((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, status: "approved" } : r
        )
      );

      notify.success("Adoption approved");
    } catch {
      // handled globally
    }
  };

  const handleReject = async (id) => {
    try {
      await api.post(`/adoption/reject/${id}/`);

      setRequests((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, status: "rejected" } : r
        )
      );

      notify.success("Adoption rejected");
    } catch {
      // handled globally
    }
  };

  if (loading) {
    return <div className="p-4">Loading adoption requests...</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-section">
        <h5>Adoption Requests</h5>

        <div className="table-box">
          <table>
            <thead>
              <tr>
                <th>Pet</th>
                <th>User</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {requests.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center" }}>
                    No adoption requests
                  </td>
                </tr>
              ) : (
                requests.map((req) => (
                  <tr key={req.id}>
                    <td>{req.pet_name}</td>
                    <td>{req.user}</td>

                    <td>
                      <span className={`status ${req.status}`}>
                        {req.status}
                      </span>
                    </td>

                    <td className="action-cell">
                      {req.status === "pending" ? (
                        <>
                          <button
                            className="btn-approve"
                            onClick={() => handleApprove(req.id)}
                          >
                            Approve
                          </button>

                          <button
                            className="btn-reject"
                            onClick={() => handleReject(req.id)}
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <span className="text-muted">No actions</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdoptionRequests;