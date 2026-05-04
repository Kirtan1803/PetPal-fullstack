import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { getMediaUrl } from "../utils/media";

function Pets() {
  const navigate = useNavigate();

  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [color, setColor] = useState("");
  const [status, setStatus] = useState("");

  const [categories, setCategories] = useState([]);
  const [colors, setColors] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const fetchAll = async () => {
      try {
        const [petsRes, catRes, colorRes] = await Promise.all([
          api.get("/pets/"),
          api.get("/categories/"),
          api.get("/pets/colors/"),
        ]);

        if (!isMounted) return;

        setPets(Array.isArray(petsRes.data) ? petsRes.data : []);
        setCategories(Array.isArray(catRes.data) ? catRes.data : []);
        setColors(Array.isArray(colorRes.data) ? colorRes.data : []);
      } catch {
        // handled globally
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAll();

    return () => {
      isMounted = false;
    };
  }, []);

  const fetchPets = async (params = {}) => {
    setLoading(true);
    try {
      const res = await api.get("/pets/", { params });
      setPets(Array.isArray(res.data) ? res.data : []);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    fetchPets({
      search: search.trim(),
      category,
      color,
      status,
    });
  };

  const resetFilters = () => {
    setSearch("");
    setCategory("");
    setColor("");
    setStatus("");
    fetchPets();
  };

  return (
    <section className="animal__area-three pt-0 pb-100">
      <div className="container">
        <div className="row">
          <div className="col-lg-3">
            <div className="pets-sidebar-fixed">
              <h5 className="mb-3 fw-bold">Filters</h5>

              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search pets..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="fw-semibold">Color</label>
                <select
                  className="form-select"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                >
                  <option value="">All</option>
                  {colors.map((c, i) => (
                    <option key={i} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="fw-semibold d-block mb-2">
                  Availability
                </label>

                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className={`filter-btn ${
                      status === "available" ? "active" : ""
                    }`}
                    onClick={() =>
                      setStatus(status === "available" ? "" : "available")
                    }
                  >
                    Available
                  </button>

                  <button
                    type="button"
                    className={`filter-btn ${
                      status === "adopted" ? "active" : ""
                    }`}
                    onClick={() =>
                      setStatus(status === "adopted" ? "" : "adopted")
                    }
                  >
                    Adopted
                  </button>
                </div>
              </div>

              <div className="mb-3">
                <label className="fw-semibold">Category</label>
                <select
                  className="form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">All</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="d-flex gap-2 mt-4">
                <button
                  type="button"
                  className="btn flex-grow-1"
                  onClick={applyFilters}
                >
                  Apply
                </button>

                <button
                  type="button"
                  className="btn btn-outline-secondary flex-grow-1"
                  onClick={resetFilters}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          <div className="col-lg-9">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border" />
              </div>
            ) : pets.length === 0 ? (
              <p className="text-center">No pets found</p>
            ) : (
              <div className="row">
                {pets.map((pet) => (
                  <div key={pet.id} className="col-md-4 mb-4">
                    <div
                      className="pet-card clickable"
                      onClick={() => navigate(`/pets/${pet.id}`)}
                    >
                      <img src={getMediaUrl(pet.image)} alt={pet.name} />

                      <div className="p-3">
                        <h5>{pet.name}</h5>

                        <p className="text-muted mb-1">
                          {pet.category_name || "Pet"} - {pet.age} yrs
                        </p>

                        <span
                          className={`pet-status me-1 ${
                            pet.status === "available"
                              ? "available"
                              : "adopted"
                          }`}
                        >
                          {pet.status
                            ? pet.status.charAt(0).toUpperCase() +
                              pet.status.slice(1)
                            : "Available"}
                        </span>

                        <div className="pet-color mt-1">
                          | {pet.color}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Pets;
