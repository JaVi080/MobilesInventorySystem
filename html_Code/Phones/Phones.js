

//Update Phones JS Code
console.log('in pones js file')
let selected_row = null;
document.getElementById("phonesTableBody").addEventListener("dblclick", e => {
  let tr = e.target.closest("tr")
  console.log("doble click");
  if (!tr) {
    alert("Double click the row for editing")
    return;
  } else {
    alert("got selected")
  }
  if (selected_row) selected_row.classList.remove("selected_row");
  selected_row = tr;
  tr.classList.add("selected_row");

})
//edit button
const edit_btn = document.getElementById("edit-phone-btn");
edit_btn.addEventListener("click", e => {
  console.log("editing")
  if (!selected_row) {
    alert("Double click row for selection");
    return;
  } else {
    alert("got edit selected")
  }
  [...selected_row.children].forEach(td => {
    td.contentEditable = true;//making content editable
    document.querySelectorAll("td").forEach((cell, index) => {
      cell.dataset.original = cell.innerText.trim();//dataset --permanent storage
    })
  }
  )
})

//saving the info in db 
document.getElementById("save-phone-info").addEventListener("click", async (e) => {
  let phone_id = selected_row.querySelector("td").innerText;
  console.log(phone_id);
  let update_data = {};
  selected_row.querySelectorAll("td").forEach((cell, index) => {
    let old_val = cell.dataset.original;
    let new_val = cell.innerText.trim();//dataset --permanent storage
    console.log("old value" + old_val);
    console.log("new value" + new_val);

    if (old_val != new_val) {
      //taking column name 
      console.log(new_val);
      console.log(old_val);

      let column_n = cell.dataset.column_n;
      update_data[column_n] = new_val;
    }
  });
  if (Object.keys(update_data).length > 0) {
    console.log("yes updating data")
    update_database(phone_id, update_data)
  }
})
async function update_database(phone_id, data) {
  try {
    const res = await fetch('http://localhost:5000/UpdatePhones', {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      // body:JSON.stringify({P_name,P_model,brand})
      body: JSON.stringify({
        phone_id: phone_id,
        update_data: data
      })
    });
    for (let d in data) {
      console.log(d + " its key " + data[d] + "its val");
    }
    const res_data = await res.json();
    if (res_data.success) {
      console.log(res_data.message);
      // alert("Data updated");
      return;
    } else {
      alert("Error" + (res_data.error() || "unknown"));
    }
  } catch (err) {
    console.log(err.message + "Req of Updating Failed");
  }
}
