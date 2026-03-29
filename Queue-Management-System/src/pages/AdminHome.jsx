import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

function AdminHome() {
  const [data, setData] = useState({
    total: 0,
    completed: 0,
    reserved: 0,
    skipped: 0,
  });

  const [recentQueues, setRecentQueues] = useState([]);
  const [today, setToday] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const now = new Date();
    const formattedDate = now.toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    setToday(formattedDate);
  }, []);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        const queues = await queueService.getAll();

        const summary = {
          total: queues.length,
          // status_id: 1=reserved, 2=skipped, 3=completed (ดูจาก model/queue.php)
          completed: queues.filter((q) => q.status_id === 3 || q.status_name === "completed").length,
          reserved: queues.filter((q) => q.status_id === 1 || q.status_name === "reserved").length,
          skipped: queues.filter((q) => q.status_id === 2 || q.status_name === "skipped").length,
        };

        setData(summary);

        // แสดง 5 คิวล่าสุด
        setRecentQueues(queues.slice(0, 5));
      } catch (err) {
        console.error("Error fetching summary:", err);
        setError("ไม่สามารถโหลดข้อมูลได้ กรุณาตรวจสอบการเชื่อมต่อ API");
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

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

  return (
    <div className="bg-light min-vh-100 p-4">
      <div className="container">

        {/* Header */}
        <div className="mb-4 text-center">
          <h2 className="fw-bold">สรุปภาพรวมวันนี้</h2>
          <p className="text-muted">{today}</p>
        </div>

        {error && (
          <div className="alert alert-danger">{error}</div>
        )}

        {/* Summary Cards */}
        <div className="row mb-4">
          <div className="col-md-3 mb-3">
            <div className="card shadow border-0 text-center h-100">
              <div className="card-body d-flex flex-column justify-content-center">
                <div className="mb-2">
                  <span style={{ fontSize: "2rem" }}>📋</span>
                </div>
                <h6 className="text-muted">จำนวนคิวทั้งหมด</h6>
                {loading ? (
                  <div className="spinner-border spinner-border-sm text-primary" />
                ) : (
                  <h2 className="fw-bold text-primary">{data.total}</h2>
                )}
              </div>
            </div>
          </div>

          <div className="col-md-3 mb-3">
            <div className="card shadow border-0 text-center h-100">
              <div className="card-body d-flex flex-column justify-content-center">
                <div className="mb-2">
                  <span style={{ fontSize: "2rem" }}>✅</span>
                </div>
                <h6 className="text-muted">เสร็จแล้ว</h6>
                {loading ? (
                  <div className="spinner-border spinner-border-sm text-success" />
                ) : (
                  <h2 className="fw-bold text-success">{data.completed}</h2>
                )}
              </div>
            </div>
          </div>

          <div className="col-md-3 mb-3">
            <div className="card shadow border-0 text-center h-100">
              <div className="card-body d-flex flex-column justify-content-center">
                <div className="mb-2">
                  <span style={{ fontSize: "2rem" }}>⏳</span>
                </div>
                <h6 className="text-muted">รอดำเนินการ</h6>
                {loading ? (
                  <div className="spinner-border spinner-border-sm text-warning" />
                ) : (
                  <h2 className="fw-bold text-warning">{data.reserved}</h2>
                )}
              </div>
            </div>
          </div>

          <div className="col-md-3 mb-3">
            <div className="card shadow border-0 text-center h-100">
              <div className="card-body d-flex flex-column justify-content-center">
                <div className="mb-2">
                  <span style={{ fontSize: "2rem" }}>⏭️</span>
                </div>
                <h6 className="text-muted">ข้ามคิว</h6>
                {loading ? (
                  <div className="spinner-border spinner-border-sm text-secondary" />
                ) : (
                  <h2 className="fw-bold text-secondary">{data.skipped}</h2>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Queues Table */}
        <div className="card shadow border-0">
          <div className="card-body">
            <h5 className="fw-bold mb-3">คิวล่าสุด</h5>
            {loading ? (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" />
                <p className="mt-2 text-muted">กำลังโหลด...</p>
              </div>
            ) : recentQueues.length === 0 ? (
              <p className="text-muted text-center">ยังไม่มีข้อมูลคิว</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>คิว #</th>
                      <th>ชื่อผู้ใช้</th>
                      <th>โต๊ะ</th>
                      <th>จำนวนคน</th>
                      <th>สถานะ</th>
                      <th>วันที่จอง</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentQueues.map((q) => (
                      <tr key={q.queue_id}>
                        <td className="fw-bold">#{q.queue_id}</td>
                        <td>{q.username || "-"}</td>
                        <td>{q.table_name || "-"} ({q.type_name || "-"})</td>
                        <td>{q.person_count} คน</td>
                        <td>{renderStatusBadge(q)}</td>
                        <td>
                          {q.reserve_date
                            ? new Date(q.reserve_date).toLocaleString("th-TH")
                            : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default AdminHome;