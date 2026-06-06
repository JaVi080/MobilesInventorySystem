
import { PopulateDropDown , PopulateDropdown_Phones} from "./populateDropdown.js";
PopulateDropDown();

       //Saving stock data
const submit=document.getElementById("submit_btn")?.addEventListener("click",async()=>{
    try{
        console.log("I am in search");
      const ModelNo=document.getElementById('dropdown_modelNo').value;
      const Supplier=document.getElementById('dropdown_supplier').value;
      const Quantity = document.getElementById("quantity").value;
      const Price = document.getElementById("price").value;
      const scnd_hand = document.getElementById('scnd_hand')?.checked || false;
      
      const res=await secureFetch('http://localhost:5000/api/Stock_in',{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ModelNo,Supplier,Quantity,Price,scnd_hand})
    });
    const data=await res.json();
          
             if(data.success){
        console.log("hello there")
        alert("Stock in");
 }else{
    console.log("error");
 }

    }catch(e){
console.log(e.message);
    }
  })

// Load all stock data on page load
async function viewData() {
  try {
    console.log("Loading stock data");
    const res_get = await secureFetch('http://localhost:5000/api/Stock_View');
    const res_data = await res_get.json();
    const tbody = document.getElementById("stockTableBody");
    tbody.innerHTML = "";
    console.log("Stock data loaded");
    console.log(res_data);

    if (res_data.length > 0) {
      display_data(tbody, res_data);
      console.log("SUCCESS Retrieve");
    } else {
      console.log("No stock data found");
    }

  } catch (err) {
    console.log(err);
  }
}

// Load data when page loads
viewData();

// Searching Specific Stock Data
const search = document.getElementById("search_btn")?.addEventListener("click", async () => {
  try {
    const brand = document.getElementById('dropdown_brand').value;
    const model = document.getElementById('dropdown_model').value;
    const supplier = document.getElementById('dropdown_supplier').value;
    const stock_id = document.getElementById('stock_id').value;
    
    console.log({ brand, model, supplier, stock_id });

    const res = await secureFetch('http://localhost:5000/api/Stock_Filter', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stockId: stock_id, brand, model, supplier })
    });
    
    const res_data = await res.json();
    const tbody = document.getElementById("stockTableBody");
    tbody.innerHTML = "";
    
    if (res_data.length > 0) {
      display_data(tbody, res_data);
      console.log("SUCCESS Retrieve");
    } else {
      console.log("No matching stock found");
    }

  } catch (e) {
    console.log(e.message);
  }
});

// Function for displaying data
function display_data(tbody, res_data) {
  let html = "";
  res_data.forEach(stock => {
    html += `
     <tr>
      <td data-column_n="purchased_id" data-original="${stock.purchase_id}">${stock.purchase_id}</td>
      <td data-column_n="Brand" data-original="${stock.Brand}">${stock.Brand}</td>
      <td data-column_n="Model" data-original="${stock.Model}">${stock.Model}</td>
      <td data-column_n="model_no" data-original="${stock.model_no}">${stock.model_no}</td>
      <td data-column_n="supplier_name" data-original="${stock.supplier_name || ''}">${stock.supplier_name || ''}</td>
      <td data-column_n="Stock_in_Quantity" data-original="${stock.Stock_in_Quantity || ''}">${stock.Stock_in_Quantity || ''}</td>
      <td data-column_n="price_mb" data-original="${stock.price_mb || ''}">${stock.price_mb || ''}</td>
      <td data-column_n="scnd_hand" data-original="${stock.scnd_hand || ''}">${stock.scnd_hand || ''}</td>
      <td data-column_n="stock_in_date" data-original="${new Date(stock.stock_in_date).toLocaleDateString()}">${new Date(stock.stock_in_date).toLocaleDateString()}</td>

    </tr>
    `;
  });

  tbody.innerHTML = html;
}

// View all Stock
const view_button = document.getElementById("view_btn")?.addEventListener("click", async () => {
  try {
    const res_get = await secureFetch('http://localhost:5000/api/Stock_View?param=all');
    const res_data = await res_get.json();
    const tbody = document.getElementById("stockTableBody");
    tbody.innerHTML = "";
    console.log("Loading all stock data");
    console.log(res_data);

    if (res_data.length > 0) {
      display_data(tbody, res_data);
      console.log("SUCCESS Retrieve");
    } else {
      console.log("No stock data available");
    }

  } catch (err) {
    console.log(err);
  }
});

// Reset button
document.getElementById("reset_btn")?.addEventListener("click", () => {
  document.getElementById('dropdown_brand').value = "";
  document.getElementById('dropdown_model').value = "";
  document.getElementById('dropdown_supplier').value = "";
  document.getElementById('stock_id').value = "";
  viewData(); // Refresh the table to show all data
});

// Edit Stock JS Code
console.log('in stock view js file');
let selected_row = null;
let editMode = false;

const stockTableBody = document.getElementById("stockTableBody");
const edit_btn = document.getElementById("edit-stock-btn");
const save_btn = document.getElementById("save-stock-info");

stockTableBody?.addEventListener("dblclick", e => {
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
    selected_row.querySelectorAll("td").forEach(td => td.contentEditable = false);
  }

  selected_row = tr;
  selected_row.classList.add("selected_row", "editing_row");

  selected_row.querySelectorAll("td").forEach((td, index) => {
    if (td.dataset.column_n === "stock_id" || td.dataset.column_n === "date_added") {
      td.contentEditable = false;
      td.dataset.original = td.innerText.trim();
      return;
    }
    td.contentEditable = true;
    td.dataset.original = td.innerText.trim();
  });
});

edit_btn?.addEventListener("click", () => {
  if (!editMode) {
    editMode = true;
    edit_btn.textContent = "Cancel Edit";
    edit_btn.style.backgroundColor = "#aa5353";
    return;
  }

  editMode = false;
  edit_btn.textContent = "Edit Info";
  edit_btn.style.backgroundColor = "#4CAF50";

  if (selected_row) {
    selected_row.classList.remove("selected_row", "editing_row");
    selected_row.querySelectorAll("td").forEach(td => td.contentEditable = false);
    selected_row = null;
  }
});

save_btn?.addEventListener("click", async () => {
  if (!selected_row) {
    alert("Please select a row to save");
    return;
  }
  if (!editMode) {
    alert("Click 'Edit Info' before saving.");
    return;
  }

  const updateData = {};
  selected_row.querySelectorAll("td").forEach((cell, index) => {
    if (cell.dataset.column_n === "stock_id" || cell.dataset.column_n === "date_added") {
      return;
    }
    const originalValue = cell.dataset.original?.trim();
    const newValue = cell.innerText.trim();
    if (originalValue !== newValue) {
      updateData[cell.dataset.column_n] = newValue;
    }
  });

  if (Object.keys(updateData).length === 0) {
    alert("No changes detected.");
    return;
  }

  try {
    const stock_id = selected_row.querySelector("td").innerText.trim();
    const res = await secureFetch('http://localhost:5000/api/Stock_Update', {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stock_id, ...updateData })
    });

    const result = await res.json();
    if (result.success) {
      alert("Stock updated successfully");
      selected_row.querySelectorAll("td").forEach(td => td.contentEditable = false);
      selected_row.classList.remove("editing_row", "selected_row");
      selected_row = null;
      editMode = false;
      edit_btn.textContent = "Edit Info";
      edit_btn.style.backgroundColor = "#4CAF50";
      viewData(); // Refresh the table
    }
  } catch (e) {
    console.log(e.message);
    alert("Error updating stock");
  }
});

