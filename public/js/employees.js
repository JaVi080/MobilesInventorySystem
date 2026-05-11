// Employees JS Code
let selected_row = null;
let editMode = false;

const employeesTableBody = document.getElementById("employeesTableBody");
const edit_btn = document.getElementById("edit-emp-btn");
const save_btn = document.getElementById("save-emp-info");
const view_btn = document.getElementById("view_btn");
const search_btn = document.getElementById("search_btn");
const reset_btn = document.getElementById("reset_btn");

async function loadData(url = '/api/EMPLOYES_View', options = {}) {
  try {
    const res = await secureFetch(url, options);
    const data = await res.json();
    display_data(employeesTableBody, data);
  } catch (err) {
    console.log(err);
  }
}

// Initial load
loadData('/api/EMPLOYES_View');

function display_data(tbody, data) {
  let html = "";
  if (!Array.isArray(data)) return;
  data.forEach(emp => {
    html += `
      <tr>
        <td data-column_n="employe_id" data-original="${emp.employe_id}">${emp.employe_id}</td>
        <td data-column_n="fName" data-original="${emp.fName || ''}">${emp.fName || ''}</td>
        <td data-column_n="lName" data-original="${emp.lName || ''}">${emp.lName || ''}</td>
        <td data-column_n="DOB" data-original="${emp.DOB ? emp.DOB.split('T')[0] : ''}">${emp.DOB ? emp.DOB.split('T')[0] : ''}</td>
        <td data-column_n="city" data-original="${emp.city || ''}">${emp.city || ''}</td>
        <td data-column_n="email" data-original="${emp.email || ''}">${emp.email || ''}</td>
        <td data-column_n="phone_no" data-original="${emp.phone_no || ''}">${emp.phone_no || ''}</td>
        <td data-column_n="Address" data-original="${emp.Address || ''}">${emp.Address || ''}</td>
        <td data-column_n="position" data-original="${emp.position || ''}">${emp.position || ''}</td>
        <td data-column_n="Hiring_Date" data-original="${emp.Hiring_Date ? emp.Hiring_Date.split('T')[0] : ''}">${emp.Hiring_Date ? emp.Hiring_Date.split('T')[0] : ''}</td>
        <td data-column_n="salary" data-original="${emp.salary || ''}">${emp.salary || ''}</td>
        <td data-column_n="last_updated" data-original="${emp.last_updated ? new Date(emp.last_updated).toLocaleString() : ''}">${emp.last_updated ? new Date(emp.last_updated).toLocaleString() : ''}</td>
      </tr>
    `;
  });
  tbody.innerHTML = html;
}

view_btn?.addEventListener("click", () => {
  loadData('/api/EMPLOYES_View?param=all');
});

search_btn?.addEventListener("click", () => {
  const payload = {
    employe_id: document.getElementById("employe_id").value.trim(),
    emp_name: document.getElementById("emp_name").value.trim(),
    city: document.getElementById("city").value.trim(),
    min_salary: document.getElementById("min_salary").value.trim(),
    max_salary: document.getElementById("max_salary").value.trim()
  };
  
  loadData('/api/Employees_Filter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
});

reset_btn?.addEventListener("click", () => {
  document.getElementById("employe_id").value = "";
  document.getElementById("emp_name").value = "";
  document.getElementById("city").value = "";
  document.getElementById("min_salary").value = "";
  document.getElementById("max_salary").value = "";
  loadData('/api/EMPLOYES_View');
});

employeesTableBody?.addEventListener("dblclick", e => {
  if (!editMode) {
    alert("Click 'Edit Info' first, then double-click a row to edit.");
    return;
  }

  const tr = e.target.closest("tr");
  if (!tr) return;

  if (selected_row) {
    selected_row.classList.remove("selected_row", "editing_row");
  }

  selected_row = tr;
  selected_row.classList.add("selected_row", "editing_row");

  selected_row.querySelectorAll("td").forEach((td, index) => {
    // Make ID and last_updated non-editable
    if (index === 0 || index === 11) {
      td.contentEditable = false;
      return;
    }
    td.contentEditable = true;
  });
});

edit_btn?.addEventListener("click", () => {
  editMode = true;
  alert("Edit mode enabled. Double-click a row to select it for editing.");
});

save_btn?.addEventListener("click", async () => {
  if (!selected_row) {
    alert("Double-click a row first to select it.");
    return;
  }
  if (!editMode) {
    alert("Click 'Edit Info' before saving.");
    return;
  }

  const employe_id = selected_row.querySelector("td").innerText.trim();
  const update_data = {};

  selected_row.querySelectorAll("td").forEach((cell, index) => {
    if (index === 0 || index === 11) return;
    
    const old_val = cell.dataset.original;
    const new_val = cell.innerText.trim();
    
    if (old_val !== new_val) {
      const column_n = cell.dataset.column_n;
      if (column_n) {
        update_data[column_n] = new_val;
      }
    }
  });

  if (Object.keys(update_data).length === 0) {
    alert("No changes detected.");
    return;
  }

  try {
    const res = await secureFetch('/api/UpdateEmployee', {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ employe_id, update_data })
    });
    const res_data = await res.json();
    if (res_data.success) {
      alert(res_data.message || "Employee Info Updated");
      selected_row.querySelectorAll("td").forEach(td => {
        td.contentEditable = false;
        td.dataset.original = td.innerText.trim();
      });
      selected_row.classList.remove("editing_row");
      editMode = false;
    } else {
      alert("Error: " + (res_data.error || "unknown"));
    }
  } catch (err) {
    alert("Failed to save changes.");
  }
});
