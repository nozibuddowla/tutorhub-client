import { useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "../Provider/AuthProvider";
import Loading from "../components/Loading";
import { Button, Input, Badge, Modal } from "../components/ui";

const TutorApplications = () => {
  const { user } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingApp, setEditingApp] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // ✅ FIX: useCallback BEFORE useEffect
  const fetchApplications = useCallback(async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/tutor/applications/${user.email}`,
        { withCredentials: true },
      );
      setApplications(res.data);
    } catch {
      toast.error("Failed to fetch applications");
    } finally {
      setLoading(false);
    }
  }, [user?.email]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (user?.email) fetchApplications();
  }, [fetchApplications]);

  const handleEdit = (app) => {
    setEditingApp({ ...app });
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/applications/${editingApp._id}`,
        {
          qualifications: editingApp.qualifications,
          experience: editingApp.experience,
          expectedSalary: editingApp.expectedSalary,
        },
        { withCredentials: true },
      );
      toast.success("Application updated successfully");
      setShowEditModal(false);
      fetchApplications();
    } catch {
      toast.error("Failed to update application");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this application?"))
      return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/applications/${id}`, {
        withCredentials: true,
      });
      toast.success("Application deleted");
      fetchApplications();
    } catch {
      toast.error("Failed to delete application");
    }
  };

  const stats = {
    total: applications.length,
    pending: applications.filter((a) => a.status === "pending").length,
    approved: applications.filter((a) => a.status === "approved").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[var(--bg-elevated)] rounded-2xl p-6 shadow-sm border border-[var(--bg-border)]">
        <h2 className="text-2xl font-black text-[var(--text-primary)]">
          My Applications
        </h2>
        <p className="text-[var(--text-secondary)] mt-1">
          Track and manage your tuition applications
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Badge variant="gray">Total: {stats.total}</Badge>
          <Badge variant="yellow" dot>
            Pending: {stats.pending}
          </Badge>
          <Badge variant="green" dot>
            Approved: {stats.approved}
          </Badge>
          <Badge variant="red" dot>
            Rejected: {stats.rejected}
          </Badge>
        </div>
      </div>

      {/* Applications List */}
      {applications.length > 0 ? (
        <div className="grid gap-4">
          {applications.map((app) => (
            <div
              key={app._id}
              className="bg-[var(--bg-elevated)] rounded-2xl p-6 shadow-sm border border-[var(--bg-border)]"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <Badge variant="purple">{app.subject || "N/A"}</Badge>
                    <Badge
                      variant={
                        app.status === "approved"
                          ? "green"
                          : app.status === "rejected"
                            ? "red"
                            : "yellow"
                      }
                      dot
                    >
                      {app.status}
                    </Badge>
                  </div>
                  <h3 className="font-bold text-lg text-[var(--text-primary)] mb-2">
                    Application for {app.tuitionTitle || "Tuition"}
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-[var(--text-secondary)]">
                        Qualifications
                      </p>
                      <p className="font-semibold text-[var(--text-primary)]">
                        {app.qualifications}
                      </p>
                    </div>
                    <div>
                      <p className="text-[var(--text-secondary)]">Experience</p>
                      <p className="font-semibold text-[var(--text-primary)]">
                        {app.experience}
                      </p>
                    </div>
                    <div>
                      <p className="text-[var(--text-secondary)]">
                        Expected Salary
                      </p>
                      <p className="font-semibold text-[var(--text-primary)]">
                        ৳{app.expectedSalary}/month
                      </p>
                    </div>
                    <div>
                      <p className="text-[var(--text-secondary)]">Applied On</p>
                      <p className="font-semibold text-[var(--text-primary)]">
                        {new Date(app.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
                {app.status === "pending" && (
                  <div className="flex gap-3">
                    <Button
                      onClick={() => handleEdit(app)}
                      variant="secondary"
                      size="sm"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(app._id)}
                      variant="danger"
                      size="sm"
                    >
                      Delete
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-[var(--bg-elevated)] rounded-2xl p-12 text-center border-2 border-dashed border-gray-200">
          <div className="text-6xl mb-4">📝</div>
          <p className="text-[var(--text-secondary)] text-lg font-medium">
            No applications yet. Start applying for tuitions!
          </p>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingApp && (
        <Modal
          open={showEditModal}
          onClose={() => setShowEditModal(false)}
          title="Edit Application"
          footer={
            <>
              <Button variant="ghost" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleUpdate}>
                Save Changes
              </Button>
            </>
          }
        >
          <div className="space-y-4">
            <Input
              label="Qualifications"
              value={editingApp?.qualifications}
              onChange={(e) =>
                setEditingApp({ ...editingApp, qualifications: e.target.value })
              }
              required
            />
            <Input
              label="Experience"
              value={editingApp?.experience}
              onChange={(e) =>
                setEditingApp({ ...editingApp, experience: e.target.value })
              }
              required
            />
            <Input
              label="Expected Salary"
              type="number"
              icon="৳"
              value={editingApp?.expectedSalary}
              onChange={(e) =>
                setEditingApp({ ...editingApp, expectedSalary: e.target.value })
              }
              required
            />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default TutorApplications;
