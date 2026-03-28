import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

function AdminHome() {
  const [data, setData] = useState({
    total: 0,
    done: 0,
    processing: 0,
    waiting: 0,
  });

  const [today, setToday] = useState("");

  useEffect(() => {
    const now = new Date();
    const formattedDate = now.toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    setToday(formattedDate);
  }, []);

  // ดึงข้อมูลจริงจาก API
  useEffect(() => {
    fetch("http://localhost/food_queue/api/queue.php")
      .then((res) => res.json())
      .then((queues) => {
        const summary = {
          total: queues.length,
          done: queues.filter(q => q.status === "done").length,
          processing: queues.filter(q => q.status === "processing").length,
          waiting: queues.filter(q => q.status === "waiting").length,
        };

        setData(summary);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="bg-light min-vh-100 p-4">
      <div className="container">

        {/* Header */}
        <div className="mb-4 text-center">
          <h2 className="fw-bold">สรุปภาพรวมวันนี้</h2>
          <p className="text-muted">{today}</p>
        </div>

        {/* Cards */}
        <div className="row">

          <div className="col-md-3 mb-3">
            <div className="card shadow border-0 text-center">
              <div className="card-body">
                <h6 className="text-muted">จำนวนคิวทั้งหมด</h6>
                <h2 className="fw-bold text-primary">{data.total}</h2>
              </div>
            </div>
          </div>

          <div className="col-md-3 mb-3">
            <div className="card shadow border-0 text-center">
              <div className="card-body">
                <h6 className="text-muted">ดำเนินการแล้ว</h6>
                <h2 className="fw-bold text-success">{data.done}</h2>
              </div>
            </div>
          </div>

          <div className="col-md-3 mb-3">
            <div className="card shadow border-0 text-center">
              <div className="card-body">
                <h6 className="text-muted">กำลังดำเนินการ</h6>
                <h2 className="fw-bold text-warning">{data.processing}</h2>
              </div>
            </div>
          </div>

          <div className="col-md-3 mb-3">
            <div className="card shadow border-0 text-center">
              <div className="card-body">
                <h6 className="text-muted">รอดำเนินการ</h6>
                <h2 className="fw-bold text-danger">{data.waiting}</h2>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default AdminHome;
