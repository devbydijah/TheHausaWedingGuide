import { useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { supabase } from "../lib/supabase";
import { PictureAsPdf } from "@mui/icons-material";

/**
 * PersonalizedPDFExport Component
 *
 * Exports user's complete wedding plan as a personalized PDF.
 * Includes bride name, wedding date, and all progress data.
 *
 * Features:
 * - Branded header with Hausa Wedding Guide colors
 * - Personalized title page with bride name
 * - Sections: Vision Quiz, Budget, Vendors, Timeline
 * - Formatted tables for structured data
 * - Auto-generated filename with bride name
 *
 * Usage:
 * <PersonalizedPDFExport userEmail="bride@example.com" />
 */

export default function PersonalizedPDFExport({ userEmail }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const generatePDF = async () => {
    setIsGenerating(true);
    setError("");

    try {
      // Fetch user data from web_app_users
      const { data: user, error: userError } = await supabase
        .from("web_app_users")
        .select("bride_name, wedding_date, access_expires_at")
        .eq("email", userEmail)
        .single();

      if (userError) throw userError;

      // Fetch progress data
      const { data: progressData, error: progressError } = await supabase
        .from("user_progress")
        .select("data")
        .eq("email", userEmail)
        .single();

      if (progressError && progressError.code !== "PGRST116") {
        // PGRST116 = no rows found (empty progress is ok)
        throw progressError;
      }

      const progress = progressData?.data || {};

      // Initialize PDF
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      let yPosition = 20;

      // Colors (matching Hausa Wedding Guide branding)
      const primaryColor = [116, 0, 21]; // #740015
      const secondaryColor = [83, 25, 70]; // #531946
      const accentColor = [206, 128, 92]; // #CE805C

      // === TITLE PAGE ===
      doc.setFillColor(...primaryColor);
      doc.rect(0, 0, pageWidth, 60, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(28);
      doc.setFont("helvetica", "bold");
      doc.text("Hausa Wedding Guide", pageWidth / 2, 25, { align: "center" });

      doc.setFontSize(14);
      doc.setFont("helvetica", "normal");
      doc.text("Your Personalized Wedding Plan", pageWidth / 2, 35, {
        align: "center",
      });

      yPosition = 80;
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.text(
        `${user.bride_name || "Your"}'s Wedding Plan`,
        pageWidth / 2,
        yPosition,
        { align: "center" }
      );

      yPosition += 15;
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      if (user.wedding_date) {
        doc.text(
          `Wedding Date: ${formatDate(user.wedding_date)}`,
          pageWidth / 2,
          yPosition,
          {
            align: "center",
          }
        );
        yPosition += 10;
      }
      doc.text(
        `Generated: ${new Date().toLocaleDateString()}`,
        pageWidth / 2,
        yPosition,
        { align: "center" }
      );

      // === VISION & VALUES ===
      if (progress.visionQuiz) {
        doc.addPage();
        yPosition = 20;

        // Section Header
        doc.setFillColor(...accentColor);
        doc.rect(0, yPosition - 5, pageWidth, 12, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text("Vision & Values", 10, yPosition + 3);

        yPosition += 20;
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");

        const vision = progress.visionQuiz;
        const visionData = [
          ["Wedding Style", vision.style || "Not set"],
          ["Color Palette", vision.colors || "Not set"],
          ["Guest Count", vision.guestCount || "Not set"],
          ["Atmosphere", vision.atmosphere || "Not set"],
          ["Priorities", vision.priorities?.join(", ") || "Not set"],
        ];

        doc.autoTable({
          startY: yPosition,
          head: [["Aspect", "Your Choice"]],
          body: visionData,
          theme: "grid",
          headStyles: {
            fillColor: primaryColor,
            textColor: [255, 255, 255],
            fontSize: 11,
            fontStyle: "bold",
          },
          bodyStyles: { fontSize: 10 },
          alternateRowStyles: { fillColor: [250, 247, 246] },
        });

        yPosition = doc.lastAutoTable.finalY + 15;

        if (vision.notes) {
          doc.setFontSize(11);
          doc.setFont("helvetica", "bold");
          doc.text("Additional Notes:", 10, yPosition);
          yPosition += 7;
          doc.setFont("helvetica", "normal");
          doc.setFontSize(10);
          const splitNotes = doc.splitTextToSize(vision.notes, pageWidth - 20);
          doc.text(splitNotes, 10, yPosition);
        }
      }

      // === BUDGET ===
      if (progress.budget) {
        doc.addPage();
        yPosition = 20;

        // Section Header
        doc.setFillColor(...accentColor);
        doc.rect(0, yPosition - 5, pageWidth, 12, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text("Budget Breakdown", 10, yPosition + 3);

        yPosition += 20;
        doc.setTextColor(0, 0, 0);

        const budget = progress.budget;
        const totalBudget = budget.totalBudget || 0;
        const categories = budget.categories || [];

        // Budget Summary
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text(`Total Budget: ${formatCurrency(totalBudget)}`, 10, yPosition);
        yPosition += 10;

        // Categories Table
        if (categories.length > 0) {
          const budgetData = categories.map((cat) => [
            cat.name || "Unnamed",
            formatCurrency(cat.budgeted || 0),
            formatCurrency(cat.spent || 0),
            formatCurrency((cat.budgeted || 0) - (cat.spent || 0)),
          ]);

          doc.autoTable({
            startY: yPosition,
            head: [["Category", "Budgeted", "Spent", "Remaining"]],
            body: budgetData,
            theme: "grid",
            headStyles: {
              fillColor: primaryColor,
              textColor: [255, 255, 255],
              fontSize: 11,
              fontStyle: "bold",
            },
            bodyStyles: { fontSize: 10 },
            alternateRowStyles: { fillColor: [250, 247, 246] },
            columnStyles: {
              1: { halign: "right" },
              2: { halign: "right" },
              3: { halign: "right" },
            },
          });
        } else {
          doc.setFontSize(10);
          doc.setFont("helvetica", "italic");
          doc.text("No budget categories added yet.", 10, yPosition);
        }
      }

      // === VENDORS ===
      if (progress.vendors && progress.vendors.length > 0) {
        doc.addPage();
        yPosition = 20;

        // Section Header
        doc.setFillColor(...accentColor);
        doc.rect(0, yPosition - 5, pageWidth, 12, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text("Vendor Directory", 10, yPosition + 3);

        yPosition += 20;

        const vendorData = progress.vendors.map((vendor) => [
          vendor.category || "Uncategorized",
          vendor.name || "Unnamed",
          vendor.contact || "—",
          vendor.status || "Pending",
          formatCurrency(vendor.cost || 0),
        ]);

        doc.autoTable({
          startY: yPosition,
          head: [["Category", "Vendor", "Contact", "Status", "Cost"]],
          body: vendorData,
          theme: "grid",
          headStyles: {
            fillColor: primaryColor,
            textColor: [255, 255, 255],
            fontSize: 10,
            fontStyle: "bold",
          },
          bodyStyles: { fontSize: 9 },
          alternateRowStyles: { fillColor: [250, 247, 246] },
          columnStyles: {
            4: { halign: "right" },
          },
        });
      }

      // === TIMELINE ===
      if (progress.timeline && progress.timeline.length > 0) {
        doc.addPage();
        yPosition = 20;

        // Section Header
        doc.setFillColor(...accentColor);
        doc.rect(0, yPosition - 5, pageWidth, 12, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text("Timeline & Tasks", 10, yPosition + 3);

        yPosition += 20;

        const timelineData = progress.timeline.map((task) => [
          task.task || "Untitled",
          formatDate(task.dueDate),
          task.priority || "Normal",
          task.completed ? "✓ Done" : "Pending",
        ]);

        doc.autoTable({
          startY: yPosition,
          head: [["Task", "Due Date", "Priority", "Status"]],
          body: timelineData,
          theme: "grid",
          headStyles: {
            fillColor: primaryColor,
            textColor: [255, 255, 255],
            fontSize: 10,
            fontStyle: "bold",
          },
          bodyStyles: { fontSize: 9 },
          alternateRowStyles: { fillColor: [250, 247, 246] },
        });
      }

      // === FOOTER ON ALL PAGES ===
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 10, {
          align: "center",
        });
        doc.text(
          "Generated by Hausa Wedding Guide | hausaroom.com",
          pageWidth / 2,
          pageHeight - 5,
          { align: "center" }
        );
      }

      // Save PDF
      const fileName = `${
        user.bride_name?.replace(/\s+/g, "_") || "My"
      }_Wedding_Plan.pdf`;
      doc.save(fileName);

      setIsGenerating(false);
    } catch (err) {
      console.error("PDF generation error:", err);
      setError("Failed to generate PDF. Please try again.");
      setIsGenerating(false);
    }
  };

  return (
    <div>
      <button
        onClick={generatePDF}
        disabled={isGenerating}
        className="flex items-center gap-2 bg-gradient-to-r from-[#740015] to-[#531946] text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        <PictureAsPdf sx={{ fontSize: 20 }} />
        {isGenerating ? (
          <span className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Generating PDF...
          </span>
        ) : (
          "Export Personalized Plan"
        )}
      </button>

      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
    </div>
  );
}

/**
 * Standalone function to generate personalized PDF
 * Can be called directly from other components
 * 
 * @param {Object} data - User's wedding planning data
 * @param {Object} userInfo - { brideName, email, weddingDate }
 */
export const generatePersonalizedPDF = (data, userInfo) => {
  const { brideName = "Bride", email = "", weddingDate = null } = userInfo || {};

  // Initialize PDF
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 20;

  // Helper functions
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Colors (matching Hausa Wedding Guide branding)
  const primaryColor = [116, 0, 21]; // #740015
  const secondaryColor = [83, 25, 70]; // #531946
  const accentColor = [206, 128, 92]; // #CE805C

  // === TITLE PAGE ===
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 60, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");
  doc.text("Hausa Wedding Guide", pageWidth / 2, 25, { align: "center" });

  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  doc.text("Your Personalized Wedding Plan", pageWidth / 2, 35, {
    align: "center",
  });

  yPosition = 80;
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text(`${brideName}'s Wedding Plan`, pageWidth / 2, yPosition, {
    align: "center",
  });

  yPosition += 15;
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  if (weddingDate) {
    doc.text(
      `Wedding Date: ${formatDate(weddingDate)}`,
      pageWidth / 2,
      yPosition,
      { align: "center" }
    );
    yPosition += 10;
  }
  doc.text(
    `Generated: ${new Date().toLocaleDateString()}`,
    pageWidth / 2,
    yPosition,
    { align: "center" }
  );

  // === VISION RESULT ===
  if (data?.visionResult) {
    doc.addPage();
    yPosition = 20;

    doc.setFillColor(...accentColor);
    doc.rect(0, yPosition - 5, pageWidth, 12, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Wedding Vision", 10, yPosition + 3);

    yPosition += 20;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(`Style: ${data.visionResult}`, 10, yPosition);
  }

  // === BUDGET ===
  if (data?.totalBudget && data?.budgetCategories) {
    doc.addPage();
    yPosition = 20;

    doc.setFillColor(...accentColor);
    doc.rect(0, yPosition - 5, pageWidth, 12, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Budget Breakdown", 10, yPosition + 3);

    yPosition += 20;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(`Total Budget: ${formatCurrency(data.totalBudget)}`, 10, yPosition);

    yPosition += 10;

    const budgetData = Object.entries(data.budgetCategories).map(
      ([category, details]) => [
        category,
        `${details.percentage || 0}%`,
        formatCurrency(details.amount || 0),
      ]
    );

    if (budgetData.length > 0) {
      doc.autoTable({
        startY: yPosition,
        head: [["Category", "Percentage", "Amount"]],
        body: budgetData,
        theme: "grid",
        headStyles: {
          fillColor: primaryColor,
          textColor: [255, 255, 255],
          fontSize: 11,
          fontStyle: "bold",
        },
        bodyStyles: { fontSize: 10 },
        alternateRowStyles: { fillColor: [250, 247, 246] },
      });
    }
  }

  // === VENDORS ===
  if (data?.vendorList && data.vendorList.length > 0) {
    doc.addPage();
    yPosition = 20;

    doc.setFillColor(...accentColor);
    doc.rect(0, yPosition - 5, pageWidth, 12, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Vendor List", 10, yPosition + 3);

    yPosition += 20;

    const vendorData = data.vendorList.map((vendor) => [
      vendor.category || "N/A",
      vendor.name || "N/A",
      vendor.contact || "N/A",
      vendor.status || "Pending",
    ]);

    doc.autoTable({
      startY: yPosition,
      head: [["Category", "Vendor", "Contact", "Status"]],
      body: vendorData,
      theme: "grid",
      headStyles: {
        fillColor: primaryColor,
        textColor: [255, 255, 255],
        fontSize: 10,
        fontStyle: "bold",
      },
      bodyStyles: { fontSize: 9 },
      alternateRowStyles: { fillColor: [250, 247, 246] },
    });
  }

  // === TIMELINE ===
  if (data?.taskList && data.taskList.length > 0) {
    doc.addPage();
    yPosition = 20;

    doc.setFillColor(...accentColor);
    doc.rect(0, yPosition - 5, pageWidth, 12, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Timeline & Tasks", 10, yPosition + 3);

    yPosition += 20;

    const taskData = data.taskList.map((task) => [
      task.task || "N/A",
      formatDate(task.date),
      task.status || "Pending",
    ]);

    doc.autoTable({
      startY: yPosition,
      head: [["Task", "Due Date", "Status"]],
      body: taskData,
      theme: "grid",
      headStyles: {
        fillColor: primaryColor,
        textColor: [255, 255, 255],
        fontSize: 11,
        fontStyle: "bold",
      },
      bodyStyles: { fontSize: 10 },
      alternateRowStyles: { fillColor: [250, 247, 246] },
    });
  }

  // === FOOTER ON LAST PAGE ===
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text(
    "Generated by Hausa Wedding Guide - hausaroom.com",
    pageWidth / 2,
    pageHeight - 10,
    { align: "center" }
  );

  // Save the PDF
  const filename = `${brideName.replace(/\s+/g, "_")}_Wedding_Plan_${new Date().toISOString().split("T")[0]}.pdf`;
  doc.save(filename);

  console.log(`PDF generated: ${filename}`);
};
