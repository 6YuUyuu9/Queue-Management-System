import React, { useEffect, useMemo, useState } from "react";
import { queueService } from "../../services/queueService";
import { Colors } from "../../constant/colors";

function ManageQueue() {
  const [queues, setQueues] = useState([]);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [mobileView, setMobileView] = useState("list");

  const [formData, setFormData] = useState({
    queueName: "",
    personCount: 1,
  });

  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);

  const loadQueues = async () => {
    try {
      setTableLoading(true);
      const data = await queueService.getAll();
      const sorted = Array.isArray(data)
        ? [...data].sort((a, b) => b.queue_id - a.queue_id)
        : [];

      setQueues(sorted);

      if (selected) {
        const updatedSelected = sorted.find((q) => q.queue_id === selected.queue_id);
        setSelected(updatedSelected || null);
      }
    } catch (error) {
      console.error("โหลดข้อมูลคิวไม่สำเร็จ:", error);
      setQueues([]);
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    loadQueues();
  }, []);

  const summary = useMemo(() => {
    const total = queues.length;
    const reserved = queues.filter((q) => Number(q.status_id) === 1).length;
    const skipped = queues.filter((q) => Number(q.status_id) === 2).length;
    const completed = queues.filter((q) => Number(q.status_id) === 3).length;
    const cancelled = queues.filter((q) => Number(q.status_id) === 4).length;

    return { total, reserved, skipped, completed, cancelled };
  }, [queues]);

  const filteredQueues = useMemo(() => {
    return queues.filter((q) => {
      const keyword = search.toLowerCase();
      return (
        getDisplayName(q).toLowerCase().includes(keyword) ||
        (q.table_name || "").toLowerCase().includes(keyword) ||
        String(q.queue_id).includes(keyword)
      );
    });
  }, [queues, search]);

  const handleSelectQueue = (queue) => {
    setSelected(queue);
    setMobileView("detail");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "personCount" ? Number(value) : value,
    }));
  };

  const handleAddQueue = async (e) => {
  e.preventDefault();

  if (!formData.queueName.trim()) {
    alert("กรุณากรอกชื่อลูกค้า");
    return;
  }

  const personCount = Number(formData.personCount);
    if (!personCount || personCount < 1 || personCount > 6) {
      alert("จำนวนคนต้องอยู่ระหว่าง 1 - 6");
      return;
    }

    try {
      setLoading(true);

      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");

      const date = `${year}-${month}-${day}`;
      const time = `${hours}:${minutes}`;

      const tableResult = await queueService.findTable(date, time, personCount);
      console.log("findTable result:", tableResult);

      const tableId =
        tableResult?.table_id ||
        tableResult?.table?.table_id ||
        null;

      if (!tableId) {
        alert(tableResult?.message || "ไม่พบโต๊ะว่างสำหรับจำนวนคนนี้");
        return;
      }

      const addResult = await queueService.add(6, tableId, personCount, date, time);
      console.log("add queue result:", addResult);

      await loadQueues();

      alert("เพิ่มคิวสำเร็จ");
      setFormData({
        queueName: "",
        personCount: 1,
      });
      setMobileView("list");
    } catch (error) {
      console.error("เพิ่มคิวไม่สำเร็จ:", error);
      alert("เพิ่มคิวไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  const isCompleted = (queue) => Number(queue.status_id) === 3;
  const isCancelled = (queue) => Number(queue.status_id) === 4;
  const isSkipped = (queue) => Number(queue.status_id) === 2;
  const hasArrived = (queue) => !!queue.arrive_at;

  const handleCancelQueue = async (queue) => {
    if (isCompleted(queue)) {
      alert("ไม่สามารถยกเลิกคิวหลังจากเสร็จสิ้นแล้ว");
      return;
    }
    if (isCancelled(queue)) {
      alert("คิวนี้ถูกยกเลิกแล้ว");
      return;
    }
    if (isSkipped(queue)) {
      alert("คิวที่ถูกข้ามแล้วไม่สามารถยกเลิกได้");
      return;
    }

    const confirmed = window.confirm("ต้องการยกเลิกคิวนี้ใช่หรือไม่");
    if (!confirmed) return;

    try {
      await queueService.updateStatus(queue.queue_id, 4);
      alert("ยกเลิกคิวสำเร็จ");
      await loadQueues();
    } catch (error) {
      console.error("ยกเลิกคิวไม่สำเร็จ:", error);
      alert("ยกเลิกคิวไม่สำเร็จ");
    }
  };

  const handleCompleteQueue = async (queue) => {
    if (!hasArrived(queue)) {
      alert('ต้องกด "มาถึง" ก่อน จึงจะกดเสร็จสิ้นได้');
      return;
    }
    if (isCompleted(queue)) {
      alert("คิวนี้เสร็จสิ้นแล้ว");
      return;
    }
    if (isCancelled(queue)) {
      alert("คิวที่ยกเลิกแล้วไม่สามารถเสร็จสิ้นได้");
      return;
    }
    if (isSkipped(queue)) {
      alert("คิวที่ถูกข้ามแล้วไม่สามารถเสร็จสิ้นได้");
      return;
    }

    try {
      await queueService.complete(queue.queue_id);
      alert("อัปเดตสถานะสำเร็จ");
      await loadQueues();
    } catch (error) {
      console.error("อัปเดตสถานะไม่สำเร็จ:", error);
      alert("อัปเดตสถานะไม่สำเร็จ");
    }
  };

  const handleSkipQueue = async (queue) => {
    if (isCompleted(queue)) {
      alert("ไม่สามารถข้ามคิวหลังจากเสร็จสิ้นแล้ว");
      return;
    }
    if (isCancelled(queue)) {
      alert("คิวที่ยกเลิกแล้วไม่สามารถข้ามได้");
      return;
    }
    if (isSkipped(queue)) {
      alert("คิวนี้ถูกข้ามแล้ว");
      return;
    }

    try {
      await queueService.skip(queue.queue_id);
      alert("ข้ามคิวสำเร็จ");
      await loadQueues();
    } catch (error) {
      console.error("ข้ามคิวไม่สำเร็จ:", error);
      alert("ข้ามคิวไม่สำเร็จ");
    }
  };

  const handleArriveQueue = async (queue) => {
    if (hasArrived(queue)) {
      alert("คิวนี้บันทึกมาถึงแล้ว");
      return;
    }
    if (isCompleted(queue)) {
      alert("คิวนี้เสร็จสิ้นแล้ว");
      return;
    }
    if (isCancelled(queue)) {
      alert("คิวที่ยกเลิกแล้วไม่สามารถกดมาถึงได้");
      return;
    }
    if (isSkipped(queue)) {
      alert("คิวที่ถูกข้ามแล้วไม่สามารถกดมาถึงได้");
      return;
    }

    try {
      await queueService.arrive(queue.queue_id);
      alert("บันทึกเวลามาถึงสำเร็จ");
      await loadQueues();
    } catch (error) {
      console.error("บันทึกเวลามาถึงไม่สำเร็จ:", error);
      alert("บันทึกเวลามาถึงไม่สำเร็จ");
    }
  };

  function getDisplayName(queue) {
    return queue.queue_name || queue.username || queue.user_name || "Walk-in";
  }

  function formatDate(dateStr) {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleString("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function renderStatus(statusId, statusName) {
    if (Number(statusId) === 1) {
      return <span className="badge text-dark">{statusName || "จองแล้ว"}</span>;
    }
    if (Number(statusId) === 2) {
      return <span className="badge text-secondary">{statusName || "ข้าม"}</span>;
    }
    if (Number(statusId) === 3) {
      return <span className="badge text-success">{statusName || "เสร็จแล้ว"}</span>;
    }
    if (Number(statusId) === 4) {
      return <span className="badge text-danger">{statusName || "ยกเลิก"}</span>;
    }
    return <span className="badge bg-light text-dark">{statusName || "-"}</span>;
  }

  const DetailPanel = () => (
    <div
      className="card border-0"
      style={{
        borderRadius: "12px",
        boxShadow: "0 1px 6px rgba(0,0,0,0.07)",
        position: "sticky",
        top: "16px",
      }}
    >
      <div className="card-body p-3 p-sm-4">
        <button
          className="btn btn-sm mb-3 d-md-none"
          onClick={() => setMobileView("list")}
          style={{
            backgroundColor: Colors.yellow,
            color: Colors.blue,
            fontWeight: "600",
            borderRadius: "8px",
            border: "none",
            fontSize: "13px",
          }}
        >
          กลับ
        </button>

        <h5
          className="fw-bold mb-3"
          style={{ color: Colors.blue, fontSize: "clamp(15px, 2vw, 17px)" }}
        >
          รายละเอียดคิว
        </h5>

        {!selected ? (
          <div className="text-center py-4">
            <p className="text-muted mb-0" style={{ fontSize: "14px" }}>
              กรุณาเลือกคิวจากรายการ
            </p>
          </div>
        ) : (
          <>
            <p className="mb-1 text-muted" style={{ fontSize: "12px" }}>
              คิว #{selected.queue_id}
            </p>
            <h6 className="fw-bold mb-3" style={{ color: Colors.blue }}>
              {getDisplayName(selected)}
            </h6>

            <div className="row g-2 mb-2">
              {[
                { label: "โต๊ะ", value: selected.table_name || "-" },
                { label: "ประเภทโต๊ะ", value: selected.type_name || "-" },
                { label: "จำนวนคน", value: `${selected.person_count} คน` },
              ].map((row) => (
                <div key={row.label} className="col-6 col-lg-12">
                  <div style={{ fontSize: "11px", color: "#999999" }}>{row.label}</div>
                  <div className="fw-semibold" style={{ fontSize: "14px" }}>
                    {row.value}
                  </div>
                </div>
              ))}
            </div>

            <hr style={{ borderColor: Colors.yellow, opacity: 1 }} />

            <div className="mb-2">
              <div style={{ fontSize: "11px", color: "#999999" }}>สถานะ</div>
              <div className="mt-1">
                {renderStatus(selected.status_id, selected.status_name)}
              </div>
            </div>

            <div className="row g-2 mt-1">
              {[
                { label: "วันที่จอง", value: formatDate(selected.reserve_date) },
                { label: "เวลาที่มาถึง", value: formatDate(selected.arrive_at) },
                { label: "เวลาเสร็จสิ้น", value: formatDate(selected.complete_at) },
              ].map((row) => (
                <div key={row.label} className="col-12">
                  <div style={{ fontSize: "11px", color: "#999999" }}>{row.label}</div>
                  <div style={{ fontSize: "13px" }}>{row.value}</div>
                </div>
              ))}
            </div>

            <hr style={{ borderColor: Colors.yellow, opacity: 1 }} />

            <div className="d-flex flex-wrap gap-2 mt-3">
              <button
                className="btn btn-sm"
                onClick={() => handleArriveQueue(selected)}
                disabled={
                  hasArrived(selected) ||
                  isCompleted(selected) ||
                  isCancelled(selected) ||
                  isSkipped(selected)
                }
                style={{
                  backgroundColor: Colors.blue,
                  color: "white",
                  borderRadius: "8px",
                  border: "none",
                }}
              >
                มาถึง
              </button>

              <button
                className="btn btn-sm btn-outline-success"
                onClick={() => handleCompleteQueue(selected)}
                disabled={
                  !hasArrived(selected) ||
                  isCompleted(selected) ||
                  isCancelled(selected) ||
                  isSkipped(selected)
                }
                style={{ borderRadius: "8px" }}
              >
                เสร็จสิ้น
              </button>

              <button
                className="btn btn-sm btn-outline-warning"
                onClick={() => handleSkipQueue(selected)}
                disabled={
                  isCompleted(selected) ||
                  isCancelled(selected) ||
                  isSkipped(selected)
                }
                style={{ borderRadius: "8px" }}
              >
                ข้าม
              </button>

              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => handleCancelQueue(selected)}
                disabled={
                  isCompleted(selected) ||
                  isCancelled(selected) ||
                  isSkipped(selected)
                }
                style={{ borderRadius: "8px" }}
              >
                ยกเลิก
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: Colors.lightGray,
        padding: "12px 12px 24px",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h4
          className="fw-bold mb-3"
          style={{ color: Colors.blue, fontSize: "clamp(16px, 3vw, 22px)" }}
        >
          จัดการคิว
        </h4>

        {/* summary */}
        <div
          className="mb-3"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "16px",
          }}
        >
          {[
            { label: "คิวทั้งหมด", value: summary.total, color: Colors.blue },
            { label: "รอดำเนินการ", value: summary.reserved, color: "#E0A100" },
            { label: "ข้ามคิว", value: summary.skipped, color: "#555555" },
            { label: "เสร็จแล้ว", value: summary.completed, color: "#1F7A3D" },
            { label: "ยกเลิก", value: summary.cancelled, color: "#A61B1B" },
          ].map((item) => (
            <div
              key={item.label}
              className="card border-0"
              style={{
                borderRadius: "12px",
                boxShadow: "0 1px 6px rgba(0,0,0,0.07)",
              }}
            >
              <div className="card-body text-center py-3">
                <div className="text-muted mb-1" style={{ fontSize: "13px" }}>
                  {item.label}
                </div>
                <div className="fw-bold" style={{ fontSize: "22px", color: item.color }}>
                  {item.value}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* add form */}
        <div
          className="card border-0 mb-3"
          style={{ borderRadius: "12px", boxShadow: "0 1px 6px rgba(0,0,0,0.07)" }}
        >
          <div
            className="card-header border-0"
            style={{
              backgroundColor: "white",
              borderTop: `3px solid ${Colors.yellow}`,
              borderRadius: "12px 12px 0 0",
            }}
          >
            <h6 className="fw-bold mb-0" style={{ color: Colors.blue }}>
              เพิ่มคิว Walk-in
            </h6>
          </div>

          <div className="card-body">
            <form onSubmit={handleAddQueue}>
              <div className="row g-3 align-items-end">
                <div className="col-12 col-md-5">
                  <label className="form-label">ชื่อลูกค้า</label>
                  <input
                    type="text"
                    className="form-control"
                    name="queueName"
                    value={formData.queueName}
                    onChange={handleChange}
                    placeholder="เช่น A01 หรือ ชื่อลูกค้า"
                    style={{ borderRadius: "10px" }}
                  />
                </div>

                <div className="col-12 col-md-3">
                  <label className="form-label">จำนวนคน</label>
                  <input
                    type="number"
                    min="1"
                    className="form-control"
                    name="personCount"
                    value={formData.personCount}
                    onChange={handleChange}
                    style={{ borderRadius: "10px" }}
                  />
                </div>

                <div className="col-12 col-md-4 d-flex gap-2">
                  <button
                    type="submit"
                    className="btn flex-grow-1"
                    disabled={loading}
                    style={{
                      backgroundColor: Colors.blue,
                      color: "white",
                      border: "none",
                      borderRadius: "10px",
                      fontWeight: "600",
                    }}
                  >
                    {loading ? "กำลังบันทึก..." : "เพิ่มคิว"}
                  </button>

                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    style={{ borderRadius: "10px" }}
                    onClick={() =>
                      setFormData({
                        queueName: "",
                        personCount: 1,
                      })
                    }
                  >
                    ล้างค่า
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* search */}
        <div
          className="card border-0 mb-3"
          style={{ borderRadius: "12px", boxShadow: "0 1px 6px rgba(0,0,0,0.07)" }}
        >
          <div className="card-body py-2 px-3">
            <input
              type="text"
              className="form-control border-0 shadow-none"
              placeholder="ค้นหาชื่อลูกค้า ชื่อโต๊ะ หรือเลขคิว..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ fontSize: "14px", backgroundColor: "transparent" }}
            />
          </div>
        </div>

        {/* layout */}
        <div className="row g-3">
          <div
            className={`col-12 col-md-7 col-lg-8 ${
              mobileView === "detail" ? "d-none d-md-block" : ""
            }`}
          >
            <div
              className="card border-0"
              style={{
                borderRadius: "12px",
                boxShadow: "0 1px 6px rgba(0,0,0,0.07)",
                overflow: "hidden",
              }}
            >
              <div className="card-body p-0">
                <div className="px-3 pt-3 pb-2 d-flex align-items-center justify-content-between flex-wrap gap-2">
                  <h6 className="fw-bold mb-0" style={{ color: Colors.blue, fontSize: "14px" }}>
                    รายการคิว
                    <span className="text-muted fw-normal ms-2" style={{ fontSize: "12px" }}>
                      ({filteredQueues.length} รายการ)
                    </span>
                  </h6>

                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={loadQueues}
                    disabled={tableLoading}
                    style={{ borderRadius: "8px" }}
                  >
                    รีเฟรช
                  </button>
                </div>

                {tableLoading ? (
                  <p className="text-muted text-center py-5" style={{ fontSize: "14px" }}>
                    กำลังโหลด...
                  </p>
                ) : filteredQueues.length === 0 ? (
                  <div className="text-center py-5">
                    <p className="text-muted mb-0" style={{ fontSize: "14px" }}>
                      ไม่พบข้อมูลคิว
                    </p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0" style={{ minWidth: "720px" }}>
                      <thead style={{ backgroundColor: Colors.blue }}>
                        <tr>
                          <th style={{ color: "#000", fontWeight: "500", fontSize: "13px", width: "50px" }}>
                            ที่
                          </th>
                          <th style={{ color: "#000", fontWeight: "500", fontSize: "13px" }}>
                            ลูกค้า
                          </th>
                          <th style={{ color: "#000", fontWeight: "500", fontSize: "13px" }}>
                            โต๊ะ
                          </th>
                          <th style={{ color: "#000", fontWeight: "500", fontSize: "13px" }}>
                            จำนวน
                          </th>
                          <th style={{ color: "#000", fontWeight: "500", fontSize: "13px" }}>
                            วันที่จอง
                          </th>
                          <th style={{ color: "#000", fontWeight: "500", fontSize: "13px" }}>
                            สถานะ
                          </th>
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
                            <td className="text-muted" style={{ fontSize: "13px" }}>
                              {i + 1}
                            </td>
                            <td className="fw-semibold" style={{ fontSize: "14px" }}>
                              {getDisplayName(q)}
                            </td>
                            <td style={{ fontSize: "13px" }}>{q.table_name || "-"}</td>
                            <td style={{ fontSize: "13px" }}>{q.person_count} คน</td>
                            <td style={{ fontSize: "13px" }}>{formatDate(q.reserve_date)}</td>
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

          <div
            className={`col-12 col-md-5 col-lg-4 ${
              mobileView === "list" ? "d-none d-md-block" : ""
            }`}
          >
            <DetailPanel />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageQueue;