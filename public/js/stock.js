
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
    const brand = document.getElementById('dropdown_brand')?.value || "";
    const modelNo = document.getElementById('dropdown_modelNo')?.value || "";
    const supplier = document.getElementById('dropdown_supplier')?.value || "";
    const stock_id = document.getElementById('stock_id')?.value || "";
    
    console.log({ brand, modelNo, supplier, stock_id });

    const res = await secureFetch('http://localhost:5000/api/Stock_Filter', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stockId: stock_id, brand, modelNo, supplier })
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
      <td data-column_n="supplier_id" data-original="${stock.supplier_id || ''}">${stock.supplier_id || ''}</td>
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
  const stockId = document.getElementById('purchased_id');
  const brand= document.getElementById('dropdown_brand');
  const modelNo = document.getElementById('dropdown_modelNo');
  const supplier = document.getElementById('dropdown_supplier');
  if (stockId) stockId.value = "";
  if (brand) brand.value = "";
  if (modelNo) modelNo.value = "";
  if (supplier) supplier.value = "";
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
    if (td.dataset.column_n === "purchased_id" || td.dataset.column_n === "stock_in_date" || td.dataset.column_n === "supplier_name" ||
      td.dataset.column_n === "Brand"|| td.dataset.column_n === "Model") {
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

//   cell = the actual <td> element (the box itself)
// index = position number — 0, 1, 2... (just which cell it is in order)
// cell.dataset.column_n = the column name stored inside that cell
  const updateData = {};
  selected_row.querySelectorAll("td").forEach((cell) => {
    if (cell.dataset.column_n === "purchased_id" || cell.dataset.column_n === "stock_in_date" || cell.dataset.column_n === "supplier_name"
      || cell.dataset.column_n === "Brand" || cell.dataset.column_n === "Model"
    ) {
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
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stock_id, updateData: updateData })
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
      viewData();
    } else {
      alert("Error: " + (result.error || "Update failed"));
    }
  } catch (e) {
    console.log(e.message);
    alert("Error updating stock");
  }
});

