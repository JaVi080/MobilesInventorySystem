

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
    const res = await fetch('http://localhost:5000/UpdatePhones', {
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
