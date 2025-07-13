const form = document.getElementById('transaction-form');
const transactionsDiv = document.getElementById('transactions');
const exportBtn = document.getElementById('export');
const categoryButtonsDiv = document.getElementById('category-buttons');
const addCategoryBtn = document.getElementById('add-category-btn');
const daySummary = document.getElementById('day-summary');
const weekSummary = document.getElementById('week-summary');
const monthSummary = document.getElementById('month-summary');

let transactions = JSON.parse(localStorage.getItem("transactions") || "[]");
let categories = JSON.parse(localStorage.getItem("categories") || "['อาหาร','ของใช้','ค่าเดินทาง','ค่าโทรศัพท์','การลงทุน']");

let selectedCategory = "";

function renderCategories() {
  categoryButtonsDiv.innerHTML = "";
  categories.forEach(cat => {
    const btn = document.createElement("div");
    btn.textContent = cat;
    btn.className = "cat-btn";
    btn.onclick = () => {
      selectedCategory = cat;
      document.querySelectorAll(".cat-btn").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
    };
    categoryButtonsDiv.appendChild(btn);
  });
}

addCategoryBtn.onclick = () => {
  const newCat = prompt("ชื่อหมวดหมู่ใหม่:");
  if (newCat && !categories.includes(newCat)) {
    categories.push(newCat);
    localStorage.setItem("categories", JSON.stringify(categories));
    renderCategories();
  }
};

form.onsubmit = function(e) {
  e.preventDefault();
  const type = document.querySelector('input[name="type"]:checked').value;
  const date = document.getElementById("date").value;
  const amount = parseFloat(document.getElementById("amount").value);
  const slip = document.getElementById("slip").files[0];
  if (!selectedCategory || !amount || !date) return alert("กรอกข้อมูลให้ครบ");

  const transaction = { type, date, category: selectedCategory, amount, slip: slip ? slip.name : "" };
  transactions.push(transaction);
  localStorage.setItem("transactions", JSON.stringify(transactions));
  renderTransactions();
  form.reset();
  selectedCategory = "";
  renderCategories();
};

function renderTransactions() {
  transactionsDiv.innerHTML = "<h2>ประวัติย้อนหลัง</h2>";
  const now = new Date();
  let dayTotal = 0, weekTotal = 0, monthTotal = 0;

  transactions.forEach(t => {
    const tDate = new Date(t.date);
    const amount = t.type === "expense" ? -t.amount : t.amount;
    const div = document.createElement("div");
    div.className = "transaction";
    div.innerHTML = `<strong>${t.date}</strong>: [${t.type === 'expense' ? '-' : '+'}] ${t.amount} บาท - ${t.category}` +
                    (t.slip ? `<br><em>สลิป: ${t.slip}</em>` : '');
    transactionsDiv.appendChild(div);

    const diffDays = (now - tDate) / (1000 * 60 * 60 * 24);
    if (diffDays < 1) dayTotal += amount;
    if (diffDays < 7) weekTotal += amount;
    if (now.getMonth() === tDate.getMonth() && now.getFullYear() === tDate.getFullYear()) {
      monthTotal += amount;
    }
  });

  daySummary.textContent = "วันนี้: " + dayTotal.toFixed(2) + " บาท";
  weekSummary.textContent = "สัปดาห์นี้: " + weekTotal.toFixed(2) + " บาท";
  monthSummary.textContent = "เดือนนี้: " + monthTotal.toFixed(2) + " บาท";
}

exportBtn.onclick = () => {
  const ws = XLSX.utils.json_to_sheet(transactions);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Transactions");
  XLSX.writeFile(wb, "transactions.xlsx");
};

renderCategories();
renderTransactions();
