

//Update Phones JS Code
console.log('in pones js file')
let selected_row=null;
document.getElementById("phonesTableBody").addEventListener("dblclick",e=>{
let tr=e.target.closest("tr")
console.log("doble click");
if(!tr){
    alert("Double click the row for editing")
    return;
}else{
    alert("got selected")
}
if(selected_row)selected_row.classList.remove("selected_row");
selected_row=tr;
tr.classList.add("selected_row");

})
//edit button
const edit_btn=document.getElementById("edit-phone-btn");
edit_btn.addEventListener("click",e=>{
    console.log("editing")
    if(!selected_row){
        alert("Double click row for selection");
        return;
    }else{
    alert("got edit selected")
}
[...selected_row.children].forEach(td=>{
    td.contentEditable=true;//making content editable
    document.querySelectorAll("td").forEach((cell,index)=>{
cell.dataset.original=cell.innerText.trim();//dataset --permanent storage
    })
}
)
})

//saving the info in db 
document.getElementById("save-phone-info").addEventListener("click",async(e)=>{
    let id=selected_row.getElementById("td");
    let update_data={};
      document.querySelectorAll("td").forEach((cell,index)=>{
        let old_val=cell.dataset.original;
let new_val=cell.innerText.trim();//dataset --permanent storage
if(old_val!=new_val){
//taking column name 
let column_n=cell.dataset.column_n;
update_data[column_n]=new_val;
    }
    if(Object.keys(update_data).length>0){
    update_database(id,update_data)

}
      });
})
async function update_database(id,data) {
      try{
    const res=await fetch('http://localhost:5000/UpdatePhones',{
        method:"Patch",
        headers:{"Content-type":"application/json"},
        // body:JSON.stringify({P_name,P_model,brand})
        body:JSON.stringify(id,data)
    });
    const res_data=await res.json();
    if(res_data.success){
        alert("Data updated");
    }else{
        alert("Error"+(res_data.error()||"unknown"));
    }
}catch(err){
    console.log(err.message+"Req of Updating Failed");
}
}
