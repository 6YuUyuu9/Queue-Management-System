import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

function AdminDashboard() {
  const [search, setSearch] = useState("");
  const [queues, setQueues] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // โหลดข้อมูลคิวจาก API
  const fetchQueues = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await queueService.getAll();
      setQueues(data);
    } catch (err) {
      console.error("Error fetching queues:", err);
      setError("ไม่สามารถโหลดข้อมูลคิวได้ กรุณาตรวจสอบการเชื่อมต่อ API");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueues();
  }, []);

  // ค้นหาคิว
  const filteredQueues = queues.filter((q) => {
    const term = search.toLowerCase();
    return (
      (q.username || "").toLowerCase().includes(term) ||
      (q.table_name || "").toLowerCase().includes(term) ||
      String(q.queue_id).includes(term)
    );
  });

  // แสดง badge สถานะ
  const renderStatusBadge = (q) => {
    const id = q.status_id;
    const name = (q.status_name || "").toLowerCase();
    if (id === 3 || name === "completed")
      return <span className="badge bg-success">เสร็จแล้ว</span>;
    if (id === 2 || name === "skipped")
      return <span className="badge bg-secondary">ข้าม</span>;
    if (id === 1 || name === "reserved")
      return <span className="badge bg-warning text-dark">จองแล้ว</span>;
    return <span className="badge bg-light text-dark">{q.status_name || "-"}</span>;
  };

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  // บันทึกการมาถึง
  const handleArrive = async () => {
    if (!selected) return;
    try {
      setActionLoading(true);
      await queueService.arrive(selected.queue_id);
      showSuccess(`บันทึกการมาถึงของ ${selected.username} เรียบร้อย`);
      await fetchQueues();
      // อัปเดต selected ด้วยข้อมูลใหม่
      setSelected((prev) => ({ ...prev, arrive_at: new Date().toISOString() }));
    } catch (err) {
      setError("บันทึกการมาถึงไม่สำเร็จ");
    } finally {
      setActionLoading(false);
    }
  };

  // บริการเสร็จสิ้น
  const handleComplete = async () => {
    if (!selected) return;
    try {
      setActionLoading(true);
      await queueService.complete(selected.queue_id);
      showSuccess(`คิว #${selected.queue_id} เสร็จสิ้นแล้ว`);
      await fetchQueues();
      setSelected(null);
    } catch (err) {
      setError("อัปเดตสถานะไม่สำเร็จ");
    } finally {
      setActionLoading(false);
    }
  };

  // ข้ามคิว
  const handleSkip = async () => {
    if (!selected) return;
    try {
      setActionLoading(true);
      await queueService.skip(selected.queue_id);
      showSuccess(`ข้ามคิว #${selected.queue_id} เรียบร้อย`);
      await fetchQueues();
      setSelected(null);
    } catch (err) {
      setError("ข้ามคิวไม่สำเร็จ");
    } finally {
      setActionLoading(false);
    }
  };

  // ลบคิว
  const handleDelete = async () => {
    if (!selected) return;
    if (!window.confirm(`ยืนยันการลบคิว #${selected.queue_id} ของ ${selected.username}?`)) return;
    try {
      setActionLoading(true);
      await queueService.delete(selected.queue_id);
      showSuccess(`ลบคิว #${selected.queue_id} เรียบร้อย`);
      await fetchQueues();
      setSelected(null);
    } catch (err) {
      setError("ลบคิวไม่สำเร็จ");
    } finally {
      setActionLoading(false);
    }
  };

  const isReserved = (q) => q && (q.status_id === 1 || (q.status_name || "").toLowerCase() === "reserved");
  const isCompleted = (q) => q && (q.status_id === 3 || (q.status_name || "").toLowerCase() === "completed");
  const isSkipped = (q) => q && (q.status_id === 2 || (q.status_name || "").toLowerCase() === "skipped");

  return (
    <div className="bg-light min-vh-100 p-3">
      <div className="container-fluid">

        {/* Notifications */}
        {error && (
          <div className="alert alert-danger alert-dismissible" role="alert">
            {error}
            <button type="button" className="btn-close" onClick={() => setError(null)} />
          </div>
        )}
        {successMsg && (
          <div className="alert alert-success alert-dismissible" role="alert">
            {successMsg}
            <button type="button" className="btn-close" onClick={() => setSuccessMsg(null)} />
          </div>
        )}

        <div className="row">

          {/* LEFT — Queue List */}
          <div className="col-md-8">

            <div className="card shadow mb-3 border-0">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-bold mb-0">จัดการคิว</h5>
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={fetchQueues}
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="spinner-border spinner-border-sm me-1" />
                    ) : ""} รีเฟรช
                  </button>
                </div>
                <input
                  type="text"
                  className="form-control"
                  placeholder="ค้นหาชื่อผู้ใช้, โต๊ะ, หรือหมายเลขคิว..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="card shadow border-0">
              <div className="card-body">
                <h5 className="fw-bold mb-3">
                  รายการคิว{" "}
                  <span className="badge bg-primary">{filteredQueues.length}</span>
                </h5>

                {loading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" />
                    <p className="mt-2 text-muted">กำลังโหลดข้อมูล...</p>
                  </div>
                ) : filteredQueues.length === 0 ? (
                  <p className="text-muted text-center py-3">ไม่พบข้อมูลคิว</p>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle">
                      <thead className="table-light">
                        <tr>
                          <th>คิว</th>
                          <th>ชื่อผู้ใช้</th>
                          <th>โต๊ะ</th>
                          <th>ประเภท</th>
                          <th>จำนวนคน</th>
                          <th>สถานะ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredQueues.map((q) => (
                          <tr
                            key={q.queue_id}
                            style={{ cursor: "pointer" }}
                            className={selected?.queue_id === q.queue_id ? "table-primary" : ""}
                            onClick={() => setSelected(q)}
                          >
                            <td className="fw-bold">#{q.queue_id}</td>
                            <td>{q.username || "-"}</td>
                            <td>{q.table_name || "-"}</td>
                            <td>{q.type_name || "-"}</td>
                            <td>{q.person_count} คน</td>
                            <td>{renderStatusBadge(q)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT — Queue Details */}
          <div className="col-md-4">
            <div className="card shadow border-0">
              <div className="card-body">
                <h5 className="fw-bold mb-3">ข้อมูลคิว</h5>

                {!selected ? (
                  <div className="text-center py-4 text-muted">
                    <div style={{ fontSize: "3rem" }}></div>
                    <p>กรุณาเลือกคิวจากตาราง</p>
                  </div>
                ) : (
                  <>
                    <div className="mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h6 className="fw-bold mb-0">คิว #{selected.queue_id}</h6>
                        {renderStatusBadge(selected)}
                      </div>
                    </div>

                    <hr />

                    <table className="table table-sm table-borderless">
                      <tbody>
                        <tr>
                          <td className="text-muted fw-semibold">ชื่อผู้ใช้</td>
                          <td>{selected.username || "-"}</td>
                        </tr>
                        <tr>
                          <td className="text-muted fw-semibold">โต๊ะ</td>
                          <td>{selected.table_name || "-"}</td>
                        </tr>
                        <tr>
                          <td className="text-muted fw-semibold">ประเภทโต๊ะ</td>
                          <td>{selected.type_name || "-"}</td>
                        </tr>
                        <tr>
                          <td className="text-muted fw-semibold">จำนวนคน</td>
                          <td>{selected.person_count} คน</td>
                        </tr>
                        <tr>
                          <td className="text-muted fw-semibold">วันที่จอง</td>
                          <td>
                            {selected.reserve_date
                              ? new Date(selected.reserve_date).toLocaleString("th-TH")
                              : "-"}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-muted fw-semibold">เวลามาถึง</td>
                          <td>
                            {selected.arrive_at
                              ? new Date(selected.arrive_at).toLocaleString("th-TH")
                              : <span className="text-muted">ยังไม่มาถึง</span>}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-muted fw-semibold">เวลาเสร็จ</td>
                          <td>
                            {selected.complete_at
                              ? new Date(selected.complete_at).toLocaleString("th-TH")
                              : <span className="text-muted">ยังไม่เสร็จ</span>}
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <hr />

                    {/* Action Buttons */}
                    <h6 className="fw-bold mb-2">การดำเนินการ</h6>

                    <div className="d-grid gap-2">
                      {/* บันทึกมาถึง — ทำได้เฉพาะตอน reserved และยังไม่มาถึง */}
                      {isReserved(selected) && !selected.arrive_at && (
                        <button
                          className="btn btn-info text-white"
                          onClick={handleArrive}
                          disabled={actionLoading}
                        >
                          {actionLoading ? <span className="spinner-border spinner-border-sm me-2" /> : "🚶 "}
                          บันทึกการมาถึง
                        </button>
                      )}

                      {/* เสร็จสิ้น — ทำได้เมื่อมาถึงแล้วและยังไม่เสร็จ */}
                      {isReserved(selected) && selected.arrive_at && !selected.complete_at && (
                        <button
                          className="btn btn-success"
                          onClick={handleComplete}
                          disabled={actionLoading}
                        >
                          {actionLoading ? <span className="spinner-border spinner-border-sm me-2" /> : "✅ "}
                          บริการเสร็จสิ้น
                        </button>
                      )}

                      {/* ข้ามคิว — ทำได้เฉพาะตอน reserved */}
                      {isReserved(selected) && (
                        <button
                          className="btn btn-warning text-dark"
                          onClick={handleSkip}
                          disabled={actionLoading}
                        >
                          {actionLoading ? <span className="spinner-border spinner-border-sm me-2" /> : "⏭️ "}
                          ข้ามคิว
                        </button>
                      )}

                      {/* สถานะปัจจุบัน — แสดงเมื่อเสร็จหรือข้ามแล้ว */}
                      {(isCompleted(selected) || isSkipped(selected)) && (
                        <div className="alert alert-light text-center py-2 mb-0">
                          {isCompleted(selected)
                            ? " คิวนี้เสร็จสิ้นแล้ว"
                            : " คิวนี้ถูกข้ามแล้ว"}
                        </div>
                      )}

                      {/* ลบคิว */}
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={handleDelete}
                        disabled={actionLoading}
                      >
                        ลบคิวนี้
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;