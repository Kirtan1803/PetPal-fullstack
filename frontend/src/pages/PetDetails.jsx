import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { notify } from "../utils/toast";
import { getMediaUrl } from "../utils/media";

function PetDetails() {
  const { id } = useParams();
  const [pet, setPet] = useState(null);
  const [message, setMessage] = useState("");
  const [requestSent, setRequestSent] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchPet = async () => {
      try {
        const res = await api.get(`/pets/${id}/`);
        if (isMounted) setPet(res.data);
      } catch {
        // handled globally
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchPet();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleAdopt = async () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
      notify.error("Please enter a message");
      return;
    }

    try {
      await notify.promise(
        api.post(
          "/adoption/request/",
          { pet: Number(id), message: trimmedMessage },
          { skipToast: true }
        ),
        {
          pending: "Sending request...",
          success: "Request sent",
          error: {
            render({ data }) {
              const err = data?.response?.data;
              if (!err) return "Something went wrong";
              if (typeof err === "object") {
                return Object.values(err).flat().join(" ");
              }
              return err;
            },
          },
        }
      );

      setRequestSent(true);
    } catch {
      // handled by toast
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!pet) return <p>Pet not found</p>;

  return (
    <section className="animal__details-area pt-0 pb-100">
      <div className="container">
        <div className="row">
          <div className="col-lg-6">
            <div className="pet-image-wrapper">
              <img
                src={getMediaUrl(pet.image)}
                alt={pet.name}
                className="img-fluid rounded shadow"
              />
            </div>
          </div>

          <div className="col-lg-6">
            <div className="animal__details-sidebar-info">
              <h2 className="title mb-2">{pet.name}</h2>

              <p className="text-muted mb-3">
                {pet.category_name || "Pet"} - {pet.age} years
              </p>

              <ul className="list-wrap mb-4">
                <li>
                  <span>Color:</span> {pet.color}
                </li>
                <li>
                  <span>Status:</span>{" "}
                  {pet.status
                    ? pet.status.charAt(0).toUpperCase() +
                      pet.status.slice(1)
                    : "Available"}
                </li>
              </ul>

              <textarea
                className="form-control no-resize"
                placeholder="Why do you want to adopt?"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />

              <button
                className="btn w-100 mt-3"
                onClick={handleAdopt}
                disabled={requestSent}
              >
                {requestSent ? "Request Sent" : "Send Adoption Request"}
              </button>
            </div>
          </div>
        </div>

        <div className="animal__details-description mt-5">
          <h4 className="title">Description</h4>
          <p>{pet.description || "No description available."}</p>
        </div>
      </div>
    </section>
  );
}

export default PetDetails;
