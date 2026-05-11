// for dropdown cities


// Inserting DATA
const act_form = document.getElementById("Customer_form")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formdata = new FormData(e.target);
  const data = {};
  for (let [key, values] of formdata.entries()) {
    data[key] = values.trim();
  }
  try {
    const res = await secureFetch('http://localhost:5000/api/AddCustomers', {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(data)
    });
    const res_data = await res.json();
    if (res_data.success) {
      alert("Data of Customers saved");
      document.getElementById("Customer_form").reset();
    } else {
      alert("Error: " + (res_data.error || "unknown"));
    }
  } catch (err) {
    console.log(err.message + " Req Failed");
  }
});

// Customer editing logic, copied from Phones edit workflow
let selected_row = null;
let editMode = false;

const customersTableBody = document.getElementById("phonesTableBody");
const editCustBtn = document.getElementById("edit-cust-btn");
const saveCustBtn = document.getElementById("save-cust-info");

customersTableBody?.addEventListener("dblclick", e => {
  if (!editMode) {
    alert("Click 'Edit Info' first, then double-click a row to edit.");
    return;
  }

  const tr = e.target.closest("tr");
  if (!tr) {
    return;
  }

  if (selected_row) {
    selected_row.classList.remove("selected_row", "editing_row");
  }

  selected_row = tr;
  selected_row.classList.add("selected_row", "editing_row");

  selected_row.querySelectorAll("td").forEach((td, index) => {
    if (index === 0) {
      td.contentEditable = false;
      td.dataset.original = td.innerText.trim();
      return;
    }
    td.contentEditable = true;
    td.dataset.original = td.innerText.trim();
  });
});

editCustBtn?.addEventListener("click", () => {
  editMode = true;
  alert("Edit mode enabled. Double-click a row to select it for editing.");
});

saveCustBtn?.addEventListener("click", async () => {
  if (!selected_row) {
    alert("Double-click a row first to select it.");
    return;
  }
  if (!editMode) {
    alert("Click 'Edit Info' before saving.");
    return;
  }

  const customer_id = selected_row.querySelector("td").innerText.trim();
  const update_data = {};

  selected_row.querySelectorAll("td").forEach((cell, index) => {
    const old_val = cell.dataset.original;
    const new_val = cell.innerText.trim();
    if (index === 0) {
      return;
    }
    if (old_val !== new_val) {
      const column_n = cell.dataset.column_n;
      if (column_n === "customer_name") {
        const { first, last } = splitCustomerName(new_val);
        update_data.fName = first;
        update_data.lName = last;
      } else if (column_n) {
        update_data[column_n] = new_val;
      }
    }
  });

  if (Object.keys(update_data).length === 0) {
    alert("No changes detected.");
    return;
  }

  const res_data = await update_database_customer(customer_id, update_data);
  if (res_data && res_data.success) {
    alert(res_data.message || "Customer info saved.");
    selected_row.querySelectorAll("td").forEach(td => {
      td.contentEditable = false;
      td.dataset.original = td.innerText.trim();
    });
    selected_row.classList.remove("editing_row");
    editMode = false;
  }
});

function splitCustomerName(fullName) {
  const parts = fullName.trim().split(/\s+/);
  const first = parts.shift() || "";
  const last = parts.join(" ") || "";
  return { first, last };
}

async function update_database_customer(customer_id, data) {
  try {
    const res = await secureFetch('http://localhost:5000/api/UpdateCustomers', {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customer_id, update_data: data })
    });
    const res_data = await res.json();
    if (res_data.success) {
      return res_data;
    }
    alert("Error: " + (res_data.error || "unknown"));
    return res_data;
  } catch (err) {
    console.log(err.message + " Req of Updating Failed");
    alert("Failed to save changes.");
    return null;
  }
}

function display_data(tbody, res_data) {
  let html = "";
  res_data.forEach(customer => {
    const customerName = `${customer.fName || ''} ${customer.lName || ''}`.trim();
    html += `
      <tr>
        <td data-column_n="customer_id" data-original="${customer.customer_id}">${customer.customer_id}</td>
        <td data-column_n="customer_name" data-original="${customerName}">${customerName}</td>
        <td data-column_n="city" data-original="${customer.city || ''}">${customer.city || ''}</td>
        <td data-column_n="email" data-original="${customer.email || ''}">${customer.email || ''}</td>
        <td data-column_n="phone_no" data-original="${customer.phone_no || ''}">${customer.phone_no || ''}</td>
        <td data-column_n="Address" data-original="${customer.Address || ''}">${customer.Address || ''}</td>
        <td data-column_n="date_added" data-original="${customer.date_added ? new Date(customer.date_added).toLocaleDateString() : ''}">${customer.date_added ? new Date(customer.date_added).toLocaleDateString() : ''}</td>
        <td data-column_n="last_updated" data-original="${customer.last_updated ? new Date(customer.last_updated).toLocaleDateString() : ''}">${customer.last_updated ? new Date(customer.last_updated).toLocaleDateString() : ''}</td>
      </tr>`;
  });
  tbody.innerHTML = html;
}

async function viewData(str) {
  try {
    const res_get = await secureFetch(`http://localhost:5000/api/Customers_View?param=${str}`);
    const res_data = await res_get.json();
    const tbody = document.getElementById("phonesTableBody");
    tbody.innerHTML = "";
    if (res_data.length > 0) {
      display_data(tbody, res_data);
    }
  } catch (err) {
    console.log(err);
  }
}
viewData("notall");

const searchBtn = document.getElementById("search_btn");
const resetBtn = document.getElementById("reset_btn");

searchBtn?.addEventListener("click", async () => {
  try {
    const customer_id = document.getElementById('customer_id').value.trim();
    const customer_name = document.getElementById('customer_name').value.trim().toLowerCase();
    const customer_city = document.getElementById('dropdown_city').value.trim().toLowerCase();

    const res_get = await secureFetch('http://localhost:5000/api/Customers_View?param=all');
    const res_data = await res_get.json();
    const filtered = res_data.filter(customer => {
      const fullName = `${customer.fName || ''} ${customer.lName || ''}`.trim().toLowerCase();
      const city = (customer.city || '').toLowerCase();
      const id = (customer.customer_id || '').toString();

      const matchId = customer_id ? id === customer_id : true;
      const matchName = customer_name ? fullName.includes(customer_name) : true;
      const matchCity = customer_city ? city.includes(customer_city) : true;

      return matchId && matchName && matchCity;
    });

    const tbody = document.getElementById("phonesTableBody");
    tbody.innerHTML = "";
    display_data(tbody, filtered);
  } catch (err) {
    console.log(err);
  }
});

resetBtn?.addEventListener("click", () => {
  document.getElementById('customer_id').value = "";
  document.getElementById('customer_name').value = "";
  document.getElementById('dropdown_city').selectedIndex = 0;
  viewData("all");
});

const view_button = document.getElementById("view_cust_Info")?.addEventListener("click", () => {
  viewData("all");
});


