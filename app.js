const STORAGE_KEY = "field-change-order-itemized-v1";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const state = {
  items: [],
  signature: "",
};

const els = {
  persistFields: Array.from(document.querySelectorAll("[data-persist]")),
  orderNumber: document.querySelector("#orderNumber"),
  workDate: document.querySelector("#workDate"),
  customerName: document.querySelector("#customerName"),
  signerName: document.querySelector("#signerName"),
  itemName: document.querySelector("#itemName"),
  itemArea: document.querySelector("#itemArea"),
  itemUnit: document.querySelector("#itemUnit"),
  itemQty: document.querySelector("#itemQty"),
  itemPrice: document.querySelector("#itemPrice"),
  itemDetails: document.querySelector("#itemDetails"),
  addItem: document.querySelector("#addItem"),
  itemsDropzone: document.querySelector("#itemsDropzone"),
  itemsList: document.querySelector("#itemsList"),
  emptyState: document.querySelector("#emptyState"),
  itemCount: document.querySelector("#itemCount"),
  subtotal: document.querySelector("#subtotal"),
  taxRate: document.querySelector("#taxRate"),
  taxAmount: document.querySelector("#taxAmount"),
  grandTotal: document.querySelector("#grandTotal"),
  saveDraft: document.querySelector("#saveDraft"),
  newOrder: document.querySelector("#newOrder"),
  draftStatus: document.querySelector("#draftStatus"),
  printOrder: document.querySelector("#printOrder"),
  signaturePad: document.querySelector("#signaturePad"),
  signaturePrint: document.querySelector("#signaturePrint"),
  clearSignature: document.querySelector("#clearSignature"),
  toast: document.querySelector("#toast"),
};

let signatureContext;
let isDrawing = false;
let lastPoint = null;
let toastTimer;
let saveTimer;

function init() {
  seedDefaults();
  restoreDraft();
  bindEvents();
  renderItems();
  resizeSignaturePad();
  updateTotals();
  window.addEventListener("resize", resizeSignaturePad);
  window.addEventListener("beforeprint", preparePrint);
}

function seedDefaults() {
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

function bindEvents() {
  els.addItem.addEventListener("click", addItemFromForm);
  els.saveDraft.addEventListener("click", () => {
    saveDraft();
    showToast("Draft saved");
  });
  els.newOrder.addEventListener("click", clearOrder);
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

  [els.itemName, els.itemArea, els.itemUnit, els.itemQty, els.itemPrice, els.itemDetails].forEach((field) => {
    field.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && !event.shiftKey && field !== els.itemDetails) {
        event.preventDefault();
        addItemFromForm();
      }
    });
  });

  els.signaturePad.addEventListener("pointerdown", startSignature);
  els.signaturePad.addEventListener("pointermove", drawSignature);
  els.signaturePad.addEventListener("pointerup", endSignature);
  els.signaturePad.addEventListener("pointercancel", endSignature);
  els.signaturePad.addEventListener("pointerleave", endSignature);
}

function addItemFromForm() {
  const name = els.itemName.value.trim();
  const qty = Number.parseFloat(els.itemQty.value || "0");
  const unitPrice = Number.parseFloat(els.itemPrice.value || "0");

  if (!name) {
    showToast("Add an item name");
    els.itemName.focus();
    return;
  }

  if (qty <= 0 || unitPrice < 0) {
    showToast("Check quantity and price");
    return;
  }

  state.items.push({
    id: createId(),
    name,
    area: els.itemArea.value.trim(),
    unit: els.itemUnit.value.trim() || "each",
    qty,
    unitPrice,
    details: els.itemDetails.value.trim(),
  });

  resetItemForm();
  renderItems();
  updateTotals();
  queueSave();
  showToast("Item added");
}

function resetItemForm() {
  els.itemName.value = "";
  els.itemArea.value = "";
  els.itemUnit.value = "each";
  els.itemQty.value = "1";
  els.itemPrice.value = "0";
  els.itemDetails.value = "";
  els.itemName.focus();
}

function renderItems() {
  els.itemsList.innerHTML = "";

  state.items.forEach((item, index) => {
    const card = document.createElement("article");
    card.className = "item-card";
    card.dataset.id = item.id;
    card.draggable = true;
    card.innerHTML = `
      <div class="item-card-head">
        <button class="drag-handle no-print" type="button" title="Drag to reorder" aria-label="Drag to reorder">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8 7h.01M12 7h.01M16 7h.01M8 12h.01M12 12h.01M16 12h.01M8 17h.01M12 17h.01M16 17h.01" />
          </svg>
        </button>
        <div class="item-title">
          <input data-item-field="name" aria-label="Item name" value="${escapeAttribute(item.name)}" />
          <span>${currency.format(getItemTotal(item))}</span>
        </div>
      </div>

      <div class="item-grid">
        <label>
          Area or note
          <input data-item-field="area" value="${escapeAttribute(item.area)}" />
        </label>
        <label>
          Unit
          <input data-item-field="unit" value="${escapeAttribute(item.unit)}" />
        </label>
        <label>
          Qty
          <input data-item-field="qty" type="number" min="0" step="0.01" inputmode="decimal" value="${formatPlainNumber(
            item.qty,
          )}" />
        </label>
        <label>
          Unit price
          <input data-item-field="unitPrice" type="number" min="0" step="0.01" inputmode="decimal" value="${formatPlainNumber(
            item.unitPrice,
          )}" />
        </label>
        <label class="wide">
          Customer wording
          <textarea data-item-field="details" rows="2">${escapeHtml(item.details)}</textarea>
        </label>
      </div>

      <div class="item-actions no-print">
        <button class="mini-button" data-move="up" type="button" ${index === 0 ? "disabled" : ""}>Up</button>
        <button class="mini-button" data-move="down" type="button" ${
          index === state.items.length - 1 ? "disabled" : ""
        }>Down</button>
        <button class="mini-button" data-duplicate type="button">Duplicate</button>
        <button class="mini-button danger" data-remove type="button">Remove</button>
      </div>
    `;

    card.addEventListener("dragstart", (event) => {
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", item.id);
      card.classList.add("dragging");
    });
    card.addEventListener("dragend", () => card.classList.remove("dragging"));
    card.addEventListener("dragover", (event) => event.preventDefault());
    card.addEventListener("drop", (event) => dropItem(event, item.id));

    card.querySelectorAll("[data-item-field]").forEach((field) => {
      field.addEventListener("input", updateItem);
      field.addEventListener("change", updateItem);
    });
    card.querySelectorAll("[data-move]").forEach((button) => {
      button.addEventListener("click", () => moveItem(item.id, button.dataset.move));
    });
    card.querySelector("[data-duplicate]").addEventListener("click", () => duplicateItem(item.id));
    card.querySelector("[data-remove]").addEventListener("click", () => removeItem(item.id));

    els.itemsList.appendChild(card);
  });

  const count = state.items.length;
  els.itemCount.textContent = `${count} ${count === 1 ? "item" : "items"}`;
  els.emptyState.hidden = count > 0;
}

function updateItem(event) {
  const card = event.target.closest(".item-card");
  const item = state.items.find((entry) => entry.id === card.dataset.id);
  if (!item) return;

  const field = event.target.dataset.itemField;
  item[field] =
    field === "qty" || field === "unitPrice"
      ? Number.parseFloat(event.target.value || "0")
      : event.target.value;

  card.querySelector(".item-title span").textContent = currency.format(getItemTotal(item));
  updateTotals();
  queueSave();
}

function dropItem(event, targetId) {
  event.preventDefault();
  const draggedId = event.dataTransfer.getData("text/plain");
  if (!draggedId || draggedId === targetId) return;

  const fromIndex = state.items.findIndex((item) => item.id === draggedId);
  const toIndex = state.items.findIndex((item) => item.id === targetId);
  if (fromIndex < 0 || toIndex < 0) return;

  const [moved] = state.items.splice(fromIndex, 1);
  state.items.splice(toIndex, 0, moved);
  renderItems();
  queueSave();
}

function moveItem(id, direction) {
  const index = state.items.findIndex((item) => item.id === id);
  const nextIndex = index + (direction === "up" ? -1 : 1);
  if (index < 0 || nextIndex < 0 || nextIndex >= state.items.length) return;

  const [item] = state.items.splice(index, 1);
  state.items.splice(nextIndex, 0, item);
  renderItems();
  queueSave();
}

function duplicateItem(id) {
  const index = state.items.findIndex((item) => item.id === id);
  if (index < 0) return;

  const copy = { ...state.items[index], id: createId(), name: `${state.items[index].name} copy` };
  state.items.splice(index + 1, 0, copy);
  renderItems();
  updateTotals();
  queueSave();
  showToast("Item duplicated");
}

function removeItem(id) {
  state.items = state.items.filter((item) => item.id !== id);
  renderItems();
  updateTotals();
  queueSave();
}

function getItemTotal(item) {
  return (Number(item.qty) || 0) * (Number(item.unitPrice) || 0);
}

function updateTotals() {
  const subtotal = state.items.reduce((sum, item) => sum + getItemTotal(item), 0);
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
      signature: state.signature,
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
    state.items = Array.isArray(draft.items) ? draft.items.map(normalizeItem) : [];
    state.signature = draft.signature || "";
    syncSignatureImage();
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }
}

function normalizeItem(item) {
  return {
    id: item.id || createId(),
    name: item.name || "Change order item",
    area: item.area || "",
    unit: item.unit || "each",
    qty: Number(item.qty) || 1,
    unitPrice: Number(item.unitPrice) || 0,
    details: item.details || "",
  };
}

function clearOrder() {
  const confirmed = window.confirm("Clear this change order and start a new blank order?");
  if (!confirmed) return;

  localStorage.removeItem(STORAGE_KEY);
  state.items = [];
  state.signature = "";

  els.persistFields.forEach((field) => {
    field.value = "";
  });
  document.querySelector("#approvalNote").value =
    "Customer authorizes the listed change-order work and price before the work begins.";
  seedDefaults();
  resetItemForm();
  clearSignature();
  renderItems();
  updateTotals();
  saveDraft();
  showToast("Blank order ready");
}

function showToast(message) {
  clearTimeout(toastTimer);
  els.toast.textContent = message;
  els.toast.classList.add("show");
  toastTimer = setTimeout(() => {
    els.toast.classList.remove("show");
  }, 2200);
}

function createId() {
  if (crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
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
