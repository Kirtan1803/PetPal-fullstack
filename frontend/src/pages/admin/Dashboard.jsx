import { useEffect, useState } from "react";
import api from "../../services/api";

function Dashboard() {
  const [pets, setPets] = useState([]);
  const [adoptions, setAdoptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchDashboard = async () => {
      try {
        const [petsRes, adoptionRes] = await Promise.all([
          api.get("/pets/"),
          api.get("/adoption/requests/"),
        ]);

        if (!isMounted) return;

        setPets(Array.isArray(petsRes.data) ? petsRes.data : []);
        setAdoptions(Array.isArray(adoptionRes.data) ? adoptionRes.data : []);
      } catch {
        // handled globally
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return <div className="p-4">Loading dashboard...</div>;
  }

  // Metrics (optimized single pass)
  let availablePets = 0;
  let adoptedPets = 0;

  pets.forEach((p) => {
    if (p.status === "available") availablePets++;
    else if (p.status === "adopted") adoptedPets++;
  });

  const pendingRequests = adoptions.reduce(
    (count, a) => (a.status === "pending" ? count + 1 : count),
    0
  );

  return (
    <div className="admin-dashboard">
      <div className="dashboard-cards">
        <div className="card-box">
          <h6>Total Pets</h6>
          <h2>{pets.length}</h2>
        </div>

        <div className="card-box">
          <h6>Available</h6>
          <h2>{availablePets}</h2>
        </div>

        <div className="card-box">
          <h6>Adopted</h6>
          <h2>{adoptedPets}</h2>
        </div>

        <div className="card-box">
          <h6>Pending Requests</h6>
          <h2>{pendingRequests}</h2>
        </div>
      </div>

      <div className="dashboard-section">
        <h5>Recent Adoption Requests</h5>

        <div className="table-box">
          <table>
            <thead>
              <tr>
                <th>Pet</th>
                <th>User</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {adoptions.slice(0, 5).map((a) => (
                <tr key={a.id}>
                  <td>{a.pet_name}</td>
                  <td>{a.user}</td>
                  <td className={`status ${a.status}`}>
                    {a.status
                      ? a.status.charAt(0).toUpperCase() +
                        a.status.slice(1)
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;