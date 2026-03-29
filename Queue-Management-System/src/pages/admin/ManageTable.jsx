import { useEffect, useState } from 'react';
import { tableService } from '../../services/tableService';
import { Colors } from '../../constant/colors';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

function ManageTable() {
  const [tables, setTables] = useState([]);
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    tableName: '',
    typeId: '',
  });

  const [editingId, setEditingId] = useState(null);

  const loadTables = async () => {
    try {
      const data = await tableService.list();
      setTables(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('โหลดข้อมูลโต๊ะไม่สำเร็จ:', error);
      setTables([]);
    }
  };

  const loadTypes = async () => {
    try {
      const data = await tableService.getTypes();
      setTypes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('โหลดประเภทโต๊ะไม่สำเร็จ:', error);
      setTypes([]);
    }
  };

  useEffect(() => {
    loadTables();
    loadTypes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      tableName: '',
      typeId: '',
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tableName.trim()) {
      alert('กรุณากรอกชื่อโต๊ะ');
      return;
    }

    if (!formData.typeId) {
      alert('กรุณาเลือกประเภทโต๊ะ');
      return;
    }

    const duplicateTable = tables.find(
      (table) =>
        table.table_name.trim().toLowerCase() === formData.tableName.trim().toLowerCase() &&
        table.table_id !== editingId
    );

    if (duplicateTable) {
      alert('ชื่อโต๊ะนี้มีอยู่แล้ว');
      return;
    }

    try {
      setLoading(true);

      if (editingId) {
        await tableService.update(
          editingId,
          formData.tableName.trim(),
          Number(formData.typeId)
        );
        alert('แก้ไขโต๊ะสำเร็จ');
      } else {
        await tableService.add(
          formData.tableName.trim(),
          Number(formData.typeId)
        );
        alert('เพิ่มโต๊ะสำเร็จ');
      }

      resetForm();
      await loadTables();
    } catch (error) {
      console.error('บันทึกข้อมูลโต๊ะไม่สำเร็จ:', error);
      alert('บันทึกข้อมูลโต๊ะไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (table) => {
    setEditingId(table.table_id);
    setFormData({
      tableName: table.table_name || '',
      typeId: table.type_id || '',
    });
  };

  const handleDelete = async (tableId) => {
    const confirmed = window.confirm('ต้องการลบโต๊ะนี้ใช่หรือไม่');
    if (!confirmed) return;

    try {
      await tableService.delete(tableId);
      alert('ลบโต๊ะสำเร็จ');

      if (editingId === tableId) {
        resetForm();
      }

      await loadTables();
    } catch (error) {
      console.error('ลบโต๊ะไม่สำเร็จ:', error);
      alert('ลบโต๊ะไม่สำเร็จ');
    }
  };

  const getTypeName = (table) => {
    return table.type_name || `ประเภท ${table.type_id}`;
  };

  return (
    <div className="container-fluid py-4">
      <div className="row g-4 mb-4">
        <div className="col-12 col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <p className="text-muted mb-1">จำนวนโต๊ะทั้งหมด</p>
              <h3 className="mb-0">{tables.length}</h3>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-8">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body d-flex align-items-center">
              <div>
                <p className="text-muted mb-1">หมายเหตุ</p>
                <div>1 = 1-2 คน, 2 = 3-4 คน, 3 = 5-6 คน</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm mb-4">
        <div
          className="card-header border-0 text-white"
          style={{ backgroundColor: Colors.blue }}
        >
          <h5 className="mb-0">
            {editingId ? 'แก้ไขโต๊ะ' : 'เพิ่มโต๊ะ'}
          </h5>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row g-3 align-items-end">
              <div className="col-12 col-md-4">
                <label className="form-label">ชื่อโต๊ะ</label>
                <input
                  type="text"
                  className="form-control"
                  name="tableName"
                  value={formData.tableName}
                  onChange={handleChange}
                  placeholder="เช่น A01"
                />
              </div>

              <div className="col-12 col-md-4">
                <label className="form-label">ประเภทโต๊ะ</label>
                <select
                  className="form-select"
                  name="typeId"
                  value={formData.typeId}
                  onChange={handleChange}
                >
                  <option value="">-- เลือกประเภทโต๊ะ --</option>
                  {types.map((type) => (
                    <option key={type.type_id} value={type.type_id}>
                      {type.type_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-12 col-md-4 d-flex gap-2">
                <button
                  type="submit"
                  className="btn flex-grow-1 text-white"
                  style={{ backgroundColor: Colors.blue }}
                  disabled={loading}
                >
                  {loading
                    ? 'กำลังบันทึก...'
                    : editingId
                    ? 'บันทึกการแก้ไข'
                    : 'เพิ่มโต๊ะ'}
                </button>

                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={resetForm}
                >
                  ล้างค่า
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-0">
          <h5 className="mb-0">รายการโต๊ะ</h5>
          <small className="text-muted">จัดการข้อมูลโต๊ะทั้งหมดในระบบ</small>
        </div>

        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead style={{ backgroundColor: Colors.lightGray }}>
                <tr>
                  <th>#</th>
                  <th>ชื่อโต๊ะ</th>
                  <th>ประเภทโต๊ะ</th>
                  <th className="text-center">จัดการ</th>
                </tr>
              </thead>

              <tbody>
                {tables.length > 0 ? (
                  tables.map((table, index) => (
                    <tr key={table.table_id}>
                      <td>{index + 1}</td>
                      <td>{table.table_name}</td>
                      <td>{getTypeName(table)}</td>
                      <td>
                        <div className="d-flex gap-2 justify-content-center">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleEdit(table)}
                          >
                            แก้ไข
                          </button>

                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(table.table_id)}
                          >
                            ลบ
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center text-muted py-4">
                      ยังไม่มีข้อมูลโต๊ะ
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

export default ManageTable;