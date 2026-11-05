"use strict";

const STORAGE_KEY = "haven-rental-manager-v1";
const now = new Date();
const isoDate = (date) => date.toISOString().slice(0, 10);
const offsetDate = (days) => { const date = new Date(); date.setDate(date.getDate() + days); return isoDate(date); };
const demoData = {
  properties: [
    { id: "p1", name: "Willow Creek Apartments", type: "Apartment", address: "124 Willow Creek Rd", city: "Portland", state: "OR", postalCode: "97205", bedrooms: 2, bathrooms: 1, rent: 1850, status: "occupied" },
    { id: "p2", name: "Maple Street Loft", type: "Condo", address: "88 Maple Street", city: "Portland", state: "OR", postalCode: "97209", bedrooms: 1, bathrooms: 1, rent: 1475, status: "occupied" },
    { id: "p3", name: "Cedar Ridge House", type: "House", address: "620 Cedar Ridge Ave", city: "Beaverton", state: "OR", postalCode: "97005", bedrooms: 3, bathrooms: 2, rent: 2325, status: "occupied" },
    { id: "p4", name: "The Hawthorne", type: "Apartment", address: "35 SE Hawthorne Blvd", city: "Portland", state: "OR", postalCode: "97214", bedrooms: 2, bathrooms: 2, rent: 1995, status: "vacant" },
    { id: "p5", name: "Riverfront Studio", type: "Studio", address: "14 N River Pkwy", city: "Portland", state: "OR", postalCode: "97227", bedrooms: 0, bathrooms: 1, rent: 1150, status: "vacant" }
  ],
  tenants: [
    { id: "t1", name: "Olivia Bennett", email: "olivia.bennett@example.com", phone: "(503) 555-0142", status: "active" },
    { id: "t2", name: "Noah Williams", email: "noah.williams@example.com", phone: "(503) 555-0186", status: "active" },
    { id: "t3", name: "Sophia Chen", email: "sophia.chen@example.com", phone: "(971) 555-0127", status: "active" }
  ],
  leases: [
    { id: "l1", propertyId: "p1", tenantId: "t1", startDate: "2025-06-01", endDate: "2026-05-31", rent: 1850, deposit: 1850, status: "active" },
    { id: "l2", propertyId: "p2", tenantId: "t2", startDate: "2025-09-01", endDate: "2026-08-31", rent: 1475, deposit: 1475, status: "active" },
    { id: "l3", propertyId: "p3", tenantId: "t3", startDate: "2025-11-01", endDate: "2026-10-31", rent: 2325, deposit: 2325, status: "active" }
  ],
  payments: [
    { id: "pay1", leaseId: "l1", tenantId: "t1", amount: 1850, dueDate: offsetDate(-4), paidDate: offsetDate(-2), method: "Bank transfer", status: "paid" },
    { id: "pay2", leaseId: "l2", tenantId: "t2", amount: 1475, dueDate: offsetDate(2), paidDate: "", method: "—", status: "pending" },
    { id: "pay3", leaseId: "l3", tenantId: "t3", amount: 2325, dueDate: offsetDate(-1), paidDate: "", method: "—", status: "overdue" },
    { id: "pay4", leaseId: "l1", tenantId: "t1", amount: 1850, dueDate: offsetDate(-34), paidDate: offsetDate(-35), method: "Online", status: "paid" },
    { id: "pay5", leaseId: "l2", tenantId: "t2", amount: 1475, dueDate: offsetDate(-34), paidDate: offsetDate(-34), method: "Bank transfer", status: "paid" }
  ],
  maintenance: [
    { id: "m1", propertyId: "p1", title: "Kitchen faucet leak", description: "Slow drip under the kitchen sink.", priority: "high", status: "open", reportedDate: offsetDate(-2) },
    { id: "m2", propertyId: "p3", title: "Annual HVAC service", description: "Schedule seasonal furnace inspection.", priority: "medium", status: "in progress", reportedDate: offsetDate(-5) },
    { id: "m3", propertyId: "p2", title: "Hallway light replacement", description: "Replace bulb by unit entrance.", priority: "low", status: "closed", reportedDate: offsetDate(-12) }
  ]
};

const definitions = {
  properties: { title: "Properties", singular: "Property", subtitle: "Manage your rental portfolio and availability.", addLabel: "Add property", fields: [
    { key: "name", label: "Property name", required: true }, { key: "type", label: "Type", type: "select", options: ["Apartment", "House", "Condo", "Studio", "Townhouse", "Other"], required: true },
    { key: "address", label: "Street address", required: true, full: true }, { key: "city", label: "City", required: true }, { key: "state", label: "State", required: true },
    { key: "postalCode", label: "ZIP / postal code", required: true }, { key: "bedrooms", label: "Bedrooms", type: "number", min: 0, required: true },
    { key: "bathrooms", label: "Bathrooms", type: "number", min: 0, step: "0.5", required: true }, { key: "rent", label: "Monthly rent ($)", type: "number", min: 0, required: true },
    { key: "status", label: "Status", type: "select", options: ["vacant", "occupied"], required: true }
  ] },
  tenants: { title: "Tenants", singular: "Tenant", subtitle: "Keep tenant contact details and tenancy status up to date.", addLabel: "Add tenant", fields: [
    { key: "name", label: "Full name", required: true }, { key: "status", label: "Status", type: "select", options: ["active", "inactive"], required: true },
    { key: "email", label: "Email address", type: "email", required: true }, { key: "phone", label: "Phone number", type: "tel", required: true }
  ] },
  leases: { title: "Leases", singular: "Lease", subtitle: "Track lease terms, rent amounts, and end dates.", addLabel: "Add lease", fields: [
    { key: "propertyId", label: "Property", type: "relation", relation: "properties", required: true }, { key: "tenantId", label: "Tenant", type: "relation", relation: "tenants", required: true },
    { key: "startDate", label: "Start date", type: "date", required: true }, { key: "endDate", label: "End date", type: "date", required: true },
    { key: "rent", label: "Monthly rent ($)", type: "number", min: 0, required: true }, { key: "deposit", label: "Security deposit ($)", type: "number", min: 0, required: true },
    { key: "status", label: "Status", type: "select", options: ["active", "pending", "ended"], required: true }
  ] },
  payments: { title: "Payments", singular: "Payment", subtitle: "Monitor rent collection and record payments.", addLabel: "Add payment", fields: [
    { key: "leaseId", label: "Lease", type: "relation", relation: "leases", required: true }, { key: "tenantId", label: "Tenant", type: "relation", relation: "tenants", required: true },
    { key: "amount", label: "Amount ($)", type: "number", min: 0, required: true }, { key: "dueDate", label: "Due date", type: "date", required: true },
    { key: "paidDate", label: "Date paid", type: "date" }, { key: "method", label: "Payment method", type: "select", options: ["—", "Bank transfer", "Online", "Check", "Cash", "Other"] },
    { key: "status", label: "Status", type: "select", options: ["pending", "paid", "overdue"], required: true }
  ] },
  maintenance: { title: "Maintenance", singular: "Request", subtitle: "Track repair requests and property upkeep.", addLabel: "Add request", fields: [
    { key: "propertyId", label: "Property", type: "relation", relation: "properties", required: true }, { key: "title", label: "Request title", required: true },
    { key: "description", label: "Description", type: "textarea", full: true, required: true }, { key: "priority", label: "Priority", type: "select", options: ["low", "medium", "high"], required: true },
    { key: "status", label: "Status", type: "select", options: ["open", "in progress", "closed"], required: true }, { key: "reportedDate", label: "Reported date", type: "date", required: true }
  ] }
};
const columns = {
  properties: [["name", "Property"], ["address", "Location"], ["type", "Type"], ["bedrooms", "Beds"], ["rent", "Monthly rent"], ["status", "Status"]],
  tenants: [["name", "Tenant"], ["email", "Email"], ["phone", "Phone"], ["tenantLeases", "Current lease"], ["status", "Status"]],
  leases: [["property", "Property"], ["tenant", "Tenant"], ["term", "Lease term"], ["rent", "Monthly rent"], ["endDate", "End date"], ["status", "Status"]],
  payments: [["tenant", "Tenant"], ["property", "Property"], ["dueDate", "Due date"], ["amount", "Amount"], ["method", "Method"], ["status", "Status"]],
  maintenance: [["title", "Request"], ["property", "Property"], ["reportedDate", "Reported"], ["priority", "Priority"], ["status", "Status"]]
};
let state = loadState();
let activePage = "dashboard";
let editingId = null;
let searchTerm = "";

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(demoData);
    const data = JSON.parse(raw);
    for (const key of Object.keys(demoData)) if (!Array.isArray(data[key])) throw new Error("Saved data is incomplete.");
    return data;
  } catch (error) {
    console.error("Could not load saved rental data:", error);
    return structuredClone(demoData);
  }
}
function saveState() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
  catch (error) { console.error("Could not save rental data:", error); showToast("Changes could not be saved in this browser."); }
}
function esc(value) { return String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]); }
function money(value) { return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(Number(value) || 0); }
function dateLabel(value) { if (!value) return "—"; const d = new Date(`${value}T00:00:00`); return Number.isNaN(d.getTime()) ? "—" : d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); }
function get(collection, id) { return state[collection].find((item) => item.id === id); }
function initials(name) { return String(name || "?").split(/\s+/).slice(0, 2).map((part) => part[0] || "").join("").toUpperCase(); }
function showToast(message) { const el = document.createElement("div"); el.className = "toast"; el.textContent = message; document.querySelector("#toast-region").append(el); setTimeout(() => el.remove(), 3200); }
function setPage(page) {
  activePage = page; searchTerm = "";
  document.querySelector("#sidebar").classList.remove("open");
  document.querySelectorAll("[data-page]").forEach((el) => el.classList.toggle("active", el.dataset.page === page));
  document.querySelector("#crumb-current").textContent = page === "dashboard" ? "Overview" : definitions[page].title;
  renderPage();
}
function renderPage() {
  document.querySelector("#page-content").innerHTML = activePage === "dashboard" ? renderDashboard() : renderCollection(activePage);
}
function renderDashboard() {
  const count = state.properties.length;
  const occupied = state.properties.filter((p) => state.leases.some((l) => l.propertyId === p.id && l.status === "active")).length;
  const active = state.leases.filter((l) => l.status === "active");
  const rent = active.reduce((sum, l) => sum + Number(l.rent || 0), 0);
  const overdue = state.payments.filter((p) => p.status === "overdue");
  const owing = overdue.reduce((sum, p) => sum + Number(p.amount || 0), 0);
  const occupancy = count ? Math.round(occupied / count * 100) : 0;
  const monthly = monthTotals();
  const max = Math.max(1000, ...monthly);
  const points = monthly.map((v, i) => `${48 + i * 75},${148 - Math.min(115, v / max * 105)}`).join(" ");
  const area = `M ${points.split(" ").join(" L ")} L 498,159 L 48,159 Z`;
  const labels = Array.from({ length: 6 }, (_, i) => new Date(now.getFullYear(), now.getMonth() - 5 + i, 1).toLocaleDateString("en-US", { month: "short" }));
  const latest = [...state.payments].sort((a, b) => b.dueDate.localeCompare(a.dueDate)).slice(0, 4);
  const hour = now.getHours();
  const greeting = hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening";
  return `<div class="page-heading"><div><span class="eyebrow">${now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }).toUpperCase()}</span><h1>Good ${greeting}, Alex <span>✦</span></h1><p class="page-subtitle">Here’s what’s happening with your properties today.</p></div><button class="button button-primary" data-action="add" data-collection="properties">＋ Add a property</button></div>
  <section class="stats-grid">
    <article class="stat-card"><div class="stat-top"><span>Total properties</span><span class="stat-icon">▦</span></div><div class="stat-value">${count}</div><div class="stat-note"><em>${occupied} occupied</em> · ${count - occupied} vacant</div></article>
    <article class="stat-card"><div class="stat-top"><span>Monthly rent</span><span class="stat-icon">＄</span></div><div class="stat-value">${money(rent)}</div><div class="stat-note">Across ${active.length} active leases</div></article>
    <article class="stat-card"><div class="stat-top"><span>Occupancy rate</span><span class="stat-icon">↗</span></div><div class="stat-value">${occupancy}%</div><div class="stat-note">Based on your active leases</div></article>
    <article class="stat-card"><div class="stat-top"><span>Overdue rent</span><span class="stat-icon">◷</span></div><div class="stat-value">${money(owing)}</div><div class="stat-note">${overdue.length} payment${overdue.length === 1 ? "" : "s"} need attention</div></article>
  </section>
  <section class="dashboard-grid">
    <article class="panel"><div class="panel-heading"><div><h2>Rent collected</h2><p class="panel-caption">Monthly paid rent · last 6 months</p></div><span class="badge">Live data</span></div>
      <div class="chart-wrap"><svg viewBox="0 0 520 190" role="img" aria-label="Rent collected during the last six months"><defs><linearGradient id="chart-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#6c9b70" stop-opacity=".2"/><stop offset="1" stop-color="#6c9b70" stop-opacity="0"/></linearGradient></defs>
      <line class="chart-grid" x1="42" y1="35" x2="505" y2="35"/><line class="chart-grid" x1="42" y1="85" x2="505" y2="85"/><line class="chart-grid" x1="42" y1="135" x2="505" y2="135"/><text class="chart-label" x="0" y="38">$6k</text><text class="chart-label" x="0" y="88">$3k</text><text class="chart-label" x="10" y="138">$0</text>
      <path class="chart-fill" d="${area}"/><polyline class="chart-line" points="${points}"/>${monthly.map((v, i) => `<circle class="chart-dot" cx="${48 + i * 75}" cy="${148 - Math.min(115, v / max * 105)}" r="3.5"><title>${money(v)}</title></circle>`).join("")}${labels.map((label, i) => `<text class="chart-label" x="${48 + i * 75}" y="178" text-anchor="middle">${label}</text>`).join("")}</svg></div>
    </article>
    <article class="panel"><div class="panel-heading"><div><h2>Occupancy</h2><p class="panel-caption">Your portfolio at a glance</p></div><button class="text-link" data-page="properties">View properties →</button></div>
      <div class="occupancy-content"><div class="donut" style="--occupancy:${occupancy}%"><div class="donut-value">${occupancy}%<small>occupied</small></div></div><div class="legend"><div class="legend-row"><i class="legend-swatch"></i>${occupied} occupied</div><div class="legend-row"><i class="legend-swatch vacant"></i>${count - occupied} vacant</div></div></div>
    </article>
  </section>
  <section class="panel recent-panel"><div class="panel-heading"><div><h2>Recent rent activity</h2><p class="panel-caption">Latest payment records across your portfolio</p></div><button class="text-link" data-page="payments">All payments →</button></div>
  ${latest.length ? `<div class="table-scroll"><table><thead><tr><th>TENANT</th><th>PROPERTY</th><th>DUE DATE</th><th>AMOUNT</th><th>STATUS</th></tr></thead><tbody>${latest.map((p) => { const tenant = get("tenants", p.tenantId); const lease = get("leases", p.leaseId); const property = lease && get("properties", lease.propertyId); return `<tr><td><div class="person-cell"><span class="mini-avatar">${esc(initials(tenant?.name))}</span><span class="cell-primary">${esc(tenant?.name || "Deleted tenant")}</span></div></td><td>${esc(property?.name || "Deleted property")}</td><td>${dateLabel(p.dueDate)}</td><td>${money(p.amount)}</td><td>${badge(p.status)}</td></tr>`; }).join("")}</tbody></table></div>` : `<div class="empty-state">No payments yet. Add one to start tracking rent.</div>`}</section>
  <div class="quick-grid"><button class="quick-card" data-action="add" data-collection="tenants"><span>♙</span>Add a tenant</button><button class="quick-card" data-action="add" data-collection="leases"><span>▤</span>Create a lease</button><button class="quick-card" data-action="add" data-collection="maintenance"><span>⌁</span>Log maintenance</button></div>`;
}
function monthTotals() {
  return Array.from({ length: 6 }, (_, i) => {
    const month = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
    return state.payments.filter((p) => {
      if (p.status !== "paid" || !p.paidDate) return false;
      const date = new Date(`${p.paidDate}T00:00:00`);
      return date.getFullYear() === month.getFullYear() && date.getMonth() === month.getMonth();
    }).reduce((sum, p) => sum + Number(p.amount || 0), 0);
  });
}
function badge(value) { const v = value || "unknown"; return `<span class="badge ${esc(v.toLowerCase().replace(/\s+/g, "-"))}">${esc(v)}</span>`; }
function renderCollection(collection) {
  const definition = definitions[collection];
  const records = state[collection].filter((r) => matches(collection, r));
  const summary = collection === "properties"
    ? `<div class="summary-strip"><span>Properties<strong>${state.properties.length}</strong></span><span>Occupied<strong>${state.properties.filter((p) => state.leases.some((l) => l.propertyId === p.id && l.status === "active")).length}</strong></span><span>Vacant<strong>${state.properties.filter((p) => !state.leases.some((l) => l.propertyId === p.id && l.status === "active")).length}</strong></span></div>`
    : collection === "payments" ? `<div class="summary-strip"><span>Collected<strong>${money(state.payments.filter((p) => p.status === "paid").reduce((n, p) => n + Number(p.amount), 0))}</strong></span><span>Overdue<strong>${money(state.payments.filter((p) => p.status === "overdue").reduce((n, p) => n + Number(p.amount), 0))}</strong></span><span>Records<strong>${state.payments.length}</strong></span></div>` : "";
  return `<div class="page-heading"><div><span class="eyebrow">PORTFOLIO MANAGEMENT</span><h1>${definition.title}</h1><p class="page-subtitle">${definition.subtitle}</p></div><button class="button button-primary" data-action="add" data-collection="${collection}">＋ ${definition.addLabel}</button></div>
  <div class="table-panel"><div class="table-toolbar"><label class="search-box"><span class="search-symbol">⌕</span><input id="table-search" type="search" value="${esc(searchTerm)}" placeholder="Search ${definition.title.toLowerCase()}..." aria-label="Search ${definition.title.toLowerCase()}"></label><div class="table-tools"><button class="button button-quiet button-small" data-action="export" data-collection="${collection}">⇩ Export CSV</button><button class="button button-primary button-small" data-action="add" data-collection="${collection}">＋ ${definition.addLabel}</button></div></div>
  ${summary}<div class="table-scroll">${renderTable(collection, records)}</div><div class="table-footer"><span>Showing ${records.length} of ${state[collection].length} ${definition.title.toLowerCase()}</span><span>Changes are saved automatically</span></div></div>`;
}
function matches(collection, r) {
  if (!searchTerm) return true;
  const values = [r.name, r.email, r.phone, r.address, r.city, r.title, r.description, r.status, r.type, r.priority, r.amount, r.rent, r.dueDate, r.startDate, r.endDate];
  if (r.tenantId) values.push(get("tenants", r.tenantId)?.name);
  if (r.propertyId) values.push(get("properties", r.propertyId)?.name);
  if (r.leaseId) values.push(get("properties", get("leases", r.leaseId)?.propertyId)?.name);
  if (collection === "tenants") values.push(...state.leases.filter((l) => l.tenantId === r.id).map((l) => get("properties", l.propertyId)?.name));
  return values.filter(Boolean).join(" ").toLowerCase().includes(searchTerm.toLowerCase());
}
function renderTable(collection, records) {
  if (!records.length) return `<div class="empty-state">${searchTerm ? "No records match your search." : `No ${definitions[collection].title.toLowerCase()} yet. Add your first record to get started.`}</div>`;
  return `<table><thead><tr>${columns[collection].map(([, label]) => `<th>${esc(label.toUpperCase())}</th>`).join("")}<th>ACTIONS</th></tr></thead><tbody>${records.map((r) => `<tr>${columns[collection].map(([key]) => `<td>${cell(collection, r, key)}</td>`).join("")}<td><div class="row-actions"><button class="row-action" data-action="edit" data-collection="${collection}" data-id="${esc(r.id)}">Edit</button><button class="row-action delete" data-action="delete" data-collection="${collection}" data-id="${esc(r.id)}">Delete</button></div></td></tr>`).join("")}</tbody></table>`;
}
function cell(collection, r, key) {
  if (key === "status" || key === "priority") return badge(r[key]);
  if (key === "rent" || key === "amount") return `<span class="cell-primary">${money(r[key])}</span>`;
  if (["endDate", "dueDate", "reportedDate"].includes(key)) return dateLabel(r[key]);
  if (key === "term") return `${dateLabel(r.startDate)} – ${dateLabel(r.endDate)}`;
  if (key === "bedrooms") return `${esc(r.bedrooms)} bd · ${esc(r.bathrooms)} ba`;
  if (key === "address") return `<span class="cell-primary">${esc(r.address)}</span><div class="cell-secondary">${esc([r.city, r.state].filter(Boolean).join(", "))}</div>`;
  if (key === "name" && collection === "tenants") return `<div class="person-cell"><span class="mini-avatar">${esc(initials(r.name))}</span><span class="cell-primary">${esc(r.name)}</span></div>`;
  if (key === "name") return `<span class="cell-primary">${esc(r.name)}</span>`;
  if (key === "email") return `<span class="cell-primary">${esc(r.email)}</span>`;
  if (key === "tenantLeases") { const lease = state.leases.find((l) => l.tenantId === r.id && l.status === "active"); return esc(get("properties", lease?.propertyId)?.name || "—"); }
  if (key === "property") return esc(get("properties", r.propertyId || get("leases", r.leaseId)?.propertyId)?.name || "Deleted property");
  if (key === "tenant") return esc(get("tenants", r.tenantId)?.name || "Deleted tenant");
  if (key === "title") return `<span class="cell-primary">${esc(r.title)}</span><div class="cell-secondary">${esc(r.description || "")}</div>`;
  return esc(r[key] ?? "—");
}
function renderField(field, value) {
  const id = `field-${field.key}`, required = field.required ? "required" : "";
  let html;
  if (field.type === "select" || field.type === "relation") {
    const choices = field.type === "relation" ? state[field.relation].map((r) => ({ value: r.id, label: field.relation === "properties" ? r.name : `${get("properties", r.propertyId)?.name || "Lease"} · ${get("tenants", r.tenantId)?.name || "Tenant"}` })) : field.options.map((v) => ({ value: v, label: v }));
    html = `<select class="form-control" id="${id}" name="${field.key}" ${required}><option value="">Select ${esc(field.label.toLowerCase())}</option>${choices.map((o) => `<option value="${esc(o.value)}" ${String(value ?? "") === String(o.value) ? "selected" : ""}>${esc(o.label)}</option>`).join("")}</select>`;
  } else if (field.type === "textarea") html = `<textarea class="form-control" id="${id}" name="${field.key}" ${required}>${esc(value ?? "")}</textarea>`;
  else html = `<input class="form-control" id="${id}" name="${field.key}" type="${field.type || "text"}" value="${esc(value ?? "")}" ${field.min !== undefined ? `min="${field.min}"` : ""} ${field.step ? `step="${field.step}"` : ""} ${required}>`;
  return `<div class="form-field ${field.full ? "full" : ""}"><label for="${id}">${esc(field.label)}${field.required ? " *" : ""}</label>${html}</div>`;
}
function openForm(collection, id = null) {
  const def = definitions[collection], record = id ? get(collection, id) : null;
  if (!def) return;
  editingId = id;
  document.querySelector("#dialog-eyebrow").textContent = def.singular.toUpperCase();
  document.querySelector("#dialog-title").textContent = `${id ? "Edit" : "Add"} ${def.singular.toLowerCase()}`;
  document.querySelector("#dialog-fields").innerHTML = def.fields.map((f) => renderField(f, record?.[f.key])).join("");
  document.querySelector("#entity-form").dataset.collection = collection;
  document.querySelector("#entity-dialog").showModal();
  document.querySelector("#dialog-fields input, #dialog-fields select, #dialog-fields textarea")?.focus();
}
function saveForm(event) {
  event.preventDefault();
  const form = event.currentTarget, collection = form.dataset.collection, def = definitions[collection];
  const data = new FormData(form), record = {};
  for (const f of def.fields) { const v = data.get(f.key); record[f.key] = f.type === "number" ? Number(v || 0) : String(v || "").trim(); }
  if (collection === "payments" && record.status === "paid" && !record.paidDate) record.paidDate = isoDate(new Date());
  if (collection === "payments" && record.status !== "paid") record.paidDate = "";
  if (collection === "leases" && record.status === "active" && state.leases.some((l) => l.id !== editingId && l.status === "active" && l.propertyId === record.propertyId)) { showToast("This property already has an active lease."); return; }
  if (collection === "leases" && record.endDate < record.startDate) { showToast("Lease end date must be on or after the start date."); return; }
  if (editingId) { const index = state[collection].findIndex((r) => r.id === editingId); if (index >= 0) state[collection][index] = { ...state[collection][index], ...record }; }
  else state[collection].unshift({ id: makeId(collection), ...record });
  if (collection === "leases") {
    const property = get("properties", record.propertyId);
    if (property) property.status = record.status === "active" ? "occupied" : state.leases.some((l) => l.id !== editingId && l.propertyId === record.propertyId && l.status === "active") ? "occupied" : "vacant";
  }
  saveState(); document.querySelector("#entity-dialog").close(); renderPage(); showToast(`${def.singular} ${editingId ? "updated" : "added"}.`); editingId = null;
}
function makeId(collection) { return `${collection.slice(0, 3)}-${globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`}`; }
function deleteRecord(collection, id) {
  const record = get(collection, id);
  if (!record || !confirm(`Delete this ${definitions[collection].singular.toLowerCase()}? This cannot be undone.`)) return;
  state[collection] = state[collection].filter((r) => r.id !== id);
  saveState(); renderPage(); showToast(`${definitions[collection].singular} deleted.`);
}
function download(filename, data, type) {
  const url = URL.createObjectURL(new Blob([data], { type }));
  const link = document.createElement("a"); link.href = url; link.download = filename; link.click(); URL.revokeObjectURL(url);
}
function exportCsv(collection) {
  const rows = [columns[collection].map(([, label]) => label)];
  for (const r of state[collection]) rows.push(columns[collection].map(([key]) => {
    let value = r[key];
    if (key === "property") value = get("properties", r.propertyId || get("leases", r.leaseId)?.propertyId)?.name || "";
    if (key === "tenant") value = get("tenants", r.tenantId)?.name || "";
    if (key === "term") value = `${r.startDate} – ${r.endDate}`;
    if (key === "tenantLeases") value = get("properties", state.leases.find((l) => l.tenantId === r.id && l.status === "active")?.propertyId)?.name || "";
    if (key === "address") value = [r.address, r.city, r.state, r.postalCode].filter(Boolean).join(", ");
    return `"${String(value ?? "").replace(/"/g, '""')}"`;
  }));
  download(`${collection}-${isoDate(new Date())}.csv`, rows.map((row) => row.map((v) => v.startsWith('"') ? v : `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\r\n"), "text/csv;charset=utf-8");
  showToast(`${definitions[collection].title} exported as CSV.`);
}
function backup() {
  download(`haven-backup-${isoDate(new Date())}.json`, JSON.stringify({ exportedAt: new Date().toISOString(), data: state }, null, 2), "application/json");
  showToast("Your data backup is ready.");
}
function restore() {
  if (!confirm("Replace your current records with the original demo data? This cannot be undone.")) return;
  state = structuredClone(demoData); saveState(); renderPage(); showToast("Demo data restored.");
}
document.addEventListener("click", (event) => {
  const button = event.target.closest("button, a");
  if (!button) return;
  if (button.dataset.page) { event.preventDefault(); setPage(button.dataset.page); return; }
  const { action, collection, id } = button.dataset;
  if (action === "add") openForm(collection);
  if (action === "edit") openForm(collection, id);
  if (action === "delete") deleteRecord(collection, id);
  if (action === "export") exportCsv(collection);
  if (action === "backup") backup();
  if (action === "restore") restore();
  if (action === "close-dialog") document.querySelector("#entity-dialog").close();
});
document.querySelector("#page-content").addEventListener("input", (event) => {
  if (event.target.id !== "table-search") return;
  const pos = event.target.selectionStart; searchTerm = event.target.value.trim(); renderPage();
  const input = document.querySelector("#table-search"); input?.focus(); input?.setSelectionRange(pos, pos);
});
document.querySelector("#entity-form").addEventListener("submit", saveForm);
document.querySelector("#mobile-menu").addEventListener("click", () => document.querySelector("#sidebar").classList.toggle("open"));
document.querySelector("#today-label").textContent = now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
document.querySelector("#entity-dialog").addEventListener("close", () => { editingId = null; });
renderPage();
