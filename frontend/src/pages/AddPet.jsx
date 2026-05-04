import { useEffect, useState } from "react";
import api from "../services/api";
import { notify } from "../utils/toast";

function GivePet() {
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    age: "",
    color: "",
    category: "",
    address: "",
    owner_name: "",
    owner_email: "",
    owner_phone: "",
    justification: "",
  });

  useEffect(() => {
    let isMounted = true;

    api
      .get("/categories/")
      .then((res) => {
        if (isMounted) {
          setCategories(Array.isArray(res.data) ? res.data : []);
        }
      })
      .catch(() => {
        // handled globally
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (preview) URL.revokeObjectURL(preview);

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = form.name.trim();
    const age = Number(form.age);
    const color = form.color.trim();
    const category = form.category;
    const address = form.address.trim();
    const ownerName = form.owner_name.trim();
    const ownerEmail = form.owner_email.trim();
    const ownerPhone = form.owner_phone.trim();
    const justification = form.justification.trim();

    if (
      !name ||
      !age ||
      !color ||
      !category ||
      !address ||
      !ownerName ||
      !ownerEmail ||
      !ownerPhone ||
      !justification
    ) {
      notify.error("Please fill all required fields");
      return;
    }

    if (!ownerEmail.includes("@")) {
      notify.error("Enter a valid owner email");
      return;
    }

    if (age <= 0) {
      notify.error("Enter a valid age");
      return;
    }

    if (loading) return;
    setLoading(true);

    const data = new FormData();

    data.append("name", name);
    data.append("age", age);
    data.append("color", color);
    data.append("category", category);
    data.append("address", address);
    data.append("owner_name", ownerName);
    data.append("owner_email", ownerEmail);
    data.append("owner_phone", ownerPhone);
    data.append("justification", justification);

    if (image) {
      data.append("image", image);
    }

    try {
      await notify.promise(
        api.post("/pets/request/", data, { skipToast: true }),
        {
          pending: "Submitting request...",
          success: "Pet submitted for approval",
          error: {
            render({ data }) {
              const err = data?.response?.data;
              if (!err) return "Submission failed";
              if (typeof err === "object") {
                return Object.values(err).flat().join(" ");
              }
              return err;
            },
          },
        }
      );

      setForm({
        name: "",
        age: "",
        color: "",
        category: "",
        address: "",
        owner_name: "",
        owner_email: "",
        owner_phone: "",
        justification: "",
      });

      setImage(null);
      setPreview(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <div className="add-pet-page">
        <section className="registration__area-two pt-0">
          <div className="container">
            <div className="registration__inner-wrap-two">
              <div className="row align-items-center">
                <div className="col-lg-8">
                  <div className="registration__form-wrap">
                    <form
                      className="registration__form"
                      onSubmit={handleSubmit}
                    >
                      <h3 className="title">Submit a Pet for Adoption</h3>
                      <span>Please fill all required details</span>

                      <div className="row gutter-20">
                        <div className="col-md-6">
                          <div className="form-grp">
                            <input
                              name="name"
                              value={form.name}
                              placeholder="Pet Name"
                              onChange={handleChange}
                            />
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="form-grp">
                            <input
                              name="age"
                              type="number"
                              value={form.age}
                              placeholder="Age"
                              onChange={handleChange}
                            />
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="form-grp">
                            <input
                              name="color"
                              value={form.color}
                              placeholder="Color"
                              onChange={handleChange}
                            />
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="form-grp">
                            <input
                              name="owner_name"
                              value={form.owner_name}
                              placeholder="Owner Name"
                              onChange={handleChange}
                            />
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="form-grp">
                            <input
                              name="owner_email"
                              type="email"
                              value={form.owner_email}
                              placeholder="Owner Email"
                              onChange={handleChange}
                            />
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="form-grp">
                            <input
                              name="owner_phone"
                              value={form.owner_phone}
                              placeholder="Owner Phone"
                              onChange={handleChange}
                            />
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="form-grp select-grp">
                            <select
                              name="category"
                              value={form.category}
                              onChange={handleChange}
                              className={`custom-select ${
                                form.category ? "has-value" : ""
                              }`}
                            >
                              <option value="">Select Category</option>
                              {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                  {cat.name}
                                </option>
                              ))}
                            </select>

                            <i className="fas fa-chevron-down select-icon"></i>
                          </div>
                        </div>

                        <div className="col-md-12">
                          <div className="form-grp">
                            <input
                              name="address"
                              value={form.address}
                              placeholder="Pickup Address"
                              onChange={handleChange}
                            />
                          </div>
                        </div>

                        <div className="col-md-12">
                          <div className="form-grp">
                            <textarea
                              name="justification"
                              value={form.justification}
                              placeholder="Why are you giving this pet?"
                              onChange={handleChange}
                              className="justification-box"
                            />
                          </div>
                        </div>

                        <div className="form-grp mb-3">
                          <input
                            type="file"
                            id="fileUpload"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{ display: "none" }}
                          />

                          <label htmlFor="fileUpload" className="upload-field">
                            <span
                              className={`upload-text my-2 ${
                                image ? "has-file" : ""
                              }`}
                            >
                              {image ? image.name : "Upload Pet Image"}
                            </span>

                            <span className="browse-btn my-2">
                              Browse
                            </span>
                          </label>
                        </div>
                      </div>

                      <button type="submit" className="btn" disabled={loading}>
                        {loading ? "Submitting..." : "Submit Request"}
                      </button>
                    </form>
                  </div>
                </div>

                <div className="col-lg-4">
                  <div className="registration__img">
                    <img
                      src={
                        preview ||
                        "/assets/img/images/registration_img.png"
                      }
                      alt="preview"
                      className="preview-img"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default GivePet;
