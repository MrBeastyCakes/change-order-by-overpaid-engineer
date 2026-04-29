const serviceCatalog = [
  { category: "Roof", name: "Shingle Repair", price: 450, unit: "each" },
  { category: "Roof", name: "Roof Inspection & Report", price: 250, unit: "each" },
  { category: "Roof", name: "Leak Assessment & Repair", price: 250, unit: "each" },
  { category: "Roof", name: "Plumbing Stack Conversion", price: 525, unit: "each" },
  { category: "Roof", name: "Cannon Stack Flashing", price: 550, unit: "each" },
  { category: "Roof", name: "Roof Vent Installation (1)", price: 250, unit: "each" },
  { category: "Roof", name: "Deck Air Vent Install (4')", price: 500, unit: "each" },
  { category: "Roof", name: "Flashing and Shingle Replacement", price: 750, unit: "each" },
  { category: "Roof", name: "Counterflashing Installation (10')", price: 400, unit: "each" },
  { category: "Roof", name: "Metal Chimney Removal", price: 750, unit: "each" },
  { category: "Roof", name: "Brick Chimney Removal", price: 1600, unit: "each" },
  { category: "Roof", name: "Chimney Cap Re-sealing", price: 300, unit: "each" },
  { category: "Roof", name: "Animal Entry Point Repair", price: 450, unit: "each" },
  { category: "Roof", name: "Plumbing Mat Installation", price: 250, unit: "each" },
  { category: "Roof", name: "Chimney Saddle Build", price: 1000, unit: "each" },
  { category: "Roof", name: "Gable Vent Installation", price: 500, unit: "each" },
  { category: "Roof", name: "Primex Vent Installation", price: 575, unit: "each" },
  { category: "Roof", name: "Roof Top Snow Clearing", price: 349, unit: "each" },
  { category: "Roof", name: "Unclog Plumbing Stack (Debris)", price: 300, unit: "each" },
  { category: "Attic", name: "Attic Inspection & Diagnosis", price: 275, unit: "each" },
  { category: "Attic", name: "Air Sealing", price: 400, unit: "each" },
  { category: "Attic", name: "Exhaust Ducting Replacement", price: 475, unit: "each" },
  { category: "Attic", name: "Exhaust Duct & Vent Replacement", price: 625, unit: "each" },
  { category: "Attic", name: "Attic Hatch Treatment", price: 500, unit: "each" },
  { category: "Attic", name: "Thermal Camera Inspection", price: 250, unit: "each" },
  { category: "Attic", name: "Insulate Plumbing Stack", price: 450, unit: "each" },
  { category: "Exterior", name: "Downspout Repair Service", price: 250, unit: "each" },
  { category: "Exterior", name: "Eaves Sealant Repair", price: 250, unit: "each" },
  { category: "Exterior", name: "Fascia Repair", price: 250, unit: "each" },
  { category: "Exterior", name: "Fascia Board Repair", price: 7, unit: "ln ft" },
  { category: "Exterior", name: "Retro Drip Edge Installation", price: 250, unit: "each" },
  { category: "Exterior", name: "Soffit Repair", price: 250, unit: "each" },
  { category: "Exterior", name: "Downpipe Replacement (1 Story)", price: 250, unit: "each" },
  { category: "Exterior", name: "Downpipe Replacement (2 Story)", price: 350, unit: "each" },
  { category: "Exterior", name: "Retrofit Gutter Guard", price: 8.75, unit: "ln ft" },
  { category: "Exterior", name: "Eavestrough Replacement Service", price: 750, unit: "each" },
  { category: "Exterior", name: "Eavestrough Cleaning", price: 6.5, unit: "ln ft" },
  { category: "Exterior", name: "Exterior Siding Repair", price: 300, unit: "each" },
];

const linealCatalog = [
  { name: "Eaves", rates: { Easy: 9.9, Medium: 10.95, Hard: 11.15 } },
  { name: "Downpipes", rates: { Easy: 9.9, Medium: 10.55, Hard: 11.15 } },
  { name: "Soffit & Fascia", rates: { Easy: 16.25, Medium: 18.8, Hard: 21.9 } },
  { name: "OS Soffit", rates: { Easy: 8.5, Medium: 9.35, Hard: 10 } },
  { name: "Fascia Only", rates: { Easy: 7.15, Medium: 8.2, Hard: 9.5 } },
  { name: "Cladding", rates: { Easy: 13, Medium: 15, Hard: 16 } },
  { name: "Fascia Repairs", rates: { Easy: 4.5, Medium: 5, Hard: 5.5 } },
  { name: "Retro Drip", rates: { Easy: 5, Medium: 6, Hard: 7 } },
  { name: "Retro Alu-Rex", rates: { Easy: 7, Medium: 8, Hard: 9 } },
];

const STORAGE_KEY = "field-change-order-v1";
const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const state = {
  mode: "service",
  items: [],
  signature: "",
  signed: false,
};

const els = {
  persistFields: Array.from(document.querySelectorAll("[data-persist]")),
  serviceSelect: document.querySelector("#serviceSelect"),
  linealType: document.querySelector("#linealType"),
  linealDifficulty: document.querySelector("#linealDifficulty"),
  customDescription: document.querySelector("#customDescription"),
  itemQty: document.querySelector("#itemQty"),
  itemPrice: document.querySelector("#itemPrice"),
  itemScope: document.querySelector("#itemScope"),
  addItem: document.querySelector("#addItem"),
  itemsBody: document.querySelector("#itemsBody"),
  emptyState: document.querySelector("#emptyState"),
  itemCount: document.querySelector("#itemCount"),
  subtotal: document.querySelector("#subtotal"),
  taxRate: document.querySelector("#taxRate"),
  taxAmount: document.querySelector("#taxAmount"),
  grandTotal: document.querySelector("#grandTotal"),
  saveDraft: document.querySelector("#saveDraft"),
  clearOrder: document.querySelector("#clearOrder"),
  printOrder: document.querySelector("#printOrder"),
  draftStatus: document.querySelector("#draftStatus"),
  signaturePad: document.querySelector("#signaturePad"),
  signaturePrint: document.querySelector("#signaturePrint"),
  clearSignature: document.querySelector("#clearSignature"),
  toast: document.querySelector("#toast"),
  orderNumber: document.querySelector("#orderNumber"),
  workDate: document.querySelector("#workDate"),
  signerName: document.querySelector("#signerName"),
  customerName: document.querySelector("#customerName"),
};

let signatureContext;
let isDrawing = false;
let lastPoint = null;
let toastTimer;
let saveTimer;

function init() {
  seedOrderDefaults();
  populateCatalogs();
  restoreDraft();
  bindEvents();
  setMode(state.mode);
  resizeSignaturePad();
  updateBuilderFromSelection();
  renderItems();
  updateTotals();
  window.addEventListener("resize", resizeSignaturePad);
  window.addEventListener("beforeprint", preparePrint);
}

function seedOrderDefaults() {
  if (!els.orderNumber.value) {
    const now = new Date();
    const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(
      now.getDate(),
    ).padStart(2, "0")}`;
    els.orderNumber.value = `CO-${stamp}-${Math.floor(100 + Math.random() * 900)}`;
  }
  if (!els.workDate.value) {
    els.workDate.value = new Date().toISOString().slice(0, 10);
  }
}

function populateCatalogs() {
  const grouped = serviceCatalog.reduce((groups, service) => {
    groups[service.category] ||= [];
    groups[service.category].push(service);
    return groups;
  }, {});

  els.serviceSelect.innerHTML = Object.entries(grouped)
    .map(([category, services]) => {
      const options = services
        .map((service) => {
          const index = serviceCatalog.indexOf(service);
          const suffix = service.unit === "ln ft" ? " / ln ft" : "";
          return `<option value="${index}">${escapeHtml(service.name)} - ${currency.format(
            service.price,
          )}${suffix}</option>`;
        })
        .join("");
      return `<optgroup label="${escapeHtml(category)}">${options}</optgroup>`;
    })
    .join("");

  els.linealType.innerHTML = linealCatalog
    .map((item, index) => `<option value="${index}">${escapeHtml(item.name)}</option>`)
    .join("");
}

function bindEvents() {
  document.querySelectorAll("[data-item-mode]").forEach((button) => {
    button.addEventListener("click", () => setMode(button.dataset.itemMode));
  });

  [els.serviceSelect, els.linealType, els.linealDifficulty].forEach((input) => {
    input.addEventListener("change", () => {
      resetBuilderOverrides();
      updateBuilderFromSelection();
    });
  });

  [els.itemQty, els.customDescription].forEach((input) => {
    input.addEventListener("input", updateBuilderFromSelection);
  });

  els.itemPrice.addEventListener("input", () => {
    els.itemPrice.dataset.manual = "true";
  });
  els.itemScope.addEventListener("input", () => {
    els.itemScope.dataset.manual = "true";
  });

  els.addItem.addEventListener("click", addCurrentItem);
  els.saveDraft.addEventListener("click", () => {
    saveDraft();
    showToast("Draft saved");
  });
  els.clearOrder.addEventListener("click", clearOrder);
  els.printOrder.addEventListener("click", () => {
    preparePrint();
    window.print();
  });
  els.clearSignature.addEventListener("click", clearSignature);

  els.persistFields.forEach((field) => {
    field.addEventListener("input", queueSave);
    field.addEventListener("change", queueSave);
  });
  els.taxRate.addEventListener("input", updateTotals);
  els.taxRate.addEventListener("change", updateTotals);

  els.customerName.addEventListener("input", () => {
    if (!els.signerName.value.trim()) {
      els.signerName.value = els.customerName.value;
    }
  });

  els.signaturePad.addEventListener("pointerdown", startSignature);
  els.signaturePad.addEventListener("pointermove", drawSignature);
  els.signaturePad.addEventListener("pointerup", endSignature);
  els.signaturePad.addEventListener("pointercancel", endSignature);
  els.signaturePad.addEventListener("pointerleave", endSignature);
}

function setMode(mode) {
  state.mode = mode;
  resetBuilderOverrides();
  document.querySelectorAll("[data-item-mode]").forEach((button) => {
    button.classList.toggle("active", button.dataset.itemMode === mode);
  });
  document.querySelectorAll("[data-mode-panel]").forEach((panel) => {
    panel.hidden = panel.dataset.modePanel !== mode;
  });
  if (mode === "lineal") {
    els.itemQty.value = els.itemQty.value === "1" ? "10" : els.itemQty.value;
  }
  updateBuilderFromSelection();
}

function updateBuilderFromSelection() {
  let description = "";
  let price = Number.parseFloat(els.itemPrice.value || "0");

  if (state.mode === "service") {
    const service = serviceCatalog[Number(els.serviceSelect.value)] || serviceCatalog[0];
    description = service.name;
    price = service.price;
    if (service.unit === "ln ft" && Number(els.itemQty.value) === 1) {
      els.itemQty.value = "10";
    }
  }

  if (state.mode === "lineal") {
    const lineal = linealCatalog[Number(els.linealType.value)] || linealCatalog[0];
    const difficulty = els.linealDifficulty.value;
    description = `${lineal.name} (${difficulty})`;
    price = lineal.rates[difficulty];
  }

  if (state.mode === "custom") {
    description = els.customDescription.value.trim();
  }

  if (state.mode !== "custom") {
    if (els.itemPrice.dataset.manual !== "true") {
      els.itemPrice.value = formatPlainNumber(price);
    }
    if (els.itemScope.dataset.manual !== "true") {
      els.itemScope.value = description;
    }
  } else if (!els.itemScope.value.trim() || els.itemScope.dataset.manual !== "true") {
    els.itemScope.value = description;
  }
}

function resetBuilderOverrides() {
  els.itemPrice.dataset.manual = "false";
  els.itemScope.dataset.manual = "false";
}

function addCurrentItem() {
  const qty = Number.parseFloat(els.itemQty.value || "0");
  const unitPrice = Number.parseFloat(els.itemPrice.value || "0");
  const description = els.itemScope.value.trim() || els.customDescription.value.trim();

  if (!description) {
    showToast("Add a scope description");
    return;
  }
  if (qty <= 0 || unitPrice < 0) {
    showToast("Check quantity and price");
    return;
  }

  state.items.push({
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    description,
    qty,
    unitPrice,
  });

  if (state.mode === "custom") {
    els.customDescription.value = "";
    els.itemScope.value = "";
    resetBuilderOverrides();
  }

  renderItems();
  updateTotals();
  queueSave();
  showToast("Work added");
}

function renderItems() {
  els.itemsBody.innerHTML = "";

  state.items.forEach((item) => {
    const row = document.createElement("div");
    row.className = "line-row";
    row.dataset.id = item.id;
    row.setAttribute("role", "row");
    row.innerHTML = `
      <input aria-label="Scope" data-line-field="description" value="${escapeAttribute(item.description)}" />
      <input aria-label="Quantity" data-line-field="qty" type="number" min="0" step="0.01" inputmode="decimal" value="${formatPlainNumber(
        item.qty,
      )}" />
      <input aria-label="Unit price" data-line-field="unitPrice" type="number" min="0" step="0.01" inputmode="decimal" value="${formatPlainNumber(
        item.unitPrice,
      )}" />
      <strong class="line-total">${currency.format(item.qty * item.unitPrice)}</strong>
      <button class="remove-item no-print" type="button" aria-label="Remove item">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
        </svg>
      </button>
    `;
    els.itemsBody.appendChild(row);
  });

  els.itemsBody.querySelectorAll("[data-line-field]").forEach((input) => {
    input.addEventListener("input", updateLineItem);
  });
  els.itemsBody.querySelectorAll(".remove-item").forEach((button) => {
    button.addEventListener("click", removeLineItem);
  });

  const count = state.items.length;
  els.itemCount.textContent = `${count} ${count === 1 ? "item" : "items"}`;
  els.emptyState.hidden = count > 0;
}

function updateLineItem(event) {
  const row = event.target.closest(".line-row");
  const item = state.items.find((entry) => entry.id === row.dataset.id);
  if (!item) return;

  const field = event.target.dataset.lineField;
  item[field] =
    field === "description" ? event.target.value : Number.parseFloat(event.target.value || "0");

  row.querySelector(".line-total").textContent = currency.format(item.qty * item.unitPrice);
  updateTotals();
  queueSave();
}

function removeLineItem(event) {
  const row = event.target.closest(".line-row");
  state.items = state.items.filter((item) => item.id !== row.dataset.id);
  renderItems();
  updateTotals();
  queueSave();
}

function updateTotals() {
  const subtotal = state.items.reduce((sum, item) => sum + item.qty * item.unitPrice, 0);
  const taxRate = Number.parseFloat(els.taxRate.value || "0");
  const taxAmount = subtotal * (taxRate / 100);
  const grandTotal = subtotal + taxAmount;

  els.subtotal.textContent = currency.format(subtotal);
  els.taxAmount.textContent = currency.format(taxAmount);
  els.grandTotal.textContent = currency.format(grandTotal);
}

function resizeSignaturePad() {
  const canvas = els.signaturePad;
  const ratio = Math.max(window.devicePixelRatio || 1, 1);
  const rect = canvas.getBoundingClientRect();
  const savedSignature = state.signature;

  canvas.width = Math.round(rect.width * ratio);
  canvas.height = Math.round(rect.height * ratio);
  signatureContext = canvas.getContext("2d");
  signatureContext.setTransform(ratio, 0, 0, ratio, 0, 0);
  signatureContext.lineCap = "round";
  signatureContext.lineJoin = "round";
  signatureContext.lineWidth = 2.4;
  signatureContext.strokeStyle = "#17202a";

  clearCanvasOnly();
  if (savedSignature) {
    const image = new Image();
    image.onload = () => {
      signatureContext.drawImage(image, 0, 0, rect.width, rect.height);
    };
    image.src = savedSignature;
  }
}

function startSignature(event) {
  event.preventDefault();
  isDrawing = true;
  state.signed = true;
  lastPoint = getCanvasPoint(event);
  els.signaturePad.setPointerCapture(event.pointerId);
}

function drawSignature(event) {
  if (!isDrawing) return;
  event.preventDefault();
  const point = getCanvasPoint(event);
  signatureContext.beginPath();
  signatureContext.moveTo(lastPoint.x, lastPoint.y);
  signatureContext.lineTo(point.x, point.y);
  signatureContext.stroke();
  lastPoint = point;
}

function endSignature(event) {
  if (!isDrawing) return;
  isDrawing = false;
  lastPoint = null;
  try {
    els.signaturePad.releasePointerCapture(event.pointerId);
  } catch {
    // Pointer capture can already be released when the pointer leaves the canvas.
  }
  state.signature = els.signaturePad.toDataURL("image/png");
  syncSignatureImage();
  queueSave();
}

function getCanvasPoint(event) {
  const rect = els.signaturePad.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
}

function clearCanvasOnly() {
  const rect = els.signaturePad.getBoundingClientRect();
  signatureContext.clearRect(0, 0, rect.width, rect.height);
}

function clearSignature() {
  clearCanvasOnly();
  state.signature = "";
  state.signed = false;
  syncSignatureImage();
  queueSave();
}

function syncSignatureImage() {
  els.signaturePrint.src = state.signature || "";
}

function preparePrint() {
  syncSignatureImage();
  saveDraft();
}

function queueSave() {
  els.draftStatus.textContent = "Unsaved";
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    saveDraft();
    els.draftStatus.textContent = "Saved";
  }, 450);
}

function saveDraft() {
  const fields = {};
  els.persistFields.forEach((field) => {
    fields[field.id] = field.value;
  });
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      fields,
      items: state.items,
      mode: state.mode,
      signature: state.signature,
      signed: state.signed,
    }),
  );
  els.draftStatus.textContent = "Saved";
}

function restoreDraft() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;

  try {
    const draft = JSON.parse(raw);
    Object.entries(draft.fields || {}).forEach(([id, value]) => {
      const field = document.getElementById(id);
      if (field) field.value = value;
    });
    state.items = Array.isArray(draft.items) ? draft.items : [];
    state.mode = draft.mode || "service";
    state.signature = draft.signature || "";
    state.signed = Boolean(draft.signed);
    syncSignatureImage();
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }
}

function clearOrder() {
  const confirmed = window.confirm("Clear this change order and start a new one?");
  if (!confirmed) return;

  localStorage.removeItem(STORAGE_KEY);
  state.items = [];
  state.signature = "";
  state.signed = false;

  els.persistFields.forEach((field) => {
    field.value = "";
  });
  document.querySelector("#customerNote").value =
    "Customer authorizes the listed change-order work and price before the work begins.";
  seedOrderDefaults();
  clearSignature();
  renderItems();
  updateTotals();
  saveDraft();
  showToast("New change order ready");
}

function showToast(message) {
  clearTimeout(toastTimer);
  els.toast.textContent = message;
  els.toast.classList.add("show");
  toastTimer = setTimeout(() => {
    els.toast.classList.remove("show");
  }, 2200);
}

function formatPlainNumber(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "0";
  return String(Math.round(number * 100) / 100);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replaceAll("\n", " ");
}

init();
