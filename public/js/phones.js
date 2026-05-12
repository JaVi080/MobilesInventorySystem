
 import { PopulateDropdown_Phones } from "./PopulateDropdown.js";
    PopulateDropdown_Phones();
    //load first all data first 10 rows 
     async function viewData () {
      try {
        const res_get = await secureFetch('http://localhost:5000/api/Phones_View');
        const res_data = await res_get.json();//.json() is a method on the Response object.
        // It reads the response body and parses it as JSON.
        //Now res_data is the actual data 
        const tbody = document.getElementById("phonesTableBody");
        tbody.innerHTML = "";
        console.log("hello there buddy");
        console.log(res_data);

        console.log(res_data[0]?.model);
        if (res_data.length > 0) {
          display_data(tbody, res_data);
          console.log("sUCCESS Retrieve");
        } else {
          console.log("error");
        }

      } catch (err) {
        console.log(err);
      }
    }
//10 records will be shown by default when the page loads
  viewData();
    //Searching Specific Phone Data

    const search = document.getElementById("search_btn")?.addEventListener("click", async () => {
      try {
        const brand = document.getElementById('dropdown_brand').value;
        const Model = document.getElementById('dropdown_model').value;
        const ModelNo = document.getElementById('dropdown_modelNo').value;
        const phone_id = document.getElementById('phone_id').value;
        console.log(brand);
        const res = await secureFetch('http://localhost:5000/api/Phones_Filter', {
          method: "POST",
          headers: { "Content-type": "application/json" },
          // body:JSON.stringify({P_name,P_model,brand})
          body: JSON.stringify({ phoneId: phone_id, brand, Model, ModelNo })
        });
        const res_data = await res.json();
        const tbody = document.getElementById("phonesTableBody");
        tbody.innerHTML = "";
        if (res_data.length > 0) {
          display_data(tbody, res_data);
          console.log("sUCCESS Retrieve");
        } else {
          console.log("error");
        }

      } catch (e) {
        console.log(e.message);
      }
    })

    //function for displayin data
    function display_data(tbody, res_data) {
      let html = "";
      res_data.forEach(phone => {
        html += `
       <tr>
        <td data-column_n="phone_id" data-original="${phone.phone_id}">${phone.phone_id}</td>
      <td data-column_n="Brand" data-original="${phone.Brand}">${phone.Brand}</td>
      <td data-column_n="Model" data-original="${phone.Model}">${phone.Model}</td>
      <td data-column_n="Model_no" data-original="${phone.Model_no}">${phone.Model_no}</td>
      <td data-column_n="os" data-original="${phone.os || ''}">${phone.os || ''}</td>
      <td data-column_n="Processor" data-original="${phone.Processor || ''}">${phone.Processor || ''}</td>
      <td data-column_n="p_storage_gb" data-original="${phone.p_storage_gb || ''}">${phone.p_storage_gb || ''}</td>
      <td data-column_n="warranty_period" data-original="${phone.warranty_period || ''}">${phone.warranty_period || ''}</td>
      <td data-column_n="base_price" data-original="${phone.base_price || ''}">${phone.base_price || ''}</td>
      <td data-column_n="total_stock" data-original="${phone.Total_Stock || ''}">${phone.Total_Stock || ''}</td>
      <td data-column_n="scnd_hand_mb" data-original="${phone.scnd_hand_mb || ''}">${phone.scnd_hand_mb || ''}</td>
      <td data-column_n="date_added" data-original="${new Date(phone.date_added).toLocaleDateString()}">${new Date(phone.date_added).toLocaleDateString()}</td>
      <td data-column_n="last_updated" data-original="${new Date(phone.last_updated).toLocaleDateString()}">${new Date(phone.last_updated).toLocaleDateString()}</td>
    </tr>
          `;
      });

      tbody.innerHTML = html;
    }

    //View all Phones
    const view_button = document.getElementById("view_btn")?.addEventListener("click", async () => {
      try {
        const res_get = await secureFetch('http://localhost:5000/api/Phones_View?param=all');
        const res_data = await res_get.json();
        const tbody = document.getElementById("phonesTableBody");
        tbody.innerHTML = "";
        console.log("hello there buddy");
        console.log(res_data);

        if (res_data.length > 0) {
          display_data(tbody, res_data);
          console.log("sUCCESS Retrieve");
        } else {
          console.log("error");
        }
        // Display data
        // let html = "";
        //   res_data.forEach(phone => {
        //     html += `<tr><td>${phone.Brand}</td><td>${phone.Model}</td><td>${phone.Model_no}</td><td>${phone.OS||''}</td>
        //    <td>${phone.warranty_period||''}</td> <td>${phone.base_price||''}</td>
        //     <td>${phone.Total_Stock||''}</td> <td>${phone.scnd_hand_mb||''}</td>
        //     <td>${new Date(phone.date_added).toLocaleDateString()}</td><td>${new Date(phone.last_updated).toLocaleDateString()}</td></tr>`;
        //   });

        //   tbody.innerHTML = html;

      } catch (err) {
        console.log(err);
      }
    });
//restting button
    document.getElementById("reset_btn")?.addEventListener("click", () => {
      document.getElementById('dropdown_brand').value = "";
      document.getElementById('dropdown_model').value = "";
      document.getElementById('dropdown_modelNo').value = "";
      document.getElementById('phone_id').value = "";
      viewData(); // Refresh the table to show all data
    });


// Update Phones JS Code
console.log('in pones js file')
let selected_row = null;
let editMode = false;

const phonesTableBody = document.getElementById("phonesTableBody");
const edit_btn = document.getElementById("edit-phone-btn");
const save_btn = document.getElementById("save-phone-info");

phonesTableBody.addEventListener("dblclick", e => {
  if (!editMode) {
    alert("Click 'Edit Info' first, then double-click a row to edit.");
    return;
  }

  const tr = e.target.closest("tr");
  if (!tr) {
    return;
  }

  if (selected_row) {
    selected_row.classList.remove("selected_row");
    selected_row.classList.remove("editing_row");
  }

  selected_row = tr;
  selected_row.classList.add("selected_row");
  selected_row.classList.add("editing_row");
// index is the position number of each td in the loop, starting from 0. 

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

edit_btn.addEventListener("click", () => {
  editMode = true;
  alert("Edit mode enabled. Double-click a row to select it for editing.");
});

save_btn.addEventListener("click", async () => {
  if (!selected_row) {
    alert("Double-click a row first to select it.");
    return;
  }
  if (!editMode) {
    alert("Click 'Edit Info' before saving.");
    return;
  }

  const phone_id = selected_row.querySelector("td").innerText.trim();
  const update_data = {};

  selected_row.querySelectorAll("td").forEach((cell, index) => {
    const old_val = cell.dataset.original;
    const new_val = cell.innerText.trim();
    if (index === 0) {
      return;
    }
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

  const res_data = await update_database(phone_id, update_data);
  if (res_data && res_data.success) {
    alert(res_data.message || "Info saved.");
    selected_row.querySelectorAll("td").forEach(td => {
      td.contentEditable = false;
      td.dataset.original = td.innerText.trim();
    });
    selected_row.classList.remove("editing_row");
    editMode = false;
  }
});

async function update_database(phone_id, data) {
  try {
    const res = await secureFetch('http://localhost:5000/api/UpdatePhones', {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone_id: phone_id,
        update_data: data
      })
    });
    const res_data = await res.json();
    if (res_data.success) {
      console.log(res_data.message);
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
