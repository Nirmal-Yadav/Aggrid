import React, { useCallback, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import "/Users/nirmalyadav/Documents/react/Aggrid/aggrid/src/pages/aggrid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { initialData } from "./rowData";
import { columnDefs } from "./columnData";

function Aggrid() {
  ModuleRegistry.registerModules([AllCommunityModule]);

  const gridRef = useRef(null);

  const [rowData, setRowData] = useState(initialData);
  const [nextId, setNextId] = useState(21);
  const [gridApi, setGridApi] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    status: "active",
    revenue: "",
  });

  const defaultColDef = {
    resizable: true,
    sortable: true,
    filter: true,
    floatingFilter: true,
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email)
      return alert("Name and Email are required");

    const newRow = {
      id: nextId,
      ...formData,
      lastLogin: new Date().toISOString().slice(0, 10),
      revenue: Number(formData.revenue) || 0,
    };

    setRowData((prev) => [newRow, ...prev]);
    setNextId((prev) => prev + 1);
    setFormData({
      name: "",
      email: "",
      role: "",
      status: "active",
      revenue: "",
    });
  };

  const handleDelete = () => {
    const selected = gridRef.current.api.getSelectedRows();
    if (!selected || selected.length === 0)
      return alert("Select rows to delete.");
    const ids = new Set(selected.map((r) => r.id));
    setRowData((prev) => prev.filter((r) => !ids.has(r.id)));
    gridRef.current.api.deselectAll();
  };

  const onCellValueChanged = useCallback((params) => {
    const updated = params.data;
    setRowData((prev) =>
      prev.map((r) => (r.id === updated.id ? { ...updated } : r))
    );
  }, []);

  const onQuickFilter = (e) => {
    if (gridApi) {
      gridApi.setGridOption("quickFilterText", e.target.value);
    }
  };

  const onGridReady = (params) => {
    setGridApi(params.api);
  };

  return (
    <div className="root">
      <header className="header">
        <div className="controls">
          <input
            className="search"
            onChange={onQuickFilter}
            placeholder="Search..."
          />
          <form className="add-form" onSubmit={handleAdd}>
            <input
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              name="role"
              placeholder="Role"
              value={formData.role}
              onChange={handleChange}
            />
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="active">Active</option>
              <option value="paused">Paused</option>
            </select>
            <input
              name="revenue"
              placeholder="Revenue"
              type="number"
              value={formData.revenue}
              onChange={handleChange}
            />
            <button type="submit" onClick={handleAdd}>
              Add
            </button>
            <button type="button" onClick={handleDelete}>
              Delete Selected
            </button>
          </form>
        </div>
      </header>

      <section className="grid-container">
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          pagination={true}
          paginationPageSize={10}
          animateRows={true}
          onCellValueChanged={onCellValueChanged}
          rowSelection={{ mode: "multiRow" }}
          onGridReady={onGridReady}
          rowSelectionOptions={{ clickSelection: "checkboxOnly" }}
        />
      </section>
    </div>
  );
}

export default Aggrid;
