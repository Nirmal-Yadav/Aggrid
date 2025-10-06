import React, { useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "/Users/nirmalyadav/Documents/react/Aggrid/aggrid/src/pages/aggrid.css";
// import { initialData } from "./rowData";
import { columnDefs } from "./columnData";

function Aggrid() {
  const gridRef = useRef(null);

  //   const [rowData, setRowData] = useState(initialData);
  //   const [nextId, setNextId] = useState(21);

  const defaultColDef = {
    resizable: true,
    sortable: true,
    filter: true,
    floatingFilter: true,
  };

  return (
    <div className="root">
      <header className="header">
        <h1>Dashboard</h1>
        <div className="controls">
          <input className="search" placeholder="Search..." />
          <button>Add</button>
          <button>Delete Selected</button>
        </div>
      </header>

      <section className="grid-container">
        <AgGridReact
          ref={gridRef}
          //   rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
        />
      </section>
    </div>
  );
}

export default Aggrid;
