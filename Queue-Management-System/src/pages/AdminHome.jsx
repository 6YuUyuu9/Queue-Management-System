import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Card } from "react-bootstrap";

function AdminHome() {
  const [data, setData] = useState({
    total: 0,
    done: 0,
    processing: 0, //  เพิ่มตรงนี้
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

  useEffect(() => {
    // รอ API จริง
    // fetch("http://localhost:3000/api/dashboard")
    //   .then(res => res.json())
    //   .then(res => {
    //     setData({
    //       total: res.total,
    //       done: res.done,
    //       processing: res.processing, //  เพิ่ม
    //       waiting: res.waiting,
    //     });
    //   });

    // mock data
    setData({
      total: 120,
      done: 70,
      processing: 20, // ตัวอย่าง
      waiting: 30,
    });
  }, []);

  return (
    <div style={{ background: "#f4f6f9", minHeight: "100vh", padding: "30px" }}>
      <Container>

        {/* Header */}
        <div className="mb-4">
          <h2 className="fw-bold"> สรุปภาพรวมวันนี้</h2>
          <p className="text-muted" style={{textAlign:"center"}}> {today}</p>
        </div>

        {/* Cards */}
        <Row>
          <Col md={3} className="mb-3">
            <Card className="shadow border-0 text-center">
              <Card.Body>
                <h6 className="text-muted">จำนวนคิวทั้งหมด</h6>
                <h2 className="fw-bold text-primary">{data.total}</h2>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3} className="mb-3">
            <Card className="shadow border-0 text-center">
              <Card.Body>
                <h6 className="text-muted">ดำเนินการแล้ว</h6>
                <h2 className="fw-bold text-success">{data.done}</h2>
              </Card.Body>
            </Card>
          </Col>

          {/*  การ์ดใหม่ */}
          <Col md={3} className="mb-3">
            <Card className="shadow border-0 text-center">
              <Card.Body>
                <h6 className="text-muted">กำลังดำเนินการ</h6>
                <h2 className="fw-bold text-warning">{data.processing}</h2>
                
              </Card.Body>
            </Card>
          </Col>

          <Col md={3} className="mb-3">
            <Card className="shadow border-0 text-center">
              <Card.Body>
                <h6 className="text-muted">รอดำเนินการ</h6>
                <h2 className="fw-bold text-danger">{data.waiting}</h2>
              </Card.Body>
            </Card>
          </Col>
        </Row>

      </Container>
    </div>
  );
}

export default AdminHome;