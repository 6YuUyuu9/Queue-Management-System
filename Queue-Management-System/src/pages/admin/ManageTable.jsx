import React, { useEffect, useMemo, useState } from "react";
import { tableService } from "../../services/tableService";
import { Colors } from "../../constant/colors";

function ManageTable() {
  const [tables, setTables] = useState([]);
  const [types, setTypes] = useState([]);
  const [selected, setSelected] = useState(null);
  const [mobileView, setMobileView] = useState("list");
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);

  const [formData, setFormData] = useState({
    tableName: "",
    typeId: "",
  });

  const [editingId, setEditingId] = useState(null);

  const loadTables = async () => {
    try {
      setTableLoading(true);
      const data = await tableService.list();
      const sorted = Array.isArray(data)
        ? [...data].sort((a, b) => b.table_id - a.table_id)
        : [];

      setTables(sorted);

      if (selected) {
        const updatedSelected = sorted.find((t) => t.table_id === selected.table_id);
        setSelected(updatedSelected || sorted[0] || null);
      } else {
        setSelected(sorted[0] || null);
      }
    } catch (error) {
      console.error("โหลดข้อมูลโต๊ะไม่สำเร็จ:", error);
      setTables([]);
    } finally {
      setTableLoading(false);
    }
  };

  const loadTypes = async () => {
    try {
      const data = await tableService.getTypes();
      setTypes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("โหลดประเภทโต๊ะไม่สำเร็จ:", error);
      setTypes([]);
    }
  };

  useEffect(() => {
    loadTables();
    loadTypes();
  }, []);

  const getTypeName = (table) => {
    if (table.type_name) {
      if (table.type_name === "for2") return "1-2 คน";
      if (table.type_name === "for4") return "3-4 คน";
      if (table.type_name === "for6") return "5-6 คน";
      return table.type_name;
    }

    switch (Number(table.type_id)) {
      case 1:
        return "1-2 คน";
      case 2:
        return "3-4 คน";
      case 3:
        return "5-6 คน";
      default:
        return `ประเภท ${table.type_id ?? "-"}`;
    }
  };

  const summary = useMemo(() => {
    const total = tables.length;

    const type1 = tables.filter(
      (t) => Number(t.type_id) === 1 || t.type_name === "for2"
    ).length;

    const type2 = tables.filter(
      (t) => Number(t.type_id) === 2 || t.type_name === "for4"
    ).length;

    const type3 = tables.filter(
      (t) => Number(t.type_id) === 3 || t.type_name === "for6"
    ).length;

    return { total, type1, type2, type3 };
  }, [tables]);

  const handleSelectTable = (table) => {
    setSelected(table);
    setMobileView("detail");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      tableName: "",
      typeId: "",
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tableName.trim()) {
      alert("กรุณากรอกชื่อโต๊ะ");
      return;
    }

    if (!formData.typeId) {
      alert("กรุณาเลือกประเภทโต๊ะ");
      return;
    }

    const duplicateTable = tables.find(
      (table) =>
        table.table_name?.trim().toLowerCase() ===
          formData.tableName.trim().toLowerCase() &&
        table.table_id !== editingId
    );

    if (duplicateTable) {
      alert("ชื่อโต๊ะนี้มีอยู่แล้ว");
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
        alert("แก้ไขโต๊ะสำเร็จ");
      } else {
        await tableService.add(
          formData.tableName.trim(),
          Number(formData.typeId)
        );
        alert("เพิ่มโต๊ะสำเร็จ");
      }

      resetForm();
      await loadTables();
    } catch (error) {
      console.error("บันทึกข้อมูลโต๊ะไม่สำเร็จ:", error);
      alert("บันทึกข้อมูลโต๊ะไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (table) => {
    setEditingId(table.table_id);
    setSelected(table);
    setMobileView("detail");
    setFormData({
      tableName: table.table_name || "",
      typeId: String(table.type_id || ""),
    });
  };

  const handleDelete = async (table) => {
    const confirmed = window.confirm(`ต้องการลบโต๊ะ ${table.table_name} ใช่หรือไม่`);
    if (!confirmed) return;

    try {
      await tableService.delete(table.table_id);
      alert("ลบโต๊ะสำเร็จ");

      if (editingId === table.table_id) {
        resetForm();
      }

      if (selected?.table_id === table.table_id) {
        setSelected(null);
      }

      await loadTables();
    } catch (error) {
      console.error("ลบโต๊ะไม่สำเร็จ:", error);
      alert("ลบโต๊ะไม่สำเร็จ");
    }
  };

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
          รายละเอียดโต๊ะ
        </h5>

        {!selected ? (
          <div className="text-center py-4">
            <p className="text-muted mb-0" style={{ fontSize: "14px" }}>
              กรุณาเลือกโต๊ะจากรายการ
            </p>
          </div>
        ) : (
          <>
            <p className="mb-1 text-muted" style={{ fontSize: "12px" }}>
              โต๊ะ #{selected.table_id}
            </p>
            <h6 className="fw-bold mb-3" style={{ color: Colors.blue }}>
              {selected.table_name}
            </h6>

            <div className="row g-2 mb-2">
              {[
                { label: "ชื่อโต๊ะ", value: selected.table_name || "-" },
                { label: "ประเภทโต๊ะ", value: getTypeName(selected) },
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

            <div className="d-flex flex-wrap gap-2 mt-3">
              <button
                className="btn btn-sm"
                onClick={() => handleEdit(selected)}
                style={{
                  backgroundColor: Colors.blue,
                  color: "white",
                  borderRadius: "8px",
                  border: "none",
                }}
              >
                แก้ไข
              </button>

              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => handleDelete(selected)}
                style={{ borderRadius: "8px" }}
              >
                ลบ
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
          จัดการโต๊ะ
        </h4>

        <div
          className="mb-3"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "16px",
          }}
        >
          {[
            { label: "โต๊ะทั้งหมด", value: summary.total, color: Colors.blue },
            { label: "โต๊ะ 1-2 คน", value: summary.type1, color: "#1F7A3D" },
            { label: "โต๊ะ 3-4 คน", value: summary.type2, color: "#E0A100" },
            { label: "โต๊ะ 5-6 คน", value: summary.type3, color: "#555555" },
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
              {editingId ? "แก้ไขโต๊ะ" : "เพิ่มโต๊ะ"}
            </h6>
          </div>

          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row g-3 align-items-end">
                <div className="col-12 col-md-6">
                  <label className="form-label">ชื่อโต๊ะ</label>
                  <input
                    type="text"
                    className="form-control"
                    name="tableName"
                    value={formData.tableName}
                    onChange={handleChange}
                    placeholder="เช่น A01"
                    style={{ borderRadius: "10px" }}
                  />
                </div>

                <div className="col-12 col-md-3">
                  <label className="form-label">ประเภทโต๊ะ</label>
                  <select
                    className="form-select"
                    name="typeId"
                    value={formData.typeId}
                    onChange={handleChange}
                    style={{ borderRadius: "10px" }}
                  >
                    <option value="">-- เลือกประเภทโต๊ะ --</option>
                    {types.map((type) => (
                      <option key={type.type_id} value={type.type_id}>
                        {type.type_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-12 col-md-3 d-flex gap-2">
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
                    {loading
                      ? "กำลังบันทึก..."
                      : editingId
                      ? "บันทึกการแก้ไข"
                      : "เพิ่มโต๊ะ"}
                  </button>

                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    style={{ borderRadius: "10px" }}
                    onClick={resetForm}
                  >
                    ล้างค่า
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

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
                    รายการโต๊ะ
                    <span className="text-muted fw-normal ms-2" style={{ fontSize: "12px" }}>
                      ({tables.length} รายการ)
                    </span>
                  </h6>

                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={loadTables}
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
                ) : tables.length === 0 ? (
                  <div className="text-center py-5">
                    <p className="text-muted mb-0" style={{ fontSize: "14px" }}>
                      ไม่พบข้อมูลโต๊ะ
                    </p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0" style={{ minWidth: "560px" }}>
                      <thead style={{ backgroundColor: Colors.blue }}>
                        <tr>
                          <th style={{ color: "#000", fontWeight: "500", fontSize: "13px", width: "50px" }}>
                            ที่
                          </th>
                          <th style={{ color: "#000", fontWeight: "500", fontSize: "13px" }}>
                            ชื่อโต๊ะ
                          </th>
                          <th style={{ color: "#000", fontWeight: "500", fontSize: "13px" }}>
                            ประเภทโต๊ะ
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {tables.map((table, i) => (
                          <tr
                            key={table.table_id}
                            onClick={() => handleSelectTable(table)}
                            style={{ cursor: "pointer" }}
                            className={selected?.table_id === table.table_id ? "table-active" : ""}
                          >
                            <td className="text-muted" style={{ fontSize: "13px" }}>
                              {i + 1}
                            </td>
                            <td className="fw-semibold" style={{ fontSize: "14px" }}>
                              {table.table_name}
                            </td>
                            <td style={{ fontSize: "13px" }}>{getTypeName(table)}</td>
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

export default ManageTable;