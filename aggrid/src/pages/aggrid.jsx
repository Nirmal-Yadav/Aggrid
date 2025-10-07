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

  const [gridApi, setGridApi] = useState(null);
  const [rowData, setRowData] = useState(initialData.employees);
  const [nextId, setNextId] = useState(initialData.employees.length + 1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    department: "",
    position: "",
    salary: "",
    location: "",
    status: "active",
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
    if (!formData.firstName || !formData.lastName || !formData.email) {
      return alert("First Name, Last Name, and Email are required.");
    }

    const newEmployee = {
      id: nextId,
      ...formData,
      salary: Number(formData.salary) || 0,
    };

    setRowData((prev) => [newEmployee, ...prev]);
    setNextId((prev) => prev + 1);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      department: "",
      position: "",
      salary: "",
      location: "",
      status: "active",
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
            <div>
              <input
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
              <input
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
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
                name="department"
                placeholder="Department"
                value={formData.department}
                onChange={handleChange}
              />
              <input
                name="position"
                placeholder="Position"
                value={formData.position}
                onChange={handleChange}
              />
              <input
                name="salary"
                type="number"
                placeholder="Salary"
                value={formData.salary}
                onChange={handleChange}
              />
              <input
                name="location"
                placeholder="Location"
                value={formData.location}
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
            </div>
            <div>
              <button type="submit">Add Employee</button>
              <button type="button" onClick={handleDelete}>
                Delete Selected
              </button>
            </div>
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
