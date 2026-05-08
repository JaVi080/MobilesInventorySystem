 //Inserting DATA
const act_form=document.getElementById("Supplier_form")?.addEventListener("submit",async (e)=>{
    e.preventDefault();
  
    // const P_model=document.getElementById("Model").value.trim(); 

    const formdata=new FormData(e.target);
    const data={};
    for(let[key,values] of formdata.entries()){
        data[key]=values.trim();
    }
    console.log(data);
    try{
    const res=await fetch('http://localhost:5000/AddSuppliers',{
        method:"POST",
        headers:{"Content-type":"application/json"},
        // body:JSON.stringify({P_name,P_model,brand})
        body:JSON.stringify(data)
    });
    const res_data=await res.json();
    if(res_data.success){
        console.log("hello there")
        alert("Data of Suppliers saved");
        document.getElementById("Supplier_form").reset();
    }else{
        alert("Error"+(res_data.error()||"unknown"));
        console.log("error");
    }
}catch(err){
    console.log(err.message+"Req Failed");
}
});
