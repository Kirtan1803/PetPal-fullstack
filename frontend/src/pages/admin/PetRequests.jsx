import { useEffect, useState } from "react";
import api from "../../services/api";
import { notify } from "../../utils/toast";

function PetRequests() {
  const [requests, setRequests] = useState([]);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const [reqRes, actRes] = await Promise.all([
          api.get("/pets/requests/"),
          api.get("/pets/admin/activity/"),
        ]);

        if (!isMounted) return;

        setRequests(Array.isArray(reqRes.data) ? reqRes.data : []);
        setActivity(Array.isArray(actRes.data) ? actRes.data : []);
      } catch {
        // handled globally
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleApprove = async (id) => {
    try {
      await api.post(`/pets/approve/${id}/`);

      setRequests((prev) => prev.filter((r) => r.id !== id));
      notify.success("Pet approved");
    } catch {
      // handled globally
    }
  };

  const handleReject = async (id) => {
    try {
      await api.post(`/pets/reject/${id}/`);

      setRequests((prev) => prev.filter((r) => r.id !== id));
      notify.success("Pet rejected");
    } catch {
      // handled globally
    }
  };

  if (loading) {
    return <div className="p-4">Loading requests...</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-section">
        <h5>Pet Requests</h5>

        <div className="table-box">
          <table>
            <thead>
              <tr>
                <th>Pet</th>
                <th>Category</th>
                <th>Owner</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {requests.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>
                    No pending requests
                  </td>
                </tr>
              ) : (
                requests.map((pet) => (
                  <tr key={pet.id}>
                    <td>{pet.name}</td>
                    <td>{pet.category_name || "-"}</td>
                    <td>{pet.owner_email || "-"}</td>

                    <td className="status pending">Pending</td>

                    <td className="action-cell">
                      <button
                        className="btn-approve"
                        onClick={() => handleApprove(pet.id)}
                      >
                        Approve
                      </button>

                      <button
                        className="btn-reject"
                        onClick={() => handleReject(pet.id)}
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="admin-activity mt-4">
        <h5 className="mb-3">Recent Activity</h5>

        {activity.length === 0 ? (
          <p className="text-muted">No recent actions</p>
        ) : (
          <div className="activity-list">
            {activity.map((item) => (
              <div key={item.id} className="activity-item">
                <span
                  className={`status-dot ${
                    item.type === "approved" ? "approved" : "rejected"
                  }`}
                ></span>

                <div>
                  <p className="mb-0">{item.message}</p>
                  <small className="text-muted">
                    {new Date(item.created_at).toLocaleString()}
                  </small>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PetRequests;