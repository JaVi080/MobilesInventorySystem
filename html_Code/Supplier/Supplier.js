  
  //for dropdoown cities
 async function cities_supp() {
    const res = await fetch('http://localhost:5000/api/Suppliers_View?param=all');
    const data = await res.json();

    const cities = [...new Set(data.map(e => e.city))]; // unique cities array (lowercase)

    const dropdown = document.getElementById("dropdown_brand");

    cities.forEach(city => {
        const option = document.createElement("option");
        option.value = city;
        option.textContent = city;
        dropdown.appendChild(option);
    });
}

cities_supp();

//Inserting DATA
const act_form=document.getElementById("Supplier_form")?.addEventListener("submit",async (e)=>{
    e.preventDefault();

    const formdata=new FormData(e.target);
    const data={};
    for(let[key,values] of formdata.entries()){
        data[key]=values.trim();
    }
    try{
      const res=await fetch('http://localhost:5000/api/AddSuppliers',{
          method:"POST",
          headers:{"Content-type":"application/json"},
          body:JSON.stringify(data)
      });
      const res_data=await res.json();
      if(res_data.success){
          alert("Data of Suppliers saved");
          document.getElementById("Supplier_form").reset();
      } else {
          alert("Error: " + (res_data.error || "unknown"));
      }
    } catch(err){
      console.log(err.message+" Req Failed");
    }
});

// Supplier editing logic, copied from Phones edit workflow
let selected_row = null;
let editMode = false;

const suppliersTableBody = document.getElementById("phonesTableBody");
const editSuppBtn = document.getElementById("edit-supp-btn");
const saveSuppBtn = document.getElementById("save-supp-info");

suppliersTableBody?.addEventListener("dblclick", e => {
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

editSuppBtn?.addEventListener("click", () => {
  editMode = true;
  alert("Edit mode enabled. Double-click a row to select it for editing.");
});

saveSuppBtn?.addEventListener("click", async () => {
  if (!selected_row) {
    alert("Double-click a row first to select it.");
    return;
  }
  if (!editMode) {
    alert("Click 'Edit Info' before saving.");
    return;
  }

  const supplier_id = selected_row.querySelector("td").innerText.trim();
  const update_data = {};

  selected_row.querySelectorAll("td").forEach((cell, index) => {
    const old_val = cell.dataset.original;
    const new_val = cell.innerText.trim();
    if (index === 0) {
      return;
    }
    if (old_val !== new_val) {
      const column_n = cell.dataset.column_n;
      if (column_n === "supplier_name") {
        const { first, last } = splitSupplierName(new_val);
        update_data.contact_person_fName = first;
        update_data.contact_person_lName = last;
      } else if (column_n) {
        update_data[column_n] = new_val;
      }
    }
  });

  if (Object.keys(update_data).length === 0) {
    alert("No changes detected.");
    return;
  }

  const res_data = await update_database_supplier(supplier_id, update_data);
  if (res_data && res_data.success) {
    alert(res_data.message || "Supplier info saved.");
    selected_row.querySelectorAll("td").forEach(td => {
      td.contentEditable = false;
      td.dataset.original = td.innerText.trim();
    });
    selected_row.classList.remove("editing_row");
    editMode = false;
  }
});

function splitSupplierName(fullName) {
  const parts = fullName.trim().split(/\s+/);
  const first = parts.shift() || "";
  const last = parts.join(" ") || "";
  return { first, last };
}

async function update_database_supplier(supplier_id, data) {
  try {
    const res = await fetch('http://localhost:5000/api/UpdateSuppliers', {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ supplier_id, update_data: data })
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
  res_data.forEach(supplier => {
    const supplierName = `${supplier.contact_person_fName || ''} ${supplier.contact_person_lName || ''}`.trim();
    html += `
      <tr>
        <td data-column_n="supplier_id" data-original="${supplier.supplier_id}">${supplier.supplier_id}</td>
        <td data-column_n="supplier_name" data-original="${supplierName}">${supplierName}</td>
        <td data-column_n="Company_Name" data-original="${supplier.Company_Name || ''}">${supplier.Company_Name || ''}</td>
        <td data-column_n="supply_type" data-original="${supplier.supply_type || ''}">${supplier.supply_type || ''}</td>
        <td data-column_n="city" data-original="${supplier.city || ''}">${supplier.city || ''}</td>
        <td data-column_n="country" data-original="${supplier.country || ''}">${supplier.country || ''}</td>
        <td data-column_n="email" data-original="${supplier.email || ''}">${supplier.email || ''}</td>
        <td data-column_n="phone_no_1" data-original="${supplier.phone_no_1 || ''}">${supplier.phone_no_1 || ''}</td>
        <td data-column_n="phone_no_2" data-original="${supplier.phone_no_2 || ''}">${supplier.phone_no_2 || ''}</td>
        <td data-column_n="Address" data-original="${supplier.Address || ''}">${supplier.Address || ''}</td>
        <td data-column_n="date_added" data-original="${supplier.date_added ? new Date(supplier.date_added).toLocaleDateString() : ''}">${supplier.date_added ? new Date(supplier.date_added).toLocaleDateString() : ''}</td>
        <td data-column_n="last_updated" data-original="${supplier.last_updated ? new Date(supplier.last_updated).toLocaleDateString() : ''}">${supplier.last_updated ? new Date(supplier.last_updated).toLocaleDateString() : ''}</td>
      </tr>`;
  });
  tbody.innerHTML = html;
}

async function viewData(str) {
  try {
    const res_get = await fetch(`http://localhost:5000/api/Suppliers_View?param=${str}`);
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
    const supplier_id = document.getElementById('supplier_id').value.trim();
    const supplier_name = document.getElementById('supplier_name').value.trim().toLowerCase();
    const supplier_city = document.getElementById('supplier_city').value.trim().toLowerCase();

    const res_get = await fetch('http://localhost:5000/api/Suppliers_View');
    const res_data = await res_get.json();
    const filtered = res_data.filter(supplier => {
      const fullName = `${supplier.contact_person_fName || ''} ${supplier.contact_person_lName || ''}`.trim().toLowerCase();
      const city = (supplier.city || '').toLowerCase();
      const id = (supplier.supplier_id || '').toString();

      const matchId = supplier_id ? id === supplier_id : true;
      const matchName = supplier_name ? fullName.includes(supplier_name) : true;
      const matchCity = supplier_city ? city.includes(supplier_city) : true;

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
  document.getElementById('supplier_id').value = "";
  document.getElementById('supplier_name').value = "";
  document.getElementById('supplier_city').value = "";
  viewData("all");
});

const view_button=document.getElementById("view_Supp_Info")?.addEventListener("click",()=>{
  viewData("all");
});