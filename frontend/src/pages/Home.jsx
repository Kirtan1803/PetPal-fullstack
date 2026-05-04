import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { getMediaUrl } from "../utils/media";

function Home() {
  const navigate = useNavigate();

  const [pets, setPets] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    adopted: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchHomeData = async () => {
      try {
        const res = await api.get("/pets/");
        const allPets = Array.isArray(res.data) ? res.data : [];

        if (!isMounted) return;

        let available = 0;
        let adopted = 0;

        allPets.forEach((p) => {
          if (!p.status || p.status.toLowerCase() === "available") {
            available++;
          } else if (p.status.toLowerCase() === "adopted") {
            adopted++;
          }
        });

        setStats({
          total: allPets.length,
          available,
          adopted,
        });

        setPets(
          allPets
            .filter((p) => !p.status || p.status.toLowerCase() === "available")
            .slice(0, 6)
        );
      } catch {
        // handled globally
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchHomeData();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <section className="pt-0 pb-80">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="fw-bold mb-3">
                Find Your Perfect Companion
              </h1>

              <p className="mb-4">
                Adopt a pet, give them a loving home, and make a difference.
              </p>

              <button className="btn" onClick={() => navigate("/pets")}>
                Browse Pets
              </button>
            </div>

            <div className="col-lg-6 text-end">
              <img
                src="/assets/img/banner/banner_img01.png"
                alt="hero"
                className="img-fluid"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="pt-60 pb-60 bg-light text-center">
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <h3>{stats.total}</h3>
              <p>Total Pets</p>
            </div>

            <div className="col-md-4">
              <h3 className="text-success">{stats.available}</h3>
              <p>Available</p>
            </div>

            <div className="col-md-4">
              <h3 className="text-danger">{stats.adopted}</h3>
              <p>Adopted</p>
            </div>
          </div>
        </div>
      </section>

      <section className="pt-80 pb-80">
        <div className="container">
          <h2 className="text-center mb-5">Available Pets</h2>

          {loading ? (
            <p className="text-center">Loading pets...</p>
          ) : pets.length === 0 ? (
            <div className="text-center">
              <p>No pets available</p>
              <button
                className="btn mt-2"
                onClick={() => navigate("/pets")}
              >
                Browse All Pets
              </button>
            </div>
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
                        className={`pet-status ${
                          pet.status === "adopted"
                            ? "adopted"
                            : "available"
                        }`}
                      >
                        {pet.status
                          ? pet.status.charAt(0).toUpperCase() +
                            pet.status.slice(1)
                          : "Available"}
                      </span>

                      <div className="pet-color">{pet.color}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-4">
            <button className="btn" onClick={() => navigate("/pets")}>
              View All Pets
            </button>
          </div>
        </div>
      </section>

      <section className="pt-60 pb-60 bg-light">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <img
                src="/assets/img/images/about_img.png"
                alt="about"
                className="img-fluid"
              />
            </div>

            <div className="col-lg-6">
              <h3 className="mb-3">
                We Connect Pets With Loving Homes
              </h3>

              <p>
                Our platform makes adoption simple and meaningful.
                Browse pets, send requests, and bring home your companion.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="pt-80 pb-80 text-center">
        <div className="container">
          <h3>Ready to adopt a pet?</h3>

          <button
            className="btn mt-3"
            onClick={() => navigate("/pets")}
          >
            Browse Pets
          </button>
        </div>
      </section>
    </>
  );
}

export default Home;
