import { useEffect, useMemo, useState } from 'react';
import { queueService } from '../../services/queueService';
import { Colors } from '../../constant/colors';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

function ManageQueue() {
  const [queues, setQueues] = useState([]);
  const [formData, setFormData] = useState({
    queueName: '',
    personCount: 1,
  });
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);

  const loadQueues = async () => {
    try {
      const data = await queueService.getAll();
      console.log('queue list:', data);
      setQueues(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('โหลดข้อมูลคิวไม่สำเร็จ:', error);
      setQueues([]);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'personCount' ? Number(value) : value,
    }));
  };

  const handleAddQueue = async (e) => {
    e.preventDefault();

    if (!formData.queueName.trim()) {
      alert('กรุณากรอกชื่อลูกค้า');
      return;
    }

    const personCount = Number(formData.personCount);

    if (!personCount || personCount < 1 || personCount > 6) {
      alert('จำนวนคนต้องอยู่ระหว่าง 1 - 6');
      return;
    }

    try {
      setLoading(true);

      const now = new Date();
      const date = now.toISOString().slice(0, 10);
      const time = now.toTimeString().slice(0, 5);

      const tableResult = await queueService.findTable(date, time, personCount);
      console.log('tableResult =', tableResult);

      const tableId = tableResult?.table?.table_id;

      if (!tableResult?.success || !tableId) {
        alert('ไม่พบโต๊ะว่างสำหรับจำนวนคนนี้');
        return;
      }

      await queueService.add(6, tableId, personCount, date, time);

      const freshData = await queueService.getAll();
      setQueues(Array.isArray(freshData) ? freshData : []);

      alert('เพิ่มคิวสำเร็จ');

      setFormData({
        queueName: '',
        personCount: 1,
      });
    } catch (error) {
      console.error('เพิ่มคิวไม่สำเร็จ:', error);
      alert('เพิ่มคิวไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  };

  const getDisplayName = (queue) => {
    return queue.queue_name || queue.username || queue.user_name || 'Walk-in';
  };

  const getDisplayStatus = (queue) => {
    if (queue.status_name) return queue.status_name;

    switch (Number(queue.status_id)) {
      case 1:
        return 'reserved';
      case 2:
        return 'skipped';
      case 3:
        return 'completed';
      case 4:
        return 'cancel';
      default:
        return 'unknown';
    }
  };

  const getStatusBadgeClass = (statusId) => {
    switch (Number(statusId)) {
      case 1:
        return 'bg-primary';
      case 2:
        return 'bg-warning text-dark';
      case 3:
        return 'bg-success';
      case 4:
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  };

  const isSkipped = (queue) => Number(queue.status_id) === 2;
  const isCompleted = (queue) => Number(queue.status_id) === 3;
  const isCancelled = (queue) => Number(queue.status_id) === 4;
  const hasArrived = (queue) => !!queue.arrive_at;

  const handleCancelQueue = async (queue) => {
    if (isCompleted(queue)) {
      alert('ไม่สามารถยกเลิกคิวหลังจากเสร็จสิ้นแล้ว');
      return;
    }

    if (isCancelled(queue)) {
      alert('คิวนี้ถูกยกเลิกแล้ว');
      return;
    }

    if (isSkipped(queue)) {
      alert('คิวที่ถูกข้ามแล้วไม่สามารถยกเลิกได้');
      return;
    }

    const confirmed = window.confirm('ต้องการยกเลิกคิวนี้ใช่หรือไม่');
    if (!confirmed) return;

    try {
      await queueService.updateStatus(queue.queue_id, 4);
      alert('ยกเลิกคิวสำเร็จ');
      await loadQueues();
    } catch (error) {
      console.error('ยกเลิกคิวไม่สำเร็จ:', error);
      alert('ยกเลิกคิวไม่สำเร็จ');
    }
  };

  const handleCompleteQueue = async (queue) => {
    if (!hasArrived(queue)) {
      alert('ต้องกด "มาถึง" ก่อน จึงจะกดเสร็จสิ้นได้');
      return;
    }

    if (isCompleted(queue)) {
      alert('คิวนี้เสร็จสิ้นแล้ว');
      return;
    }

    if (isCancelled(queue)) {
      alert('คิวที่ยกเลิกแล้วไม่สามารถเสร็จสิ้นได้');
      return;
    }

    if (isSkipped(queue)) {
      alert('คิวที่ถูกข้ามแล้วไม่สามารถเสร็จสิ้นได้');
      return;
    }

    try {
      await queueService.complete(queue.queue_id);
      alert('อัปเดตสถานะสำเร็จ');
      await loadQueues();
    } catch (error) {
      console.error('อัปเดตสถานะไม่สำเร็จ:', error);
      alert('อัปเดตสถานะไม่สำเร็จ');
    }
  };

  const handleSkipQueue = async (queue) => {
    if (isCompleted(queue)) {
      alert('ไม่สามารถข้ามคิวหลังจากเสร็จสิ้นแล้ว');
      return;
    }

    if (isCancelled(queue)) {
      alert('คิวที่ยกเลิกแล้วไม่สามารถข้ามได้');
      return;
    }

    if (isSkipped(queue)) {
      alert('คิวนี้ถูกข้ามแล้ว');
      return;
    }

    try {
      await queueService.skip(queue.queue_id);
      alert('ข้ามคิวสำเร็จ');
      await loadQueues();
    } catch (error) {
      console.error('ข้ามคิวไม่สำเร็จ:', error);
      alert('ข้ามคิวไม่สำเร็จ');
    }
  };

  const handleArriveQueue = async (queue) => {
    if (hasArrived(queue)) {
      alert('คิวนี้บันทึกมาถึงแล้ว');
      return;
    }

    if (isCompleted(queue)) {
      alert('คิวนี้เสร็จสิ้นแล้ว');
      return;
    }

    if (isCancelled(queue)) {
      alert('คิวที่ยกเลิกแล้วไม่สามารถกดมาถึงได้');
      return;
    }

    try {
      await queueService.arrive(queue.queue_id);
      alert('บันทึกเวลามาถึงสำเร็จ');
      await loadQueues();
    } catch (error) {
      console.error('บันทึกเวลามาถึงไม่สำเร็จ:', error);
      alert('บันทึกเวลามาถึงไม่สำเร็จ');
    }
  };

  return (
    <div className="container-fluid py-4">
      <div
        className="mb-4"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '16px',
        }}
      >
        <div className="card border-0 shadow-sm h-100">
          <div className="card-body">
            <p className="text-muted mb-1">คิวทั้งหมด</p>
            <h3 className="mb-0">{summary.total}</h3>
          </div>
        </div>

        <div className="card border-0 shadow-sm h-100">
          <div className="card-body">
            <p className="text-muted mb-1">รอคิว</p>
            <h3 className="mb-0 text-primary">{summary.reserved}</h3>
          </div>
        </div>

        <div className="card border-0 shadow-sm h-100">
          <div className="card-body">
            <p className="text-muted mb-1">ข้ามคิว</p>
            <h3 className="mb-0 text-warning">{summary.skipped}</h3>
          </div>
        </div>

        <div className="card border-0 shadow-sm h-100">
          <div className="card-body">
            <p className="text-muted mb-1">เสร็จสิ้น</p>
            <h3 className="mb-0 text-success">{summary.completed}</h3>
          </div>
        </div>

        <div className="card border-0 shadow-sm h-100">
          <div className="card-body">
            <p className="text-muted mb-1">ยกเลิกแล้ว</p>
            <h3 className="mb-0 text-danger">{summary.cancelled}</h3>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm mb-4">
        <div
          className="card-header border-0 text-white"
          style={{ backgroundColor: Colors.blue }}
        >
          <h5 className="mb-0">เพิ่มคิว Walk-in</h5>
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
                />
              </div>

              <div className="col-12 col-md-4 d-flex gap-2">
                <button
                  type="submit"
                  className="btn flex-grow-1 text-white"
                  style={{ backgroundColor: Colors.blue }}
                  disabled={loading}
                >
                  {loading ? 'กำลังบันทึก...' : 'เพิ่มคิว'}
                </button>

                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() =>
                    setFormData({
                      queueName: '',
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

      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center">
          <div>
            <h5 className="mb-0">รายการคิว</h5>
            <small className="text-muted">แสดงข้อมูลคิวทั้งหมดในระบบ</small>
          </div>

          <button
            className="btn btn-outline-primary btn-sm"
            onClick={loadQueues}
            disabled={tableLoading}
          >
            รีเฟรช
          </button>
        </div>

        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead style={{ backgroundColor: Colors.lightGray }}>
                <tr>
                  <th>#</th>
                  <th>ชื่อ</th>
                  <th>จำนวนคน</th>
                  <th>สถานะ</th>
                  <th>เวลาจอง</th>
                  <th>มาถึง</th>
                  <th>เสร็จสิ้น</th>
                  <th className="text-center">จัดการ</th>
                </tr>
              </thead>

              <tbody>
                {queues.length > 0 ? (
                  queues.map((queue, index) => (
                    <tr key={queue.queue_id || index}>
                      <td>{index + 1}</td>
                      <td>
                        <div className="fw-semibold">{getDisplayName(queue)}</div>
                        <small className="text-muted">Queue ID: {queue.queue_id}</small>
                      </td>
                      <td>{queue.person_count}</td>
                      <td>
                        <span className={`badge ${getStatusBadgeClass(queue.status_id)}`}>
                          {getDisplayStatus(queue)}
                        </span>
                      </td>
                      <td>{queue.reserve_date || '-'}</td>
                      <td>{queue.arrive_at || '-'}</td>
                      <td>{queue.complete_at || '-'}</td>
                      <td>
                        <div className="d-flex gap-2 flex-wrap justify-content-center">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleArriveQueue(queue)}
                            disabled={hasArrived(queue) || isCompleted(queue) || isCancelled(queue) || isSkipped(queue)}
                          >
                            มาถึง
                          </button>

                          <button
                            className="btn btn-sm btn-outline-success"
                            onClick={() => handleCompleteQueue(queue)}
                            disabled={!hasArrived(queue) || isCompleted(queue) || isCancelled(queue) || isSkipped(queue)}
                          >
                            เสร็จสิ้น
                          </button>

                          <button
                            className="btn btn-sm btn-outline-warning"
                            onClick={() => handleSkipQueue(queue)}
                            disabled={isCompleted(queue) || isCancelled(queue) || isSkipped(queue)}
                          >
                            ข้าม
                          </button>

                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleCancelQueue(queue)}
                            disabled={isCompleted(queue) || isCancelled(queue) || isSkipped(queue)}
                          >
                            ยกเลิก
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center text-muted py-4">
                      ยังไม่มีข้อมูลคิว
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageQueue;