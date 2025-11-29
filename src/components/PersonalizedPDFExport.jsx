import { useState } from "react";
import { jsPDF } from "jspdf";
import { applyPlugin } from "jspdf-autotable";
applyPlugin(jsPDF);
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
      doc.text("Northern Wedding Guide", pageWidth / 2, 25, {
        align: "center",
      });

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
          "Generated by Northern Wedding Guide | hausaroom.com",
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
  try {
    console.log("📄 Starting enhanced PDF generation...");
    console.log("Data:", data);
    console.log("UserInfo:", userInfo);

    const {
      brideName = "Bride",
      email = "",
      weddingDate = null,
    } = userInfo || {};

    // Initialize PDF
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPosition = 20;
    const leftMargin = 15;
    const rightMargin = pageWidth - 15;

    // Helper functions
    const formatCurrency = (amount) => {
      return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        maximumFractionDigits: 0,
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

    const calculateCountdown = (weddingDate) => {
      if (!weddingDate) return null;
      const today = new Date();
      const wedding = new Date(weddingDate);
      const diffTime = wedding - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 0) return { text: "Wedding Day Has Passed", isPast: true };
      if (diffDays === 0)
        return { text: "Today is Your Wedding Day! 🎉", isToday: true };

      const months = Math.floor(diffDays / 30);
      const days = diffDays % 30;

      if (months > 0) {
        return {
          text: `${months} month${months > 1 ? "s" : ""} and ${days} day${days !== 1 ? "s" : ""} until your big day!`,
          diffDays,
        };
      }
      return {
        text: `${diffDays} day${diffDays !== 1 ? "s" : ""} until your big day!`,
        diffDays,
      };
    };

    const addSectionHeader = (title, yPos) => {
      doc.setFillColor(206, 128, 92); // accentColor
      doc.rect(0, yPos - 5, pageWidth, 12, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text(title, leftMargin, yPos + 3);
      return yPos + 20;
    };

    const checkPageBreak = (requiredSpace) => {
      if (yPosition + requiredSpace > pageHeight - 30) {
        doc.addPage();
        return 20;
      }
      return yPosition;
    };

    // Colors (matching brand)
    const primaryColor = [116, 0, 21]; // #740015
    const secondaryColor = [83, 25, 70]; // #531946
    const accentColor = [206, 128, 92]; // #CE805C

    // ========================================
    // === TITLE PAGE ===
    // ========================================
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, pageWidth, 80, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(32);
    doc.setFont("helvetica", "bold");
    doc.text("Northern Wedding Guide", pageWidth / 2, 30, { align: "center" });

    doc.setFontSize(16);
    doc.setFont("helvetica", "normal");
    doc.text("Complete Wedding Planning Guide", pageWidth / 2, 45, {
      align: "center",
    });

    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255, 0.8);
    doc.text(
      "Your Personalized Offline Planning Companion",
      pageWidth / 2,
      60,
      {
        align: "center",
      }
    );

    yPosition = 100;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text(`${brideName}'s Wedding Plan`, pageWidth / 2, yPosition, {
      align: "center",
    });

    yPosition += 20;
    const countdown = calculateCountdown(weddingDate);

    if (countdown) {
      doc.setFontSize(14);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(116, 0, 21);
      doc.text(countdown.text, pageWidth / 2, yPosition, { align: "center" });
      yPosition += 10;
    }

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    if (weddingDate) {
      doc.text(
        `Wedding Date: ${formatDate(weddingDate)}`,
        pageWidth / 2,
        yPosition,
        { align: "center" }
      );
      yPosition += 8;
    }
    doc.setTextColor(100, 100, 100);
    doc.text(
      `Generated: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`,
      pageWidth / 2,
      yPosition,
      { align: "center" }
    );

    // Table of Contents Box
    yPosition += 25;
    doc.setDrawColor(206, 128, 92);
    doc.setLineWidth(0.5);
    doc.rect(leftMargin, yPosition, pageWidth - 30, 60);

    yPosition += 10;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(116, 0, 21);
    doc.text("Contents of This Guide", leftMargin + 5, yPosition);

    yPosition += 10;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    const tocItems = [
      "📋 Your Wedding Vision & Style",
      "💰 Complete Budget Breakdown",
      "👥 Vendor Contact Directory",
      "📅 Timeline & Task Checklist",
      "✅ Offline Planning Checklists",
      "📞 Emergency Contacts & Notes",
    ];
    tocItems.forEach((item) => {
      doc.text(item, leftMargin + 10, yPosition);
      yPosition += 7;
    });

    // ========================================
    // === VISION QUIZ RESULTS ===
    // ========================================
    if (data?.visionQuiz?.result || data?.visionResult) {
      doc.addPage();
      yPosition = 20;

      yPosition = addSectionHeader("Your Wedding Vision", yPosition);

      const visionResult = data?.visionQuiz?.result || data?.visionResult;
      const visionDetails = {
        traditional: {
          title: "Traditional Northern Nigerian Wedding",
          description:
            "Your wedding will honor authentic Northern Nigerian customs with full traditional ceremonies, attire, and cultural elements.",
          characteristics: [
            "✓ Full traditional ceremonies (Gaisua, Kayan Zance, Kamu, etc.)",
            "✓ Authentic Northern attire and accessories",
            "✓ Cultural music and entertainment",
            "✓ Traditional decorations and colors",
            "✓ Emphasis on family and community involvement",
          ],
        },
        modern: {
          title: "Modern Contemporary Wedding",
          description:
            "You'll celebrate with a contemporary approach, incorporating international trends while respecting essential cultural values.",
          characteristics: [
            "✓ Contemporary venue and decorations",
            "✓ Modern attire with cultural accents",
            "✓ Diverse entertainment options",
            "✓ Simplified ceremony structure",
            "✓ Focus on personal expression and style",
          ],
        },
        fusion: {
          title: "Fusion Wedding Style",
          description:
            "You'll blend cherished Northern Nigerian traditions with modern elements for a unique celebration that honors both heritage and contemporary style.",
          characteristics: [
            "✓ Mix of traditional and modern ceremonies",
            "✓ Blended attire styles",
            "✓ Diverse music and entertainment",
            "✓ Creative fusion decorations",
            "✓ Balance between tradition and innovation",
          ],
        },
      };

      const selectedVision =
        visionDetails[visionResult?.toLowerCase()] || visionDetails.fusion;

      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(116, 0, 21);
      doc.text(selectedVision.title, leftMargin, yPosition);

      yPosition += 10;
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0);
      const descLines = doc.splitTextToSize(
        selectedVision.description,
        pageWidth - 30
      );
      doc.text(descLines, leftMargin, yPosition);
      yPosition += descLines.length * 6 + 10;

      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Key Characteristics:", leftMargin, yPosition);
      yPosition += 8;

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      selectedVision.characteristics.forEach((char) => {
        doc.text(char, leftMargin + 5, yPosition);
        yPosition += 6;
      });

      // Priorities Section
      if (data?.priorities && data.priorities.length > 0) {
        yPosition += 10;
        yPosition = checkPageBreak(40);

        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(116, 0, 21);
        doc.text("Your Top Priorities:", leftMargin, yPosition);
        yPosition += 8;

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(0, 0, 0);
        data.priorities.forEach((priority, index) => {
          doc.text(`${index + 1}. ${priority}`, leftMargin + 5, yPosition);
          yPosition += 6;
        });
      }
    }

    // ========================================
    // === BUDGET BREAKDOWN ===
    // ========================================
    if (data?.totalBudget || data?.budgetCategories) {
      doc.addPage();
      yPosition = 20;

      yPosition = addSectionHeader("Budget Breakdown", yPosition);

      const totalBudget = data.totalBudget || 0;

      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(116, 0, 21);
      doc.text(
        `Total Budget: ${formatCurrency(totalBudget)}`,
        leftMargin,
        yPosition
      );
      yPosition += 15;

      if (
        data?.budgetCategories &&
        Object.keys(data.budgetCategories).length > 0
      ) {
        const budgetData = Object.entries(data.budgetCategories).map(
          ([category, details]) => [
            category,
            `${details.percentage || 0}%`,
            formatCurrency(details.amount || 0),
            details.spent ? formatCurrency(details.spent) : "₦0",
            formatCurrency((details.amount || 0) - (details.spent || 0)),
          ]
        );

        doc.autoTable({
          startY: yPosition,
          head: [["Category", "%", "Budgeted", "Spent", "Remaining"]],
          body: budgetData,
          theme: "striped",
          headStyles: {
            fillColor: primaryColor,
            textColor: [255, 255, 255],
            fontSize: 11,
            fontStyle: "bold",
            halign: "left",
          },
          bodyStyles: {
            fontSize: 10,
            textColor: [0, 0, 0],
          },
          alternateRowStyles: { fillColor: [250, 247, 246] },
          columnStyles: {
            0: { cellWidth: 50 },
            1: { halign: "center", cellWidth: 20 },
            2: { halign: "right", cellWidth: 35 },
            3: { halign: "right", cellWidth: 35 },
            4: { halign: "right", cellWidth: 35 },
          },
        });

        yPosition = doc.lastAutoTable.finalY + 15;
      }

      // Budget Planning Tips
      yPosition = checkPageBreak(60);
      doc.setFillColor(250, 247, 246);
      doc.rect(leftMargin, yPosition, pageWidth - 30, 50, "F");

      yPosition += 8;
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(116, 0, 21);
      doc.text("💡 Budget Management Tips:", leftMargin + 5, yPosition);

      yPosition += 7;
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0);
      const budgetTips = [
        "• Track all expenses immediately to avoid budget surprises",
        "• Always negotiate with vendors - most prices have room for discussion",
        "• Keep 10-15% of your budget as emergency contingency",
        "• Get written quotes from at least 3 vendors before deciding",
        "• Consider off-peak dates for better venue and vendor rates",
      ];
      budgetTips.forEach((tip) => {
        doc.text(tip, leftMargin + 8, yPosition);
        yPosition += 5;
      });
    }

    // ========================================
    // === VENDOR DIRECTORY ===
    // ========================================
    if (data?.vendorList && data.vendorList.length > 0) {
      doc.addPage();
      yPosition = 20;

      yPosition = addSectionHeader("Vendor Contact Directory", yPosition);

      doc.setFontSize(10);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(100, 100, 100);
      doc.text(
        "Keep this page handy for quick vendor contact during planning",
        leftMargin,
        yPosition
      );
      yPosition += 12;

      // Group vendors by status
      const bookedVendors = data.vendorList.filter(
        (v) => v.status === "Booked"
      );
      const otherVendors = data.vendorList.filter((v) => v.status !== "Booked");

      if (bookedVendors.length > 0) {
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(116, 0, 21);
        doc.text("✓ Confirmed Vendors:", leftMargin, yPosition);
        yPosition += 8;

        bookedVendors.forEach((vendor) => {
          yPosition = checkPageBreak(30);

          doc.setFillColor(240, 255, 240);
          doc.rect(leftMargin, yPosition, pageWidth - 30, 25, "F");

          doc.setDrawColor(76, 175, 80);
          doc.setLineWidth(2);
          doc.line(leftMargin, yPosition, leftMargin, yPosition + 25);

          yPosition += 6;
          doc.setFontSize(11);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(0, 0, 0);
          doc.text(
            `${vendor.category || "General"}: ${vendor.name || "Unnamed"}`,
            leftMargin + 5,
            yPosition
          );

          yPosition += 6;
          doc.setFontSize(9);
          doc.setFont("helvetica", "normal");
          doc.text(
            `📞 Contact: ${vendor.contact || "Not provided"}`,
            leftMargin + 5,
            yPosition
          );

          if (vendor.cost) {
            yPosition += 5;
            doc.text(
              `💰 Cost: ${formatCurrency(vendor.cost)}`,
              leftMargin + 5,
              yPosition
            );
          }

          if (vendor.notes) {
            yPosition += 5;
            const noteText = doc.splitTextToSize(
              `📝 ${vendor.notes}`,
              pageWidth - 45
            );
            doc.text(noteText, leftMargin + 5, yPosition);
            yPosition += noteText.length * 4;
          }

          yPosition += 8;
        });
      }

      if (otherVendors.length > 0) {
        yPosition += 5;
        yPosition = checkPageBreak(40);

        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(116, 0, 21);
        doc.text("⏳ Pending & Researching:", leftMargin, yPosition);
        yPosition += 10;

        const vendorTableData = otherVendors.map((vendor) => [
          vendor.category || "N/A",
          vendor.name || "Unnamed",
          vendor.contact || "—",
          vendor.status || "Pending",
          vendor.cost ? formatCurrency(vendor.cost) : "—",
        ]);

        doc.autoTable({
          startY: yPosition,
          head: [["Category", "Vendor", "Contact", "Status", "Cost"]],
          body: vendorTableData,
          theme: "striped",
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
    }

    // ========================================
    // === TIMELINE & TASKS ===
    // ========================================
    if ((data?.taskList && data.taskList.length > 0) || weddingDate) {
      doc.addPage();
      yPosition = 20;

      yPosition = addSectionHeader("Timeline & Task Checklist", yPosition);

      if (weddingDate) {
        const countdown = calculateCountdown(weddingDate);
        if (countdown && !countdown.isPast) {
          doc.setFillColor(255, 250, 240);
          doc.rect(leftMargin, yPosition, pageWidth - 30, 15, "F");

          yPosition += 10;
          doc.setFontSize(12);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(116, 0, 21);
          doc.text(`⏰ ${countdown.text}`, leftMargin + 5, yPosition);
          yPosition += 12;
        }
      }

      if (data?.taskList && data.taskList.length > 0) {
        // Sort tasks by date
        const sortedTasks = [...data.taskList].sort((a, b) => {
          if (!a.date) return 1;
          if (!b.date) return -1;
          return new Date(a.date) - new Date(b.date);
        });

        const completedTasks = sortedTasks.filter(
          (t) => t.completed || t.status === "Completed"
        );
        const pendingTasks = sortedTasks.filter(
          (t) => !t.completed && t.status !== "Completed"
        );

        if (pendingTasks.length > 0) {
          doc.setFontSize(11);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(116, 0, 21);
          doc.text(
            `☐ Pending Tasks (${pendingTasks.length}):`,
            leftMargin,
            yPosition
          );
          yPosition += 10;

          pendingTasks.forEach((task) => {
            yPosition = checkPageBreak(15);

            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(0, 0, 0);

            // Checkbox
            doc.rect(leftMargin, yPosition - 3, 4, 4);

            // Task text
            const taskText = `${task.task || "Untitled Task"}`;
            doc.text(taskText, leftMargin + 7, yPosition);

            // Date
            if (task.date) {
              doc.setTextColor(100, 100, 100);
              doc.setFontSize(9);
              doc.text(
                `📅 ${formatDate(task.date)}`,
                rightMargin - 45,
                yPosition,
                { align: "left" }
              );
            }

            yPosition += 7;
          });
        }

        if (completedTasks.length > 0) {
          yPosition += 8;
          yPosition = checkPageBreak(30);

          doc.setFontSize(11);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(76, 175, 80);
          doc.text(
            `✓ Completed Tasks (${completedTasks.length}):`,
            leftMargin,
            yPosition
          );
          yPosition += 10;

          completedTasks.forEach((task) => {
            yPosition = checkPageBreak(10);

            doc.setFontSize(9);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(150, 150, 150);

            doc.text("✓", leftMargin, yPosition);
            doc.text(task.task || "Untitled Task", leftMargin + 7, yPosition);

            if (task.date) {
              doc.text(formatDate(task.date), rightMargin - 45, yPosition, {
                align: "left",
              });
            }

            yPosition += 6;
          });
        }
      }
    }

    // ========================================
    // === OFFLINE PLANNING GUIDE ===
    // ========================================
    doc.addPage();
    yPosition = 20;

    yPosition = addSectionHeader("Offline Planning Checklists", yPosition);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    doc.text(
      "Use these checklists when planning offline or meeting with vendors:",
      leftMargin,
      yPosition
    );
    yPosition += 15;

    // Venue Checklist
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(116, 0, 21);
    doc.text("📍 Venue Selection Checklist:", leftMargin, yPosition);
    yPosition += 7;

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    const venueChecklist = [
      "☐ Capacity matches guest count",
      "☐ Available on wedding date",
      "☐ Fits within budget (including hidden fees)",
      "☐ Has adequate parking or transport access",
      "☐ Indoor/outdoor backup options",
      "☐ Catering allowed/provided",
      "☐ Sound system and electricity adequate",
      "☐ Changing rooms for bride & groom",
      "☐ Photography-friendly lighting",
      "☐ Deposit and payment terms agreed",
    ];
    venueChecklist.forEach((item) => {
      doc.text(item, leftMargin + 5, yPosition);
      yPosition += 5;
    });

    yPosition += 10;
    yPosition = checkPageBreak(60);

    // Vendor Meeting Checklist
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(116, 0, 21);
    doc.text("🤝 Vendor Meeting Checklist:", leftMargin, yPosition);
    yPosition += 7;

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    const vendorChecklist = [
      "☐ Get detailed written quote",
      "☐ Check availability for wedding date",
      "☐ Review portfolio/previous work",
      "☐ Discuss payment schedule & methods",
      "☐ Clarify cancellation/refund policy",
      "☐ Ask for client references",
      "☐ Confirm what's included vs. extra costs",
      "☐ Get contract in writing before payment",
      "☐ Discuss backup plans for emergencies",
      "☐ Save vendor contact info immediately",
    ];
    vendorChecklist.forEach((item) => {
      doc.text(item, leftMargin + 5, yPosition);
      yPosition += 5;
    });

    yPosition += 10;
    yPosition = checkPageBreak(50);

    // Week Before Wedding Checklist
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(116, 0, 21);
    doc.text("📅 Final Week Checklist:", leftMargin, yPosition);
    yPosition += 7;

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    const finalWeekChecklist = [
      "☐ Confirm all vendor arrival times",
      "☐ Finalize guest count with caterer",
      "☐ Prepare vendor payments/tips",
      "☐ Create day-of timeline for everyone",
      "☐ Pack emergency kit (safety pins, makeup, etc.)",
      "☐ Confirm transportation for all parties",
      "☐ Give reception venue final headcount",
      "☐ Delegate tasks to wedding party",
      "☐ Prepare vendor contact list for day-of coordinator",
      "☐ Get plenty of rest and stay hydrated!",
    ];
    finalWeekChecklist.forEach((item) => {
      doc.text(item, leftMargin + 5, yPosition);
      yPosition += 5;
    });

    // ========================================
    // === EMERGENCY CONTACTS & NOTES ===
    // ========================================
    doc.addPage();
    yPosition = 20;

    yPosition = addSectionHeader("Emergency Contacts & Notes", yPosition);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    doc.text(
      "Keep this page accessible on your wedding day!",
      leftMargin,
      yPosition
    );
    yPosition += 15;

    // Emergency Contact Table
    doc.autoTable({
      startY: yPosition,
      head: [["Contact", "Name", "Phone Number"]],
      body: [
        [
          "Wedding Planner/Coordinator",
          "_____________________",
          "_____________________",
        ],
        ["Venue Manager", "_____________________", "_____________________"],
        ["Caterer", "_____________________", "_____________________"],
        ["Photographer", "_____________________", "_____________________"],
        ["Transportation", "_____________________", "_____________________"],
        ["Emergency Services", "Local Police/Hospital", "___________________"],
      ],
      theme: "grid",
      headStyles: {
        fillColor: primaryColor,
        textColor: [255, 255, 255],
        fontSize: 10,
        fontStyle: "bold",
      },
      bodyStyles: { fontSize: 9, cellPadding: 3 },
      columnStyles: {
        0: { cellWidth: 50 },
        1: { cellWidth: 60 },
        2: { cellWidth: 50 },
      },
    });

    yPosition = doc.lastAutoTable.finalY + 15;
    yPosition = checkPageBreak(60);

    // Notes Section
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(116, 0, 21);
    doc.text("📝 Important Notes & Reminders:", leftMargin, yPosition);
    yPosition += 10;

    // Draw lined note area
    for (let i = 0; i < 15; i++) {
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.1);
      doc.line(leftMargin, yPosition, rightMargin, yPosition);
      yPosition += 7;
    }

    // ========================================
    // === FOOTER ON ALL PAGES ===
    // ========================================
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);

      // Page numbers
      doc.setFontSize(9);
      doc.setTextColor(128, 128, 128);
      doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 10, {
        align: "center",
      });

      // Footer text
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(
        "Generated by Northern Wedding Guide | hausaroom.com | Plan Your Dream Northern Wedding",
        pageWidth / 2,
        pageHeight - 5,
        { align: "center" }
      );
    }

    // ========================================
    // === SAVE PDF ===
    // ========================================
    const filename = `${brideName.replace(/\s+/g, "_")}_Complete_Wedding_Plan_${new Date().toISOString().split("T")[0]}.pdf`;
    doc.save(filename);

    console.log(`✅ Enhanced PDF generated successfully: ${filename}`);
    console.log(
      `📊 PDF contains ${pageCount} pages of comprehensive planning information`
    );
    return true;
  } catch (error) {
    console.error("❌ PDF generation error:", error);
    console.error("Error stack:", error.stack);
    throw error; // Re-throw to be caught by handleExport
  }
};
