import { Link } from "react-router-dom";
import { getMediaUrl } from "../utils/media";

function PetCard({ pet }) {
  return (
    <div className="card pet-card border-0 shadow-sm h-100 overflow-hidden">
      <img
        src={getMediaUrl(pet.image)}
        className="card-img-top"
        alt={pet.name}
        style={{ height: "220px", objectFit: "cover" }}
      />

      <div className="card-body">
        <h5 className="fw-bold">{pet.name}</h5>

        <p className="text-muted mb-1">Color: {pet.color}</p>
        <p className="text-muted">Age: {pet.age}</p>

        <Link
          to={`/pets/${pet.id}`}
          className="btn btn-primary w-100 mt-3 fw-semibold"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}

export default PetCard;
