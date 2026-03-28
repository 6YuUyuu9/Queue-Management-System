import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Card, Table, Form } from "react-bootstrap";

function AdminDashboard() {
  // 🔍 search
  const [search, setSearch] = useState("");

  // 📋 mock queue data
  const [queues] = useState([
    { id: 1, name: "สมชาย", people: 2, status: "waiting" },
    { id: 2, name: "สมหญิง", people: 4, status: "processing" },
    { id: 3, name: "John", people: 3, status: "done" },
  ]);

  // 👤 selected customer
  const [selected, setSelected] = useState(null);

  // 🔍 filter
  const filteredQueues = queues.filter((q) =>
    q.name.toLowerCase().includes(search.toLowerCase())
  );

  // 🎨 แปลงสถานะ
  const renderStatus = (status) => {
    if (status === "waiting")
      return <span className="badge bg-danger">รอดำเนินการ</span>;
    if (status === "processing")
      return <span className="badge bg-warning text-dark">กำลังดำเนินการ</span>;
    if (status === "done")
      return <span className="badge bg-success">ดำเนินการแล้ว</span>;
  };

  return (
    <div style={{ background: "#f4f6f9", minHeight: "100vh", padding: "20px" }}>
      <Container fluid>
        <Row>

          {/* 🔹 LEFT SIDE */}
          <Col md={8}>
            <Card className="shadow border-0 mb-3">
              <Card.Body>
                <h5 className="fw-bold mb-3">🔍 ค้นหาคิว</h5>
                <Form.Control
                  type="text"
                  placeholder="ค้นหาชื่อลูกค้า..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </Card.Body>
            </Card>

            {/* 📋 TABLE */}
            <Card className="shadow border-0">
              <Card.Body>
                <h5 className="fw-bold mb-3">📋 รายการคิว</h5>
                <Table hover responsive>
                  <thead>
                    <tr>
                      <th>#</th>
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
                        onClick={() =>
                          setSelected({
                            name: q.name,
                            phone: "099-999-9999",
                            total: 10,
                            cancel: 2,
                            success: 8,
                          })
                        }
                      >
                        <td>{index + 1}</td>
                        <td>{q.name}</td>
                        <td>{q.people} คน</td>
                        <td>{renderStatus(q.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>

          {/* 🔹 RIGHT SIDE */}
          <Col md={4}>
            <Card className="shadow border-0">
              <Card.Body>
                <h5 className="fw-bold mb-3">👤 ข้อมูลลูกค้า</h5>

                {!selected ? (
                  <p className="text-muted">กรุณาเลือกคิวจากตาราง</p>
                ) : (
                  <>
                    <p><b>ชื่อ:</b> {selected.name}</p>
                    <p><b>เบอร์โทร:</b> {selected.phone}</p>

                    <hr />

                    <p><b>การจองทั้งหมด:</b> {selected.total}</p>
                    <p><b>ยกเลิก:</b> <span className="text-danger">{selected.cancel}</span></p>
                    <p><b>สำเร็จ:</b> <span className="text-success">{selected.success}</span></p>
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>

        </Row>
      </Container>
    </div>
  );
}

export default AdminDashboard;