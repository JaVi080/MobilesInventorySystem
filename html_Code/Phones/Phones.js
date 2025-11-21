
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
}
)
})
