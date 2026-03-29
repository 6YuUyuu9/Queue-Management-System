import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { useAuth } from "../../context/useAuth";
import { Colors } from "../../constant/colors";

// ── Derived palette (based on Colors.blue #003666 & Colors.yellow #FCC402) ──
const P = {
  blueTint:    "#e6eef5",   // blue 8%  — bg card "ทั้งหมด"
  yellowTint:  "#fff8e1",   // yellow 15% — bg card "รอดำเนินการ"
  yellowDeep:  "#a07800",   // yellow darkened — text บน bg เหลืองอ่อน (contrast ผ่าน WCAG AA)
  grayTint:    "#ececec",   // neutral — bg card "ข้ามคิว"
  grayText:    "#555",
  greenTint:   "#e6f4ec",   // soft green — bg card "เสร็จแล้ว"
  greenText:   "#1a6135",
  redTint:     "#fdecea",   // soft red — bg card "ยกเลิก"
  redText:     "#b91c1c",
  border:      "#e0e0e0",
  overlay:     "rgba(0,30,60,0.5)",   // น้ำเงินเข้มโปร่งใส — modal backdrop
};

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

  // ── Queue summary cards ──────────────────────────────────────────────────
  const queueCards = [
    { label: "คิวทั้งหมด",   value: queueData.total,    color: Colors.blue,   bg: P.blueTint   },
    { label: "รอดำเนินการ", value: queueData.waiting,   color: P.yellowDeep,  bg: P.yellowTint },
    { label: "ข้ามคิว",      value: queueData.skipped,  color: P.grayText,    bg: P.grayTint   },
    { label: "เสร็จแล้ว",   value: queueData.done,      color: P.greenText,   bg: P.greenTint  },
    { label: "ยกเลิก",       value: queueData.canceled,  color: P.redText,     bg: P.redTint    },
  ];

  // ── Role badge ──────────────────────────────────────────────────────────
  const roleBadge = (role) =>
    role === "admin"
      ? (
        <span style={{
          display: "inline-block",
          fontSize: "11px", padding: "2px 8px", borderRadius: "20px",
          backgroundColor: Colors.blue, color: Colors.yellow, fontWeight: "600",
        }}>
          Admin
        </span>
      ) : (
        <span style={{
          display: "inline-block",
          fontSize: "11px", padding: "2px 8px", borderRadius: "20px",
          backgroundColor: P.grayTint, color: P.grayText, fontWeight: "500",
        }}>
          User
        </span>
      );

  // ── Filter button style ─────────────────────────────────────────────────
  const filterBtnStyle = (active, activeColor, activeBg) => ({
    fontSize: "13px",
    padding: "5px 12px",
    borderRadius: "20px",
    border: `1.5px solid ${activeColor}`,
    backgroundColor: active ? activeBg || activeColor : "transparent",
    color: active ? (activeBg ? activeColor : "#fff") : activeColor,
    cursor: "pointer",
    fontWeight: active ? "600" : "400",
    whiteSpace: "nowrap",
    transition: "all 0.15s ease",
  });

  return (
    <div style={{ minHeight: "100vh", backgroundColor: Colors.lightGray, padding: "12px 12px 32px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

        {/* ── Header ── */}
        <div className="mb-4">
          <h4 className="fw-bold mb-0" style={{ color: Colors.blue, fontSize: "clamp(16px, 3vw, 22px)" }}>
            สรุปภาพรวมวันนี้
          </h4>
          <p className="mb-0" style={{ fontSize: "13px", color: P.grayText }}>{today}</p>
        </div>

        {/* ── Queue Cards ──
            xs  : 2 คอล  | sm : 3 คอล  | lg : 5 คอล  */}
        <div className="row g-2 g-sm-3 mb-4">
          {queueCards.map(c => (
            <div key={c.label} className="col-6 col-sm-4 col-lg">
              <div
                className="card border-0 text-center h-100"
                style={{
                  backgroundColor: c.bg,
                  borderRadius: "12px",
                  boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
                }}
              >
                <div className="card-body py-3 px-2">
                  <div style={{ fontSize: "11px", color: P.grayText, marginBottom: "4px", lineHeight: 1.3 }}>
                    {c.label}
                  </div>
                  <div style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: "700", color: c.color, lineHeight: 1 }}>
                    {c.value}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Divider ใช้สีเหลืองจาก palette */}
        <hr style={{ borderColor: Colors.yellow, borderWidth: "2px", opacity: 1 }} className="my-4" />

        {/* ── User Management Header ── */}
        <div className="mb-3">
          <h5 className="fw-bold mb-3" style={{ color: Colors.blue, fontSize: "clamp(14px, 2.5vw, 18px)" }}>
            จัดการผู้ใช้งาน
          </h5>

          <div className="d-flex flex-column flex-sm-row gap-2 align-items-start align-items-sm-center flex-wrap">
            <div className="d-flex gap-2 flex-wrap flex-shrink-0">
              {/* ทั้งหมด — ใช้ blue */}
              <button
                style={filterBtnStyle(roleFilter === "all", Colors.blue)}
                onClick={() => setRoleFilter("all")}
              >
                ทั้งหมด <span style={{ marginLeft: "4px", fontWeight: "700" }}>{countAll}</span>
              </button>
              {/* Admin — yellow บน blue */}
              <button
                style={filterBtnStyle(roleFilter === "admin", Colors.blue, Colors.blue)}
                onClick={() => setRoleFilter("admin")}
              >
                Admin <span style={{ marginLeft: "4px", fontWeight: "700" }}>{countAdmin}</span>
              </button>
              {/* User — gray */}
              <button
                style={filterBtnStyle(roleFilter === "user", P.grayText)}
                onClick={() => setRoleFilter("user")}
              >
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

        {/* ── User Table ── */}
        <div className="card border-0" style={{ borderRadius: "12px", boxShadow: "0 1px 6px rgba(0,0,0,0.06)", overflow: "hidden" }}>
          {loading ? (
            <p className="text-center py-5" style={{ fontSize: "14px", color: P.grayText }}>กำลังโหลด...</p>
          ) : filtered.length === 0 ? (
            <div className="text-center py-5">
              <div style={{ fontSize: "2rem", marginBottom: "8px" }}>🔍</div>
              <p className="mb-0" style={{ fontSize: "14px", color: P.grayText }}>ไม่พบผู้ใช้</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0" style={{ minWidth: "300px" }}>
                <thead style={{ backgroundColor: Colors.blue }}>
                  <tr>
                    <th style={{ color: "black", fontWeight: "500", fontSize: "13px", width: 40 }}>ที่</th>
                    <th style={{ color: "black", fontWeight: "500", fontSize: "13px" }}>ชื่อผู้ใช้</th>
                    <th style={{ color: "black", fontWeight: "500", fontSize: "13px" }}>Role</th>
                    <th className="d-none d-md-table-cell" style={{ color: "black", fontWeight: "500", fontSize: "13px" }}>วันที่สมัคร</th>
                    {/* หัวคอลัมน์จัดการ — ใช้เหลืองให้โดดเด่นบน blue header */}
                    <th style={{ color: Colors.yellow, fontWeight: "600", fontSize: "13px", width: 110 }}>จัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((u, i) => (
                    <tr key={u.user_id}>
                      <td style={{ fontSize: "13px", color: P.grayText }}>{i + 1}</td>
                      <td>
                        <span className="fw-semibold" style={{ fontSize: "14px" }}>{u.username}</span>
                        {u.user_id === currentUser?.user_id && (
                          <span style={{
                            marginLeft: "6px",
                            fontSize: "10px", padding: "2px 6px", borderRadius: "10px",
                            backgroundColor: Colors.yellow, color: Colors.blue, fontWeight: "700",
                          }}>
                            คุณ
                          </span>
                        )}
                      </td>
                      <td>{roleBadge(u.role)}</td>
                      <td className="d-none d-md-table-cell" style={{ fontSize: "13px", color: P.grayText }}>
                        {u.create_at ? new Date(u.create_at).toLocaleDateString("th-TH") : "-"}
                      </td>
                      <td>
                        <div className="d-flex gap-1 flex-wrap">
                          <button
                            onClick={() => openEdit(u)}
                            className="btn btn-sm"
                            style={{
                              fontSize: "12px", padding: "3px 10px", borderRadius: "6px",
                              backgroundColor: Colors.blue, color: Colors.yellow,
                              fontWeight: "600", whiteSpace: "nowrap", border: "none",
                            }}
                          >
                            แก้ไข
                          </button>
                          {u.user_id !== currentUser?.user_id && (
                            <button
                              onClick={() => setDeleteConfirm(u.user_id)}
                              className="btn btn-sm"
                              style={{
                                fontSize: "12px", padding: "3px 10px", borderRadius: "6px",
                                backgroundColor: P.redTint, color: P.redText,
                                border: `1px solid ${P.redText}`, whiteSpace: "nowrap",
                              }}
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

        {/* ── Modal Edit ── */}
        {editUser && (
          <div
            className="modal show d-block"
            style={{ backgroundColor: P.overlay }}
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
                    <label className="form-label fw-semibold" style={{ fontSize: "14px", color: Colors.blue }}>ชื่อผู้ใช้</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editForm.username}
                      onChange={e => setEditForm({ ...editForm, username: e.target.value })}
                      style={{ fontSize: "14px" }}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold" style={{ fontSize: "14px", color: Colors.blue }}>Role</label>
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
                <div className="modal-footer" style={{ borderTop: `1px solid ${P.border}` }}>
                  <button
                    className="btn"
                    onClick={() => setEditUser(null)}
                    style={{
                      fontSize: "14px", borderRadius: "8px",
                      border: `1.5px solid ${P.border}`, color: P.grayText,
                    }}
                  >
                    ยกเลิก
                  </button>
                  <button
                    className="btn fw-semibold"
                    onClick={handleSave}
                    disabled={saving}
                    style={{
                      fontSize: "14px", borderRadius: "8px",
                      backgroundColor: Colors.blue, color: Colors.yellow, border: "none",
                    }}
                  >
                    {saving ? "กำลังบันทึก..." : "บันทึก"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Modal ยืนยันลบ ── */}
        {deleteConfirm && (
          <div
            className="modal show d-block"
            style={{ backgroundColor: P.overlay }}
            onClick={(e) => { if (e.target === e.currentTarget) setDeleteConfirm(null); }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content" style={{ borderRadius: "14px", overflow: "hidden" }}>
                <div className="modal-header" style={{ borderBottom: "none" }}>
                  <h5 className="modal-title fw-bold" style={{ color: P.redText }}>ยืนยันการลบ</h5>
                  <button className="btn-close" onClick={() => setDeleteConfirm(null)} />
                </div>
                <div className="modal-body pt-0">
                  <p style={{ fontSize: "14px", color: P.grayText }}>
                    คุณต้องการลบผู้ใช้นี้ออกจากระบบ?<br />
                    การกระทำนี้ไม่สามารถย้อนกลับได้
                  </p>
                </div>
                <div className="modal-footer" style={{ borderTop: `1px solid ${P.border}` }}>
                  <button
                    className="btn"
                    onClick={() => setDeleteConfirm(null)}
                    style={{
                      fontSize: "14px", borderRadius: "8px",
                      border: `1.5px solid ${P.border}`, color: P.grayText,
                    }}
                  >
                    ยกเลิก
                  </button>
                  <button
                    className="btn"
                    onClick={() => handleDelete(deleteConfirm)}
                    style={{
                      fontSize: "14px", borderRadius: "8px",
                      backgroundColor: P.redText, color: "#fff", border: "none",
                    }}
                  >
                    ลบ
                  </button>
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