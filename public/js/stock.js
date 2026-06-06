
import { PopulateDropDown , PopulateDropdown_Phones} from "./populateDropdown.js";
PopulateDropDown();
PopulateDropdown_Phones();

       //Searching Specific Phone Data
const search=document.getElementById("submit_btn")?.addEventListener("click",async()=>{
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
      <td data-column_n="stock_id" data-original="${stock.stock_id}">${stock.stock_id}</td>
      <td data-column_n="Brand" data-original="${stock.Brand}">${stock.Brand}</td>
      <td data-column_n="Model" data-original="${stock.Model}">${stock.Model}</td>
      <td data-column_n="model_no" data-original="${stock.model_no}">${stock.model_no}</td>
      <td data-column_n="supplier_name" data-original="${stock.supplier_name || ''}">${stock.supplier_name || ''}</td>
      <td data-column_n="Stock_in_Quantity" data-original="${stock.Stock_in_Quantity || ''}">${stock.Stock_in_Quantity || ''}</td>
      <td data-column_n="price_mb" data-original="${stock.price_mb || ''}">${stock.price_mb || ''}</td>
      <td data-column_n="scnd_hand" data-original="${stock.scnd_hand || ''}">${stock.scnd_hand || ''}</td>
      <td data-column_n="date_added" data-original="${new Date(stock.date_added).toLocaleDateString()}">${new Date(stock.date_added).toLocaleDateString()}</td>

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

stockTableBody.addEventListener("dblclick", e => {
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
  tr.classList.add("selected_row");
  tr.classList.add("editing_row");

  const cells = tr.querySelectorAll("td");
  cells.forEach(cell => {
    if (cell.dataset.column_n === "stock_id" || cell.dataset.column_n === "date_added") {
      return; // Skip ID and date fields
    }
    const originalValue = cell.dataset.original;
    const currentValue = cell.innerText;
    cell.innerHTML = `<input type="text" value="${currentValue}" />`;
  });
});

edit_btn?.addEventListener("click", () => {
  editMode = !editMode; //togle button logic
  edit_btn.textContent = editMode ? "Cancel Edit" : "Edit Info";
  edit_btn.style.backgroundColor = editMode ? "#ff6b6b" : "#4CAF50";

  if (!editMode && selected_row) {
    selected_row.classList.remove("selected_row");
    selected_row.classList.remove("editing_row");
    selected_row = null;
  }
});

save_btn?.addEventListener("click", async () => {
  if (!selected_row) {
    alert("Please select a row to save");
    return;
  }

  const cells = selected_row.querySelectorAll("td");
  const updateData = {};
  cells.forEach(cell => {
    const input = cell.querySelector("input");
    if (input) {
      updateData[cell.dataset.column_n] = input.value;
    }
  });

  try {
    const stock_id = selected_row.querySelector("td").innerText;
    const res = await secureFetch('http://localhost:5000/api/Stock_Update', {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stock_id, ...updateData })
    });

    const result = await res.json();
    if (result.success) {
      alert("Stock updated successfully");
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

