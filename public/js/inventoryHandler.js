console.log("hey there");
const add_phone=document.getElementById("addPhone");
console.log('Running');

//Inserting DATA
const act_form=document.getElementById("phone_form")?.addEventListener("submit",async (e)=>{
    e.preventDefault();
  
    // const P_model=document.getElementById("Model").value.trim(); 

    const formdata=new FormData(e.target);
    const data={};
    for(let[key,values] of formdata.entries()){
        data[key]=values.trim();
    }
    console.log(data);
    try{
    const res=await fetch('http://localhost:5000/AddPhones',{
        method:"POST",
        headers:{"Content-type":"application/json"},
        // body:JSON.stringify({P_name,P_model,brand})
        body:JSON.stringify(data)
    });
    const res_data=await res.json();
    if(res_data.success){
        console.log("hello there")
        alert("Data saved");
        document.getElementById("phone_form").reset();
    }else{
        alert("Error"+(res_data.error()||"unknown"));
        console.log("error");
    }
}catch(err){
    console.log(err.message+"Req Failed");
}
});

//View Phones
const view_button=document.getElementById("view_btn")?.addEventListener("click",async()=>{
    try{
        const res_get=await fetch('http://localhost:5000/Phones_View');
        const res_data=await res_get.json();//.json() is a method on the Response object.
           // It reads the response body and parses it as JSON.
           //Now res_data is the actual data 
           const tbody=document.getElementById("phonesTableBody");
           tbody.innerHTML="";
           console.log("hello there buddy");
           console.log(res_data);

           console.log(res_data[0]?.model);
 if(res_data.length>0){
    console.log("sUCCESS Retrieve");
 }else{
    console.log("error");
 }
               // Display data
      let html = "";
        res_data.forEach(phone => {
          html += `<tr><td>${phone.brand}</td><td>${phone.model}</td><td>${phone.p_storage||''}</td><td>${phone.ram||''}</td><td>${phone.os||''}</td>
          <td>${phone.supplier_name||''}</td><td>${phone.warranty_period ||''}</td><td>${phone.price}</td><td>${phone.quantity}</td>
          <td>${new Date(phone.date_added).toLocaleDateString()}</td><td>${new Date(phone.last_updated).toLocaleDateString()}</td></tr>`;
        });

        tbody.innerHTML = html;

    }catch(err){
        console.log(err);
    }
});

//Update Phones
const stockIn_button=document.getElementById("in-stock_btn")?.addEventListener("click",async()=>{
     const phone_id=document.getElementById("dropdown_model").value; 
    const brand=document.getElementById("dropdown_brand").value; 
   const p_quantity=document.getElementById("p_quantity").value;
   console.log(phone_id);
   try{
       const response=await fetch('http://localhost:5000/UpdateQuantity',{
        method:"PUT",
        headers:{"Content-type":"application/json"},
        body:JSON.stringify({phone_id,brand,p_quantity})
    
    });
     console.log("oh noice")
    const response_data=await response.json();
    if(response_data.success){
        console.log("hello hy")
        alert("Data Updated (In Stock)");
    }else{
        alert("Error"+(response_data.error||"unknown"));
        console.log("error");
    }
   }catch(err){
    console.log(err.message);
   }
});