// src/pdf/WeddingDocument.jsx
// Main document assembler - combines all pages into one PDF

import React from "react";
import { Document } from "@react-pdf/renderer";
import {
  CoverPage,
  VisionPage,
  BudgetPage,
  VendorPage,
  TimelinePage,
  ChecklistsPage,
  EmergencyPage,
} from "./pages";

/**
 * WeddingDocument - The complete wedding planning PDF
 *
 * @param {Object} data - All wedding planning data
 * @param {string} data.brideName - Bride's name for personalization
 * @param {string} data.weddingDate - Wedding date
 * @param {Object} data.visionQuiz - Vision quiz results
 * @param {Object} data.budget - Budget data with categories
 * @param {Array} data.vendorList - List of vendors
 * @param {Array} data.taskList - List of tasks/timeline items
 */
export const WeddingDocument = ({ data = {} }) => {
  const {
    brideName = "",
    weddingDate = null,
    visionQuiz = {},
    budget = {},
    vendorList = [],
    taskList = [],
  } = data;

  return (
    <Document
      title={brideName ? `${brideName}'s Wedding Plan` : "My Wedding Plan"}
      author="The Hausa Wedding Guide"
      subject="Wedding Planning Guide"
      keywords="wedding, planning, hausa, northern, nigeria"
    >
      {/* Page 1: Cover Page */}
      <CoverPage brideName={brideName} weddingDate={weddingDate} />

      {/* Page 2: Vision & Style */}
      <VisionPage visionData={visionQuiz} />

      {/* Page 3: Budget Breakdown */}
      <BudgetPage budgetData={budget} />

      {/* Page 4: Vendor Directory */}
      <VendorPage vendors={vendorList} />

      {/* Page 5: Timeline & Tasks */}
      <TimelinePage tasks={taskList} weddingDate={weddingDate} />

      {/* Page 6: Essential Checklists */}
      <ChecklistsPage />

      {/* Page 7: Emergency Contacts & Notes */}
      <EmergencyPage brideName={brideName} vendors={vendorList} />
    </Document>
  );
};

export default WeddingDocument;
