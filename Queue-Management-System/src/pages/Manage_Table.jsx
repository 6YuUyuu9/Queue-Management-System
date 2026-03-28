import React, { useState, useEffect } from 'react';
import { tableService } from '../services/tableService'; // อย่าลืมเช็ค path ให้ตรงนะครับ

const APP_COLORS = { yellow: '#FCC402', blue: '#003666', lightGray: '#F7F7F7' };

const Manage_Table = () => {
  const [tables, setTables] = useState([]);
  const [tableTypes, setTableTypes] = useState([]);
  
  // สำหรับฟอร์มเพิ่ม/แก้ไข
  const [tableName, setTableName] = useState('');
  const [typeId, setTypeId] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editTableId, setEditTableId] = useState(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  // ดึงข้อมูลโต๊ะและประเภทโต๊ะพร้อมกันตอนเปิดหน้าเว็บ
  const fetchInitialData = async () => {
    try {
      const [tablesData, typesData] = await Promise.all([
        tableService.list(),
        tableService.getTypes()
      ]);
      setTables(tablesData);
      setTableTypes(typesData);
      
      // ตั้งค่า default ให้ Dropdown เลือกประเภทโต๊ะอันแรกเสมอ (ถ้ามีข้อมูล)
      if (typesData && typesData.length > 0) {
        setTypeId(typesData[0].type_id || typesData[0].id);
      }
    } catch (error) {
      console.error("โหลดข้อมูลโต๊ะไม่สำเร็จ", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!tableName || !typeId) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    try {
      if (isEditing) {
        await tableService.update(editTableId, tableName, typeId);
        alert("อัปเดตข้อมูลโต๊ะเรียบร้อย!");
      } else {
        await tableService.add(tableName, typeId);
        alert("เพิ่มโต๊ะใหม่เรียบร้อย!");
      }
      
      // ล้างค่าฟอร์ม และดึงข้อมูลใหม่มาโชว์
      resetForm();
      fetchInitialData();
    } catch (error) {
      console.error(error);
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("คุณแน่ใจหรือไม่ที่จะลบโต๊ะนี้?")) {
      try {
        await tableService.delete(id);
        fetchInitialData();
      } catch (error) {
        alert("ลบข้อมูลไม่สำเร็จ");
      }
    }
  };

  const handleEditClick = (table) => {
    setIsEditing(true);
    setEditTableId(table.table_id || table.id);
    setTableName(table.table_name || table.name);
    // พยายามหา type_id จากข้อมูลโต๊ะ ถ้าไม่มีก็ดึงจาก Dropdown อันแรก
    setTypeId(table.type_id || tableTypes[0]?.type_id || tableTypes[0]?.id || '');
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditTableId(null);
    setTableName('');
    if (tableTypes.length > 0) setTypeId(tableTypes[0].type_id || tableTypes[0].id);
  };

  return (
    <div>
      <h2 className="fw-bold mb-4" style={{ color: 'black' }}>จัดการโต๊ะอาหาร</h2>
      <hr className="mb-5" />

      {/* ฟอร์มเพิ่ม/แก้ไขโต๊ะ */}
      <div className="mb-4 p-4 rounded" style={{ backgroundColor: APP_COLORS.lightGray, border: `1px solid ${APP_COLORS.blue}20` }}>
        <h5 className="mb-3 fw-bold" style={{ color: APP_COLORS.blue }}>
          {isEditing ? '✏️ แก้ไขข้อมูลโต๊ะ' : '➕ เพิ่มโต๊ะใหม่'}
        </h5>
        <form className="row g-3 align-items-end" onSubmit={handleSubmit}>
          <div className="col-md-4">
            <label className="form-label fw-bold">ชื่อโต๊ะ / หมายเลขโต๊ะ</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="เช่น T01, โต๊ะมุมกระจก" 
              value={tableName} 
              onChange={(e) => setTableName(e.target.value)} 
            />
          </div>
          <div className="col-md-4">
            <label className="form-label fw-bold">ประเภทโต๊ะ</label>
            <select 
              className="form-select" 
              value={typeId} 
              onChange={(e) => setTypeId(e.target.value)}
            >
              {tableTypes.map((type) => (
                <option key={type.type_id || type.id} value={type.type_id || type.id}>
                  {type.type_name || type.name} (นั่งได้ {type.capacity} ท่าน)
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-4 d-flex gap-2">
            <button type="submit" className="btn fw-bold w-100" style={{ backgroundColor: APP_COLORS.blue, color: 'white' }}>
              {isEditing ? 'บันทึกการแก้ไข' : 'เพิ่มโต๊ะ'}
            </button>
            {isEditing && (
              <button type="button" className="btn btn-secondary fw-bold w-100" onClick={resetForm}>
                ยกเลิก
              </button>
            )}
          </div>
        </form>
      </div>

      {/* ตารางแสดงโต๊ะ */}
      <h5 className="mb-3 fw-bold">📋 รายการโต๊ะทั้งหมด</h5>
      <div className="table-responsive">
        <table className="table table-hover align-middle text-center border">
          <thead style={{ backgroundColor: APP_COLORS.blue, color: 'white' }}>
            <tr>
              <th>รหัสโต๊ะ</th>
              <th>ชื่อโต๊ะ</th>
              <th>ประเภท</th>
              <th>สถานะปัจจุบัน</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {tables.length === 0 ? (
              <tr><td colSpan="5" className="py-4 text-muted">กำลังโหลดข้อมูล หรือ ยังไม่มีโต๊ะในระบบ...</td></tr>
            ) : (
              tables.map((t) => (
                <tr key={t.table_id || t.id}>
                  <td className="fw-bold text-muted">#{t.table_id || t.id}</td>
                  <td className="fw-bold fs-5" style={{ color: APP_COLORS.blue }}>{t.table_name || t.name}</td>
                  <td>{t.type_name || t.type || 'ไม่ระบุประเภท'}</td>
                  <td>
                     {/* สมมติว่ามีสถานะส่งมาด้วย ถ้าไม่มีก็โชว์ว่า 'ว่าง' ไว้ก่อน */}
                     <span className={`badge rounded-pill px-3 py-2 ${t.status === 'ว่าง' || !t.status ? 'bg-success' : 'bg-secondary'}`}>
                        {t.status || 'ว่าง'}
                     </span>
                  </td>
                  <td>
                    <div className="d-flex justify-content-center gap-2">
                      <button type="button" className="btn btn-sm btn-outline-warning text-dark" onClick={() => handleEditClick(t)}>✏️ แก้ไข</button>
                      <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(t.table_id || t.id)}>❌ ลบ</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Manage_Table;