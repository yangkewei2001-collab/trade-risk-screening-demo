const FALLBACK_RULES = [
  {
    id: "third_party_payment",
    category: "Third-Party Payment Risk",
    riskLevel: "High",
    score: 3,
    conditionField: "thirdPartyPayment",
    conditionOperator: "equals",
    conditionValue: "true",
    reason: "Payment by a third party may indicate fraud, money laundering, or mismatch between the contracting party and the paying entity.",
    followUpQuestion: "Why is the payment made by a third party instead of the contracting buyer?",
    reviewPoint: "Verify the relationship between the buyer, payer, and beneficiary, and consider enhanced due diligence."
  },
  {
    id: "incoterms_not_clear",
    category: "Incoterms / Delivery Risk",
    riskLevel: "Medium",
    score: 2,
    conditionField: "incotermsSpecified",
    conditionOperator: "equals",
    conditionValue: "false",
    reason: "Without clear Incoterms, delivery obligations, cost allocation, and risk transfer may be unclear.",
    followUpQuestion: "Which Incoterms rule applies to this transaction?",
    reviewPoint: "Clarify the delivery term, place of delivery, insurance obligation, and transfer of risk."
  },
  {
    id: "cross_border_data_transfer",
    category: "Cross-Border Data Risk",
    riskLevel: "Medium",
    score: 2,
    conditionField: "crossBorderData",
    conditionOperator: "equals",
    conditionValue: "true",
    reason: "Cross-border transfer of personal data may trigger privacy and data transfer compliance requirements.",
    followUpQuestion: "What types of personal data will be transferred, and to which country or region?",
    reviewPoint: "Assess GDPR, PIPL, data processing agreements, and cross-border transfer mechanisms."
  }
];

const FORM_FIELDS = [
  "buyerCountry",
  "sellerCountry",
  "transactionAmount",
  "currency",
  "productType",
  "exportControl",
  "paymentMethod",
  "thirdPartyPayment",
  "incotermsSpecified",
  "incotermsRule",
  "disputeResolutionClause",
  "governingLawClause",
  "crossBorderData",
  "antiBriberyClause",
  "sanctionsScreening"
];

const FIELD_LABELS = {
  buyerCountry: "Buyer country or region",
  sellerCountry: "Seller country or region",
  transactionAmount: "Transaction amount",
  currency: "Currency",
  productType: "Product type",
  exportControl: "Product may be subject to export control",
  paymentMethod: "Payment method",
  thirdPartyPayment: "Payment is made by a third party",
  incotermsSpecified: "Incoterms are clearly specified",
  incotermsRule: "Selected Incoterms rule",
  disputeResolutionClause: "Dispute resolution clause exists",
  governingLawClause: "Governing law clause exists",
  crossBorderData: "Personal data or customer data will be transferred across borders",
  antiBriberyClause: "Anti-bribery clause exists",
  sanctionsScreening: "Sanctions screening has been conducted"
};

const SAMPLE_TRANSACTIONS = {
  low: {
    buyerCountry: "Singapore",
    sellerCountry: "China",
    transactionAmount: 48000,
    currency: "USD",
    productType: "Consumer accessories",
    exportControl: "false",
    paymentMethod: "lc",
    thirdPartyPayment: "false",
    incotermsSpecified: "true",
    incotermsRule: "FOB",
    disputeResolutionClause: "true",
    governingLawClause: "true",
    crossBorderData: "false",
    antiBriberyClause: "true",
    sanctionsScreening: "true"
  },
  medium: {
    buyerCountry: "Germany",
    sellerCountry: "China",
    transactionAmount: 180000,
    currency: "EUR",
    productType: "Cloud-based after-sales support service",
    exportControl: "false",
    paymentMethod: "da",
    thirdPartyPayment: "false",
    incotermsSpecified: "true",
    incotermsRule: "DAP",
    disputeResolutionClause: "true",
    governingLawClause: "unknown",
    crossBorderData: "true",
    antiBriberyClause: "unknown",
    sanctionsScreening: "true"
  },
  high: {
    buyerCountry: "United Arab Emirates",
    sellerCountry: "China",
    transactionAmount: 750000,
    currency: "USD",
    productType: "Industrial control module with encryption functionality",
    exportControl: "true",
    paymentMethod: "open_account",
    thirdPartyPayment: "true",
    incotermsSpecified: "false",
    incotermsRule: "Not specified",
    disputeResolutionClause: "false",
    governingLawClause: "false",
    crossBorderData: "true",
    antiBriberyClause: "false",
    sanctionsScreening: "false"
  }
};

let rules = FALLBACK_RULES;
let reportState = {
  chineseReport: "",
  englishSummary: "",
  fullReport: ""
};

document.addEventListener("DOMContentLoaded", async () => {
  rules = await loadRules();
  document.getElementById("riskForm").addEventListener("submit", handleSubmit);
  document.getElementById("resetBtn").addEventListener("click", resetForm);
  document.getElementById("copyChineseBtn").addEventListener("click", () => copyText(reportState.chineseReport, "copyChineseBtn", "Chinese Report Copied"));
  document.getElementById("copyEnglishBtn").addEventListener("click", () => copyText(reportState.englishSummary, "copyEnglishBtn", "English Summary Copied"));
  document.getElementById("downloadTxtBtn").addEventListener("click", downloadTxtReport);
  document.getElementById("printReportBtn").addEventListener("click", printReport);
  document.getElementById("tabChinese").addEventListener("click", () => switchReportTab("chinese"));
  document.getElementById("tabEnglish").addEventListener("click", () => switchReportTab("english"));
  document.getElementById("tabBilingual").addEventListener("click", () => switchReportTab("bilingual"));
  document.querySelectorAll("[data-sample]").forEach((button) => {
    button.addEventListener("click", () => loadSampleTransaction(button.dataset.sample));
  });
});

// Load the external JSON rule library when available. The fallback keeps
// index.html usable even when opened directly from the local file system.
async function loadRules() {
  try {
    const response = await fetch("rules.json", { cache: "no-store" });
    if (!response.ok) throw new Error("Rules file unavailable");
    const data = await response.json();
    return Array.isArray(data.rules) && data.rules.length ? data.rules : FALLBACK_RULES;
  } catch (error) {
    return FALLBACK_RULES;
  }
}

function handleSubmit(event) {
  event.preventDefault();
  runRiskScreening();
}

function runRiskScreening() {
  const formData = collectFormData();
  const triggered = rules.filter((rule) => evaluateRule(rule, formData));
  const scoredRisks = triggered.map((rule) => ({
    ...rule,
    calculatedScore: getRiskScore(rule.riskLevel)
  }));
  const totalScore = scoredRisks.reduce((sum, rule) => sum + rule.calculatedScore, 0);
  const overall = calculateOverallRisk(totalScore, formData);
  renderResults(formData, scoredRisks, totalScore, overall);
}

function collectFormData() {
  return FORM_FIELDS.reduce((data, field) => {
    const element = document.getElementById(field);
    data[field] = field === "transactionAmount" ? Number(element.value || 0) : element.value.trim();
    return data;
  }, {});
}

function evaluateRule(rule, data) {
  const actual = data[rule.conditionField];
  const expected = rule.conditionValue;

  switch (rule.conditionOperator) {
    case "equals":
      return normalize(actual) === normalize(expected);
    case "notEquals":
      return normalize(actual) !== normalize(expected);
    case "in":
      return Array.isArray(expected) && expected.map(normalize).includes(normalize(actual));
    case "greaterThan":
      return Number(actual) > Number(expected);
    case "greaterThanOrEqual":
      return Number(actual) >= Number(expected);
    case "lessThan":
      return Number(actual) < Number(expected);
    case "lessThanOrEqual":
      return Number(actual) <= Number(expected);
    default:
      return false;
  }
}

// Overall level combines the numeric score with business-critical red flags.
function calculateOverallRisk(totalScore, formData) {
  const mediumLiftFlags = [
    formData.thirdPartyPayment === "true",
    formData.sanctionsScreening === "false",
    formData.exportControl === "true",
    formData.crossBorderData === "true"
  ];

  const criticalFlags = [
    formData.thirdPartyPayment === "true",
    formData.exportControl === "true",
    formData.sanctionsScreening === "false",
    formData.disputeResolutionClause === "false",
    formData.governingLawClause === "false"
  ];

  const criticalFlagCount = criticalFlags.filter(Boolean).length;

  if (criticalFlagCount >= 2 || totalScore >= 8) {
    return { key: "high", label: "High" };
  }

  if (totalScore >= 4 || mediumLiftFlags.some(Boolean)) {
    return { key: "medium", label: "Medium" };
  }

  return { key: "low", label: "Low" };
}

function getRiskScore(riskLevel) {
  const scores = {
    Low: 1,
    Medium: 2,
    High: 3
  };
  return scores[riskLevel] || 0;
}

function renderResults(formData, triggered, totalScore, overall) {
  document.getElementById("emptyState").classList.add("hidden");
  document.getElementById("resultContent").classList.remove("hidden");

  const badge = document.getElementById("riskBadge");
  badge.textContent = overall.label;
  badge.className = `risk-badge ${overall.key}`;

  document.getElementById("overallRiskLevel").textContent = overall.label;
  document.getElementById("totalRiskScore").textContent = totalScore;
  document.getElementById("triggeredRiskCount").textContent = triggered.length;

  renderTriggeredRisks(triggered);

  const businessChecklist = buildBusinessChecklist(triggered);
  const legalReviewPoints = buildLegalReviewPoints(triggered);
  const chineseReport = buildChineseReport(formData, triggered, totalScore, overall, businessChecklist, legalReviewPoints);
  const englishSummary = buildEnglishSummary(formData, triggered, totalScore, overall, businessChecklist, legalReviewPoints);

  document.getElementById("chineseReport").textContent = chineseReport;
  document.getElementById("englishSummary").textContent = englishSummary;
  document.getElementById("bilingualChineseReport").textContent = chineseReport;
  document.getElementById("bilingualEnglishSummary").textContent = englishSummary;
  renderList("businessChecklist", businessChecklist);
  renderList("legalReviewPoints", legalReviewPoints);

  reportState = {
    chineseReport,
    englishSummary,
    fullReport: `${chineseReport}\n\n==============================\n\n${englishSummary}`
  };
}

function renderTriggeredRisks(triggered) {
  const container = document.getElementById("triggeredRisks");
  container.innerHTML = "";

  if (triggered.length === 0) {
    const empty = document.createElement("div");
    empty.className = "risk-card low";
    empty.innerHTML = `
      <div class="risk-card-header">
        <strong>No preset risk triggered</strong>
        <span class="risk-level low">Low</span>
      </div>
      <div class="risk-detail-grid">
        <p><span>Reason:</span> The submitted information did not trigger the current preset screening rules.</p>
        <p><span>Suggested follow-up question:</span> Are all transaction documents complete and consistent?</p>
        <p><span>Suggested legal review point:</span> Keep standard contract, compliance, payment, and shipment records for future review.</p>
      </div>
    `;
    container.appendChild(empty);
    return;
  }

  triggered.forEach((risk) => {
    const card = document.createElement("article");
    card.className = `risk-card ${risk.riskLevel.toLowerCase()}`;
    card.innerHTML = `
      <div class="risk-card-header">
        <strong>${escapeHtml(risk.category)}</strong>
        <span class="risk-level ${risk.riskLevel.toLowerCase()}">${escapeHtml(risk.riskLevel)} | Score ${risk.calculatedScore}</span>
      </div>
      <div class="risk-detail-grid">
        <p><span>Reason:</span> ${escapeHtml(risk.reason)}</p>
        <p><span>Suggested follow-up question:</span> ${escapeHtml(risk.followUpQuestion)}</p>
        <p><span>Suggested legal review point:</span> ${escapeHtml(risk.reviewPoint)}</p>
      </div>
    `;
    container.appendChild(card);
  });
}

function buildBusinessChecklist(triggered) {
  const base = [
    "Have the identities and signing authority of the buyer, seller, and relevant payment parties been verified?",
    "Are the contract draft, purchase order, invoice, shipping documents, and payment records complete and consistent?",
    "Does the transaction require internal commercial, finance, compliance, or legal approval before execution?"
  ];
  return unique([...triggered.map((risk) => risk.followUpQuestion), ...base]).slice(0, 10);
}

function buildLegalReviewPoints(triggered) {
  const base = [
    "Review whether contract terms match the actual transaction structure, payment flow, delivery process, and compliance obligations.",
    "Confirm that this rule-based result is reviewed by qualified legal professionals before being relied upon."
  ];
  return unique([...triggered.map((risk) => risk.reviewPoint), ...base]).slice(0, 10);
}

function buildChineseReport(formData, triggered, totalScore, overall, checklist, legalPoints) {
  const riskLines = triggered.length
    ? triggered.map((risk, index) => [
        `${index + 1}. 风险类别：${risk.category}`,
        `   风险等级：${risk.riskLevel}`,
        `   初筛理由：${risk.reason}`,
        `   建议业务追问：${risk.followUpQuestion}`,
        `   建议法务审查重点：${risk.reviewPoint}`
      ].join("\n"))
    : ["未触发当前预设风险规则。建议仍保留交易文件，并完成常规合同、付款、交付及合规核查。"];

  return [
    "《外贸交易法律风险初筛报告》",
    "",
    "一、交易基本信息",
    `- 买方国家/地区：${valueOrNA(formData.buyerCountry)}`,
    `- 卖方国家/地区：${valueOrNA(formData.sellerCountry)}`,
    `- 交易金额：${formatAmount(formData)}`,
    `- 付款方式：${formatPaymentMethod(formData.paymentMethod)}`,
    `- 贸易术语：${valueOrNA(formData.incotermsRule)}`,
    `- 产品类型：${valueOrNA(formData.productType)}`,
    "",
    "二、整体风险等级",
    `- ${overall.label}`,
    `- 风险总分：${totalScore}`,
    `- 初筛意见：${buildChineseRiskExplanation(overall, totalScore, triggered)}`,
    "",
    "三、主要风险点",
    ...riskLines,
    "",
    "四、业务追问清单",
    ...checklist.map((item, index) => `${index + 1}. ${item}`),
    "",
    "五、建议法务重点审查内容",
    ...legalPoints.map((item, index) => `${index + 1}. ${item}`),
    "",
    "六、免责声明",
    "本工具仅用于交易前期法律与合规风险初筛，不构成正式法律意见。具体交易安排、合同条款及合规判断应由专业法律人员结合完整事实和适用法律进一步审查。"
  ].join("\n");
}

function buildEnglishSummary(formData, triggered, totalScore, overall, checklist, legalPoints) {
  const riskLines = triggered.length
    ? triggered.map((risk, index) => [
        `${index + 1}. ${risk.category}`,
        `   Risk level: ${risk.riskLevel}`,
        `   Reason: ${risk.reason}`,
        `   Follow-up question: ${risk.followUpQuestion}`,
        `   Legal review point: ${risk.reviewPoint}`
      ].join("\n"))
    : ["No preset risk rule was triggered. Standard contract and compliance checks are still recommended."];

  return [
    "International Trade Legal Risk Screening Summary",
    "",
    "1. Transaction Overview",
    `Buyer country or region: ${valueOrNA(formData.buyerCountry)}`,
    `Seller country or region: ${valueOrNA(formData.sellerCountry)}`,
    `Transaction amount: ${formatAmount(formData)}`,
    `Payment method: ${formatPaymentMethod(formData.paymentMethod)}`,
    `Incoterms rule: ${valueOrNA(formData.incotermsRule)}`,
    `Product type: ${valueOrNA(formData.productType)}`,
    "",
    "2. Overall Risk Level",
    `Overall risk level: ${overall.label}`,
    `Total risk score: ${totalScore}`,
    `Preliminary assessment: ${buildEnglishRiskExplanation(overall, totalScore, triggered)}`,
    "",
    "3. Key Triggered Risks",
    ...riskLines,
    "",
    "4. Follow-up Questions",
    ...checklist.map((item, index) => `${index + 1}. ${item}`),
    "",
    "5. Suggested Legal Review Points",
    ...legalPoints.map((item, index) => `${index + 1}. ${item}`),
    "",
    "6. Disclaimer",
    "This tool is for preliminary legal and compliance risk screening at the early stage of a transaction and does not constitute formal legal advice. The specific transaction structure, contract terms, and compliance assessment should be further reviewed by qualified legal professionals based on complete facts and applicable law."
  ].join("\n");
}

function renderList(id, items) {
  const list = document.getElementById(id);
  list.innerHTML = "";
  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    list.appendChild(li);
  });
}

async function copyText(text, buttonId, successText) {
  if (!text) return;
  try {
    await navigator.clipboard.writeText(text);
    showTemporaryButtonText(buttonId, successText);
  } catch (error) {
    showTemporaryButtonText(buttonId, "Copy failed");
  }
}

function downloadTxtReport() {
  if (!reportState.fullReport) return;
  const blob = new Blob([reportState.fullReport], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "trade-risk-screening-report.txt";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function printReport() {
  if (!reportState.fullReport) return;
  switchReportTab("bilingual");
  window.print();
}

function loadSampleTransaction(sampleName) {
  const sample = SAMPLE_TRANSACTIONS[sampleName];
  if (!sample) return;

  FORM_FIELDS.forEach((field) => {
    const element = document.getElementById(field);
    if (element) element.value = sample[field] ?? "";
  });

  runRiskScreening();
}

function resetForm() {
  document.getElementById("riskForm").reset();
  document.getElementById("emptyState").classList.remove("hidden");
  document.getElementById("resultContent").classList.add("hidden");
  const badge = document.getElementById("riskBadge");
  badge.textContent = "Not run";
  badge.className = "risk-badge neutral";
  reportState = { chineseReport: "", englishSummary: "", fullReport: "" };
  switchReportTab("chinese");
}

function switchReportTab(tab) {
  const isChinese = tab === "chinese";
  const isEnglish = tab === "english";
  const isBilingual = tab === "bilingual";
  document.getElementById("tabChinese").classList.toggle("active", isChinese);
  document.getElementById("tabEnglish").classList.toggle("active", isEnglish);
  document.getElementById("tabBilingual").classList.toggle("active", isBilingual);
  document.getElementById("tabChinese").setAttribute("aria-selected", String(isChinese));
  document.getElementById("tabEnglish").setAttribute("aria-selected", String(isEnglish));
  document.getElementById("tabBilingual").setAttribute("aria-selected", String(isBilingual));
  document.getElementById("panelChinese").classList.toggle("hidden", !isChinese);
  document.getElementById("panelEnglish").classList.toggle("hidden", !isEnglish);
  document.getElementById("panelBilingual").classList.toggle("hidden", !isBilingual);
}

function showTemporaryButtonText(buttonId, text) {
  const button = document.getElementById(buttonId);
  const original = button.textContent;
  button.textContent = text;
  setTimeout(() => {
    button.textContent = original;
  }, 1600);
}

function normalize(value) {
  return String(value).trim().toLowerCase();
}

function unique(items) {
  return [...new Set(items.filter(Boolean))];
}

function formatAmount(formData) {
  const amount = valueOrNA(formData.transactionAmount);
  const currency = valueOrNA(formData.currency);
  return `${amount} ${currency}`;
}

function formatPaymentMethod(value) {
  const labels = {
    tt: "T/T",
    lc: "L/C",
    dp: "D/P",
    da: "D/A",
    open_account: "Open Account",
    other: "Other"
  };
  return labels[value] || valueOrNA(value);
}

function buildChineseRiskExplanation(overall, totalScore, triggered) {
  if (!triggered.length) {
    return "当前输入未触发预设风险规则，但仍建议进行常规合同、付款、交付和合规文件核查。";
  }

  const categories = unique(triggered.map((risk) => risk.category)).slice(0, 4).join("、");
  if (overall.label === "High") {
    return `根据当前录入信息，本交易触发 ${triggered.length} 项风险，风险总分为 ${totalScore}，主要集中在 ${categories}。建议在签约、发货、付款或数据/技术资料交付前暂停关键动作，并由法务或合规人员进行专项复核。`;
  }

  if (overall.label === "Medium") {
    return `根据当前录入信息，本交易触发 ${triggered.length} 项风险，风险总分为 ${totalScore}，主要涉及 ${categories}。建议在交易执行前补充事实确认、完善合同条款，并留存必要合规记录。`;
  }

  return `本交易触发 ${triggered.length} 项低度风险，风险总分为 ${totalScore}。建议保留交易文件并完成常规业务与法务核查。`;
}

function buildEnglishRiskExplanation(overall, totalScore, triggered) {
  if (!triggered.length) {
    return "No preset risk rule was triggered based on the current inputs. Routine contract, payment, delivery, and compliance checks are still recommended.";
  }

  const categories = unique(triggered.map((risk) => risk.category)).slice(0, 4).join(", ");
  if (overall.label === "High") {
    return `The transaction triggered ${triggered.length} risk item(s), with a total score of ${totalScore}. The main areas are ${categories}. Focused legal and compliance review is recommended before signing, shipment, payment, or transfer of data or technical materials.`;
  }

  if (overall.label === "Medium") {
    return `The transaction triggered ${triggered.length} risk item(s), with a total score of ${totalScore}. The main areas are ${categories}. Additional factual confirmation, contract wording, and compliance records should be prepared before execution.`;
  }

  return `The transaction triggered ${triggered.length} low-level risk item(s), with a total score of ${totalScore}. Standard business and legal checks remain recommended.`;
}

function valueOrNA(value) {
  return value === "" || value === null || value === undefined ? "N/A" : value;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
