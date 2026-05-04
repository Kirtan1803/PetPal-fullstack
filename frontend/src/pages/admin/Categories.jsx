import { useEffect, useState } from "react";
import api from "../../services/api";
import { notify } from "../../utils/toast";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories/");
        if (isMounted) {
          setCategories(Array.isArray(res.data) ? res.data : []);
        }
      } catch {
        // handled globally
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleEdit = (cat) => {
    setEditingId(cat.id);
    setEditValue(cat.name);
  };

  const handleUpdate = async (id) => {
    const value = editValue.trim();

    if (!value) {
      notify.error("Name cannot be empty");
      return;
    }

    try {
      await api.put(`/categories/${id}/`, { name: value });

      setCategories((prev) =>
        prev.map((c) =>
          c.id === id
            ? { ...c, name: value, pet_count: c.pet_count }
            : c
        )
      );

      notify.success("Category updated");
      setEditingId(null);
    } catch {
      // handled globally
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();

    const value = name.trim();

    if (!value) {
      notify.error("Category name required");
      return;
    }

    try {
      const res = await api.post("/categories/create/", { name: value });

      setCategories((prev) => [...prev, res.data]);
      setName("");

      notify.success("Category added");
    } catch {
      // handled globally
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;

    try {
      await api.delete(`/categories/${id}/`);

      setCategories((prev) => prev.filter((c) => c.id !== id));
      notify.success("Category deleted");
    } catch {
      // handled globally
    }
  };

  if (loading) {
    return <div className="p-4">Loading categories...</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-section">
        <h5>Add Category</h5>

        <form onSubmit={handleAdd} className="category-form">
          <input
            type="text"
            placeholder="Enter category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <button type="submit" className="btn-approve">
            Add
          </button>
        </form>
      </div>

      <div className="dashboard-section">
        <h5>All Categories</h5>

        <div className="table-box categories-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Pets</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {categories.length === 0 ? (
                <tr>
                  <td colSpan="3" style={{ textAlign: "center" }}>
                    No categories found
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat.id}>
                    <td>
                      {editingId === cat.id ? (
                        <input
                          className="edit-input"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                        />
                      ) : (
                        cat.name
                      )}
                    </td>

                    <td>{cat.pet_count || 0}</td>

                    <td className="action-cell">
                      <div className="actions-fixed">
                        <div className="action-slot">
                          <button
                            className={`btn-edit ${
                              editingId === cat.id ? "hidden" : ""
                            }`}
                            onClick={() => handleEdit(cat)}
                          >
                            Edit
                          </button>

                          <button
                            className={`btn-approve ${
                              editingId === cat.id ? "" : "hidden"
                            }`}
                            onClick={() => handleUpdate(cat.id)}
                          >
                            Save
                          </button>
                        </div>

                        <div className="action-slot">
                          <button
                            className={`btn-reject ${
                              editingId === cat.id ? "hidden" : ""
                            }`}
                            onClick={() => handleDelete(cat.id)}
                          >
                            Delete
                          </button>

                          <button
                            className={`btn-secondary ${
                              editingId === cat.id ? "" : "hidden"
                            }`}
                            onClick={() => setEditingId(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
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

export default Categories;