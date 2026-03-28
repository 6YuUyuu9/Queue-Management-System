import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

function AdminDashboard() {
  const [search, setSearch] = useState("");
  const [queues, setQueues] = useState([]);
  const [selected, setSelected] = useState(null);

  // โหลดข้อมูลจาก API
  useEffect(() => {
    fetch("http://localhost/food_queue/api/queue.php")
      .then((res) => res.json())
      .then((data) => {
        setQueues(data);
      })
      .catch((err) => console.error(err));
  }, []);

  const filteredQueues = queues.filter((q) =>
    q.name?.toLowerCase().includes(search.toLowerCase())
  );

  const renderStatus = (status) => {
    if (status === "waiting")
      return <span className="badge bg-danger">รอดำเนินการ</span>;
    if (status === "processing")
      return <span className="badge bg-warning text-dark">กำลังดำเนินการ</span>;
    if (status === "done")
      return <span className="badge bg-success">ดำเนินการแล้ว</span>;
    return status;
  };

  return (
    <div className="bg-light min-vh-100 p-3">
      <div className="container-fluid">
        <div className="row">

          {/* LEFT */}
          <div className="col-md-8">

            <div className="card shadow mb-3 border-0">
              <div className="card-body">
                <h5 className="fw-bold mb-3">ค้นหาคิว</h5>
                <input
                  type="text"
                  className="form-control"
                  placeholder="ค้นหาชื่อลูกค้า..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="card shadow border-0">
              <div className="card-body">
                <h5 className="fw-bold mb-3">รายการคิว</h5>

                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>ลำดับคิว</th>
                        <th>ชื่อ</th>
                        <th>จำนวนที่นั่ง</th>
                        <th>สถานะ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredQueues.map((q, index) => (
                        <tr
                          key={q.id}
                          style={{ cursor: "pointer" }}
                          onClick={() => setSelected(q)}
                        >
                          <td>{index + 1}</td>
                          <td>{q.name}</td>
                          <td>{q.people} คน</td>
                          <td>{renderStatus(q.status)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="col-md-4">
            <div className="card shadow border-0">
              <div className="card-body">
                <h5 className="fw-bold mb-3">ข้อมูลลูกค้า</h5>

                {!selected ? (
                  <p className="text-muted">กรุณาเลือกคิวจากตาราง</p>
                ) : (
                  <>
                    <p><b>ชื่อ:</b> {selected.name}</p>
                    <p><b>เบอร์โทร:</b> {selected.phone}</p>

                    <hr />

                    <p><b>จำนวนคน:</b> {selected.people}</p>
                    <p><b>สถานะ:</b> {selected.status}</p>
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