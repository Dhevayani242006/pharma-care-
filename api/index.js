// api/index.js – PharmaCare Express server using Supabase (no XAMPP/MySQL)
const express = require("express");
const cors = require("cors");
const path = require("path");
const { supabase } = require("../supabase");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static frontend files (index.html, css/, js/, images/, pages/)
app.use(express.static(path.join(__dirname, "..")));

// ========================== MEDICINES ==========================

// GET all medicines
app.get("/api/medicines", async (req, res) => {
  const { data, error } = await supabase.from("medicines").select("*");
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// POST add medicine
app.post("/api/medicines", async (req, res) => {
  const { name, category, price, quantity } = req.body;
  const { error } = await supabase
    .from("medicines")
    .insert([{ name, category, price, quantity }]);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: "Medicine added successfully" });
});

// PUT update medicine
app.put("/api/medicines/:id", async (req, res) => {
  const { name, category, price, quantity } = req.body;
  const { error } = await supabase
    .from("medicines")
    .update({ name, category, price, quantity })
    .eq("id", req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: "Medicine updated successfully" });
});

// DELETE medicine
app.delete("/api/medicines/:id", async (req, res) => {
  const { error } = await supabase
    .from("medicines")
    .delete()
    .eq("id", req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: "Medicine deleted successfully" });
});

// ========================== CUSTOMERS ==========================

// GET all customers
app.get("/api/customers", async (req, res) => {
  const { data, error } = await supabase.from("customers").select("*");
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// POST add customer
app.post("/api/customers", async (req, res) => {
  const { name, phone, email } = req.body;
  const { error } = await supabase
    .from("customers")
    .insert([{ name, phone, email }]);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: "Customer saved successfully" });
});

// ========================== BILLING ==========================

// GET all bills
app.get("/api/bills", async (req, res) => {
  const { data, error } = await supabase.from("bills").select("*");
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// POST generate bill
app.post("/api/bills", async (req, res) => {
  const { customer_name, medicine, quantity, amount } = req.body;
  const { error } = await supabase
    .from("bills")
    .insert([{ customer_name, medicine, quantity, amount }]);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: "Bill generated successfully" });
});

// ========================== REMINDERS ==========================

// GET all reminders
app.get("/api/reminders", async (req, res) => {
  const { data, error } = await supabase.from("reminders").select("*");
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// POST add reminder
app.post("/api/reminders", async (req, res) => {
  const { medicine, reminder_time } = req.body;
  const { error } = await supabase
    .from("reminders")
    .insert([{ medicine, reminder_time }]);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: "Reminder saved successfully" });
});

// ========================== AUTH (Users) ==========================

// POST register
app.post("/api/register", async (req, res) => {
  const { username, password } = req.body;
  const { error } = await supabase
    .from("users")
    .insert([{ username, password }]);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: "User registered successfully" });
});

// POST login
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("username", username)
    .eq("password", password);
  if (error) return res.status(500).json({ error: error.message });
  if (data.length > 0) {
    res.json({ success: true, message: "Login successful" });
  } else {
    res.json({ success: false, message: "Invalid username or password" });
  }
});

// ========================== DASHBOARD ==========================

app.get("/api/dashboard", async (req, res) => {
  try {
    const [medicines, customers, bills, lowStock] = await Promise.all([
      supabase.from("medicines").select("id", { count: "exact", head: true }),
      supabase.from("customers").select("id", { count: "exact", head: true }),
      supabase.from("bills").select("id", { count: "exact", head: true }),
      supabase.from("medicines").select("id", { count: "exact", head: true }).lt("quantity", 10),
    ]);

    res.json({
      medicines: medicines.count ?? 0,
      customers: customers.count ?? 0,
      bills: bills.count ?? 0,
      lowStock: lowStock.count ?? 0,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========================== LOW STOCK ==========================

app.get("/api/low-stock", async (req, res) => {
  const { data, error } = await supabase
    .from("medicines")
    .select("*")
    .lt("quantity", 10);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// ========================== SALES REPORT ==========================

app.get("/api/sales-report", async (req, res) => {
  const { data, error } = await supabase.from("bills").select("amount");
  if (error) return res.status(500).json({ error: error.message });
  const totalBills = data.length;
  const totalSales = data.reduce((sum, b) => sum + (parseFloat(b.amount) || 0), 0);
  res.json({ totalBills, totalSales });
});

// ========================== CONTACT ==========================

// POST save contact message
app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body;
  const { error } = await supabase
    .from("contacts")
    .insert([{ name, email, message }]);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: "Message sent successfully" });
});

// GET all contact messages
app.get("/api/contact", async (req, res) => {
  const { data, error } = await supabase.from("contacts").select("*");
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// ========================== START ==========================

app.listen(PORT, () => {
  console.log(`🚀 PharmaCare running at http://localhost:${PORT}`);
});

module.exports = app;
