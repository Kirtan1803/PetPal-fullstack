import { useEffect, useState } from "react";
import api from "../services/api";

function MyAdoptions() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchAdoptions = async () => {
      try {
        const res = await api.get("/adoption/my/");
        if (isMounted) {
          setData(Array.isArray(res.data) ? res.data : []);
        }
      } catch {
        // handled globally
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAdoptions();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="animal__area-three pt-0 pb-100">
      <div className="container">
        <h2 className="mb-4">My Adoptions</h2>

        {loading ? (
          <p>Loading...</p>
        ) : data.length === 0 ? (
          <p>No adoption requests found</p>
        ) : (
          <div className="table-box">
            <table>
              <thead>
                <tr>
                  <th>Pet</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {data.map((item) => (
                  <tr key={item.id}>
                    <td>{item.pet_name}</td>

                    <td className={`status ${item.status || ""}`}>
                      {item.status
                        ? item.status.charAt(0).toUpperCase() +
                          item.status.slice(1)
                        : "-"}
                    </td>

                    <td>
                      {item.created_at
                        ? new Date(item.created_at).toLocaleString()
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

export default MyAdoptions;
