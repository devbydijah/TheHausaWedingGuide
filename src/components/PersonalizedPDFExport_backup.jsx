import { useState } from "react";
import { supabase } from "../lib/supabase";
import { PictureAsPdf } from "@mui/icons-material";

// Lazy load pdfmake to avoid initialization issues
let pdfMakeModule = null;
let pdfFontsModule = null;

const initPdfMake = async () => {
  if (!pdfMakeModule) {
    pdfMakeModule = await import("pdfmake/build/pdfmake");
    pdfFontsModule = await import("pdfmake/build/vfs_fonts");

    const pdfMake = pdfMakeModule.default || pdfMakeModule;
    const pdfFonts = pdfFontsModule.default || pdfFontsModule;

    if (pdfMake.vfs === undefined) {
      pdfMake.vfs = pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : pdfFonts.vfs;
    }
  }
  return pdfMakeModule.default || pdfMakeModule;
};

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

      // Call the new pdfmake function
      await generatePersonalizedPDF(progress, {
        brideName: user.bride_name || "Bride",
        email: userEmail,
        weddingDate: user.wedding_date,
      });

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
 * Standalone function to generate personalized PDF using pdfmake
 * Beautiful, professional design with modern layouts
 *
 * @param {Object} data - User's wedding planning data
 * @param {Object} userInfo - { brideName, email, weddingDate }
 */
export const generatePersonalizedPDF = async (data, userInfo) => {
  try {
    console.log("📄 Starting enhanced pdfmake PDF generation...");
    console.log("Data:", data);
    console.log("UserInfo:", userInfo);

    const {
      brideName = "Bride",
      email = "",
      weddingDate = null,
    } = userInfo || {};

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

    // Brand colors
    const colors = {
      primary: "#740015",
      secondary: "#531946",
      accent: "#CE805C",
      lightAccent: "#F5E6D3",
      darkText: "#1a1a1a",
      lightText: "#666666",
      success: "#4CAF50",
      warning: "#FF9800",
    };

    const countdown = calculateCountdown(weddingDate);

    // Vision details mapping
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

    // ========================================
    // PDF DOCUMENT DEFINITION
    // ========================================
    const docDefinition = {
      info: {
        title: `${brideName}'s Wedding Plan`,
        author: "Northern Wedding Guide",
        subject: "Wedding Planning Guide",
        keywords: "wedding, planning, Northern Nigeria, Hausa",
      },
      pageSize: "A4",
      pageMargins: [40, 60, 40, 60],

      // Header on every page
      header: function (currentPage, pageCount) {
        if (currentPage === 1) return null; // No header on title page
        return {
          columns: [
            {
              text: `${brideName}'s Wedding Plan`,
              style: "headerText",
              margin: [40, 20, 0, 0],
            },
            {
              text: `Page ${currentPage} of ${pageCount}`,
              style: "headerText",
              alignment: "right",
              margin: [0, 20, 40, 0],
            },
          ],
        };
      },

      // Footer on every page
      footer: function (currentPage, pageCount) {
        return {
          text: "Generated by Northern Wedding Guide | hausaroom.com | Plan Your Dream Northern Wedding",
          style: "footer",
          alignment: "center",
          margin: [0, 0, 0, 20],
        };
      },

      content: [
        // ========================================
        // TITLE PAGE
        // ========================================
        {
          canvas: [
            {
              type: "rect",
              x: -40,
              y: -60,
              w: 515,
              h: 150,
              color: colors.primary,
            },
          ],
        },
        {
          text: "Northern Wedding Guide",
          style: "title",
          color: "white",
          margin: [0, -120, 0, 10],
        },
        {
          text: "Complete Wedding Planning Guide",
          style: "subtitle",
          color: "white",
          margin: [0, 0, 0, 5],
        },
        {
          text: "Your Personalized Offline Planning Companion",
          style: "smallSubtitle",
          color: "white",
          margin: [0, 0, 0, 50],
        },

        // Bride name and countdown
        {
          text: `${brideName}'s Wedding Plan`,
          style: "mainHeading",
          margin: [0, 20, 0, 15],
        },
        countdown
          ? {
              text: countdown.text,
              style: "countdown",
              color: colors.primary,
              margin: [0, 0, 0, 10],
            }
          : {},
        weddingDate
          ? {
              text: `Wedding Date: ${formatDate(weddingDate)}`,
              style: "normalText",
              margin: [0, 0, 0, 5],
            }
          : {},
        {
          text: `Generated: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`,
          style: "lightText",
          margin: [0, 0, 0, 30],
        },

        // Table of Contents Box
        {
          canvas: [
            {
              type: "rect",
              x: 0,
              y: 0,
              w: 475,
              h: 140,
              lineWidth: 1,
              lineColor: colors.accent,
            },
          ],
        },
        {
          text: "Contents of This Guide",
          style: "sectionSubheading",
          color: colors.primary,
          margin: [10, -130, 0, 10],
        },
        {
          ul: [
            "📋 Your Wedding Vision & Style",
            "💰 Complete Budget Breakdown",
            "👥 Vendor Contact Directory",
            "📅 Timeline & Task Checklist",
            "✅ Offline Planning Checklists",
            "📞 Emergency Contacts & Notes",
          ],
          style: "tocList",
          margin: [15, 0, 0, 20],
        },

        // ========================================
        // VISION QUIZ RESULTS PAGE
        // ========================================
        { text: "", pageBreak: "after" },

        {
          canvas: [
            {
              type: "rect",
              x: -40,
              y: 0,
              w: 555,
              h: 35,
              color: colors.accent,
            },
          ],
        },
        {
          text: "Your Wedding Vision",
          style: "sectionHeading",
          color: "white",
          margin: [0, -28, 0, 20],
        },

        ...(data?.visionQuiz?.result || data?.visionResult
          ? (() => {
              const visionResult =
                data?.visionQuiz?.result || data?.visionResult;
              const selectedVision =
                visionDetails[visionResult?.toLowerCase()] ||
                visionDetails.fusion;

              return [
                {
                  text: selectedVision.title,
                  style: "subHeading",
                  color: colors.primary,
                  margin: [0, 10, 0, 10],
                },
                {
                  text: selectedVision.description,
                  style: "normalText",
                  margin: [0, 0, 0, 15],
                },
                {
                  text: "Key Characteristics:",
                  style: "boldText",
                  margin: [0, 0, 0, 8],
                },
                {
                  ul: selectedVision.characteristics,
                  style: "bulletList",
                  margin: [0, 0, 0, 15],
                },
              ];
            })()
          : []),

        // Priorities
        ...(data?.priorities && data.priorities.length > 0
          ? [
              {
                canvas: [
                  {
                    type: "rect",
                    x: 0,
                    y: 0,
                    w: 475,
                    h: 80 + data.priorities.length * 15,
                    color: colors.lightAccent,
                  },
                ],
              },
              {
                text: "Your Top Priorities:",
                style: "boldText",
                color: colors.primary,
                margin: [10, -80 - data.priorities.length * 15 + 10, 0, 8],
              },
              {
                ol: data.priorities,
                style: "bulletList",
                margin: [15, 0, 0, 10],
              },
            ]
          : []),

        // ========================================
        // BUDGET BREAKDOWN PAGE
        // ========================================
        { text: "", pageBreak: "after" },

        {
          canvas: [
            {
              type: "rect",
              x: -40,
              y: 0,
              w: 555,
              h: 35,
              color: colors.accent,
            },
          ],
        },
        {
          text: "Budget Breakdown",
          style: "sectionHeading",
          color: "white",
          margin: [0, -28, 0, 20],
        },

        ...(data?.totalBudget
          ? [
              {
                text: `Total Budget: ${formatCurrency(data.totalBudget)}`,
                style: "bigNumber",
                color: colors.primary,
                margin: [0, 10, 0, 20],
              },
            ]
          : []),

        // Budget table
        ...(data?.budgetCategories &&
        Object.keys(data.budgetCategories).length > 0
          ? [
              {
                table: {
                  headerRows: 1,
                  widths: ["*", "auto", "auto", "auto", "auto"],
                  body: [
                    [
                      { text: "Category", style: "tableHeader" },
                      { text: "%", style: "tableHeader", alignment: "center" },
                      {
                        text: "Budgeted",
                        style: "tableHeader",
                        alignment: "right",
                      },
                      {
                        text: "Spent",
                        style: "tableHeader",
                        alignment: "right",
                      },
                      {
                        text: "Remaining",
                        style: "tableHeader",
                        alignment: "right",
                      },
                    ],
                    ...Object.entries(data.budgetCategories).map(
                      ([category, details]) => [
                        { text: category, style: "tableCell" },
                        {
                          text: `${details.percentage || 0}%`,
                          style: "tableCell",
                          alignment: "center",
                        },
                        {
                          text: formatCurrency(details.amount || 0),
                          style: "tableCell",
                          alignment: "right",
                        },
                        {
                          text: details.spent
                            ? formatCurrency(details.spent)
                            : "₦0",
                          style: "tableCell",
                          alignment: "right",
                        },
                        {
                          text: formatCurrency(
                            (details.amount || 0) - (details.spent || 0)
                          ),
                          style: "tableCell",
                          alignment: "right",
                        },
                      ]
                    ),
                  ],
                },
                layout: {
                  fillColor: function (rowIndex) {
                    return rowIndex === 0
                      ? colors.primary
                      : rowIndex % 2 === 0
                        ? colors.lightAccent
                        : null;
                  },
                  hLineWidth: function () {
                    return 0.5;
                  },
                  vLineWidth: function () {
                    return 0.5;
                  },
                  hLineColor: function () {
                    return "#dddddd";
                  },
                  vLineColor: function () {
                    return "#dddddd";
                  },
                },
                margin: [0, 0, 0, 20],
              },
            ]
          : []),

        // Budget Tips Box
        {
          canvas: [
            {
              type: "rect",
              x: 0,
              y: 0,
              w: 475,
              h: 110,
              color: colors.lightAccent,
            },
          ],
        },
        {
          text: "💡 Budget Management Tips:",
          style: "boldText",
          color: colors.primary,
          margin: [10, -100, 0, 8],
        },
        {
          ul: [
            "Track all expenses immediately to avoid budget surprises",
            "Always negotiate with vendors - most prices have room for discussion",
            "Keep 10-15% of your budget as emergency contingency",
            "Get written quotes from at least 3 vendors before deciding",
            "Consider off-peak dates for better venue and vendor rates",
          ],
          style: "smallText",
          margin: [15, 0, 0, 10],
        },

        // ========================================
        // VENDOR DIRECTORY PAGE
        // ========================================
        ...(data?.vendorList && data.vendorList.length > 0
          ? [
              { text: "", pageBreak: "after" },

              {
                canvas: [
                  {
                    type: "rect",
                    x: -40,
                    y: 0,
                    w: 555,
                    h: 35,
                    color: colors.accent,
                  },
                ],
              },
              {
                text: "Vendor Contact Directory",
                style: "sectionHeading",
                color: "white",
                margin: [0, -28, 0, 15],
              },
              {
                text: "Keep this page handy for quick vendor contact during planning",
                style: "lightText",
                italics: true,
                margin: [0, 0, 0, 20],
              },

              // Confirmed vendors
              ...(() => {
                const bookedVendors = data.vendorList.filter(
                  (v) => v.status === "Booked"
                );
                if (bookedVendors.length === 0) return [];

                return [
                  {
                    text: "✓ Confirmed Vendors:",
                    style: "boldText",
                    color: colors.primary,
                    margin: [0, 0, 0, 10],
                  },
                  ...bookedVendors
                    .map((vendor) => ({
                      canvas: [
                        {
                          type: "rect",
                          x: 0,
                          y: 0,
                          w: 475,
                          h: 65,
                          color: "#f0fff0",
                        },
                        {
                          type: "rect",
                          x: 0,
                          y: 0,
                          w: 4,
                          h: 65,
                          color: colors.success,
                        },
                      ],
                      margin: [0, 0, 0, 5],
                    }))
                    .concat(
                      bookedVendors.map((vendor, index) => ({
                        stack: [
                          {
                            text: `${vendor.category || "General"}: ${vendor.name || "Unnamed"}`,
                            style: "boldText",
                            margin: [10, -60 - index * 70, 0, 3],
                          },
                          {
                            text: `📞 Contact: ${vendor.contact || "Not provided"}`,
                            style: "smallText",
                            margin: [10, 0, 0, 2],
                          },
                          vendor.cost
                            ? {
                                text: `💰 Cost: ${formatCurrency(vendor.cost)}`,
                                style: "smallText",
                                margin: [10, 0, 0, 2],
                              }
                            : {},
                          vendor.notes
                            ? {
                                text: `📝 ${vendor.notes}`,
                                style: "smallText",
                                margin: [10, 0, 0, 5],
                              }
                            : {},
                        ],
                      }))
                    ),
                  { text: "", margin: [0, 0, 0, 15] },
                ];
              })(),

              // Other vendors
              ...(() => {
                const otherVendors = data.vendorList.filter(
                  (v) => v.status !== "Booked"
                );
                if (otherVendors.length === 0) return [];

                return [
                  {
                    text: "⏳ Pending & Researching:",
                    style: "boldText",
                    color: colors.primary,
                    margin: [0, 10, 0, 10],
                  },
                  {
                    table: {
                      headerRows: 1,
                      widths: ["auto", "*", "auto", "auto", "auto"],
                      body: [
                        [
                          { text: "Category", style: "tableHeader" },
                          { text: "Vendor", style: "tableHeader" },
                          { text: "Contact", style: "tableHeader" },
                          { text: "Status", style: "tableHeader" },
                          {
                            text: "Cost",
                            style: "tableHeader",
                            alignment: "right",
                          },
                        ],
                        ...otherVendors.map((vendor) => [
                          {
                            text: vendor.category || "N/A",
                            style: "tableCell",
                          },
                          {
                            text: vendor.name || "Unnamed",
                            style: "tableCell",
                          },
                          { text: vendor.contact || "—", style: "tableCell" },
                          {
                            text: vendor.status || "Pending",
                            style: "tableCell",
                          },
                          {
                            text: vendor.cost
                              ? formatCurrency(vendor.cost)
                              : "—",
                            style: "tableCell",
                            alignment: "right",
                          },
                        ]),
                      ],
                    },
                    layout: {
                      fillColor: function (rowIndex) {
                        return rowIndex === 0
                          ? colors.primary
                          : rowIndex % 2 === 0
                            ? colors.lightAccent
                            : null;
                      },
                      hLineWidth: function () {
                        return 0.5;
                      },
                      vLineWidth: function () {
                        return 0.5;
                      },
                      hLineColor: function () {
                        return "#dddddd";
                      },
                      vLineColor: function () {
                        return "#dddddd";
                      },
                    },
                    margin: [0, 0, 0, 20],
                  },
                ];
              })(),
            ]
          : []),

        // ========================================
        // TIMELINE & TASKS PAGE
        // ========================================
        ...((data?.taskList && data.taskList.length > 0) || weddingDate
          ? [
              { text: "", pageBreak: "after" },

              {
                canvas: [
                  {
                    type: "rect",
                    x: -40,
                    y: 0,
                    w: 555,
                    h: 35,
                    color: colors.accent,
                  },
                ],
              },
              {
                text: "Timeline & Task Checklist",
                style: "sectionHeading",
                color: "white",
                margin: [0, -28, 0, 20],
              },

              // Countdown banner
              ...(countdown && !countdown.isPast
                ? [
                    {
                      canvas: [
                        {
                          type: "rect",
                          x: 0,
                          y: 0,
                          w: 475,
                          h: 30,
                          color: "#fff8dc",
                        },
                      ],
                    },
                    {
                      text: `⏰ ${countdown.text}`,
                      style: "boldText",
                      color: colors.primary,
                      margin: [10, -22, 0, 20],
                    },
                  ]
                : []),

              // Tasks
              ...(data?.taskList && data.taskList.length > 0
                ? (() => {
                    const sortedTasks = [...data.taskList].sort((a, b) => {
                      if (!a.date) return 1;
                      if (!b.date) return -1;
                      return new Date(a.date) - new Date(b.date);
                    });

                    const pendingTasks = sortedTasks.filter(
                      (t) => !t.completed && t.status !== "Completed"
                    );
                    const completedTasks = sortedTasks.filter(
                      (t) => t.completed || t.status === "Completed"
                    );

                    return [
                      ...(pendingTasks.length > 0
                        ? [
                            {
                              text: `☐ Pending Tasks (${pendingTasks.length}):`,
                              style: "boldText",
                              color: colors.primary,
                              margin: [0, 0, 0, 10],
                            },
                            {
                              ul: pendingTasks.map((task) => ({
                                text: [
                                  {
                                    text: task.task || "Untitled Task",
                                    style: "normalText",
                                  },
                                  task.date
                                    ? {
                                        text: `  📅 ${formatDate(task.date)}`,
                                        style: "lightText",
                                      }
                                    : {},
                                ],
                              })),
                              style: "taskList",
                              margin: [0, 0, 0, 15],
                            },
                          ]
                        : []),

                      ...(completedTasks.length > 0
                        ? [
                            {
                              text: `✓ Completed Tasks (${completedTasks.length}):`,
                              style: "boldText",
                              color: colors.success,
                              margin: [0, 10, 0, 10],
                            },
                            {
                              ul: completedTasks.map((task) => ({
                                text: [
                                  {
                                    text: task.task || "Untitled Task",
                                    style: "lightText",
                                    decoration: "lineThrough",
                                  },
                                  task.date
                                    ? {
                                        text: `  📅 ${formatDate(task.date)}`,
                                        style: "lightText",
                                      }
                                    : {},
                                ],
                              })),
                              style: "taskList",
                              margin: [0, 0, 0, 15],
                            },
                          ]
                        : []),
                    ];
                  })()
                : []),
            ]
          : []),

        // ========================================
        // OFFLINE PLANNING CHECKLISTS PAGE
        // ========================================
        { text: "", pageBreak: "after" },

        {
          canvas: [
            {
              type: "rect",
              x: -40,
              y: 0,
              w: 555,
              h: 35,
              color: colors.accent,
            },
          ],
        },
        {
          text: "Offline Planning Checklists",
          style: "sectionHeading",
          color: "white",
          margin: [0, -28, 0, 15],
        },
        {
          text: "Use these checklists when planning offline or meeting with vendors:",
          style: "normalText",
          margin: [0, 0, 0, 20],
        },

        // Venue Checklist
        {
          text: "📍 Venue Selection Checklist:",
          style: "boldText",
          color: colors.primary,
          margin: [0, 0, 0, 8],
        },
        {
          ul: [
            "Capacity matches guest count",
            "Available on wedding date",
            "Fits within budget (including hidden fees)",
            "Has adequate parking or transport access",
            "Indoor/outdoor backup options",
            "Catering allowed/provided",
            "Sound system and electricity adequate",
            "Changing rooms for bride & groom",
            "Photography-friendly lighting",
            "Deposit and payment terms agreed",
          ],
          style: "checklistItem",
          margin: [0, 0, 0, 20],
        },

        // Vendor Meeting Checklist
        {
          text: "🤝 Vendor Meeting Checklist:",
          style: "boldText",
          color: colors.primary,
          margin: [0, 0, 0, 8],
        },
        {
          ul: [
            "Get detailed written quote",
            "Check availability for wedding date",
            "Review portfolio/previous work",
            "Discuss payment schedule & methods",
            "Clarify cancellation/refund policy",
            "Ask for client references",
            "Confirm what's included vs. extra costs",
            "Get contract in writing before payment",
            "Discuss backup plans for emergencies",
            "Save vendor contact info immediately",
          ],
          style: "checklistItem",
          margin: [0, 0, 0, 20],
        },

        // Final Week Checklist
        {
          text: "📅 Final Week Checklist:",
          style: "boldText",
          color: colors.primary,
          margin: [0, 0, 0, 8],
        },
        {
          ul: [
            "Confirm all vendor arrival times",
            "Finalize guest count with caterer",
            "Prepare vendor payments/tips",
            "Create day-of timeline for everyone",
            "Pack emergency kit (safety pins, makeup, etc.)",
            "Confirm transportation for all parties",
            "Give reception venue final headcount",
            "Delegate tasks to wedding party",
            "Prepare vendor contact list for day-of coordinator",
            "Get plenty of rest and stay hydrated!",
          ],
          style: "checklistItem",
          margin: [0, 0, 0, 20],
        },

        // ========================================
        // EMERGENCY CONTACTS PAGE
        // ========================================
        { text: "", pageBreak: "after" },

        {
          canvas: [
            {
              type: "rect",
              x: -40,
              y: 0,
              w: 555,
              h: 35,
              color: colors.accent,
            },
          ],
        },
        {
          text: "Emergency Contacts & Notes",
          style: "sectionHeading",
          color: "white",
          margin: [0, -28, 0, 15],
        },
        {
          text: "Keep this page accessible on your wedding day!",
          style: "normalText",
          color: colors.primary,
          bold: true,
          margin: [0, 0, 0, 20],
        },

        // Emergency contacts table
        {
          table: {
            headerRows: 1,
            widths: ["*", "*", "*"],
            body: [
              [
                { text: "Contact", style: "tableHeader" },
                { text: "Name", style: "tableHeader" },
                { text: "Phone Number", style: "tableHeader" },
              ],
              [
                { text: "Wedding Planner/Coordinator", style: "tableCell" },
                { text: "_____________________", style: "tableCell" },
                { text: "_____________________", style: "tableCell" },
              ],
              [
                { text: "Venue Manager", style: "tableCell" },
                { text: "_____________________", style: "tableCell" },
                { text: "_____________________", style: "tableCell" },
              ],
              [
                { text: "Caterer", style: "tableCell" },
                { text: "_____________________", style: "tableCell" },
                { text: "_____________________", style: "tableCell" },
              ],
              [
                { text: "Photographer", style: "tableCell" },
                { text: "_____________________", style: "tableCell" },
                { text: "_____________________", style: "tableCell" },
              ],
              [
                { text: "Transportation", style: "tableCell" },
                { text: "_____________________", style: "tableCell" },
                { text: "_____________________", style: "tableCell" },
              ],
              [
                { text: "Emergency Services", style: "tableCell" },
                { text: "Local Police/Hospital", style: "tableCell" },
                { text: "___________________", style: "tableCell" },
              ],
            ],
          },
          layout: {
            fillColor: function (rowIndex) {
              return rowIndex === 0
                ? colors.primary
                : rowIndex % 2 === 0
                  ? colors.lightAccent
                  : null;
            },
            hLineWidth: function () {
              return 1;
            },
            vLineWidth: function () {
              return 1;
            },
            hLineColor: function () {
              return "#cccccc";
            },
            vLineColor: function () {
              return "#cccccc";
            },
          },
          margin: [0, 0, 0, 25],
        },

        // Notes section
        {
          text: "📝 Important Notes & Reminders:",
          style: "boldText",
          color: colors.primary,
          margin: [0, 0, 0, 10],
        },
        {
          canvas: [
            {
              type: "line",
              x1: 0,
              y1: 10,
              x2: 475,
              y2: 10,
              lineWidth: 0.5,
              lineColor: "#cccccc",
            },
            {
              type: "line",
              x1: 0,
              y1: 25,
              x2: 475,
              y2: 25,
              lineWidth: 0.5,
              lineColor: "#cccccc",
            },
            {
              type: "line",
              x1: 0,
              y1: 40,
              x2: 475,
              y2: 40,
              lineWidth: 0.5,
              lineColor: "#cccccc",
            },
            {
              type: "line",
              x1: 0,
              y1: 55,
              x2: 475,
              y2: 55,
              lineWidth: 0.5,
              lineColor: "#cccccc",
            },
            {
              type: "line",
              x1: 0,
              y1: 70,
              x2: 475,
              y2: 70,
              lineWidth: 0.5,
              lineColor: "#cccccc",
            },
            {
              type: "line",
              x1: 0,
              y1: 85,
              x2: 475,
              y2: 85,
              lineWidth: 0.5,
              lineColor: "#cccccc",
            },
            {
              type: "line",
              x1: 0,
              y1: 100,
              x2: 475,
              y2: 100,
              lineWidth: 0.5,
              lineColor: "#cccccc",
            },
            {
              type: "line",
              x1: 0,
              y1: 115,
              x2: 475,
              y2: 115,
              lineWidth: 0.5,
              lineColor: "#cccccc",
            },
            {
              type: "line",
              x1: 0,
              y1: 130,
              x2: 475,
              y2: 130,
              lineWidth: 0.5,
              lineColor: "#cccccc",
            },
            {
              type: "line",
              x1: 0,
              y1: 145,
              x2: 475,
              y2: 145,
              lineWidth: 0.5,
              lineColor: "#cccccc",
            },
          ],
        },
      ],

      // ========================================
      // STYLES
      // ========================================
      styles: {
        title: {
          fontSize: 32,
          bold: true,
          alignment: "center",
        },
        subtitle: {
          fontSize: 16,
          alignment: "center",
        },
        smallSubtitle: {
          fontSize: 12,
          alignment: "center",
          opacity: 0.8,
        },
        mainHeading: {
          fontSize: 24,
          bold: true,
          alignment: "center",
        },
        countdown: {
          fontSize: 14,
          bold: true,
          alignment: "center",
        },
        sectionHeading: {
          fontSize: 18,
          bold: true,
        },
        subHeading: {
          fontSize: 16,
          bold: true,
        },
        sectionSubheading: {
          fontSize: 14,
          bold: true,
        },
        normalText: {
          fontSize: 11,
          lineHeight: 1.4,
        },
        boldText: {
          fontSize: 11,
          bold: true,
        },
        lightText: {
          fontSize: 10,
          color: "#666666",
        },
        smallText: {
          fontSize: 9,
          lineHeight: 1.3,
        },
        bigNumber: {
          fontSize: 18,
          bold: true,
        },
        tocList: {
          fontSize: 10,
          lineHeight: 1.5,
        },
        bulletList: {
          fontSize: 10,
          lineHeight: 1.4,
        },
        checklistItem: {
          fontSize: 9,
          lineHeight: 1.3,
        },
        taskList: {
          fontSize: 10,
          lineHeight: 1.4,
        },
        tableHeader: {
          fontSize: 10,
          bold: true,
          color: "white",
          fillColor: colors.primary,
        },
        tableCell: {
          fontSize: 9,
        },
        headerText: {
          fontSize: 9,
          color: "#666666",
        },
        footer: {
          fontSize: 8,
          color: "#999999",
        },
      },

      defaultStyle: {
        font: "Roboto",
      },
    };

    // Generate and download PDF
    const filename = `${brideName.replace(/\s+/g, "_")}_Complete_Wedding_Plan_${new Date().toISOString().split("T")[0]}.pdf`;

    // Initialize pdfMake dynamically
    const pdfMake = await initPdfMake();
    pdfMake.createPdf(docDefinition).download(filename);

    console.log(`✅ Enhanced pdfmake PDF generated successfully: ${filename}`);
    return true;
  } catch (error) {
    console.error("❌ PDF generation error:", error);
    console.error("Error stack:", error.stack);
    throw error;
  }
};
