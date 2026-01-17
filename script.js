// Load expenses
let expenses = JSON.parse(localStorage.getItem('expenses') || '[]');

// Category classes
const categoryClasses = { Food:"food", Transport:"transport", Bills:"bills", Shopping:"shopping", Entertainment:"entertainment", Others:"others" };

// DOM elements
const container = document.getElementById('expensesContainer');
const totalSpan = document.getElementById('total');
const filterCategory = document.getElementById('filterCategory');

// Modal elements
const modal = document.getElementById('editModal');
const closeModal = document.getElementById('closeModal');
const editDate = document.getElementById('editDate');
const editCategory = document.getElementById('editCategory');
const editAmount = document.getElementById('editAmount');
const saveEdit = document.getElementById('saveEdit');
let editingIndex = null;

// Helper: compare day
function isSameDay(date1,date2){return date1.getFullYear()===date2.getFullYear()&&date1.getMonth()===date2.getMonth()&&date1.getDate()===date2.getDate();}

// Calculate summary
function calculateSummary() {
  const today = new Date();
  let dayTotal=0, weekTotal=0, monthTotal=0, yearTotal=0;
  expenses.forEach(exp=>{
    const [y,m,d]=exp.date.split('-');
    const expDate=new Date(y,m-1,d);
    const amount=parseFloat(exp.amount);
    if(isSameDay(expDate,today)) dayTotal+=amount;
    const oneJan=new Date(today.getFullYear(),0,1);
    const currentWeek=Math.ceil((((today-oneJan)/86400000)+oneJan.getDay()+1)/7);
    const expWeek=Math.ceil((((expDate-oneJan)/86400000)+oneJan.getDay()+1)/7);
    if(expDate.getFullYear()===today.getFullYear() && expWeek===currentWeek) weekTotal+=amount;
    if(expDate.getFullYear()===today.getFullYear() && expDate.getMonth()===today.getMonth()) monthTotal+=amount;
    if(expDate.getFullYear()===today.getFullYear()) yearTotal+=amount;
  });
  return { dayTotal, weekTotal, monthTotal, yearTotal };
}

// Render summary
function renderSummary(){
  const {dayTotal,weekTotal,monthTotal,yearTotal}=calculateSummary();
  document.getElementById('dayTotal').innerText=dayTotal.toFixed(2);
  document.getElementById('weekTotal').innerText=weekTotal.toFixed(2);
  document.getElementById('monthTotal').innerText=monthTotal.toFixed(2);
  document.getElementById('yearTotal').innerText=yearTotal.toFixed(2);
}

// Render expenses
function renderExpenses(){
  const filter=filterCategory.value;
  container.innerHTML='';
  let total=0;
  expenses.forEach((exp,index)=>{
    if(filter!=='All' && exp.category!==filter) return;
    total+=parseFloat(exp.amount);
    const card=document.createElement('div');
    card.className=`expenseCard ${categoryClasses[exp.category]}`;
    card.innerHTML=`
      <strong>${exp.category}</strong>
      <span>Date: ${exp.date}</span>
      <span>Amount: ₱${parseFloat(exp.amount).toFixed(2)}</span>
      <div>
        <button onclick="openEdit(${index})">Edit</button>
        <button onclick="deleteExpense(${index})">Delete</button>
      </div>`;
    container.appendChild(card);
  });
  totalSpan.innerText=total.toFixed(2);
  renderSummary();
}

// Add new expense
document.getElementById('expenseForm').addEventListener('submit',function(e){
  e.preventDefault();
  const date=document.getElementById('date').value;
  const category=document.getElementById('category').value;
  const amount=document.getElementById('amount').value;
  if(date && category && amount){
    expenses.push({date,category,amount});
    localStorage.setItem('expenses',JSON.stringify(expenses));
    renderExpenses();
    this.reset();
  }
});

// Delete expense
function deleteExpense(index){
  if(confirm("Are you sure you want to delete this expense?")){
    expenses.splice(index,1);
    localStorage.setItem('expenses',JSON.stringify(expenses));
    renderExpenses();
  }
}

// Open edit modal
function openEdit(index){
  editingIndex=index;
  const exp=expenses[index];
  editDate.value=exp.date;
  editCategory.value=exp.category;
  editAmount.value=exp.amount;
  modal.style.display='block';
}

// Close modal
closeModal.onclick=function(){ modal.style.display='none'; }
window.onclick=function(e){ if(e.target===modal) modal.style.display='none'; }

// Save edit
saveEdit.addEventListener('click',()=>{
  const newDate=editDate.value;
  const newCategory=editCategory.value;
  const newAmount=editAmount.value;
  if(newDate && newCategory && newAmount){
    expenses[editingIndex]={date:newDate,category:newCategory,amount:newAmount};
    localStorage.setItem('expenses',JSON.stringify(expenses));
    modal.style.display='none';
    renderExpenses();
  }
});

// Filter change
filterCategory.addEventListener('change',renderExpenses);

// Initial render
renderExpenses();




