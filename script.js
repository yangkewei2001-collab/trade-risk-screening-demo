let rules = [];
let authorityLibrary = { version: "Not loaded", lastUpdated: "Not loaded", references: [] };
let authorityById = new Map();

const ruleLibraryVersion = "2026.05.30-rules-v2";
const highRiskJurisdictions = [
  "russia",
  "iran",
  "north korea",
  "dprk",
  "syria",
  "crimea",
  "cuba",
  "belarus",
  "high-risk",
  "sanctioned"
];

const form = document.querySelector("#screening-form");
const report = document.querySelector("#report");
const exampleButton = document.querySelector("#load-transformer-example");
const openAuthorityButton = document.querySelector("#open-authority-library");
const closeAuthorityButton = document.querySelector("#close-authority-library");
const authorityDialog = document.querySelector("#authority-dialog");
const authorityLibraryContent = document.querySelector("#authority-library-content");

document.querySelector("#rule-version").textContent = ruleLibraryVersion;

Promise.all([
  fetch("rules.json").then((response) => response.json()),
  fetch("authority-references.json").then((response) => response.json())
])
  .then(([ruleData, authorityData]) => {
    rules = ruleData;
    authorityLibrary = authorityData;
    authorityById = new Map(authorityLibrary.references.map((reference) => [reference.id, reference]));
    document.querySelector("#authority-version").textContent = authorityLibrary.version;
    document.querySelector("#last-updated").textContent = authorityLibrary.lastUpdated;
    renderAuthorityLibrary();
  })
  .catch(() => {
    report.innerHTML = `<p class="error">Rules or authority references could not be loaded. Please check rules.json and authority-references.json.</p>`;
  });

exampleButton.addEventListener("click", () => {
  setFormValues({
    sellerCountry: "China",
    transactionStage: "pre-contract",
    buyerCountry: "Overseas buyer",
    destinationCountry: "High-risk example jurisdiction",
    endUserCountry: "High-risk example jurisdiction",
    paymentCountry: "Overseas payment bank",
    partyClarity: "unclear",
    incotermsRule: "unclear",
    namedPlacePort: "",
    exportClearanceParty: "unclear",
    importClearanceParty: "unclear",
    marineInsurance: "unclear",
    oversizedCargo: "yes",
    shippingWindow: "unclear",
    delayLD: "unclear",
    forceMajeure: "unclear",
    buyerDelayConsequences: "unclear",
    exportLicenceDelayAllocation: "unclear",
    governingLawStatus: "unclear",
    crossBorderDataTransfer: "yes",
    productCategory: "transformer",
    productName: "Customized power transformer",
    hsCode: "",
    technicalSpecsAttached: "no",
    technicalStandard: "iec",
    technicalParameters: "Voltage and capacity to be confirmed in technical appendix",
    customizedProduct: "yes",
    oemPrivateLabel: "yes",
    technologyTransfer: "yes",
    sanctionsScreening: "not-completed",
    exportControlReview: "not-completed",
    endUseClarity: "unclear",
    endUserIdentified: "unclear",
    endUseStatement: "no",
    noReExportClause: "no",
    intermediaryInvolved: "yes",
    transshipmentRoute: "unclear",
    countryMismatch: "yes",
    dualUseConcern: "unclear",
    contractValue: "high",
    productionCycle: "customized-project",
    paymentMethod: "tt",
    advancePaymentPercentage: "low",
    currencyRisk: "unclear",
    lcTerms: "not-applicable",
    retentionPayment: "yes",
    retentionReleaseCondition: "unclear",
    warrantyBond: "unclear",
    performanceBond: "unclear",
    parentGuarantee: "no",
    bankGuarantee: "unclear",
    lcSoftClauses: "not-applicable",
    exchangeRateClause: "unclear",
    technicalAppendix: "missing",
    fatRequirement: "unclear",
    satRequirement: "unclear",
    thirdPartyInspection: "unclear",
    acceptanceCriteria: "unclear",
    inspectionProcedure: "missing",
    testFailureRemedy: "unclear",
    deemedAcceptance: "unclear",
    inspectionDelayConsequences: "unclear",
    standardHierarchy: "unclear",
    warrantyPeriod: "unclear",
    sparePartsObligation: "unclear",
    commissioningSupport: "unclear",
    remoteSupport: "unclear",
    onsiteService: "unclear",
    onsiteResponsibility: "unclear",
    liabilityLimit: "unclear",
    disputeResolution: "unclear"
  });

  generateReport(new FormData(form));
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  generateReport(new FormData(form));
});

openAuthorityButton.addEventListener("click", () => {
  authorityDialog.showModal();
});

closeAuthorityButton.addEventListener("click", () => {
  authorityDialog.close();
});

function setFormValues(values) {
  form.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
    checkbox.checked = false;
  });

  Object.entries(values).forEach(([name, value]) => {
    const field = form.elements[name];
    if (!field) return;
    if (field instanceof RadioNodeList && field[0]?.type === "checkbox") {
      const selected = Array.isArray(value) ? value : [value];
      Array.from(field).forEach((checkbox) => {
        checkbox.checked = selected.includes(checkbox.value);
      });
    } else if (field.type === "checkbox") {
      field.checked = Boolean(value);
    } else {
      field.value = value;
    }
  });
}

function formDataToObject(formData) {
  return Array.from(formData.entries()).reduce((values, [key, value]) => {
    const normalized = String(value).trim();
    if (values[key]) {
      values[key] = Array.isArray(values[key]) ? [...values[key], normalized] : [values[key], normalized];
    } else {
      values[key] = normalized;
    }
    return values;
  }, {});
}

function generateReport(formData) {
  const values = formDataToObject(formData);
  const matches = rules
    .map((rule) => ({ rule, facts: getTriggeredFacts(rule, values) }))
    .filter((result) => result.facts.length > 0);

  report.innerHTML = `
    <div class="report-header">
      <p class="eyebrow">Preliminary Screening Report</p>
      <h2>Power Equipment Export Legal & Compliance Preliminary Screening Report</h2>
      <h3>电力设备出口法律与合规风险初筛报告</h3>
      <p>
        Product: <strong>${escapeHtml(values.productName || "Not specified")}</strong>
        · Destination: <strong>${escapeHtml(values.destinationCountry || "Not specified")}</strong>
        · Stage: <strong>${escapeHtml(getStageLabel(values.transactionStage))}</strong>
      </p>
      <p class="notice compact">
        This tool does not provide legal advice. It is only a preliminary issue-spotting
        and escalation prototype. Manual legal/compliance review is required. It does not
        query live sanctions lists or export-control databases, and it does not determine
        whether a transaction is lawful.
      </p>
    </div>
    ${renderStageChecklist(values.transactionStage)}
    ${
      matches.length
        ? matches.map(({ rule, facts }) => renderRisk(rule, facts)).join("")
        : `<p class="success">No configured rule was triggered. Manual review may still be required for high-value equipment exports.</p>`
    }
    ${renderReportFooter()}
  `;
}

function renderRisk(rule, facts) {
  const references = getRuleReferences(rule);
  const stageProfile = getStageProfile(rule.id, formDataToObject(new FormData(form)));
  const category = getRiskCategory(rule.id);

  return `
    <article class="risk-card">
      <div class="risk-title">
        <div>
          <h3>${escapeHtml(rule.title)}</h3>
          <p>${escapeHtml(rule.titleZh)}</p>
        </div>
        <span class="badge">${escapeHtml(rule.riskLevel)}</span>
      </div>
      <div class="risk-meta">
        <span><strong>Risk category:</strong> ${escapeHtml(category)}</span>
        <span><strong>Transaction stage affected:</strong> ${escapeHtml(stageProfile.stageLabel)}</span>
        <span><strong>Urgency:</strong> ${escapeHtml(stageProfile.urgency)}</span>
      </div>
      ${renderList("Triggered fact / 触发事实", facts)}
      <p><strong>Risk level / 风险等级:</strong> ${escapeHtml(rule.riskLevel)}</p>
      <p><strong>Legal/compliance rationale / 法律与合规理由:</strong> ${escapeHtml(rule.rationale)}</p>
      ${renderAuthorityDetails(references)}
      ${renderList("Evidence needed / 需要补充的材料", rule.evidenceNeeded)}
      ${renderList("Recommended action / 建议动作", rule.recommendedAction)}
      <p><strong>Manual review requirement / 是否需要人工复核:</strong> ${rule.manualReviewRequired ? "Yes / 是" : "No"}</p>
      <p><strong>Limitations / 工具适用边界:</strong> ${escapeHtml(rule.limitations)}</p>
    </article>
  `;
}

function renderAuthorityDetails(references) {
  if (!references.length) {
    return `<p><strong>Legal / regulatory references:</strong> No authority reference mapped.</p>`;
  }

  return `
    <details class="authority-details">
      <summary>View legal basis / 查看法律依据 (${references.length})</summary>
      <div class="authority-list">
        <h4>Legal / regulatory references / 法律、监管与权威依据</h4>
        ${references.map(renderAuthorityReference).join("")}
      </div>
    </details>
  `;
}

function renderStageChecklist(currentStage) {
  const stages = [
    {
      id: "before-signing",
      title: "Before signing / 签约前",
      items: [
        "Complete sanctions screening.",
        "Confirm end user and obtain end-use statement where needed.",
        "Conduct export-control classification.",
        "Clarify Incoterms rule and named place.",
        "Confirm payment security.",
        "Attach technical specifications.",
        "Clarify dispute resolution and governing law."
      ]
    },
    {
      id: "before-production",
      title: "Before production / 生产前",
      items: [
        "Confirm advance payment, L/C, or guarantees.",
        "Confirm technical appendix and applicable standards.",
        "Confirm FAT requirements.",
        "Confirm OEM/IP authorization if applicable.",
        "Confirm no re-export / no diversion clause if needed."
      ]
    },
    {
      id: "before-shipment",
      title: "Before shipment / 发货前",
      items: [
        "Verify sanctions screening remains current.",
        "Confirm export licence status if required.",
        "Complete FAT and inspection certificate.",
        "Prepare commercial invoice, packing list, certificate of origin, bill of lading, and insurance certificate.",
        "Confirm export/import clearance responsibility.",
        "Confirm shipping window and insurance."
      ]
    },
    {
      id: "before-delivery",
      title: "Before delivery / acceptance / 交付验收前",
      items: [
        "Confirm SAT procedure.",
        "Confirm deemed acceptance mechanism.",
        "Confirm non-conformity notice period.",
        "Confirm remedy mechanism for failed tests."
      ]
    },
    {
      id: "warranty",
      title: "Warranty / after-sales / 质保售后",
      items: [
        "Confirm warranty period.",
        "Confirm spare parts obligations.",
        "Confirm remote/on-site support obligations.",
        "Confirm liability cap and exclusions.",
        "Confirm visa, safety, and access responsibility for on-site service."
      ]
    }
  ];

  return `
    <section class="stage-checklist">
      <h3>Action Checklist by Stage / 按交易阶段行动清单</h3>
      <p>Current transaction stage: <strong>${escapeHtml(getStageLabel(currentStage))}</strong></p>
      <div class="checklist-grid">
        ${stages.map((stage) => `
          <div class="checklist-card ${isCurrentChecklistStage(stage.id, currentStage) ? "current" : ""}">
            <h4>${escapeHtml(stage.title)}</h4>
            <ul>${stage.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
          </div>
        `).join("")}
      </div>
    </section>
  `;
}

function renderAuthorityReference(reference) {
  const link = reference.officialUrl
    ? `<a href="${escapeAttribute(reference.officialUrl)}" target="_blank" rel="noreferrer">${escapeHtml(reference.officialUrl)}</a>`
    : `<span>Manual contract/legal review source; no single official URL</span>`;

  return `
    <div class="authority-ref">
      <h5>${escapeHtml(reference.name)}</h5>
      <dl>
        <dt>Jurisdiction / 管辖区域</dt>
        <dd>${escapeHtml(reference.jurisdiction)}</dd>
        <dt>Source type / 来源类型</dt>
        <dd>${escapeHtml(reference.type)}</dd>
        <dt>Official source / 官方来源</dt>
        <dd>${escapeHtml(reference.officialSource)}</dd>
        <dt>Why relevant / 为什么相关</dt>
        <dd>${escapeHtml(reference.relevance)}</dd>
        <dt>How used in this demo / 本原型如何使用</dt>
        <dd>${escapeHtml(reference.howToUseInThisDemo)}</dd>
        <dt>Applicability limits / 适用边界</dt>
        <dd>${escapeHtml(reference.limitations)}</dd>
        <dt>Last checked / 最近核查</dt>
        <dd>${escapeHtml(reference.lastChecked)}</dd>
        <dt>Manual verification required / 是否需要人工复核</dt>
        <dd>${reference.manualVerificationRequired ? "Yes / 是" : "No"}</dd>
        <dt>Official source link / 官方来源链接</dt>
        <dd>${link}</dd>
      </dl>
    </div>
  `;
}

function renderReportFooter() {
  return `
    <div class="report-footer">
      <p>
        <strong>Rule library version:</strong> ${escapeHtml(ruleLibraryVersion)}
        · <strong>Authority library version:</strong> ${escapeHtml(authorityLibrary.version)}
        · <strong>Last updated:</strong> ${escapeHtml(authorityLibrary.lastUpdated)}
      </p>
      <p>This demo does not perform live database searches. Manual verification required before real transaction use.</p>
    </div>
  `;
}

function renderAuthorityLibrary() {
  const grouped = authorityLibrary.references.reduce((groups, reference) => {
    if (!groups[reference.category]) groups[reference.category] = [];
    groups[reference.category].push(reference);
    return groups;
  }, {});

  const preferredOrder = [
    "Trade Terms & International Sale of Goods",
    "Sanctions & Restricted Party Screening",
    "Export Control",
    "AML / Trade-Based Money Laundering",
    "Technical Standards",
    "IP / OEM / Confidentiality",
    "Arbitration & Dispute Resolution",
    "Cross-border Data Transfer"
  ];

  authorityLibraryContent.innerHTML = preferredOrder
    .filter((category) => grouped[category])
    .map((category) => `
      <section class="authority-category">
        <h3>${escapeHtml(category)}</h3>
        ${grouped[category].map(renderAuthorityReference).join("")}
      </section>
    `)
    .join("");
}

function renderList(title, items) {
  return `
    <div>
      <strong>${title}:</strong>
      <ul>
        ${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
      </ul>
    </div>
  `;
}

function getRuleReferences(rule) {
  return (rule.authorityIds || [])
    .map((id) => authorityById.get(id))
    .filter(Boolean);
}

function getRiskCategory(ruleId) {
  const categories = {
    "export-control-review": "Export control",
    "sanctions-screening": "Sanctions / restricted party",
    "high-value-payment": "Payment security",
    "technical-acceptance": "FAT / SAT / technical acceptance",
    "oem-ip-technology": "IP / OEM / confidentiality",
    "dispute-resolution": "Dispute resolution",
    "trade-terms-governing-law": "Incoterms / logistics / governing law",
    "cross-border-data-transfer": "Cross-border data",
    "delivery-delay": "Delivery / delay",
    "end-use-diversion": "End-use / diversion",
    "warranty-after-sales": "Warranty / after-sales",
    "shipment-documents": "Documents / customs readiness"
  };
  return categories[ruleId] || "General risk";
}

function getStageProfile(ruleId, values) {
  const stage = values.transactionStage || "pre-contract";
  const stageLabel = getStageLabel(stage);
  const map = {
    "export-control-review": {
      "pre-contract": "Before signing: complete classification and end-use/end-user review before contract signing.",
      "contract-signed": "Before production: review immediately before production or shipment commitments continue.",
      "production": "Critical: pause production or shipment planning until export-control review is completed.",
      "pre-shipment": "Critical before shipment: do not ship until classification, licence status, and end-use/end-user review are verified.",
      "delivery": "Post-shipment escalation: preserve records and seek urgent compliance review.",
      "warranty": "After-sales escalation: review whether technical support, spare parts, or documentation create controlled transfer issues."
    },
    "sanctions-screening": {
      "pre-contract": "Before signing: screen parties, banks, destination, end user, and intermediaries.",
      "contract-signed": "Before payment or production: refresh sanctions screening before performance continues.",
      "production": "Before payment/shipment: refresh screening and resolve red flags before shipment.",
      "pre-shipment": "Critical before shipment: confirm screening is current and complete.",
      "delivery": "Before delivery/acceptance: confirm no new sanctions or restricted-party changes.",
      "warranty": "Before after-sales support: rescreen parties and destination before service or spare-parts supply."
    },
    "technical-acceptance": {
      "pre-contract": "Before signing: attach technical appendix and acceptance procedure.",
      "contract-signed": "Before production: clarify FAT/SAT, standards, and remedies through amendment if needed.",
      "production": "Before shipment: resolve FAT/SAT and technical evidence gaps before completion.",
      "pre-shipment": "High before shipment: clarify FAT/SAT and acceptance documents before shipment.",
      "delivery": "Before acceptance: align SAT, non-conformity notice, and remedy process.",
      "warranty": "Warranty stage: use acceptance records to separate defects from warranty claims."
    },
    "high-value-payment": {
      "pre-contract": "Before signing: confirm payment security and guarantees.",
      "contract-signed": "Before production: do not start production without adequate payment security.",
      "production": "Critical cashflow point: review milestone payments and security before continuing production.",
      "pre-shipment": "Before shipment: confirm collectability, L/C compliance, and retention release mechanics.",
      "delivery": "Before release/acceptance: confirm outstanding payment and retention arrangements.",
      "warranty": "Warranty stage: monitor retention, warranty bond, and final release conditions."
    },
    "warranty-after-sales": {
      "delivery": "Before delivery: clarify warranty, support, site access, and liability before acceptance.",
      "warranty": "Warranty stage: high operational urgency if service obligations are unclear."
    }
  };
  return {
    stageLabel,
    urgency: map[ruleId]?.[stage] || defaultUrgency(stage)
  };
}

function defaultUrgency(stage) {
  const defaults = {
    "pre-contract": "Before signing: resolve before contract execution where possible.",
    "contract-signed": "Before production: resolve through amendment or written confirmation.",
    "production": "Before shipment: resolve before goods are completed or shipped.",
    "pre-shipment": "Before shipment: complete review before dispatch.",
    "delivery": "Before delivery/acceptance: resolve before handover or deemed acceptance.",
    "warranty": "Warranty / after-sales: resolve before service, spare parts, or technical support."
  };
  return defaults[stage] || defaults["pre-contract"];
}

function getStageLabel(stage) {
  const labels = {
    "pre-contract": "Pre-contract",
    "contract-signed": "Contract signed",
    "production": "Production",
    "pre-shipment": "Pre-shipment",
    "delivery": "Delivery",
    "warranty": "Warranty / After-sales"
  };
  return labels[stage] || "Pre-contract";
}

function isCurrentChecklistStage(checklistStage, currentStage) {
  const map = {
    "pre-contract": "before-signing",
    "contract-signed": "before-production",
    "production": "before-shipment",
    "pre-shipment": "before-shipment",
    "delivery": "before-delivery",
    "warranty": "warranty"
  };
  return map[currentStage] === checklistStage;
}

function getTriggeredFacts(rule, values) {
  const triggers = [];
  const facts = rule.triggerFacts;

  addProductCategoryTrigger(triggers, facts, values.productCategory);

  if (facts.destinationHighRisk && isHighRisk(values.destinationCountry)) triggers.push(facts.destinationHighRisk);
  if (facts.buyerHighRisk && isHighRisk(values.buyerCountry)) triggers.push(facts.buyerHighRisk);
  if (facts.paymentHighRisk && isHighRisk(values.paymentCountry)) triggers.push(facts.paymentHighRisk);
  if (facts.endUserHighRisk && isHighRisk(values.endUserCountry)) triggers.push(facts.endUserHighRisk);
  if (facts.endUseUnclear && values.endUseClarity === "unclear") triggers.push(facts.endUseUnclear);
  if (facts.partyUnclear && values.partyClarity === "unclear") triggers.push(facts.partyUnclear);
  if (facts.dualUseConcern && ["yes", "unclear"].includes(values.dualUseConcern)) triggers.push(facts.dualUseConcern);
  if (facts.technologyTransfer && values.technologyTransfer === "yes") triggers.push(facts.technologyTransfer);
  if (facts.exportControlNotCompleted && ["not-completed", "unclear"].includes(values.exportControlReview)) triggers.push(facts.exportControlNotCompleted);
  if (facts.screeningNotCompleted && ["not-completed", "unclear"].includes(values.sanctionsScreening)) triggers.push(facts.screeningNotCompleted);
  if (facts.highValue && values.contractValue === "high") triggers.push(facts.highValue);
  if (facts.longProductionCycle && values.productionCycle === "long") triggers.push(facts.longProductionCycle);
  if (facts.lowAdvance && ["low", "unclear"].includes(values.advancePayment)) triggers.push(facts.lowAdvance);
  if (facts.lowAdvance && ["low", "unclear"].includes(values.advancePaymentPercentage)) triggers.push(facts.lowAdvance);
  if (facts.openAccount && values.paymentMethod === "open-account") triggers.push(facts.openAccount);
  if (facts.unclearLc && values.paymentMethod === "lc" && values.lcTerms === "unclear") triggers.push(facts.unclearLc);
  if (facts.lcSoftClauses && ["yes", "unclear"].includes(values.lcSoftClauses)) triggers.push(facts.lcSoftClauses);
  if (facts.thirdPartyPayment && values.paymentMethod === "third-party") triggers.push(facts.thirdPartyPayment);
  if (facts.currencyRisk && ["mismatch", "unclear"].includes(values.currencyRisk)) triggers.push(facts.currencyRisk);
  if (facts.noExchangeRateClause && values.currencyRisk === "mismatch" && ["no", "unclear"].includes(values.exchangeRateClause)) triggers.push(facts.noExchangeRateClause);
  if (facts.retentionUnclear && values.retentionPayment === "yes" && values.retentionReleaseCondition === "unclear") triggers.push(facts.retentionUnclear);
  if (facts.bondTermsUnclear && (["yes", "unclear"].includes(values.warrantyBond) || ["yes", "unclear"].includes(values.performanceBond))) triggers.push(facts.bondTermsUnclear);
  if (facts.customizedProduct && values.customizedProduct === "yes") triggers.push(facts.customizedProduct);
  if (facts.standardUnclear && values.technicalStandard === "unclear") triggers.push(facts.standardUnclear);
  if (facts.technicalSpecsMissing && values.technicalSpecsAttached === "no") triggers.push(facts.technicalSpecsMissing);
  if (facts.technicalAppendixMissing && values.technicalAppendix === "missing") triggers.push(facts.technicalAppendixMissing);
  if (facts.acceptanceUnclear && values.acceptanceCriteria === "unclear") triggers.push(facts.acceptanceUnclear);
  if (facts.inspectionMissing && values.inspectionProcedure === "missing") triggers.push(facts.inspectionMissing);
  if (facts.fatSatUnclear && (values.fatRequirement === "unclear" || values.satRequirement === "unclear")) triggers.push(facts.fatSatUnclear);
  if (facts.thirdPartyInspectionUnclear && ["not-specified", "unclear"].includes(values.thirdPartyInspection)) triggers.push(facts.thirdPartyInspectionUnclear);
  if (facts.testRemedyUnclear && values.testFailureRemedy === "unclear") triggers.push(facts.testRemedyUnclear);
  if (facts.deemedAcceptanceMissing && ["no", "unclear"].includes(values.deemedAcceptance)) triggers.push(facts.deemedAcceptanceMissing);
  if (facts.inspectionDelayUnclear && ["not-defined", "unclear"].includes(values.inspectionDelayConsequences)) triggers.push(facts.inspectionDelayUnclear);
  if (facts.standardHierarchyUnclear && values.standardHierarchy === "unclear") triggers.push(facts.standardHierarchyUnclear);
  if (facts.oemPrivateLabel && values.oemPrivateLabel === "yes") triggers.push(facts.oemPrivateLabel);
  if (facts.disputeUnclear && values.disputeResolution === "unclear") triggers.push(facts.disputeUnclear);
  if (facts.incotermsUnclear && values.incotermsRule === "unclear") triggers.push(facts.incotermsUnclear);
  if (facts.namedPlaceMissing && values.incotermsRule && values.incotermsRule !== "unclear" && !values.namedPlacePort) triggers.push(facts.namedPlaceMissing);
  if (facts.ddpSellerBurden && values.incotermsRule === "ddp") triggers.push(facts.ddpSellerBurden);
  if (facts.exwExportClearanceUnclear && values.incotermsRule === "exw" && values.exportClearanceParty === "unclear") triggers.push(facts.exwExportClearanceUnclear);
  if (facts.insuranceUnclear && ["cif", "cip"].includes(values.incotermsRule) && ["not-arranged", "unclear"].includes(values.marineInsurance)) triggers.push(facts.insuranceUnclear);
  if (facts.oversizedLogisticsUnclear && ["yes", "unclear"].includes(values.oversizedCargo) && (values.incotermsRule === "unclear" || !values.namedPlacePort || values.shippingWindow !== "yes")) triggers.push(facts.oversizedLogisticsUnclear);
  if (facts.governingLawUnclear && values.governingLawStatus === "unclear") triggers.push(facts.governingLawUnclear);
  if (facts.dataTransfer && values.crossBorderDataTransfer === "yes") triggers.push(facts.dataTransfer);
  if (facts.shippingWindowMissing && ["no", "unclear"].includes(values.shippingWindow)) triggers.push(facts.shippingWindowMissing);
  if (facts.delayLdMissing && ["no", "unclear"].includes(values.delayLD)) triggers.push(facts.delayLdMissing);
  if (facts.forceMajeureMissing && ["no", "unclear"].includes(values.forceMajeure)) triggers.push(facts.forceMajeureMissing);
  if (facts.buyerDelayUnclear && ["no", "unclear"].includes(values.buyerDelayConsequences)) triggers.push(facts.buyerDelayUnclear);
  if (facts.exportLicenceDelayUnclear && ["no", "unclear"].includes(values.exportLicenceDelayAllocation)) triggers.push(facts.exportLicenceDelayUnclear);
  if (facts.longProductionCycle && ["long", "customized-project", "unclear"].includes(values.productionCycle)) triggers.push(facts.longProductionCycle);
  if (facts.endUserUnclear && ["no", "unclear"].includes(values.endUserIdentified)) triggers.push(facts.endUserUnclear);
  if (facts.endUseStatementMissing && ["no", "unclear"].includes(values.endUseStatement) && isHighRisk(values.destinationCountry + " " + values.endUserCountry)) triggers.push(facts.endUseStatementMissing);
  if (facts.noReExportMissing && ["no", "unclear"].includes(values.noReExportClause) && ["yes", "unclear"].includes(values.intermediaryInvolved)) triggers.push(facts.noReExportMissing);
  if (facts.intermediaryInvolved && ["yes", "unclear"].includes(values.intermediaryInvolved)) triggers.push(facts.intermediaryInvolved);
  if (facts.transshipmentRoute && ["yes", "unclear"].includes(values.transshipmentRoute)) triggers.push(facts.transshipmentRoute);
  if (facts.countryMismatch && ["yes", "unclear"].includes(values.countryMismatch)) triggers.push(facts.countryMismatch);
  if (facts.warrantyUnclear && ["not-defined", "unclear"].includes(values.warrantyPeriod)) triggers.push(facts.warrantyUnclear);
  if (facts.sparePartsUnclear && values.sparePartsObligation === "unclear") triggers.push(facts.sparePartsUnclear);
  if (facts.commissioningUnclear && ["required", "unclear"].includes(values.commissioningSupport)) triggers.push(facts.commissioningUnclear);
  if (facts.onsiteResponsibilityUnclear && ["yes", "unclear"].includes(values.onsiteService) && values.onsiteResponsibility === "unclear") triggers.push(facts.onsiteResponsibilityUnclear);
  if (facts.liabilityLimitMissing && ["missing", "unclear"].includes(values.liabilityLimit)) triggers.push(facts.liabilityLimitMissing);
  if (facts.missingKeyDocuments && ["pre-shipment", "delivery"].includes(values.transactionStage) && missingAny(values.documentsPrepared, ["commercial-invoice", "packing-list", "bill-of-lading"])) triggers.push(facts.missingKeyDocuments);
  if (facts.originMissing && ["pre-shipment", "delivery"].includes(values.transactionStage) && !hasDocument(values.documentsPrepared, "certificate-origin")) triggers.push(facts.originMissing);
  if (facts.testInspectionMissing && ["pre-shipment", "delivery"].includes(values.transactionStage) && missingAny(values.documentsPrepared, ["test-certificate", "inspection-certificate"])) triggers.push(facts.testInspectionMissing);
  if (facts.oversizedDocsMissing && ["yes", "unclear"].includes(values.oversizedCargo) && !hasDocument(values.documentsPrepared, "oversized-cargo-docs")) triggers.push(facts.oversizedDocsMissing);
  if (facts.exportLicenceMissing && ["not-completed", "unclear"].includes(values.exportControlReview) && !hasDocument(values.documentsPrepared, "export-licence") && ["pre-shipment", "delivery"].includes(values.transactionStage)) triggers.push(facts.exportLicenceMissing);

  return [...new Set(triggers)];
}

function hasDocument(documents, documentId) {
  const list = Array.isArray(documents) ? documents : documents ? [documents] : [];
  return list.includes(documentId);
}

function missingAny(documents, requiredDocuments) {
  return requiredDocuments.some((documentId) => !hasDocument(documents, documentId));
}

function addProductCategoryTrigger(triggers, facts, productCategory) {
  if (facts.productCategory && facts.productCategory[productCategory]) {
    triggers.push(facts.productCategory[productCategory]);
  }
}

function isHighRisk(value) {
  const normalized = String(value || "").toLowerCase();
  return highRiskJurisdictions.some((term) => normalized.includes(term));
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
  return escapeHtml(value).replaceAll("`", "&#096;");
}
