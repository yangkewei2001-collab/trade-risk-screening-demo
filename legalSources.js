const legalSources = {
  INCOTERMS_2020: {
    title: "Incoterms® 2020",
    institution: "International Chamber of Commerce",
    authorityType: "International commercial rules",
    authorityLevel: "Commercial rules incorporated by contract",
    jurisdictionOrScope: "International trade / sale of goods",
    officialUrl: "https://iccwbo.org/business-solutions/incoterms-rules/incoterms-2020/",
    summary: "Incoterms rules help allocate delivery obligations, costs, and risk transfer between seller and buyer.",
    relevanceToDemo: "Used to flag unclear or missing delivery terms, unclear named place/port, insurance responsibility, and export/import clearance issues.",
    applicabilityLimits: "Incoterms do not determine title transfer, payment obligations, governing law, dispute resolution, sanctions, or export control compliance.",
    lastReviewed: "2026-05-06"
  },
  CISG_UNCITRAL: {
    title: "United Nations Convention on Contracts for the International Sale of Goods (CISG)",
    institution: "UNCITRAL",
    authorityType: "International convention",
    authorityLevel: "Treaty / hard law where applicable",
    jurisdictionOrScope: "International sale of goods",
    officialUrl: "https://uncitral.un.org/en/texts/salegoods/conventions/sale_of_goods/cisg",
    summary: "The CISG may govern international sale of goods contracts where parties are located in different Contracting States or where private international law leads to the law of a Contracting State.",
    relevanceToDemo: "Used to flag governing law review and possible CISG applicability in cross-border goods transactions.",
    applicabilityLimits: "The demo does not determine CISG applicability automatically. It only flags when CISG analysis may be required.",
    lastReviewed: "2026-05-06"
  },
  NEW_YORK_CONVENTION: {
    title: "Convention on the Recognition and Enforcement of Foreign Arbitral Awards (New York Convention)",
    institution: "United Nations / UNCITRAL",
    authorityType: "International convention",
    authorityLevel: "Treaty / hard law where applicable",
    jurisdictionOrScope: "International arbitration enforcement",
    officialUrl: "https://uncitral.un.org/en/texts/arbitration/conventions/foreign_arbitral_awards",
    summary: "The New York Convention provides a framework for recognition and enforcement of foreign arbitral awards.",
    relevanceToDemo: "Used to flag dispute resolution clause review, arbitration seat, institution, language, and enforcement planning.",
    applicabilityLimits: "The demo does not assess enforceability in a specific jurisdiction. Manual legal review is required.",
    lastReviewed: "2026-05-06"
  },
  FATF_TBML_INDICATORS: {
    title: "Trade-Based Money Laundering Risk Indicators",
    institution: "FATF / Egmont Group",
    authorityType: "AML/CFT guidance",
    authorityLevel: "International standard-setting body guidance",
    jurisdictionOrScope: "AML / trade-based money laundering",
    officialUrl: "https://www.fatf-gafi.org/en/publications/Methodsandtrends/Trade-based-money-laundering-indicators.html",
    summary: "FATF risk indicators help public and private entities identify suspicious activity associated with trade-based money laundering.",
    relevanceToDemo: "Used to flag third-party payments, unusual trade routes, inconsistent parties, vague goods descriptions, unusual pricing, and unclear source of funds.",
    applicabilityLimits: "Risk indicators are not conclusive proof of money laundering. They require further due diligence.",
    lastReviewed: "2026-05-06"
  },
  OFAC_COMPLIANCE_FRAMEWORK: {
    title: "A Framework for OFAC Compliance Commitments",
    institution: "U.S. Department of the Treasury / OFAC",
    authorityType: "Sanctions compliance guidance",
    authorityLevel: "Official regulator guidance",
    jurisdictionOrScope: "U.S. sanctions compliance",
    officialUrl: "https://ofac.treasury.gov/media/16331/download?inline=",
    summary: "OFAC encourages risk-based sanctions compliance programs, including management commitment, risk assessment, internal controls, testing/auditing, and training.",
    relevanceToDemo: "Used to flag sanctions screening needs where a transaction has a U.S. nexus, U.S.-origin goods/technology, USD payments, U.S. persons, or U.S. financial system involvement.",
    applicabilityLimits: "The demo does not screen live OFAC lists. Manual verification against current sanctions lists is required.",
    lastReviewed: "2026-05-06"
  },
  UK_OFSI_FINANCIAL_SANCTIONS: {
    title: "UK Financial Sanctions Guidance",
    institution: "Office of Financial Sanctions Implementation, HM Treasury",
    authorityType: "Financial sanctions guidance",
    authorityLevel: "Official regulator guidance",
    jurisdictionOrScope: "United Kingdom financial sanctions",
    officialUrl: "https://www.gov.uk/guidance/uk-financial-sanctions-guidance",
    summary: "OFSI provides guidance to help businesses understand and comply with UK financial sanctions.",
    relevanceToDemo: "Used to flag UK sanctions review where the transaction has a UK nexus, UK person, UK bank, UK company, or UK-regulated activity.",
    applicabilityLimits: "The demo does not screen live UK sanctions lists. Manual verification against current OFSI lists is required.",
    lastReviewed: "2026-05-06"
  },
  UN_CONSOLIDATED_SANCTIONS_LIST: {
    title: "United Nations Security Council Consolidated List",
    institution: "United Nations Security Council",
    authorityType: "Sanctions list",
    authorityLevel: "International sanctions list",
    jurisdictionOrScope: "UN sanctions",
    officialUrl: "https://main.un.org/securitycouncil/en/content/un-sc-consolidated-list",
    summary: "The UN Consolidated List includes individuals and entities subject to UN Security Council sanctions measures.",
    relevanceToDemo: "Used to explain why counterparties, beneficial owners, banks, vessels, and destinations may require sanctions screening.",
    applicabilityLimits: "The demo does not query the live UN list. Manual verification is required.",
    lastReviewed: "2026-05-06"
  },
  EU_SANCTIONS_MAP: {
    title: "EU Sanctions Map",
    institution: "European Union",
    authorityType: "Sanctions information tool",
    authorityLevel: "Official EU sanctions information source",
    jurisdictionOrScope: "EU restrictive measures",
    officialUrl: "https://www.sanctionsmap.eu/",
    summary: "The EU Sanctions Map provides information about EU restrictive measures.",
    relevanceToDemo: "Used to flag EU sanctions review where the transaction has an EU nexus, EU counterparty, EU bank, EU goods, or EU territory connection.",
    applicabilityLimits: "The demo does not query the live EU Sanctions Map. Manual verification is required.",
    lastReviewed: "2026-05-06"
  },
  BIS_END_USE_END_USER_CONTROLS: {
    title: "Guidance on End-User and End-Use Controls",
    institution: "U.S. Bureau of Industry and Security",
    authorityType: "Export control guidance",
    authorityLevel: "Official regulator guidance",
    jurisdictionOrScope: "U.S. export controls / EAR",
    officialUrl: "https://www.bis.gov/licensing/guidance-on-end-user-and-end-use-controls-and-us-person-controls",
    summary: "BIS guidance helps determine license requirements based on the end user and end use of items subject to the EAR.",
    relevanceToDemo: "Used to flag export control review for dual-use items, sensitive end users, sensitive destinations, restricted end uses, and U.S.-origin items or technology.",
    applicabilityLimits: "The demo does not classify products, determine ECCNs, or determine license requirements. Manual export control review is required.",
    lastReviewed: "2026-05-06"
  },
  UK_ECJU_EXPORT_CONTROLS: {
    title: "UK Strategic Export Controls",
    institution: "Export Control Joint Unit / UK Government",
    authorityType: "Export control guidance",
    authorityLevel: "Official government guidance",
    jurisdictionOrScope: "UK export controls",
    officialUrl: "https://www.gov.uk/guidance/export-controls-dual-use-items-software-and-technology-goods-for-torture-and-radioactive-sources",
    summary: "UK guidance explains controls on dual-use items, software, technology, and other controlled goods.",
    relevanceToDemo: "Used to flag UK export control review where goods, software, technology, or technical data may be controlled.",
    applicabilityLimits: "The demo does not check the UK control list or determine licensing outcomes.",
    lastReviewed: "2026-05-06"
  },
  GDPR_SCC_EU_COMMISSION: {
    title: "Standard Contractual Clauses for International Transfers",
    institution: "European Commission",
    authorityType: "Data protection transfer mechanism",
    authorityLevel: "Official EU legal instrument / guidance",
    jurisdictionOrScope: "EU/EEA personal data transfers under GDPR",
    officialUrl: "https://commission.europa.eu/law/law-topic/data-protection/international-dimension-data-protection/standard-contractual-clauses-scc_en",
    summary: "The European Commission issued modernised SCCs for transfers of personal data from the EU/EEA to third countries.",
    relevanceToDemo: "Used to flag cross-border personal data transfer review where EU/EEA personal data is transferred outside the EU/EEA.",
    applicabilityLimits: "The demo does not determine whether SCCs are sufficient in a specific transfer scenario. Data protection review is required.",
    lastReviewed: "2026-05-06"
  },
  UK_BRIBERY_ACT_GUIDANCE: {
    title: "Bribery Act 2010 Guidance",
    institution: "UK Ministry of Justice",
    authorityType: "Anti-bribery guidance",
    authorityLevel: "Official government guidance",
    jurisdictionOrScope: "United Kingdom anti-bribery compliance",
    officialUrl: "https://www.gov.uk/government/publications/bribery-act-2010-guidance",
    summary: "The guidance helps commercial organisations understand procedures they can put in place to prevent bribery.",
    relevanceToDemo: "Used to flag anti-bribery due diligence for agents, distributors, success fees, government customers, state-owned enterprises, gifts, hospitality, and unusual commissions.",
    applicabilityLimits: "The demo does not determine whether bribery has occurred. It only flags due diligence and escalation needs.",
    lastReviewed: "2026-05-06"
  },
  FCPA_RESOURCE_GUIDE: {
    title: "A Resource Guide to the U.S. Foreign Corrupt Practices Act",
    institution: "U.S. Department of Justice / U.S. Securities and Exchange Commission",
    authorityType: "Anti-corruption enforcement guidance",
    authorityLevel: "Official enforcement guidance",
    jurisdictionOrScope: "U.S. anti-corruption / foreign bribery",
    officialUrl: "https://www.justice.gov/criminal/criminal-fraud/file/1292051/download",
    summary: "The guide explains the DOJ and SEC approach to FCPA enforcement and compliance.",
    relevanceToDemo: "Used to flag third-party intermediary, government customer, state-owned enterprise, gifts, hospitality, and commission risks.",
    applicabilityLimits: "The demo does not assess FCPA jurisdiction or liability. Manual legal review is required.",
    lastReviewed: "2026-05-06"
  }
};

if (typeof window !== "undefined") {
  window.legalSources = legalSources;
}
