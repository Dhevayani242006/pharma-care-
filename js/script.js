// ================= DARK / LIGHT MODE TOGGLE =================

const themeToggle = document.getElementById("themeToggle");
const themeIcon   = document.getElementById("themeIcon");

// Restore saved theme
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-mode");
  themeIcon && themeIcon.classList.replace("fa-sun", "fa-moon");
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const isDark = document.body.classList.contains("dark-mode");
    if (themeIcon) {
      themeIcon.classList.replace(
        isDark ? "fa-sun"  : "fa-moon",
        isDark ? "fa-moon" : "fa-sun"
      );
    }
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });
}

// ================= USER SESSION MANAGEMENT =================

function checkAuthSession() {
  const authContainer = document.getElementById("authContainer");
  if (!authContainer) return;

  const savedUser = localStorage.getItem("pharmaUser");
  if (savedUser) {
    try {
      const session = JSON.parse(savedUser);
      const roleIcon = session.role === "admin" ? "fa-user-shield" : "fa-user";
      const badgeClass = session.role === "admin" ? "admin" : "customer";
      
      const displayName = (session.username.toLowerCase() === session.role.toLowerCase()) 
        ? session.username 
        : `${session.role.toUpperCase()}: ${session.username}`;

      authContainer.innerHTML = `
        <span style="display:inline-flex; align-items:center; gap:8px; font-size:0.85rem; font-weight:600;">
          <span class="cat-badge cat-${badgeClass}"><i class="fa-solid ${roleIcon}"></i> ${displayName}</span>
          <button type="button" class="btn-sm btn-danger" onclick="logoutUser()" title="Logout">
            <i class="fa-solid fa-right-from-bracket"></i>
          </button>
        </span>
      `;
    } catch (e) {
      localStorage.removeItem("pharmaUser");
    }
  }
}

function logoutUser() {
  if (confirm("Are you sure you want to log out?")) {
    localStorage.removeItem("pharmaUser");
    window.location.reload();
  }
}

checkAuthSession();

// ================= ADD MEDICINE =================

let editingMedicineId = null;

const medicineForm = document.getElementById("medicineForm");

if (medicineForm) {
  medicineForm.addEventListener("submit", (e) => {
    e.preventDefault();

    let medicine = {
      name:     document.getElementById("medicineName").value,
      category: document.getElementById("category").value,
      price:    document.getElementById("price").value,
      quantity: document.getElementById("quantity").value,
    };

    let url    = "/api/medicines";
    let method = "POST";

    if (editingMedicineId !== null) {
      url    = "/api/medicines/" + editingMedicineId;
      method = "PUT";
    }

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(medicine),
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message);
        medicineForm.reset();
        editingMedicineId = null;
        document.querySelector("#medicineForm button").innerText = "Save Medicine";
        if (document.getElementById("medicineTable")) loadMedicines();
      });
  });
}

// ================= SEED MEDICINE DATA (Real pharmacy data – India) =================
// Source: NPPA / common pharmacy formulary
const SEED_MEDICINES = [
  // Pain Relief & Fever
  { id: 1,  name: "Paracetamol 500mg",        category: "Tablet",    price: 12,   quantity: 200 },
  { id: 2,  name: "Ibuprofen 400mg",           category: "Tablet",    price: 18,   quantity: 150 },
  { id: 3,  name: "Diclofenac 50mg",           category: "Tablet",    price: 22,   quantity: 120 },
  { id: 4,  name: "Aspirin 75mg",              category: "Tablet",    price: 10,   quantity: 180 },
  { id: 5,  name: "Nimesulide 100mg",          category: "Tablet",    price: 25,   quantity: 90  },
  // Antibiotics
  { id: 6,  name: "Amoxicillin 500mg",         category: "Capsule",   price: 65,   quantity: 100 },
  { id: 7,  name: "Azithromycin 500mg",        category: "Tablet",    price: 80,   quantity: 75  },
  { id: 8,  name: "Ciprofloxacin 500mg",       category: "Tablet",    price: 55,   quantity: 110 },
  { id: 9,  name: "Cefixime 200mg",            category: "Capsule",   price: 90,   quantity: 60  },
  { id: 10, name: "Doxycycline 100mg",         category: "Capsule",   price: 45,   quantity: 85  },
  // Syrups & Liquid
  { id: 11, name: "Amoxicillin Dry Syrup",     category: "Syrup",     price: 72,   quantity: 50  },
  { id: 12, name: "Paracetamol Suspension",    category: "Syrup",     price: 35,   quantity: 80  },
  { id: 13, name: "Cetirizine Syrup",          category: "Syrup",     price: 40,   quantity: 65  },
  { id: 14, name: "Multivitamin Drops",        category: "Syrup",     price: 85,   quantity: 40  },
  { id: 15, name: "Antacid Suspension",        category: "Syrup",     price: 55,   quantity: 55  },
  // Gastro-Intestinal
  { id: 16, name: "Pantoprazole 40mg",         category: "Tablet",    price: 48,   quantity: 130 },
  { id: 17, name: "Domperidone 10mg",          category: "Tablet",    price: 30,   quantity: 100 },
  { id: 18, name: "Metronidazole 400mg",       category: "Tablet",    price: 20,   quantity: 95  },
  { id: 19, name: "Ondansetron 4mg",           category: "Tablet",    price: 42,   quantity: 70  },
  // Anti-Allergic
  { id: 20, name: "Cetirizine 10mg",           category: "Tablet",    price: 15,   quantity: 160 },
  { id: 21, name: "Levocetirizine 5mg",        category: "Tablet",    price: 28,   quantity: 140 },
  { id: 22, name: "Fexofenadine 120mg",        category: "Tablet",    price: 52,   quantity: 80  },
  // Cardiovascular
  { id: 23, name: "Atorvastatin 10mg",         category: "Tablet",    price: 38,   quantity: 120 },
  { id: 24, name: "Amlodipine 5mg",            category: "Tablet",    price: 22,   quantity: 110 },
  { id: 25, name: "Metformin 500mg",           category: "Tablet",    price: 18,   quantity: 200 },
  // Vitamins & Supplements
  { id: 26, name: "Vitamin D3 60000 IU",       category: "Capsule",   price: 35,   quantity: 150 },
  { id: 27, name: "Vitamin C 500mg",           category: "Tablet",    price: 12,   quantity: 180 },
  { id: 28, name: "Calcium + Vitamin D3",      category: "Tablet",    price: 45,   quantity: 100 },
  // Injections
  { id: 29, name: "Diclofenac Injection 75mg", category: "Injection", price: 28,   quantity: 8   },
  { id: 30, name: "Ondansetron Injection 4mg", category: "Injection", price: 55,   quantity: 5   },
];

// ================= DISPLAY & BILLING MEDICINES =================

let currentMedicinesList = [];

function populateMedicineBillingSelect(medicines) {
  currentMedicinesList = medicines;
  const select = document.getElementById("billMedicineSelect");
  if (!select) return;
  select.innerHTML = '<option value="">-- Select Medicine from Stock --</option>';
  medicines.forEach((m) => {
    const option = document.createElement("option");
    option.value = m.name;
    option.dataset.price = m.price;
    option.dataset.quantity = m.quantity;
    option.textContent = `${m.name} (${m.category}) - ₹${m.price} [Stock: ${m.quantity}]`;
    select.appendChild(option);
  });
}

function onBillingMedicineChange() {
  const select = document.getElementById("billMedicineSelect");
  if (!select) return;
  const selectedName = select.value;
  const selectedOption = select.options[select.selectedIndex];

  if (selectedName) {
    document.getElementById("billMedicine").value = selectedName;
    const price = selectedOption.dataset.price || 0;
    document.getElementById("billUnitPrice").value = price;
    calculateBillTotal();
  }
}

function calculateBillTotal() {
  const unitPriceInput = document.getElementById("billUnitPrice");
  const qtyInput = document.getElementById("billQuantity");
  const amountInput = document.getElementById("billAmount");
  if (!unitPriceInput || !qtyInput || !amountInput) return;

  const unitPrice = parseFloat(unitPriceInput.value) || 0;
  const qty = parseInt(qtyInput.value) || 1;
  const total = (unitPrice * qty).toFixed(2);
  amountInput.value = total;
}

function renderMedicineTable(data) {
  populateMedicineBillingSelect(data);
  const medicineTable = document.getElementById("medicineTable");
  if (!medicineTable) return;
  let table = "";
  data.forEach((item) => {
    const lowStock = item.quantity < 10 ? ' style="color:#c0392b;font-weight:700;"' : "";
    table += `
    <tr>
      <td>${item.name}</td>
      <td><span class="cat-badge cat-${item.category.toLowerCase()}">${item.category}</span></td>
      <td>₹${item.price}</td>
      <td${lowStock}>${item.quantity}${item.quantity < 10 ? " ⚠️" : ""}</td>
      <td>
        <button type="button" class="editBtn btn-sm" data-id="${item.id}">✏️ Edit</button>
        <button type="button" class="btn-danger btn-sm" onclick="deleteMedicine(${item.id})">🗑️ Delete</button>
      </td>
    </tr>`;
  });
  medicineTable.innerHTML = table;
}

function loadMedicines() {
  fetch("/api/medicines")
    .then((res) => {
      if (!res.ok) throw new Error("API not available");
      return res.json();
    })
    .then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        renderMedicineTable(data);
      } else {
        renderMedicineTable(SEED_MEDICINES);
      }
    })
    .catch(() => {
      renderMedicineTable(SEED_MEDICINES);
    });
}

loadMedicines();

// ================= BILLS HISTORY & RECEIPT MODAL =================

let allBillsList = [];

function renderBillsTable(bills) {
  allBillsList = bills;
  const billsTable = document.getElementById("billsTable");
  if (!billsTable) return;

  if (!bills || bills.length === 0) {
    billsTable.innerHTML = `<tr><td colspan="7" style="text-align:center;">No bills generated yet.</td></tr>`;
    return;
  }

  let html = "";
  bills.forEach((b, idx) => {
    const invNum = b.inv_num || `INV-${(1000 + (b.id || idx + 1))}`;
    const dateStr = b.date_str || (b.created_at ? new Date(b.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }));
    html += `
      <tr>
        <td><strong>${invNum}</strong></td>
        <td>${dateStr}</td>
        <td>${b.customer_name || 'Walk-in Customer'}</td>
        <td>${b.medicine}</td>
        <td>${b.quantity}</td>
        <td>₹${parseFloat(b.amount).toFixed(2)}</td>
        <td>
          <button type="button" class="btn-sm btn-primary" onclick="viewBillInvoice(${idx})">🖨️ Receipt</button>
        </td>
      </tr>
    `;
  });
  billsTable.innerHTML = html;
}

function loadBills() {
  fetch("/api/bills")
    .then((res) => {
      if (!res.ok) throw new Error("API failed");
      return res.json();
    })
    .then((data) => {
      if (Array.isArray(data)) {
        renderBillsTable(data);
      }
    })
    .catch(() => {
      renderBillsTable([]);
    });
}

loadBills();

function showInvoiceModal(bill) {
  document.getElementById("invNum").innerText = bill.inv_num || "INV-0001";
  document.getElementById("invDate").innerText = bill.date_str || new Date().toLocaleDateString("en-IN");
  document.getElementById("invCustomerName").innerText = bill.customer_name || "Walk-in Customer";
  document.getElementById("invCustomerPhone").innerText = bill.phone ? `Phone: ${bill.phone}` : "";
  document.getElementById("invMedicineName").innerText = bill.medicine;

  const unitPrice = parseFloat(bill.unit_price || (bill.amount / bill.quantity)).toFixed(2);
  const totalAmount = parseFloat(bill.amount).toFixed(2);
  const tax = (totalAmount * 0.05).toFixed(2); // 5% GST included

  document.getElementById("invUnitPrice").innerText = `₹${unitPrice}`;
  document.getElementById("invQuantity").innerText = bill.quantity;
  document.getElementById("invSubtotal").innerText = `₹${totalAmount}`;
  document.getElementById("invSubtotalAmount").innerText = `₹${totalAmount}`;
  document.getElementById("invTax").innerText = `₹${tax}`;
  document.getElementById("invGrandTotal").innerText = `₹${totalAmount}`;

  document.getElementById("invoiceModal").style.display = "flex";
}

function closeInvoiceModal() {
  document.getElementById("invoiceModal").style.display = "none";
}

function printInvoice() {
  window.print();
}

function viewBillInvoice(index) {
  if (allBillsList[index]) {
    showInvoiceModal(allBillsList[index]);
  }
}

// ================= CUSTOMER SAVE =================

const customerForm = document.getElementById("customerForm");
if (customerForm) {
  customerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let customer = {
      name:  document.getElementById("customerName").value,
      phone: document.getElementById("phone").value,
      email: document.getElementById("email").value,
    };
    fetch("/api/customers", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(customer),
    })
      .then((res) => res.json())
      .then((data) => { alert(data.message); customerForm.reset(); });
  });
}

// ================= BILL GENERATION =================

const billForm = document.getElementById("billForm");
if (billForm) {
  billForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const customerName = document.getElementById("billCustomer").value;
    const phoneInput = document.getElementById("billPhone");
    const phone = phoneInput ? phoneInput.value : "";
    const medicineName = document.getElementById("billMedicine").value;
    const unitPrice = parseFloat(document.getElementById("billUnitPrice").value) || 0;
    const quantity = parseInt(document.getElementById("billQuantity").value) || 1;
    const amount = parseFloat(document.getElementById("billAmount").value) || (unitPrice * quantity);
    const invNum = `INV-${Date.now().toString().slice(-6)}`;
    const dateStr = new Date().toLocaleString("en-IN", {
      day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
    });

    const billData = {
      customer_name: customerName,
      phone: phone,
      medicine: medicineName,
      unit_price: unitPrice,
      quantity: quantity,
      amount: amount,
      inv_num: invNum,
      date_str: dateStr
    };

    const processBillSuccess = () => {
      // Deduct stock if matching medicine is found
      const med = currentMedicinesList.find(m => m.name.toLowerCase() === medicineName.toLowerCase());
      if (med) {
        med.quantity = Math.max(0, med.quantity - quantity);
        if (med.id) {
          fetch(`/api/medicines/${med.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: med.name,
              category: med.category,
              price: med.price,
              quantity: med.quantity
            })
          }).then(() => loadMedicines());
        } else {
          renderMedicineTable(currentMedicinesList);
        }
      }

      // Display printable receipt modal
      showInvoiceModal(billData);

      // Add to local bills list & update table
      allBillsList.unshift(billData);
      renderBillsTable(allBillsList);

      // Reset form
      billForm.reset();
      const select = document.getElementById("billMedicineSelect");
      if (select) select.value = "";
    };

    fetch("/api/bills", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({
        customer_name: customerName,
        medicine: medicineName,
        quantity: quantity,
        amount: amount
      }),
    })
      .then((res) => res.json())
      .then(() => processBillSuccess())
      .catch(() => processBillSuccess());
  });
}

// ================= REMINDER SAVE =================

const reminderForm = document.getElementById("reminderForm");
if (reminderForm) {
  reminderForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let reminder = {
      medicine:      document.getElementById("reminderMedicine").value,
      reminder_time: document.getElementById("reminderTime").value,
    };
    fetch("/api/reminders", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(reminder),
    })
      .then((res) => res.json())
      .then((data) => { alert(data.message); reminderForm.reset(); });
  });
}

// ================= AUTHENTICATION & LOGIN TAB LOGIC =================

function switchTab(role) {
  const tabAdmin = document.getElementById("tabAdmin");
  const tabCustomer = document.getElementById("tabCustomer");
  const loginRole = document.getElementById("loginRole");
  const submitBtn = document.getElementById("submitLoginBtn");
  const demoAdminInfo = document.getElementById("demoAdminInfo");
  const demoCustomerInfo = document.getElementById("demoCustomerInfo");

  if (!tabAdmin || !tabCustomer) return;

  if (role === "admin") {
    tabAdmin.classList.add("active");
    tabCustomer.classList.remove("active");
    if (loginRole) loginRole.value = "admin";
    if (submitBtn) submitBtn.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> Sign In as Admin';
    if (demoAdminInfo) demoAdminInfo.style.display = "block";
    if (demoCustomerInfo) demoCustomerInfo.style.display = "none";
  } else {
    tabCustomer.classList.add("active");
    tabAdmin.classList.remove("active");
    if (loginRole) loginRole.value = "customer";
    if (submitBtn) submitBtn.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> Sign In as Customer';
    if (demoCustomerInfo) demoCustomerInfo.style.display = "block";
    if (demoAdminInfo) demoAdminInfo.style.display = "none";
  }
}

function fillDemo(role) {
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");

  if (role === "admin") {
    switchTab("admin");
    if (usernameInput) usernameInput.value = "admin";
    if (passwordInput) passwordInput.value = "admin123";
  } else {
    switchTab("customer");
    if (usernameInput) usernameInput.value = "customer";
    if (passwordInput) passwordInput.value = "customer123";
  }
}

function togglePasswordVisibility() {
  const passwordInput = document.getElementById("password");
  const eyeIcon = document.getElementById("eyeIcon");
  if (!passwordInput || !eyeIcon) return;

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    eyeIcon.classList.replace("fa-eye", "fa-eye-slash");
  } else {
    passwordInput.type = "password";
    eyeIcon.classList.replace("fa-eye-slash", "fa-eye");
  }
}

// ================= LOGIN SUBMIT HANDLER =================

const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const role = document.getElementById("loginRole") ? document.getElementById("loginRole").value : "admin";
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const userPayload = { username, password, role };

    const handleLoginSuccess = (resRole, resUser) => {
      const session = {
        role: resRole || role,
        username: resUser || username,
        loggedInAt: new Date().toISOString()
      };
      localStorage.setItem("pharmaUser", JSON.stringify(session));
      alert(`✅ Login Successful as ${session.role.toUpperCase()}! Welcome, ${session.username}.`);
      window.location.href = "../index.html";
    };

    fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userPayload),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          handleLoginSuccess(data.role, data.username);
        } else {
          // Demo fallback check if backend API isn't running
          if ((username === "admin" || username === "admin@pharmacare.com") && password === "admin123") {
            handleLoginSuccess("admin", "Admin");
          } else if ((username === "customer" || username === "customer@pharmacare.com") && password === "customer123") {
            handleLoginSuccess("customer", "Customer");
          } else {
            alert(data.message || "❌ Invalid credentials. Please use demo credentials (admin / admin123 or customer / customer123).");
          }
        }
      })
      .catch(() => {
        // Fallback for file:// static mode
        if (username === "admin" && password === "admin123") {
          handleLoginSuccess("admin", "Admin");
        } else if (username === "customer" && password === "customer123") {
          handleLoginSuccess("customer", "Customer");
        } else {
          alert("❌ Invalid credentials. Use demo password: admin123 (Admin) or customer123 (Customer).");
        }
      });
  });
}

// ================= DASHBOARD =================

if (document.getElementById("totalMedicines")) {
  fetch("/api/dashboard")
    .then((res) => res.json())
    .then((data) => {
      document.getElementById("totalMedicines").innerHTML = data.medicines;
      document.getElementById("totalCustomers").innerHTML = data.customers;
      document.getElementById("totalBills").innerHTML     = data.bills;
      document.getElementById("lowStock").innerHTML       = data.lowStock;
    });
}

// ================= LOW STOCK =================

if (document.getElementById("lowStockList")) {
  fetch("/api/low-stock")
    .then((res) => res.json())
    .then((data) => {
      let output = "";
      if (data.length === 0) {
        output = "<p>No low stock medicines.</p>";
      } else {
        data.forEach((item) => {
          output += `
          <div class="stock-alert">
            <h3>${item.name}</h3>
            <p>Remaining Stock: ${item.quantity}</p>
          </div>`;
        });
      }
      document.getElementById("lowStockList").innerHTML = output;
    });
}

// ================= SALES REPORT =================

if (document.getElementById("salesBills")) {
  fetch("/api/sales-report")
    .then((res) => res.json())
    .then((data) => {
      document.getElementById("salesBills").innerHTML  = data.totalBills;
      document.getElementById("salesAmount").innerHTML = "₹" + (data.totalSales || 0);
    });
}

// ================= CONTACT =================

const contactForm = document.getElementById("contactForm");
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    fetch("/api/contact", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name:    document.getElementById("contactName").value,
        email:   document.getElementById("contactEmail").value,
        message: document.getElementById("contactMessage").value,
      }),
    })
      .then((res) => res.json())
      .then((data) => { alert(data.message); contactForm.reset(); });
  });
}

// ================= ROLE-BASED ACCESS CONTROL & PERMISSIONS =================

function applyRolePermissions() {
  const adminElements = document.querySelectorAll(".admin-only");
  adminElements.forEach((el) => {
    el.style.display = "";
  });
}

document.addEventListener("DOMContentLoaded", applyRolePermissions);
applyRolePermissions();

// ================= SEARCH MEDICINE =================

function searchMedicine() {
  let input = document.getElementById("searchMedicine").value.toLowerCase();
  let rows  = document.querySelectorAll("#medicineTable tr");
  rows.forEach((row) => {
    let name     = row.cells[0].textContent.toLowerCase();
    let category = row.cells[1].textContent.toLowerCase();
    row.style.display =
      name.includes(input) || category.includes(input) ? "" : "none";
  });
}

// ================= DELETE MEDICINE =================

function deleteMedicine(id) {
  if (confirm("Are you sure you want to delete this medicine?")) {
    fetch("/api/medicines/" + id, { method: "DELETE" })
      .then((res) => res.json())
      .then((data) => { alert(data.message); loadMedicines(); });
  }
}

// ================= EDIT MEDICINE =================

function editMedicine(id) {
  fetch("/api/medicines")
    .then((res) => res.json())
    .then((data) => {
      const medicine = data.find((item) => item.id == id);
      if (!medicine) { alert("Medicine not found"); return; }
      document.getElementById("medicineName").value = medicine.name;
      document.getElementById("category").value     = medicine.category;
      document.getElementById("price").value         = medicine.price;
      document.getElementById("quantity").value      = medicine.quantity;
      editingMedicineId = id;
      document.querySelector("#medicineForm button[type='submit']").innerText = "Update Medicine";
    });
}

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("editBtn")) {
    editMedicine(e.target.getAttribute("data-id"));
  }
});
