import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { useAuth } from "../../context/useAuth";
import { Colors } from "../../constant/colors";

function AdminHome() {
  const { user: currentUser } = useAuth();

  const [queueData, setQueueData] = useState({ total: 0, done: 0, skipped: 0, waiting: 0, canceled: 0 });
  const [today, setToday] = useState("");
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [editUser, setEditUser] = useState(null);
  const [editForm, setEditForm] = useState({ username: "", role: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    setToday(new Date().toLocaleDateString("th-TH", { year: "numeric", month: "long", day: "numeric" }));
  }, []);

  useEffect(() => {
    axios.get("http://localhost/food_queue/api/queue.php/list")
      .then(res => {
        const q = res.data || [];
        setQueueData({
          total:    q.length,
          done:     q.filter(x => x.status_id === 3).length,
          skipped:  q.filter(x => x.status_id === 2).length,
          waiting:  q.filter(x => x.status_id === 1).length,
          canceled: q.filter(x => x.status_id === 4).length,
        });
      }).catch(console.error);
  }, []);

  const fetchUsers = () => {
    setLoading(true);
    axios.get("http://localhost/food_queue/api/user.php/users")
      .then(res => setUsers(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };
  useEffect(() => { fetchUsers(); }, []);

  const countAll   = users.length;
  const countAdmin = users.filter(u => u.role === "admin").length;
  const countUser  = users.filter(u => u.role === "user").length;

  const filtered = users.filter(u => {
    const matchSearch = u.username.toLowerCase().includes(search.toLowerCase());
    const matchRole   = roleFilter === "all" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const openEdit = (u) => {
    setEditUser(u);
    setEditForm({ username: u.username, role: u.role });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.post("http://localhost/food_queue/api/user.php/update", {
        user_id: editUser.user_id,
        username: editForm.username,
        role: editForm.role,
      });
      setEditUser(null);
      fetchUsers();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (userId) => {
    try {
      await axios.delete("http://localhost/food_queue/api/user.php/delete", {
        data: { user_id: userId }
      });
      setDeleteConfirm(null);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const queueCards = [
    { label: "คิวทั้งหมด",   value: queueData.total,    color: Colors.blue,  bg: "#ffffff" },
    { label: "รอดำเนินการ", value: queueData.waiting,   color: "#FCC402",    bg: "#ffffff" },
    { label: "ข้ามคิว",      value: queueData.skipped,  color: "#555555",       bg: "#ffffff" },
    { label: "เสร็จแล้ว",   value: queueData.done,      color: "#166534",    bg: "#ffffff" },
    { label: "ยกเลิก",       value: queueData.canceled,  color: "#991b1b",    bg: "#ffffff" },
  ];
  
  const roleBadge = (role) =>
    role === "admin"
      ? <span className="badge" style={{ backgroundColor:"#FCC402" ,color:"black"}}>Admin</span>
      : <span className="badge" style={{ backgroundColor:"#003666" ,color:"white"}}>User</span>;

  const filterBtnStyle = (active, activeColor) => ({
    fontSize: "13px",
    padding: "5px 12px",
    borderRadius: "20px",
    border: `1.5px solid ${activeColor}`,
    backgroundColor: active ? activeColor : "transparent",
    color: active ? "#ffff" : activeColor,
    cursor: "pointer",
    fontWeight: active ? "600" : "400",
    whiteSpace: "nowrap",
    transition: "all 0.15s ease",
  });

  return (
    <div style={{ minHeight: "100vh", backgroundColor: Colors.lightGray, padding: "12px 12px 32px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

        {/* ===== Header ===== */}
        <div className="mb-4">
          <h4 className="fw-bold mb-0" style={{ color: Colors.blue, fontSize: "clamp(16px, 3vw, 22px)" }}>
            สรุปภาพรวมวันนี้
          </h4>
          <p className="text-muted mb-0" style={{ fontSize: "13px" }}>{today}</p>
        </div>

        {/* ===== Queue Cards =====
            xs  : 2 คอล  | sm : 3 คอล  | lg : 5 คอล  */}
        <div className="row g-2 g-sm-3 mb-4">
          {queueCards.map(c => (
            <div key={c.label} className="col-6 col-sm-4 col-lg">
              <div
                className="card border-0 text-center h-100"
                style={{ backgroundColor: c.bg, borderRadius: "12px", boxShadow: "0 1px 6px rgba(0,0,0,0.07)" }}
              >
                <div className="card-body py-3 px-2">
                  <div style={{ fontSize: "11px", color: "#666666", marginBottom: "4px", lineHeight: 1.3 }}>{c.label}</div>
                  <div style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: "700", color: c.color, lineHeight: 1 }}>{c.value}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <hr style={{ borderColor: Colors.yellow, borderWidth: "2px", opacity: 1 }} className="my-4" />

        {/* ===== User Management Header ===== */}
        <div className="mb-3">
          <h5 className="fw-bold mb-3" style={{ color: Colors.blue, fontSize: "clamp(14px, 2.5vw, 18px)" }}>
            จัดการผู้ใช้งาน
          </h5>

          <div className="d-flex flex-column flex-sm-row gap-2 align-items-start align-items-sm-center flex-wrap">
            <div className="d-flex gap-2 flex-wrap flex-shrink-0">
              <button style={filterBtnStyle(roleFilter === "all", "#333333")} onClick={() => setRoleFilter("all")}>
                ทั้งหมด <span style={{ marginLeft: "4px", fontWeight: "700" }}>{countAll}</span>
              </button>
              <button style={filterBtnStyle(roleFilter === "admin", Colors.blue)} onClick={() => setRoleFilter("admin")}>
                Admin <span style={{ marginLeft: "4px", fontWeight: "700" }}>{countAdmin}</span>
              </button>
              <button style={filterBtnStyle(roleFilter === "user", "#6b7280")} onClick={() => setRoleFilter("user")}>
                User <span style={{ marginLeft: "4px", fontWeight: "700" }}>{countUser}</span>
              </button>
            </div>

            <input
              type="text"
              className="form-control"
              placeholder="ค้นหาชื่อผู้ใช้..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ fontSize: "14px", maxWidth: "100%", width: "100%" }}
            />
          </div>
        </div>

        {/* ===== User Table ===== */}
        <div className="card border-0" style={{ borderRadius: "12px", boxShadow: "0 1px 6px rgba(0,0,0,0.07)", overflow: "hidden" }}>
          {loading ? (
            <p className="text-muted text-center py-5" style={{ fontSize: "14px" }}>กำลังโหลด...</p>
          ) : filtered.length === 0 ? (
            <div className="text-center py-5">
              <div style={{ fontSize: "2rem", marginBottom: "8px" }}><img src="/src/components/icon/search.svg" width="40" /></div>
              <p className="text-muted mb-0" style={{ fontSize: "14px" }}>ไม่พบผู้ใช้</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0" style={{ minWidth: "300px" }}>
                <thead style={{ backgroundColor: Colors.blue }}>
                  <tr>
                    <th style={{ color: "#070707", fontWeight: "500", fontSize: "13px", width: 40 }}>ที่</th>
                    <th style={{ color: "#070707", fontWeight: "500", fontSize: "13px" }}>ชื่อผู้ใช้</th>
                    <th style={{ color: "#f070707ff", fontWeight: "500", fontSize: "13px" }}>Role</th>
                    <th className="d-none d-md-table-cell" style={{ color: "#070707", fontWeight: "500", fontSize: "13px" }}>วันที่สมัคร</th>
                    <th style={{ color: "#070707", fontWeight: "500", fontSize: "13px", width: 110 }}>จัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((u, i) => (
                    <tr key={u.user_id}>
                      <td className="text-muted" style={{ fontSize: "13px" }}>{i + 1}</td>
                      <td>
                        <span className="fw-semibold" style={{ fontSize: "14px" }}>{u.username}</span>
                        {u.user_id === currentUser?.user_id && (
                          <span
                            className="ms-1 ms-sm-2"
                            style={{
                              fontSize: "10px", padding: "2px 6px", borderRadius: "10px",
                              backgroundColor: Colors.yellow, color: Colors.blue, fontWeight: "700",
                              whiteSpace: "nowrap",
                            }}
                          >
                            คุณ
                          </span>
                        )}
                      </td>
                      <td>{roleBadge(u.role)}</td>
                      <td className="d-none d-md-table-cell text-muted" style={{ fontSize: "13px" }}>
                        {u.create_at ? new Date(u.create_at).toLocaleDateString("th-TH") : "-"}
                      </td>
                      <td>
                        <div className="d-flex gap-1 flex-wrap">
                          <button
                            onClick={() => openEdit(u)}
                            className="btn btn-sm"
                            style={{
                              fontSize: "12px", backgroundColor: Colors.blue, color: "#ffffff",
                              borderRadius: "6px", padding: "3px 10px", whiteSpace: "nowrap",
                            }}
                          >
                            แก้ไข
                          </button>
                          {u.user_id !== currentUser?.user_id && (
                            <button
                              onClick={() => setDeleteConfirm(u.user_id)}
                              className="btn btn-sm btn-outline-danger"
                              style={{ fontSize: "12px", borderRadius: "6px", padding: "3px 10px", whiteSpace: "nowrap" }}
                            >
                              ลบ
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ===== Modal Edit ===== */}
        {editUser && (
          <div
            className="modal show d-block"
            style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
            onClick={(e) => { if (e.target === e.currentTarget) setEditUser(null); }}
          >
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
              <div className="modal-content" style={{ borderRadius: "14px", overflow: "hidden" }}>
                <div className="modal-header" style={{ backgroundColor: Colors.blue, borderBottom: "none" }}>
                  <h5 className="modal-title fw-bold" style={{ color: Colors.yellow }}>แก้ไขผู้ใช้</h5>
                  <button className="btn-close btn-close-white" onClick={() => setEditUser(null)} />
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label fw-semibold" style={{ fontSize: "14px" }}>ชื่อผู้ใช้</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editForm.username}
                      onChange={e => setEditForm({ ...editForm, username: e.target.value })}
                      style={{ fontSize: "14px" }}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold" style={{ fontSize: "14px" }}>Role</label>
                    <select
                      className="form-select"
                      value={editForm.role}
                      onChange={e => setEditForm({ ...editForm, role: e.target.value })}
                      style={{ fontSize: "14px" }}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer" style={{ borderTop: "1px solid #eeeeee" }}>
                  <button className="btn btn-outline-secondary" onClick={() => setEditUser(null)} style={{ fontSize: "14px" }}>ยกเลิก</button>
                  <button
                    className="btn fw-semibold"
                    onClick={handleSave}
                    disabled={saving}
                    style={{ backgroundColor: Colors.blue, color: Colors.yellow, fontSize: "14px" }}
                  >
                    {saving ? "กำลังบันทึก..." : "บันทึก"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===== Modal ยืนยันลบ ===== */}
        {deleteConfirm && (
          <div
            className="modal show d-block"
            style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
            onClick={(e) => { if (e.target === e.currentTarget) setDeleteConfirm(null); }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content" style={{ borderRadius: "14px", overflow: "hidden" }}>
                <div className="modal-header border-0">
                  <h5 className="modal-title fw-bold text-danger">ยืนยันการลบ</h5>
                  <button className="btn-close" onClick={() => setDeleteConfirm(null)} />
                </div>
                <div className="modal-body pt-0">
                  <p className="text-muted" style={{ fontSize: "14px" }}>
                    คุณต้องการลบผู้ใช้นี้ออกจากระบบ?<br />
                    การกระทำนี้ไม่สามารถย้อนกลับได้
                  </p>
                </div>
                <div className="modal-footer border-0">
                  <button className="btn btn-outline-secondary" onClick={() => setDeleteConfirm(null)} style={{ fontSize: "14px" }}>ยกเลิก</button>
                  <button className="btn btn-danger" onClick={() => handleDelete(deleteConfirm)} style={{ fontSize: "14px" }}>ลบ</button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default AdminHome;