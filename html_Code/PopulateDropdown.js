

export async function PopulateDropdown_Phones(){
    try{
        const res_get=await fetch('http://localhost:5000/Phones_View');
        const res_data=await res_get.json();
const uniqueBrands=new Set();
const uniqueModels=new Set();
const uniqueModelsNo=new Set();
          res_data.forEach( e=> {
            if(!uniqueBrands.has(e.Brand)){
                uniqueBrands.add(e.Brand);

          const option2=document.createElement("option");
          option2.value=e.Brand;
          option2.textContent=e.Brand;
          document.getElementById("dropdown_brand")?.appendChild(option2);
            }
        });

       
        res_data.forEach( e=> {
            if(!uniqueModels.has(e.Model)){
                uniqueModels.add(e.Model);

          const option=document.createElement("option");
          option.value=e.Model,
          option.textContent=e.Model;
          document.getElementById("dropdown_model")?.appendChild(option);
            }
        });
          res_data.forEach( e=> {
            if(!uniqueModelsNo.has(e.Model_no)){
                uniqueModelsNo.add(e.Model_no);
          const option=document.createElement("option");
          option.value=e.Model_no,
          option.textContent=e.Model_no;
          document.getElementById("dropdown_modelNo")?.appendChild(option);
            }
        });


   
        // let dropMenu_brand="";
        // res_data.forEach(ele => {
        //   dropMenu_brand+=`<option value=${ele.phone_id}>${ele.brand}</option>`
        // });
        // document.getElementById("dropdown_brand").innerHTML=dropMenu_brand;
   }catch(err){
    console.log(err)
   }
  }
  export async function Sales_PopulateDropDown(){

       const Cust_res_get=await fetch('http://localhost:5000/Customers_View');
        const Cust_res_data=await Cust_res_get.json();
             Cust_res_data.forEach( e=> {
         
          const option=document.createElement("option");
          option.value=e.customer_id;
          option.textContent=e.customer_id;
          document.getElementById("dropdown_cust_ids")?.appendChild(option);
            });
             const emp_res_get=await fetch('http://localhost:5000/EMPLOYES_View');
        const emp_res_data=await emp_res_get.json();
             emp_res_data.forEach( e=> {
         
          const option2=document.createElement("option");
          option2.value=e.employ_id;
          option2.textContent=e.employe_id;
          document.getElementById("dropdown_emp_ids")?.appendChild(option2);
            });

      const res_get=await fetch('http://localhost:5000/Phones_View');
        const res_data=await res_get.json();
             res_data.forEach( e=> {
         
          const option3=document.createElement("option");
          option3.value=e.Model_no;
          option3.textContent=e.Model_no;
          document.getElementById("dropdown_modelNo")?.appendChild(option3);
            });
  }
//Customer Dropdown Populate
  export async function populateCustomersDropdown(){
const cust_data=await fetch('http://localhost:5000/Customers_View');
const res_cust_data=cust_data.json();

//Filling Customer ids  Dropdown
res_cust_data.forEach(e=>{
  const option_id=document.createElement("option");
  option_id.value=e.customer_id;
  option_id.textContent=e.customer_id;
  document.getElementById("drop-cust-id").appendChild(option_id);
})
//Filling Customer Names
res_cust_data.forEach(e=>{
  const option_names=document.createElement("option");
  option_names.value=concat(e.fname+" "+e.lname);
  option_names.textContent=concat(e.fname+" "+e.lname);
  document.getElementById("drop-cust-id").appendChild(option_names);
})
  }