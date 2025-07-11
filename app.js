const form = document.getElementById('transaction-form');
const transactionsDiv = document.getElementById('transactions');
const exportBtn = document.getElementById('export');
let transactions = [];

form.addEventListener('submit', function(e) {
  e.preventDefault();
  const date = document.getElementById('date').value;
  const category = document.getElementById('category').value;
  const bank = document.getElementById('bank').value;
  const amount = document.getElementById('amount').value;
  const slip = document.getElementById('slip').files[0];
  
  const transaction = {
    date,
    category,
    bank,
    amount,
    slipName: slip ? slip.name : ''
  };
  transactions.push(transaction);
  renderTransactions();
  form.reset();
});

function renderTransactions() {
  transactionsDiv.innerHTML = '';
  transactions.forEach((t, i) => {
    const div = document.createElement('div');
    div.className = 'transaction';
    div.innerHTML = `<strong>${t.date}</strong>: ${t.category} - ${t.amount} บาท (${t.bank})` + 
                    (t.slipName ? `<br><em>สลิป: ${t.slipName}</em>` : '');
    transactionsDiv.appendChild(div);
  });
}

exportBtn.addEventListener('click', function() {
  const worksheet = XLSX.utils.json_to_sheet(transactions);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");
  XLSX.writeFile(workbook, "transactions.xlsx");
});
