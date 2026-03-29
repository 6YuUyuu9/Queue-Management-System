import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Colors } from "../../constant/colors"; 

function AdminDashboard() {
  const [search, setSearch] = useState("");
  const [queues, setQueues] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  // บนมือถือ: สลับระหว่าง "list" กับ "detail"
  const [mobileView, setMobileView] = useState("list");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost/food_queue/api/queue.php/list");
        setQueues(res.data || []);
      } catch (err) {
        console.error("โหลดข้อมูลล้มเหลว:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredQueues = queues.filter((q) =>
    q.username?.toLowerCase().includes(search.toLowerCase()) ||
    q.table_name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectQueue = (q) => {
    setSelected(q);
    setMobileView("detail"); // บนมือถือเปิด detail อัตโนมัติ
  };

  const renderStatus = (status_id, status_name) => {
    if (status_id === 1) return <span className="badge bg-warning text-dark">{status_name || "จองแล้ว"}</span>;
    if (status_id === 2) return <span className="badge bg-secondary">{status_name || "ข้าม"}</span>;
    if (status_id === 3) return <span className="badge bg-success">{status_name || "เสร็จแล้ว"}</span>;
    return <span className="badge bg-light text-dark">{status_name || "-"}</span>;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleString("th-TH", {
      year: "numeric", month: "short", day: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };

  const DetailPanel = () => (
    <div className="card border-0 h-100" style={{ borderRadius: "12px", boxShadow: "0 1px 6px rgba(0,0,0,0.07)" }}>
      <div className="card-body">
        {/* ปุ่มกลับ — แสดงเฉพาะมือถือ */}
        <button
          className="btn btn-sm mb-3 d-md-none"
          onClick={() => setMobileView("list")}
          style={{ backgroundColor: Colors.yellow, color: Colors.blue, fontWeight: "600", borderRadius: "8px", border: "none" }}
        >
          ← กลับ
        </button>

        <h5 className="fw-bold mb-3" style={{ color: Colors.blue }}>รายละเอียดคิว</h5>

        {!selected ? (
          <p className="text-muted" style={{ fontSize: "14px" }}>กรุณาเลือกคิวจากรายการ</p>
        ) : (
          <>
            <p className="mb-1 text-muted" style={{ fontSize: "12px" }}>คิว #{selected.queue_id}</p>
            <h6 className="fw-bold mb-3" style={{ color: Colors.blue }}>{selected.username}</h6>

            {[
              { label: "โต๊ะ", value: selected.table_name },
              { label: "ประเภทโต๊ะ", value: selected.type_name },
              { label: "จำนวนคน", value: `${selected.person_count} คน` },
            ].map(r => (
              <div key={r.label} className="mb-2">
                <div style={{ fontSize: "12px", color: "#999" }}>{r.label}</div>
                <div className="fw-semibold" style={{ fontSize: "14px" }}>{r.value}</div>
              </div>
            ))}

            <hr style={{ borderColor: Colors.yellow, opacity: 1 }} />

            <div className="mb-2">
              <div style={{ fontSize: "12px", color: "#999" }}>สถานะ</div>
              <div className="mt-1">{renderStatus(selected.status_id, selected.status_name)}</div>
            </div>

            {[
              { label: "วันที่จอง", value: formatDate(selected.reserve_date) },
              { label: "เวลาที่มาถึง", value: formatDate(selected.arrive_at) },
              { label: "เวลาเสร็จสิ้น", value: formatDate(selected.complete_at) },
            ].map(r => (
              <div key={r.label} className="mb-2">
                <div style={{ fontSize: "12px", color: "#999" }}>{r.label}</div>
                <div style={{ fontSize: "14px" }}>{r.value}</div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", backgroundColor: Colors.lightGray, padding: "16px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

        <h4 className="fw-bold mb-4" style={{ color: Colors.blue }}>จัดการคิว</h4>

        {/* ===== Search ===== */}
        <div className="card border-0 mb-3" style={{ borderRadius: "12px", boxShadow: "0 1px 6px rgba(0,0,0,0.07)" }}>
          <div className="card-body">
            <input
              type="text"
              className="form-control"
              placeholder="🔍 ค้นหาชื่อผู้ใช้ หรือชื่อโต๊ะ..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ fontSize: "14px" }}
            />
          </div>
        </div>

        {/* ===== Layout: desktop = row, mobile = toggle view ===== */}
        <div className="row g-3">

          {/* LEFT — ตาราง (ซ่อนบนมือถือเมื่อดู detail) */}
          <div className={`col-12 col-md-8 ${mobileView === "detail" ? "d-none d-md-block" : ""}`}>
            <div className="card border-0" style={{ borderRadius: "12px", boxShadow: "0 1px 6px rgba(0,0,0,0.07)", overflow: "hidden" }}>
              <div className="card-body p-0">
                <div className="px-3 pt-3 pb-2 d-flex align-items-center justify-content-between">
                  <h6 className="fw-bold mb-0" style={{ color: Colors.blue }}>
                    รายการคิว
                    <span className="text-muted fw-normal ms-2" style={{ fontSize: "13px" }}>
                      ({filteredQueues.length} รายการ)
                    </span>
                  </h6>
                </div>

                {loading ? (
                  <p className="text-muted text-center py-4">กำลังโหลด...</p>
                ) : filteredQueues.length === 0 ? (
                  <p className="text-muted text-center py-4">ไม่พบข้อมูลคิว</p>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead style={{ backgroundColor: Colors.blue }}>
                        <tr>
                          <th style={{ color: "#fff", fontWeight: "500" }}>#</th>
                          <th style={{ color: "#fff", fontWeight: "500" }}>ผู้ใช้</th>
                          {/* ซ่อนบนมือถือ */}
                          <th className="d-none d-sm-table-cell" style={{ color: "#fff", fontWeight: "500" }}>โต๊ะ</th>
                          <th className="d-none d-md-table-cell" style={{ color: "#fff", fontWeight: "500" }}>ประเภท</th>
                          <th className="d-none d-sm-table-cell" style={{ color: "#fff", fontWeight: "500" }}>จำนวน</th>
                          <th style={{ color: Colors.yellow, fontWeight: "500" }}>สถานะ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredQueues.map((q, i) => (
                          <tr
                            key={q.queue_id}
                            onClick={() => handleSelectQueue(q)}
                            style={{ cursor: "pointer" }}
                            className={selected?.queue_id === q.queue_id ? "table-active" : ""}
                          >
                            <td className="text-muted" style={{ fontSize: "13px" }}>{i + 1}</td>
                            <td className="fw-semibold" style={{ fontSize: "14px" }}>{q.username}</td>
                            <td className="d-none d-sm-table-cell" style={{ fontSize: "14px" }}>{q.table_name}</td>
                            <td className="d-none d-md-table-cell text-muted" style={{ fontSize: "13px" }}>{q.type_name}</td>
                            <td className="d-none d-sm-table-cell" style={{ fontSize: "14px" }}>{q.person_count} คน</td>
                            <td>{renderStatus(q.status_id, q.status_name)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT — detail (บนมือถือแสดงเต็มจอเมื่อเลือกแถว) */}
          <div className={`col-12 col-md-4 ${mobileView === "list" ? "d-none d-md-block" : ""}`}>
            <DetailPanel />
          </div>

        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
