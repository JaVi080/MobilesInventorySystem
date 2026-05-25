
import { PopulateDropDown } from "./populateDropdown.js";
PopulateDropDown();

       //Searching Specific Phone Data
const search=document.getElementById("Stock_btn")?.addEventListener("click",async()=>{
    try{
      const ModelNo=document.getElementById('dropdown_modelNo').value;
        const Supplier=document.getElementById('dropdown_supplier').value;
         const Quantity = document.getElementById("Quantity").value;
    const Price = document.getElementById("Price").value;
    
    const res=await fetch('http://localhost:5000/Stock_in',{
        method:"POST",
        headers:{"Content-type":"application/json"},
        // body:JSON.stringify({P_name,P_model,brand})
        body:JSON.stringify({ModelNo,Supplier,Quantity,Price})
    });
    const data=await res.json();
          
             if(res_data.success){
        console.log("hello there")
        alert("Stock in");
 }else{
    console.log("error");
 }

    }catch(e){
console.log(e.message);
    }
  })
