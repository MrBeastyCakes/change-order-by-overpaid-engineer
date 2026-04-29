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
  { category: "Lineal", name: "Eaves", rates: { Easy: 9.9, Medium: 10.95, Hard: 11.15 } },
  { category: "Lineal", name: "Downpipes", rates: { Easy: 9.9, Medium: 10.55, Hard: 11.15 } },
  { category: "Lineal", name: "Soffit & Fascia", rates: { Easy: 16.25, Medium: 18.8, Hard: 21.9 } },
  { category: "Lineal", name: "OS Soffit", rates: { Easy: 8.5, Medium: 9.35, Hard: 10 } },
  { category: "Lineal", name: "Fascia Only", rates: { Easy: 7.15, Medium: 8.2, Hard: 9.5 } },
  { category: "Lineal", name: "Cladding", rates: { Easy: 13, Medium: 15, Hard: 16 } },
  { category: "Lineal", name: "Fascia Repairs", rates: { Easy: 4.5, Medium: 5, Hard: 5.5 } },
  { category: "Lineal", name: "Retro Drip", rates: { Easy: 5, Medium: 6, Hard: 7 } },
  { category: "Lineal", name: "Retro Alu-Rex", rates: { Easy: 7, Medium: 8, Hard: 9 } },
];

const starterCustomBlocks = [
  {
    id: "custom-repair-area",
    category: "Custom",
    name: "Repair damaged area",
    phase: "Other",
    unit: "allowance",
    defaultQty: 1,
    price: 250,
    note: "Repair damaged area discovered on-site.",
  },
  {
    id: "custom-extra-labor",
    category: "Custom",
    name: "Additional labor",
    phase: "Other",
    unit: "hour",
    defaultQty: 1,
    price: 75,
    note: "Additional labor required to complete approved work.",
  },
  {
    id: "custom-material-allowance",
    category: "Custom",
    name: "Material allowance",
    phase: "Other",
    unit: "allowance",
    defaultQty: 1,
    price: 150,
    note: "Additional material allowance for approved change-order work.",
  },
];

const STORAGE_KEY = "field-change-order-v2";
const OLD_STORAGE_KEY = "field-change-order-v1";
const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const state = {
  items: [],
  customBlocks: [...starterCustomBlocks],
  libraryFilter: "custom",
  signature: "",
  signed: false,
};

const els = {
  shell: document.querySelector(".app-shell"),
  persistFields: Array.from(document.querySelectorAll("[data-persist]")),
  orderNumber: document.querySelector("#orderNumber"),
  workDate: document.querySelector("#workDate"),
  customerName: document.querySelector("#customerName"),
  signerName: document.querySelector("#signerName"),
  customerNote: document.querySelector("#customerNote"),
  customName: document.querySelector("#customName"),
  customPhase: document.querySelector("#customPhase"),
  customUnit: document.querySelector("#customUnit"),
  customQty: document.querySelector("#customQty"),
  customPrice: document.querySelector("#customPrice"),
  customNote: document.querySelector("#customNote"),
  addCustomToJob: document.querySelector("#addCustomToJob"),
  makeReusableBlock: document.querySelector("#makeReusableBlock"),
  blockSearch: document.querySelector("#blockSearch"),
  blockPalette: document.querySelector("#blockPalette"),
  jobDropzone: document.querySelector("#jobDropzone"),
  jobList: document.querySelector("#jobList"),
  emptyBoard: document.querySelector("#emptyBoard"),
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
};

let signatureContext;
let isDrawing = false;
let lastPoint = null;
let toastTimer;
let saveTimer;
let pointerDrag = null;

function init() {
  seedOrderDefaults();
  restoreDraft();
  bindEvents();
  renderPalette();
  renderJobBoard();
  resizeSignaturePad();
  updateTotals();
  syncEnergyMode();
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

function bindEvents() {
  document.querySelectorAll("[data-energy-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      els.shell.dataset.energy = button.dataset.energyMode;
      syncEnergyMode();
      queueSave();
    });
  });

  document.querySelectorAll("[data-library-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      state.libraryFilter = button.dataset.libraryFilter;
      renderPalette();
    });
  });

  els.blockSearch.addEventListener("input", renderPalette);
  els.addCustomToJob.addEventListener("click", addCustomWorkToJob);
  els.makeReusableBlock.addEventListener("click", makeReusableBlock);
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

  els.jobDropzone.addEventListener("dragover", allowDropOnBoard);
  els.jobDropzone.addEventListener("dragleave", leaveDropZone);
  els.jobDropzone.addEventListener("drop", dropBlockOnBoard);

  els.signaturePad.addEventListener("pointerdown", startSignature);
  els.signaturePad.addEventListener("pointermove", drawSignature);
  els.signaturePad.addEventListener("pointerup", endSignature);
  els.signaturePad.addEventListener("pointercancel", endSignature);
  els.signaturePad.addEventListener("pointerleave", endSignature);
}

function syncEnergyMode() {
  document.querySelectorAll("[data-energy-mode]").forEach((button) => {
    button.classList.toggle("active", button.dataset.energyMode === els.shell.dataset.energy);
  });
}

function addCustomWorkToJob() {
  const block = readCustomBlock();
  if (!block) return;
  saveCustomBlock(block);
  addBlockToJob(block, Number.parseFloat(els.customQty.value || "1"));
  resetCustomEntry();
  showToast("Custom work added");
}

function makeReusableBlock() {
  const block = readCustomBlock();
  if (!block) return;
  saveCustomBlock(block);
  state.libraryFilter = "custom";
  renderPalette();
  queueSave();
  showToast("Block ready");
}

function readCustomBlock() {
  const name = els.customName.value.trim();
  const price = Number.parseFloat(els.customPrice.value || "0");
  const qty = Number.parseFloat(els.customQty.value || "0");

  if (!name) {
    showToast("Name the work");
    els.customName.focus();
    return null;
  }
  if (qty <= 0 || price < 0) {
    showToast("Check quantity and price");
    return null;
  }

  return {
    id: createId("custom"),
    category: "Custom",
    name,
    phase: els.customPhase.value,
    unit: els.customUnit.value,
    defaultQty: qty,
    price,
    note: els.customNote.value.trim() || name,
  };
}

function saveCustomBlock(block) {
  const existing = state.customBlocks.find(
    (item) => item.name.toLowerCase() === block.name.toLowerCase() && item.unit === block.unit,
  );
  if (existing) {
    Object.assign(existing, block, { id: existing.id });
  } else {
    state.customBlocks.unshift(block);
  }
  renderPalette();
}

function resetCustomEntry() {
  els.customName.value = "";
  els.customQty.value = "1";
  els.customPrice.value = "0";
  els.customNote.value = "";
}

function renderPalette() {
  document.querySelectorAll("[data-library-filter]").forEach((button) => {
    button.classList.toggle("active", button.dataset.libraryFilter === state.libraryFilter);
  });

  const query = els.blockSearch.value.trim().toLowerCase();
  const blocks = getLibraryBlocks()
    .filter((block) => {
      return `${block.name} ${block.category} ${block.phase || ""}`.toLowerCase().includes(query);
    })
    .slice(0, 60);

  els.blockPalette.innerHTML = "";
  if (!blocks.length) {
    els.blockPalette.innerHTML = `<div class="palette-empty">No matching blocks</div>`;
    return;
  }

  blocks.forEach((block) => {
    const card = document.createElement("article");
    card.className = "block-card";
    card.draggable = false;
    card.dataset.blockType = state.libraryFilter;
    card.dataset.blockId = block.id;
    card.innerHTML = `
      <div class="drag-grip" aria-hidden="true">
        <span></span><span></span><span></span>
      </div>
      <div class="block-main">
        <strong>${escapeHtml(block.name)}</strong>
        <span>${escapeHtml(block.phase || block.category)} · ${currency.format(block.price)} / ${escapeHtml(
          block.unit,
        )}</span>
      </div>
      <button class="icon-button add-block" type="button" title="Add block" aria-label="Add block">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
      </button>
    `;
    card.addEventListener("pointerdown", (event) => beginBlockPointerDrag(event, block, card));
    card.addEventListener("pointermove", moveBlockPointerDrag);
    card.addEventListener("pointerup", endBlockPointerDrag);
    card.addEventListener("pointercancel", cancelBlockPointerDrag);
    card.querySelector(".add-block").addEventListener("click", () => {
      addBlockToJob(block);
      showToast("Block added");
    });
    els.blockPalette.appendChild(card);
  });
}

function beginBlockPointerDrag(event, block, card) {
  if (event.target.closest("button,input,select,textarea")) return;
  pointerDrag = {
    block,
    card,
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    dragging: false,
    ghost: null,
  };
  card.setPointerCapture(event.pointerId);
}

function moveBlockPointerDrag(event) {
  if (!pointerDrag || event.pointerId !== pointerDrag.pointerId) return;
  const dx = event.clientX - pointerDrag.startX;
  const dy = event.clientY - pointerDrag.startY;

  if (!pointerDrag.dragging && Math.hypot(dx, dy) > 8) {
    pointerDrag.dragging = true;
    pointerDrag.card.classList.add("dragging");
    pointerDrag.ghost = pointerDrag.card.cloneNode(true);
    pointerDrag.ghost.classList.add("drag-ghost");
    pointerDrag.ghost.style.width = `${pointerDrag.card.getBoundingClientRect().width}px`;
    document.body.appendChild(pointerDrag.ghost);
    els.jobDropzone.classList.add("is-ready");
  }

  if (!pointerDrag.dragging) return;
  event.preventDefault();
  pointerDrag.ghost.style.left = `${event.clientX}px`;
  pointerDrag.ghost.style.top = `${event.clientY}px`;
}

function endBlockPointerDrag(event) {
  if (!pointerDrag || event.pointerId !== pointerDrag.pointerId) return;
  const placed = pointerDrag.dragging && isPointInside(event.clientX, event.clientY, els.jobDropzone);
  const block = pointerDrag.block;
  cleanupPointerDrag(event);

  if (placed) {
    addBlockToJob(block);
    showToast("Block placed");
  }
}

function cancelBlockPointerDrag(event) {
  if (!pointerDrag || event.pointerId !== pointerDrag.pointerId) return;
  cleanupPointerDrag(event);
}

function cleanupPointerDrag(event) {
  try {
    pointerDrag.card.releasePointerCapture(event.pointerId);
  } catch {
    // Pointer capture can already be released after a cancel.
  }
  pointerDrag.card.classList.remove("dragging");
  pointerDrag.ghost?.remove();
  pointerDrag = null;
  els.jobDropzone.classList.remove("is-ready");
}

function isPointInside(x, y, element) {
  const rect = element.getBoundingClientRect();
  return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
}

function getLibraryBlocks() {
  if (state.libraryFilter === "custom") {
    return state.customBlocks;
  }
  if (state.libraryFilter === "lineal") {
    return linealCatalog.map((item) => ({
      id: `lineal-${slug(item.name)}`,
      category: "Lineal",
      phase: "Aluminum",
      name: `${item.name} (Medium)`,
      unit: "ln ft",
      price: item.rates.Medium,
      note: `${item.name} change-order work.`,
    }));
  }
  return serviceCatalog.map((service, index) => ({
    id: `service-${index}`,
    category: service.category,
    phase: service.category,
    name: service.name,
    unit: service.unit,
    price: service.price,
    note: service.name,
  }));
}

function allowDropOnBoard(event) {
  event.preventDefault();
  els.jobDropzone.classList.add("is-ready");
}

function leaveDropZone(event) {
  if (!els.jobDropzone.contains(event.relatedTarget)) {
    els.jobDropzone.classList.remove("is-ready");
  }
}

function dropBlockOnBoard(event) {
  event.preventDefault();
  els.jobDropzone.classList.remove("is-ready");
  const raw = event.dataTransfer.getData("application/json");
  if (!raw) return;

  try {
    const block = JSON.parse(raw);
    addBlockToJob(block);
    showToast("Block placed");
  } catch {
    showToast("Could not place block");
  }
}

function addBlockToJob(block, qty = block.defaultQty || 1) {
  state.items.push({
    id: createId("item"),
    description: block.note || block.name,
    phase: block.phase || block.category || "Other",
    qty: Number(qty) || 1,
    unit: block.unit || "each",
    unitPrice: Number(block.price) || 0,
  });
  renderJobBoard();
  updateTotals();
  queueSave();
}

function renderJobBoard() {
  els.jobList.innerHTML = "";

  state.items.forEach((item, index) => {
    const card = document.createElement("article");
    card.className = "job-card";
    card.dataset.id = item.id;
    card.draggable = true;
    card.innerHTML = `
      <div class="job-card-head">
        <button class="drag-handle" type="button" title="Move work" aria-label="Move work">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 7h.01M12 7h.01M16 7h.01M8 12h.01M12 12h.01M16 12h.01M8 17h.01M12 17h.01M16 17h.01" /></svg>
        </button>
        <select data-line-field="phase" aria-label="Area">
          ${phaseOptions(item.phase)}
        </select>
        <strong>${currency.format(item.qty * item.unitPrice)}</strong>
      </div>
      <label class="wide">
        Scope
        <textarea data-line-field="description" rows="2">${escapeHtml(item.description)}</textarea>
      </label>
      <div class="job-card-grid">
        <label>
          Qty
          <input data-line-field="qty" type="number" min="0" step="0.01" inputmode="decimal" value="${formatPlainNumber(
            item.qty,
          )}" />
        </label>
        <label>
          Unit
          <input data-line-field="unit" value="${escapeAttribute(item.unit)}" />
        </label>
        <label>
          Unit price
          <input data-line-field="unitPrice" type="number" min="0" step="0.01" inputmode="decimal" value="${formatPlainNumber(
            item.unitPrice,
          )}" />
        </label>
      </div>
      <div class="card-actions no-print">
        <button class="mini-button" data-move="up" type="button" ${index === 0 ? "disabled" : ""}>Up</button>
        <button class="mini-button" data-move="down" type="button" ${
          index === state.items.length - 1 ? "disabled" : ""
        }>Down</button>
        <button class="mini-button danger" data-remove type="button">Remove</button>
      </div>
    `;

    card.addEventListener("dragstart", (event) => {
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/job-item", item.id);
      card.classList.add("dragging");
    });
    card.addEventListener("dragend", () => card.classList.remove("dragging"));
    card.addEventListener("dragover", (event) => event.preventDefault());
    card.addEventListener("drop", (event) => dropJobCard(event, item.id));

    card.querySelectorAll("[data-line-field]").forEach((input) => {
      input.addEventListener("input", updateLineItem);
      input.addEventListener("change", updateLineItem);
    });
    card.querySelectorAll("[data-move]").forEach((button) => {
      button.addEventListener("click", () => moveItem(item.id, button.dataset.move));
    });
    card.querySelector("[data-remove]").addEventListener("click", () => removeItem(item.id));

    els.jobList.appendChild(card);
  });

  const count = state.items.length;
  els.itemCount.textContent = `${count} ${count === 1 ? "item" : "items"}`;
  els.emptyBoard.hidden = count > 0;
}

function phaseOptions(activePhase) {
  return ["Roof", "Aluminum", "Attic", "Exterior", "Other"]
    .map((phase) => `<option ${phase === activePhase ? "selected" : ""}>${phase}</option>`)
    .join("");
}

function updateLineItem(event) {
  const card = event.target.closest(".job-card");
  const item = state.items.find((entry) => entry.id === card.dataset.id);
  if (!item) return;

  const field = event.target.dataset.lineField;
  item[field] =
    field === "qty" || field === "unitPrice"
      ? Number.parseFloat(event.target.value || "0")
      : event.target.value;

  card.querySelector(".job-card-head strong").textContent = currency.format(item.qty * item.unitPrice);
  updateTotals();
  queueSave();
}

function dropJobCard(event, targetId) {
  event.preventDefault();
  const draggedId = event.dataTransfer.getData("text/job-item");
  if (!draggedId || draggedId === targetId) return;

  const fromIndex = state.items.findIndex((item) => item.id === draggedId);
  const toIndex = state.items.findIndex((item) => item.id === targetId);
  if (fromIndex < 0 || toIndex < 0) return;

  const [moved] = state.items.splice(fromIndex, 1);
  state.items.splice(toIndex, 0, moved);
  renderJobBoard();
  queueSave();
}

function moveItem(id, direction) {
  const index = state.items.findIndex((item) => item.id === id);
  const offset = direction === "up" ? -1 : 1;
  const nextIndex = index + offset;
  if (index < 0 || nextIndex < 0 || nextIndex >= state.items.length) return;

  const [item] = state.items.splice(index, 1);
  state.items.splice(nextIndex, 0, item);
  renderJobBoard();
  queueSave();
}

function removeItem(id) {
  state.items = state.items.filter((item) => item.id !== id);
  renderJobBoard();
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
      energy: els.shell.dataset.energy,
      fields,
      items: state.items,
      customBlocks: state.customBlocks,
      signature: state.signature,
      signed: state.signed,
    }),
  );
  els.draftStatus.textContent = "Saved";
}

function restoreDraft() {
  const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(OLD_STORAGE_KEY);
  if (!raw) return;

  try {
    const draft = JSON.parse(raw);
    Object.entries(draft.fields || {}).forEach(([id, value]) => {
      const field = document.getElementById(id);
      if (field) field.value = value;
    });
    state.items = normalizeDraftItems(draft.items || []);
    state.customBlocks = normalizeCustomBlocks(draft.customBlocks || state.customBlocks);
    state.signature = draft.signature || "";
    state.signed = Boolean(draft.signed);
    els.shell.dataset.energy = draft.energy || "focus";
    syncSignatureImage();
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }
}

function normalizeDraftItems(items) {
  return items.map((item) => ({
    id: item.id || createId("item"),
    description: item.description || item.name || "Custom work",
    phase: item.phase || "Other",
    qty: Number(item.qty) || 1,
    unit: item.unit || "each",
    unitPrice: Number(item.unitPrice ?? item.price) || 0,
  }));
}

function normalizeCustomBlocks(blocks) {
  const cleanBlocks = blocks
    .filter((block) => block && block.name)
    .map((block) => ({
      id: block.id || createId("custom"),
      category: "Custom",
      name: block.name,
      phase: block.phase || "Other",
      unit: block.unit || "each",
      defaultQty: Number(block.defaultQty) || 1,
      price: Number(block.price) || 0,
      note: block.note || block.name,
    }));
  return cleanBlocks.length ? cleanBlocks : [...starterCustomBlocks];
}

function clearOrder() {
  const confirmed = window.confirm("Clear this change order and start a new one?");
  if (!confirmed) return;

  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(OLD_STORAGE_KEY);
  state.items = [];
  state.customBlocks = [...starterCustomBlocks];
  state.signature = "";
  state.signed = false;

  els.persistFields.forEach((field) => {
    field.value = "";
  });
  els.customerNote.value =
    "Customer authorizes the listed change-order work and price before the work begins.";
  seedOrderDefaults();
  clearSignature();
  resetCustomEntry();
  renderPalette();
  renderJobBoard();
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

function createId(prefix) {
  if (crypto.randomUUID) return `${prefix}-${crypto.randomUUID()}`;
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

function slug(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
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
