
 //Inserting DATA
const act_form=document.getElementById("Sale_form")?.addEventListener("submit",async (e)=>{
    e.preventDefault();
  
    // const P_model=document.getElementById("Model").value.trim(); 

    const formdata=new FormData(e.target);
    const data={};
    for(let[key,values] of formdata.entries()){
        data[key]=values.trim();
    }
    console.log(data);
    try{
    const res=await secureFetch('http://localhost:5000/api/Sales',{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        // body:JSON.stringify({P_name,P_model,brand})
        body:JSON.stringify(data)
    });
    const res_data=await res.json();
    if(res_data.success){
        console.log("hello there")
        alert("Saled Successfully");
        document.getElementById("Sale_form").reset();
    }else{
        alert("Error"+(res_data.error()||"unknown"));
        console.log("error");
    }
}catch(err){
    console.log(err.message+"Req Failed");
}
});


const salesTableBody = document.getElementById('salesTableBody');
const editSalesBtn = document.getElementById('edit-sales-btn');
const saveSalesBtn = document.getElementById('save-sales-info');
const viewAllBtn = document.getElementById('view_sales_btn');

let selectedRow = null;
let editMode = false;

viewAllBtn?.addEventListener('click', () => {
  viewData('all');
});

salesTableBody?.addEventListener('dblclick', e => {
  if (!editMode) {
    alert("Click 'Edit Info' first, then double-click a row to select it.");
    return;
  }

  const tr = e.target.closest('tr');
  if (!tr) {
    return;
  }

  if (selectedRow) {
    selectedRow.classList.remove('selected_row', 'editing_row');
  }

  selectedRow = tr;
  selectedRow.classList.add('selected_row', 'editing_row');

  selectedRow.querySelectorAll('td').forEach((td, index) => {
    const nonEditableIndexes = [0, 1, 2, 3];
    td.dataset.original = td.innerText.trim();
    if (nonEditableIndexes.includes(index)) {
      td.contentEditable = false;
    } else {
      td.contentEditable = true;
    }
  });
});

editSalesBtn?.addEventListener('click', () => {
  editMode = true;
  alert("Edit mode enabled. Double-click a row to select it for editing.");
});

saveSalesBtn?.addEventListener('click', async () => {
  if (!selectedRow) {
    alert('Double-click a row first to select it.');
    return;
  }
  if (!editMode) {
    alert("Click 'Edit Info' before saving.");
    return;
  }

  const sales_id = selectedRow.querySelector('td').innerText.trim();
  const update_data = {};

  selectedRow.querySelectorAll('td').forEach((cell, index) => {
    const original = cell.dataset.original;
    const current = cell.innerText.trim();
    if (original === current) {
      return;
    }
    const column_n = cell.dataset.column_n;
    if (!column_n) {
      return;
    }
    update_data[column_n] = current;
  });

  if (Object.keys(update_data).length === 0) {
    alert('No changes detected.');
    return;
  }

  const res_data = await updateSalesRecord(sales_id, update_data);
  if (res_data && res_data.success) {
    alert(res_data.message || 'Sales info saved.');
    selectedRow.querySelectorAll('td').forEach(td => {
      td.contentEditable = false;
      td.dataset.original = td.innerText.trim();
    });
    selectedRow.classList.remove('editing_row');
    editMode = false;
    recalcRow(selectedRow);
  }
});

function recalcRow(row) {
  const quantity = parseFloat(row.querySelector('td[data-column_n="No_Phones_Sales"]').innerText.trim()) || 0;
  const sellingPrice = parseFloat(row.querySelector('td[data-column_n="selling_price"]').innerText.trim()) || 0;
  const deposit = parseFloat(row.querySelector('td[data-column_n="Deposit"]').innerText.trim()) || 0;
  const totalPrice = (quantity * sellingPrice).toFixed(2);
  const pendingAmount = (quantity * sellingPrice - deposit).toFixed(2);
  row.querySelector('td[data-column_n="total_price"]').innerText = totalPrice;
  row.querySelector('td[data-column_n="pending_amount"]').innerText = pendingAmount;
}

async function updateSalesRecord(sales_id, update_data) {
  try {
    const res = await secureFetch('http://localhost:5000/api/UpdateSales', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sales_id, update_data })
    });
    const data = await res.json();
    if (!data.success) {
      alert('Error: ' + (data.error || 'unknown'));
    }
    return data;
  } catch (err) {
    console.log(err.message + ' Req Failed');
    alert('Failed to save changes.');
    return null;
  }
}

function displayRows(data) {
  if (!salesTableBody) return;
  let html = '';
  data.forEach(item => {
    html += `
      <tr>
        <td data-column_n="sales_id">${item.sales_id}</td>
        <td data-column_n="customer_name">${item.customer_name || ''}</td>
        <td data-column_n="SalesPerson_id">${item.Employee_ID}</td>
        <td data-column_n="mb_model_no">${item.mb_model_no || ''}</td>
        <td data-column_n="No_Phones_Sales">${item.No_Phones_Sales}</td>
        <td data-column_n="selling_price">${parseFloat(item.selling_price).toFixed(2)}</td>
        <td data-column_n="Deposit">${parseFloat(item.Deposit).toFixed(2)}</td>
        <td data-column_n="total_price">${parseFloat(item.total_price).toFixed(2)}</td>
        <td data-column_n="pending_amount">${parseFloat(item.pending_amount).toFixed(2)}</td>
        <td data-column_n="Quality">${item.Quality || ''}</td>
        <td data-column_n="sales_date">${item.sales_date ? new Date(item.sales_date).toLocaleString() : ''}</td>
      </tr>`;
  });
  salesTableBody.innerHTML = html;
}

async function viewData(param = 'all') {
  try {
    const res = await secureFetch(`http://localhost:5000/api/Sales_View?param=${param}`);
    const data = await res.json();
    if (Array.isArray(data)) {
      displayRows(data);
    }
  } catch (err) {
    console.log(err.message);
  }
}

viewData();

async function filterSales() {
    const sales_id   = document.getElementById('filter_sales_id').value.trim();
    const emp_id     = document.getElementById('filter_emp_id').value.trim();
    const cust_name  = document.getElementById('filter_cust_name').value.trim();
    const from_date  = document.getElementById('filter_from_date').value;
    const to_date    = document.getElementById('filter_to_date').value;
console.log("abi tk tu chal raha hai");
    const body = {};
    if (sales_id)  body.sales_id  = sales_id;
    if (emp_id)    body.emp_id    = emp_id;
    if (cust_name) body.cust_name = cust_name;
    if (from_date) body.from_date = from_date;
    if (to_date)   body.to_date   = to_date;

    try {
        const res = await secureFetch('/api/Sales_Filter', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        const data = await res.json();
        displayRows(data);  // your existing function that renders rows
    } catch (err) {
        console.log('Filter error:', err);
    }
}

document.getElementById('search_btn')?.addEventListener('click', filterSales);

document.getElementById('reset_btn')?.addEventListener('click', () => {
    document.getElementById('filter_sales_id').value = '';
    document.getElementById('filter_emp_id').value = '';
    document.getElementById('filter_cust_name').value = '';
    document.getElementById('filter_from_date').value = '';
    document.getElementById('filter_to_date').value = '';
    viewData('all');
});
