import React, { useState } from "react";
import { supabase } from "../lib/supabase";
import { PictureAsPdf } from "@mui/icons-material";

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

// Brand colors from the Hausa Wedding Guide theme (muiTheme.js)
const COLORS = {
  // Primary brand colors
  primary: "#740015", // Burgundy - main brand color
  primaryLight: "#990200",
  primaryDark: "#4a0000",

  // Secondary brand colors
  secondary: "#531946", // Maroon
  secondaryLight: "#6b2159",
  secondaryDark: "#3a1130",

  // Accent colors
  terracotta: "#CE805C", // Warm accent
  terracottaLight: "#d89b7f",
  sage: "#57886C", // Success/positive
  sageLight: "#6fa385",

  // Supporting colors
  gold: "#D4AF37",
  goldLight: "#FFF8E7",
  cream: "#FDF8F4",

  // Neutral colors
  text: "#1E1E1E",
  textLight: "#4A4A4A",
  textMuted: "#888888",
  border: "#E0D5CC",
  borderLight: "#F0EBE6",
  white: "#FFFFFF",

  // Semantic colors
  success: "#57886C",
  successLight: "#E8F5E9",
  warning: "#CE805C",
  warningLight: "#FFF3E0",
  error: "#740015",
};

// Chart colors for budget visualization
const CHART_COLORS = [
  "#740015", // Burgundy
  "#531946", // Maroon
  "#CE805C", // Terracotta
  "#57886C", // Sage
  "#D4AF37", // Gold
  "#6b2159", // Secondary Light
  "#d89b7f", // Terracotta Light
  "#6fa385", // Sage Light
];

// Geometric border pattern for Northern aesthetic
const createGeometricBorder = () => ({
  canvas: [
    // Top border with geometric pattern
    {
      type: "line",
      x1: 20,
      y1: 20,
      x2: 495,
      y2: 20,
      lineWidth: 2,
      lineColor: COLORS.gold,
    },
    {
      type: "line",
      x1: 20,
      y1: 24,
      x2: 495,
      y2: 24,
      lineWidth: 0.5,
      lineColor: COLORS.border,
    },
    // Corner accents - top left
    {
      type: "line",
      x1: 20,
      y1: 20,
      x2: 20,
      y2: 50,
      lineWidth: 2,
      lineColor: COLORS.gold,
    },
    {
      type: "line",
      x1: 20,
      y1: 20,
      x2: 50,
      y2: 20,
      lineWidth: 2,
      lineColor: COLORS.gold,
    },
    // Diamond accent top-left
    {
      type: "polyline",
      lineWidth: 1.5,
      lineColor: COLORS.gold,
      closePath: true,
      points: [
        { x: 35, y: 35 },
        { x: 42, y: 28 },
        { x: 49, y: 35 },
        { x: 42, y: 42 },
      ],
    },
    // Corner accents - top right
    {
      type: "line",
      x1: 495,
      y1: 20,
      x2: 495,
      y2: 50,
      lineWidth: 2,
      lineColor: COLORS.gold,
    },
    {
      type: "line",
      x1: 465,
      y1: 20,
      x2: 495,
      y2: 20,
      lineWidth: 2,
      lineColor: COLORS.gold,
    },
    // Diamond accent top-right
    {
      type: "polyline",
      lineWidth: 1.5,
      lineColor: COLORS.gold,
      closePath: true,
      points: [
        { x: 480, y: 35 },
        { x: 473, y: 28 },
        { x: 466, y: 35 },
        { x: 473, y: 42 },
      ],
    },
    // Bottom border
    {
      type: "line",
      x1: 20,
      y1: 780,
      x2: 495,
      y2: 780,
      lineWidth: 2,
      lineColor: COLORS.gold,
    },
    {
      type: "line",
      x1: 20,
      y1: 776,
      x2: 495,
      y2: 776,
      lineWidth: 0.5,
      lineColor: COLORS.border,
    },
    // Corner accents - bottom left
    {
      type: "line",
      x1: 20,
      y1: 750,
      x2: 20,
      y2: 780,
      lineWidth: 2,
      lineColor: COLORS.gold,
    },
    {
      type: "line",
      x1: 20,
      y1: 780,
      x2: 50,
      y2: 780,
      lineWidth: 2,
      lineColor: COLORS.gold,
    },
    // Diamond accent bottom-left
    {
      type: "polyline",
      lineWidth: 1.5,
      lineColor: COLORS.gold,
      closePath: true,
      points: [
        { x: 35, y: 765 },
        { x: 42, y: 758 },
        { x: 49, y: 765 },
        { x: 42, y: 772 },
      ],
    },
    // Corner accents - bottom right
    {
      type: "line",
      x1: 495,
      y1: 750,
      x2: 495,
      y2: 780,
      lineWidth: 2,
      lineColor: COLORS.gold,
    },
    {
      type: "line",
      x1: 465,
      y1: 780,
      x2: 495,
      y2: 780,
      lineWidth: 2,
      lineColor: COLORS.gold,
    },
    // Diamond accent bottom-right
    {
      type: "polyline",
      lineWidth: 1.5,
      lineColor: COLORS.gold,
      closePath: true,
      points: [
        { x: 480, y: 765 },
        { x: 473, y: 758 },
        { x: 466, y: 765 },
        { x: 473, y: 772 },
      ],
    },
  ],
  absolutePosition: { x: 0, y: 0 },
});

const formatCurrency = (amount) => {
  if (!amount || amount === 0) return "—";
  return "₦" + Number(amount).toLocaleString();
};

const formatDate = (dateString) => {
  if (!dateString) return null;
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatShortDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getCountdown = (weddingDate) => {
  if (!weddingDate) return null;
  const wedding = new Date(weddingDate);
  const today = new Date();
  const diffTime = wedding - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return { text: "Your special day has arrived!", days: 0 };
  const months = Math.floor(diffDays / 30);
  const days = diffDays % 30;
  if (months > 0) {
    return {
      text:
        months +
        " month" +
        (months > 1 ? "s" : "") +
        " and " +
        days +
        " day" +
        (days !== 1 ? "s" : "") +
        " until your big day!",
      days: diffDays,
    };
  }
  return {
    text:
      diffDays + " day" + (diffDays !== 1 ? "s" : "") + " until your big day!",
    days: diffDays,
  };
};

const capitalizeFirst = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const createSectionHeader = (title, icon = "") => ({
  stack: [
    {
      canvas: [
        {
          type: "rect",
          x: 0,
          y: 0,
          w: 515,
          h: 40,
          r: 8,
          color: COLORS.terracotta,
        },
        // Subtle inner highlight
        {
          type: "line",
          x1: 10,
          y1: 38,
          x2: 505,
          y2: 38,
          lineWidth: 1,
          lineColor: COLORS.terracottaLight,
        },
      ],
    },
    {
      text: (icon ? icon + "  " : "") + title,
      fontSize: 16,
      bold: true,
      color: COLORS.white,
      margin: [20, -32, 0, 20],
    },
  ],
  margin: [0, 0, 0, 20],
});

const createDivider = (width = 200) => ({
  canvas: [
    {
      type: "line",
      x1: (515 - width) / 2,
      y1: 0,
      x2: (515 + width) / 2,
      y2: 0,
      lineWidth: 1,
      lineColor: COLORS.border,
    },
  ],
  margin: [0, 12, 0, 12],
});

const createOrnamentalDivider = () => ({
  columns: [
    {
      width: "*",
      canvas: [
        {
          type: "line",
          x1: 0,
          y1: 5,
          x2: 170,
          y2: 5,
          lineWidth: 0.5,
          lineColor: COLORS.gold,
        },
      ],
    },
    {
      width: "auto",
      canvas: [
        // Diamond shape
        {
          type: "polyline",
          lineWidth: 1.5,
          lineColor: COLORS.gold,
          closePath: true,
          points: [
            { x: 10, y: 5 },
            { x: 17, y: -2 },
            { x: 24, y: 5 },
            { x: 17, y: 12 },
          ],
        },
      ],
      margin: [8, 0, 8, 0],
    },
    {
      width: "*",
      canvas: [
        {
          type: "line",
          x1: 0,
          y1: 5,
          x2: 170,
          y2: 5,
          lineWidth: 0.5,
          lineColor: COLORS.gold,
        },
      ],
    },
  ],
  margin: [40, 15, 40, 15],
});

// Professional checkbox with proper visual design
const createCheckbox = (text, checked = false, isEmpty = false) => {
  const boxSize = 14;
  const checkboxCanvas = [
    // Outer box with rounded corners effect
    {
      type: "rect",
      x: 0,
      y: 1,
      w: boxSize,
      h: boxSize,
      r: 3,
      lineWidth: 1.5,
      lineColor: checked ? COLORS.sage : COLORS.border,
    },
  ];

  if (checked) {
    // Fill box
    checkboxCanvas.push({
      type: "rect",
      x: 1,
      y: 2,
      w: boxSize - 2,
      h: boxSize - 2,
      r: 2,
      color: COLORS.sage,
    });
    // Checkmark
    checkboxCanvas.push(
      {
        type: "line",
        x1: 3,
        y1: 8,
        x2: 6,
        y2: 12,
        lineWidth: 2,
        lineColor: COLORS.white,
        lineCap: "round",
      },
      {
        type: "line",
        x1: 6,
        y1: 12,
        x2: 11,
        y2: 5,
        lineWidth: 2,
        lineColor: COLORS.white,
        lineCap: "round",
      }
    );
  }

  return {
    columns: [
      { canvas: checkboxCanvas, width: 22 },
      isEmpty
        ? {
            canvas: [
              {
                type: "line",
                x1: 0,
                y1: 9,
                x2: 280,
                y2: 9,
                lineWidth: 0.5,
                lineColor: COLORS.borderLight,
              },
            ],
          }
        : {
            text: text,
            fontSize: 10,
            color: checked ? COLORS.textMuted : COLORS.text,
            decoration: checked ? "lineThrough" : null,
            margin: [0, 2, 0, 0],
            lineHeight: 1.3,
          },
    ],
    margin: [0, 4, 0, 4],
  };
};

// Create a horizontal bar chart for budget visualization
const createBudgetBarChart = (categories, totalBudget) => {
  if (!categories || categories.length === 0 || totalBudget <= 0) return null;

  const maxWidth = 300;
  const barHeight = 18;
  const spacing = 8;
  const labelWidth = 100;

  const bars = categories.slice(0, 6).map((cat, index) => {
    const percentage = totalBudget > 0 ? (cat.amount / totalBudget) * 100 : 0;
    const barWidth = Math.max((percentage / 100) * maxWidth, 2);
    const color = CHART_COLORS[index % CHART_COLORS.length];

    return {
      columns: [
        {
          text: capitalizeFirst(cat.name),
          width: labelWidth,
          fontSize: 9,
          color: COLORS.textLight,
          margin: [0, 3, 0, 0],
        },
        {
          canvas: [
            // Background bar
            {
              type: "rect",
              x: 0,
              y: 0,
              w: maxWidth,
              h: barHeight,
              r: 4,
              color: COLORS.borderLight,
            },
            // Filled bar
            {
              type: "rect",
              x: 0,
              y: 0,
              w: barWidth,
              h: barHeight,
              r: 4,
              color: color,
            },
          ],
          width: maxWidth + 10,
        },
        {
          text: Math.round(percentage) + "%",
          width: 35,
          fontSize: 9,
          bold: true,
          color: color,
          margin: [5, 3, 0, 0],
          alignment: "right",
        },
      ],
      margin: [0, spacing / 2, 0, spacing / 2],
    };
  });

  return {
    stack: [
      {
        text: "Budget Allocation",
        fontSize: 12,
        bold: true,
        color: COLORS.secondary,
        margin: [0, 0, 0, 12],
      },
      ...bars,
    ],
    margin: [0, 15, 0, 20],
  };
};

// Create a progress ring/arc for spent vs budget
const createProgressIndicator = (spent, total) => {
  const percentage = total > 0 ? Math.min((spent / total) * 100, 100) : 0;
  const radius = 35;
  const centerX = 45;
  const centerY = 45;
  const strokeWidth = 8;

  // Calculate arc
  const angle = (percentage / 100) * 360;
  const endAngle = angle - 90; // Start from top
  const startAngle = -90;

  const startRad = (startAngle * Math.PI) / 180;
  const endRad = (endAngle * Math.PI) / 180;

  const x1 = centerX + radius * Math.cos(startRad);
  const y1 = centerY + radius * Math.sin(startRad);
  const x2 = centerX + radius * Math.cos(endRad);
  const y2 = centerY + radius * Math.sin(endRad);

  const largeArc = angle > 180 ? 1 : 0;

  return {
    stack: [
      {
        canvas: [
          // Background circle
          {
            type: "ellipse",
            x: centerX,
            y: centerY,
            r1: radius,
            r2: radius,
            lineWidth: strokeWidth,
            lineColor: COLORS.borderLight,
          },
          // Progress arc (simplified as line for pdfmake compatibility)
          percentage > 0
            ? {
                type: "ellipse",
                x: centerX,
                y: centerY,
                r1: radius,
                r2: radius,
                lineWidth: strokeWidth,
                lineColor: percentage > 80 ? COLORS.warning : COLORS.sage,
              }
            : null,
        ].filter(Boolean),
        width: 90,
        height: 90,
      },
      {
        text: Math.round(percentage) + "%",
        fontSize: 16,
        bold: true,
        color: COLORS.primary,
        alignment: "center",
        margin: [0, -55, 0, 0],
      },
      {
        text: "spent",
        fontSize: 8,
        color: COLORS.textMuted,
        alignment: "center",
        margin: [0, 5, 0, 0],
      },
    ],
    width: 90,
  };
};

const createFillableLine = (label, value = "", width = 200) => ({
  columns: [
    {
      text: label + ": ",
      fontSize: 10,
      color: COLORS.text,
      width: "auto",
      bold: true,
    },
    {
      stack: [
        { text: value || "", fontSize: 10, color: COLORS.text },
        {
          canvas: [
            {
              type: "line",
              x1: 0,
              y1: 0,
              x2: width,
              y2: 0,
              lineWidth: 0.5,
              lineColor: COLORS.border,
            },
          ],
          margin: [0, 2, 0, 0],
        },
      ],
      width: width,
    },
  ],
  margin: [0, 5, 0, 5],
});

export const generatePersonalizedPDF = async (data, userInfo = {}) => {
  try {
    console.log("Generating wedding plan PDF...");
    const pdfMake = await initPdfMake();

    const brideName = userInfo.brideName || "Bride";
    const weddingDate = userInfo.weddingDate || data?.weddingDate;
    const formattedDate = formatDate(weddingDate);
    const countdown = getCountdown(weddingDate);
    const visionResult = data?.visionQuiz?.result || data?.visionResult;
    const totalBudget = data?.totalBudget || data?.budget?.total || 0;

    const budgetCategories = data?.budgetCategories
      ? Object.entries(data.budgetCategories)
          .filter(
            ([_, details]) => details.percentage > 0 || details.amount > 0
          )
          .map(([name, details]) => ({
            name,
            percentage: details.percentage || 0,
            amount: details.amount || 0,
            spent: details.spent || 0,
          }))
      : [];

    const vendors = (data?.vendorList || []).filter(
      (v) =>
        v &&
        v.name &&
        v.name.trim() !== "" &&
        v.name.toLowerCase() !== "untitled"
    );
    const bookedVendors = vendors.filter(
      (v) => v.status?.toLowerCase() === "booked"
    );
    const pendingVendors = vendors.filter(
      (v) => v.status?.toLowerCase() !== "booked"
    );

    const tasks = (data?.taskList || data?.timeline || []).filter(
      (t) =>
        t &&
        t.task &&
        t.task.trim() !== "" &&
        !t.task.toLowerCase().includes("untitled")
    );
    const completedTasks = tasks.filter(
      (t) => t.completed || t.status === "Completed"
    );
    const pendingTasks = tasks.filter(
      (t) => !t.completed && t.status !== "Completed"
    );

    const visionStyles = {
      traditional: {
        title: "Traditional Northern Wedding",
        description:
          "A beautiful celebration deeply rooted in Northern Nigerian customs, honoring family traditions and cultural heritage.",
        characteristics: [
          "Full traditional ceremony with cultural rites",
          "Authentic Northern Nigerian attire",
          "Traditional music and entertainment",
          "Cultural food and hospitality",
          "Family-centered celebrations",
        ],
      },
      modern: {
        title: "Modern Contemporary Wedding",
        description:
          "A contemporary celebration incorporating international trends while respecting essential cultural values.",
        characteristics: [
          "Contemporary venue and decorations",
          "Modern attire with cultural accents",
          "Diverse entertainment options",
          "Fusion cuisine menu",
          "Personal expression and style",
        ],
      },
      fusion: {
        title: "Fusion Celebration",
        description:
          "The perfect blend of traditional and modern elements, creating a unique celebration that honors heritage while embracing contemporary style.",
        characteristics: [
          "Blend of traditional and modern venues",
          "Mix of cultural and contemporary attire",
          "Varied entertainment styles",
          "Fusion menu options",
          "Personalized cultural touches",
        ],
      },
    };

    const selectedStyle =
      visionStyles[visionResult?.toLowerCase()] || visionStyles.modern;

    const defaultTimeline = [
      {
        phase: "12+ Months Before",
        tasks: [
          "Set wedding date",
          "Establish budget",
          "Book venue",
          "Start guest list",
        ],
      },
      {
        phase: "9-12 Months Before",
        tasks: [
          "Book photographer/videographer",
          "Choose wedding party",
          "Shop for attire",
        ],
      },
      {
        phase: "6-9 Months Before",
        tasks: [
          "Book caterer",
          "Order invitations",
          "Plan honeymoon",
          "Book music/DJ",
        ],
      },
      {
        phase: "3-6 Months Before",
        tasks: [
          "Send invitations",
          "Finalize menu",
          "Book makeup/hair",
          "Arrange transportation",
        ],
      },
      {
        phase: "1-3 Months Before",
        tasks: [
          "Final dress fitting",
          "Confirm all vendors",
          "Get marriage license",
          "Plan rehearsal",
        ],
      },
      {
        phase: "Final Week",
        tasks: [
          "Confirm final headcount",
          "Pack for honeymoon",
          "Prepare vendor payments",
          "Relax and enjoy!",
        ],
      },
    ];

    const essentialVendorCategories = [
      "Venue",
      "Catering",
      "Photography",
      "Videography",
      "Makeup Artist",
      "Hair Stylist",
      "DJ/Music",
      "Decorator",
      "MC/Host",
      "Henna Artist",
    ];
    const missingCategories = essentialVendorCategories.filter(
      (cat) =>
        !vendors.some((v) =>
          v.category?.toLowerCase().includes(cat.toLowerCase())
        )
    );

    // PAGE 1: COVER with Geometric Border
    const coverPage = {
      stack: [
        createGeometricBorder(),
        { text: "", margin: [0, 60, 0, 0] },
        {
          text: "NORTHERN WEDDING GUIDE",
          fontSize: 11,
          color: COLORS.terracotta,
          alignment: "center",
          characterSpacing: 3,
          margin: [0, 0, 0, 8],
        },
        createOrnamentalDivider(),
        { text: "", margin: [0, 25, 0, 0] },
        {
          text: brideName + "'s",
          fontSize: 18,
          color: COLORS.textLight,
          alignment: "center",
          italics: true,
          margin: [0, 0, 0, 6],
        },
        {
          text: "Wedding Plan",
          fontSize: 42,
          bold: true,
          color: COLORS.primary,
          alignment: "center",
          margin: [0, 0, 0, 18],
        },
        {
          columns: [
            { width: "*", text: "" },
            {
              width: "auto",
              canvas: [
                {
                  type: "line",
                  x1: 0,
                  y1: 0,
                  x2: 50,
                  y2: 0,
                  lineWidth: 2,
                  lineColor: COLORS.gold,
                },
              ],
            },
            { width: 15, text: "" },
            {
              width: "auto",
              canvas: [
                {
                  type: "polyline",
                  lineWidth: 1.5,
                  lineColor: COLORS.gold,
                  closePath: true,
                  points: [
                    { x: 8, y: 0 },
                    { x: 15, y: -7 },
                    { x: 22, y: 0 },
                    { x: 15, y: 7 },
                  ],
                },
              ],
            },
            { width: 15, text: "" },
            {
              width: "auto",
              canvas: [
                {
                  type: "line",
                  x1: 0,
                  y1: 0,
                  x2: 50,
                  y2: 0,
                  lineWidth: 2,
                  lineColor: COLORS.gold,
                },
              ],
            },
            { width: "*", text: "" },
          ],
          margin: [0, 8, 0, 30],
        },
        weddingDate
          ? {
              stack: [
                {
                  text: formattedDate,
                  fontSize: 17,
                  color: COLORS.primary,
                  alignment: "center",
                  bold: true,
                },
                countdown
                  ? {
                      text: countdown.text,
                      fontSize: 12,
                      color: COLORS.terracotta,
                      alignment: "center",
                      italics: true,
                      margin: [0, 10, 0, 0],
                    }
                  : null,
              ].filter(Boolean),
              margin: [0, 0, 0, 40],
            }
          : { text: "", margin: [0, 0, 0, 40] },
        {
          table: {
            widths: [340],
            body: [
              [
                {
                  stack: [
                    {
                      text: "What's Inside",
                      fontSize: 14,
                      bold: true,
                      color: COLORS.primary,
                      alignment: "center",
                      margin: [0, 0, 0, 14],
                    },
                    {
                      ul: [
                        "Your Wedding Vision & Style",
                        "Complete Budget Breakdown",
                        "Vendor Contact Directory",
                        "Timeline & Task Checklist",
                        "Planning Checklists",
                        "Emergency Contacts & Notes",
                      ],
                      fontSize: 11,
                      color: COLORS.text,
                      markerColor: COLORS.terracotta,
                      margin: [35, 0, 0, 0],
                      lineHeight: 1.4,
                    },
                  ],
                  margin: [25, 18, 25, 18],
                  fillColor: COLORS.cream,
                },
              ],
            ],
          },
          layout: {
            hLineWidth: () => 1.5,
            vLineWidth: () => 1.5,
            hLineColor: () => COLORS.gold,
            vLineColor: () => COLORS.gold,
          },
          alignment: "center",
          margin: [87, 0, 87, 0],
        },
        { text: "", margin: [0, 0, 0, 45] },
        createOrnamentalDivider(),
        {
          text: "Prepared with love for your special day",
          fontSize: 11,
          italics: true,
          color: COLORS.textMuted,
          alignment: "center",
          margin: [0, 8, 0, 0],
        },
      ],
      pageBreak: "after",
    };

    // PAGE 2: VISION with improved typography and brand colors
    const visionPage = {
      stack: [
        createSectionHeader("Your Wedding Vision", "◆◆◆"),
        {
          text: selectedStyle.title,
          fontSize: 20,
          bold: true,
          color: COLORS.primary,
          margin: [0, 12, 0, 15],
        },
        {
          table: {
            widths: ["*"],
            body: [
              [
                {
                  text: selectedStyle.description,
                  fontSize: 11,
                  italics: true,
                  color: COLORS.text,
                  lineHeight: 1.5,
                  margin: [16, 14, 16, 14],
                },
              ],
            ],
          },
          layout: {
            hLineWidth: () => 0,
            vLineWidth: (i) => (i === 0 ? 4 : 0),
            vLineColor: () => COLORS.terracotta,
          },
          margin: [0, 0, 0, 22],
        },
        {
          text: "Key Characteristics:",
          fontSize: 13,
          bold: true,
          color: COLORS.secondary,
          margin: [0, 0, 0, 10],
        },
        {
          ul: selectedStyle.characteristics,
          fontSize: 10,
          color: COLORS.text,
          lineHeight: 1.5,
          markerColor: COLORS.terracotta,
          margin: [18, 0, 0, 25],
        },
        createOrnamentalDivider(),
        {
          text: "My Inspiration Board",
          fontSize: 14,
          bold: true,
          color: COLORS.primary,
          alignment: "center",
          margin: [0, 8, 0, 6],
        },
        {
          text: "Paste photos, fabric swatches, or sketches of your dream wedding here",
          fontSize: 9,
          italics: true,
          color: COLORS.textMuted,
          alignment: "center",
          margin: [0, 0, 0, 15],
        },
        {
          columns: [
            {
              stack: [
                {
                  table: {
                    widths: [135],
                    heights: [85],
                    body: [[{ text: "", fillColor: COLORS.cream }]],
                  },
                  layout: {
                    hLineWidth: () => 1,
                    vLineWidth: () => 1,
                    hLineColor: () => COLORS.border,
                    vLineColor: () => COLORS.border,
                  },
                },
                {
                  text: "Venue Inspiration",
                  fontSize: 9,
                  color: COLORS.textMuted,
                  alignment: "center",
                  margin: [0, 5, 0, 0],
                },
              ],
              width: 155,
            },
            {
              stack: [
                {
                  table: {
                    widths: [135],
                    heights: [85],
                    body: [[{ text: "", fillColor: COLORS.cream }]],
                  },
                  layout: {
                    hLineWidth: () => 1,
                    vLineWidth: () => 1,
                    hLineColor: () => COLORS.border,
                    vLineColor: () => COLORS.border,
                  },
                },
                {
                  text: "Attire Ideas",
                  fontSize: 9,
                  color: COLORS.textMuted,
                  alignment: "center",
                  margin: [0, 5, 0, 0],
                },
              ],
              width: 155,
            },
            {
              stack: [
                {
                  table: {
                    widths: [135],
                    heights: [85],
                    body: [[{ text: "", fillColor: COLORS.cream }]],
                  },
                  layout: {
                    hLineWidth: () => 1,
                    vLineWidth: () => 1,
                    hLineColor: () => COLORS.border,
                    vLineColor: () => COLORS.border,
                  },
                },
                {
                  text: "Color Palette",
                  fontSize: 9,
                  color: COLORS.textMuted,
                  alignment: "center",
                  margin: [0, 5, 0, 0],
                },
              ],
              width: 155,
            },
          ],
          margin: [20, 0, 20, 25],
        },
        {
          text: "Vision Notes:",
          fontSize: 11,
          bold: true,
          color: COLORS.text,
          margin: [0, 12, 0, 10],
        },
        ...Array(5)
          .fill(null)
          .map(() => ({
            canvas: [
              {
                type: "line",
                x1: 0,
                y1: 0,
                x2: 515,
                y2: 0,
                lineWidth: 0.5,
                lineColor: COLORS.border,
              },
            ],
            margin: [0, 12, 0, 0],
          })),
      ],
      pageBreak: "after",
    };

    // PAGE 3: BUDGET with right-aligned currency and visual chart
    const totalSpent = budgetCategories.reduce(
      (sum, cat) => sum + (cat.spent || 0),
      0
    );
    const totalRemaining = totalBudget - totalSpent;
    const spentPercentage =
      totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

    const budgetPage = {
      stack: [
        createSectionHeader("Budget Breakdown", "◆◆◆"),
        // Budget summary box with 3 columns
        {
          table: {
            widths: ["*"],
            body: [
              [
                {
                  columns: [
                    {
                      stack: [
                        {
                          text: "Total Budget",
                          fontSize: 10,
                          color: COLORS.textLight,
                          alignment: "center",
                        },
                        {
                          text: formatCurrency(totalBudget),
                          fontSize: 24,
                          bold: true,
                          color: COLORS.primary,
                          alignment: "center",
                          margin: [0, 6, 0, 0],
                        },
                      ],
                      width: "33%",
                    },
                    {
                      stack: [
                        {
                          text: "Spent",
                          fontSize: 10,
                          color: COLORS.textLight,
                          alignment: "center",
                        },
                        {
                          text: formatCurrency(totalSpent),
                          fontSize: 18,
                          bold: true,
                          color: COLORS.warning,
                          alignment: "center",
                          margin: [0, 6, 0, 0],
                        },
                        {
                          canvas: [
                            // Progress bar background
                            {
                              type: "rect",
                              x: 10,
                              y: 0,
                              w: 100,
                              h: 8,
                              r: 4,
                              color: COLORS.borderLight,
                            },
                            // Progress bar fill
                            {
                              type: "rect",
                              x: 10,
                              y: 0,
                              w: Math.max(spentPercentage, 1),
                              h: 8,
                              r: 4,
                              color:
                                spentPercentage > 80
                                  ? COLORS.warning
                                  : COLORS.sage,
                            },
                          ],
                          margin: [0, 8, 0, 0],
                        },
                        {
                          text: spentPercentage + "% of budget",
                          fontSize: 8,
                          color: COLORS.textMuted,
                          alignment: "center",
                          margin: [0, 4, 0, 0],
                        },
                      ],
                      width: "34%",
                    },
                    {
                      stack: [
                        {
                          text: "Remaining",
                          fontSize: 10,
                          color: COLORS.textLight,
                          alignment: "center",
                        },
                        {
                          text: formatCurrency(totalRemaining),
                          fontSize: 18,
                          bold: true,
                          color:
                            totalRemaining >= 0 ? COLORS.sage : COLORS.error,
                          alignment: "center",
                          margin: [0, 6, 0, 0],
                        },
                      ],
                      width: "33%",
                    },
                  ],
                  margin: [15, 20, 15, 20],
                  fillColor: COLORS.cream,
                },
              ],
            ],
          },
          layout: {
            hLineWidth: () => 1.5,
            vLineWidth: () => 1.5,
            hLineColor: () => COLORS.gold,
            vLineColor: () => COLORS.gold,
          },
          margin: [30, 0, 30, 20],
        },
        // Budget bar chart visualization
        budgetCategories.length > 0
          ? createBudgetBarChart(budgetCategories, totalBudget)
          : null,
        // Budget table
        budgetCategories.length > 0
          ? {
              table: {
                headerRows: 1,
                widths: ["*", 42, 78, 68, 78],
                body: [
                  [
                    {
                      text: "Category",
                      bold: true,
                      fontSize: 10,
                      color: COLORS.white,
                      fillColor: COLORS.primary,
                      margin: [10, 10, 6, 10],
                    },
                    {
                      text: "%",
                      bold: true,
                      fontSize: 10,
                      color: COLORS.white,
                      fillColor: COLORS.primary,
                      alignment: "center",
                      margin: [4, 10, 4, 10],
                    },
                    {
                      text: "Budgeted",
                      bold: true,
                      fontSize: 10,
                      color: COLORS.white,
                      fillColor: COLORS.primary,
                      alignment: "right",
                      margin: [4, 10, 10, 10],
                    },
                    {
                      text: "Spent",
                      bold: true,
                      fontSize: 10,
                      color: COLORS.white,
                      fillColor: COLORS.primary,
                      alignment: "right",
                      margin: [4, 10, 10, 10],
                    },
                    {
                      text: "Remaining",
                      bold: true,
                      fontSize: 10,
                      color: COLORS.white,
                      fillColor: COLORS.primary,
                      alignment: "right",
                      margin: [4, 10, 10, 10],
                    },
                  ],
                  ...budgetCategories.map((item, idx) => {
                    const remaining = (item.amount || 0) - (item.spent || 0);
                    const rowColor =
                      idx % 2 === 0 ? COLORS.white : COLORS.cream;
                    return [
                      {
                        text: capitalizeFirst(item.name),
                        fontSize: 10,
                        margin: [10, 8, 6, 8],
                        fillColor: rowColor,
                      },
                      {
                        text: (item.percentage || 0) + "%",
                        fontSize: 10,
                        alignment: "center",
                        margin: [4, 8, 4, 8],
                        fillColor: rowColor,
                      },
                      {
                        text: formatCurrency(item.amount),
                        fontSize: 10,
                        alignment: "right",
                        margin: [4, 8, 10, 8],
                        fillColor: rowColor,
                      },
                      {
                        text: item.spent > 0 ? formatCurrency(item.spent) : "—",
                        fontSize: 10,
                        alignment: "right",
                        margin: [4, 8, 10, 8],
                        fillColor: rowColor,
                      },
                      {
                        text: formatCurrency(remaining),
                        fontSize: 10,
                        alignment: "right",
                        margin: [4, 8, 10, 8],
                        color: remaining >= 0 ? COLORS.sage : COLORS.error,
                        bold: true,
                        fillColor: rowColor,
                      },
                    ];
                  }),
                ],
              },
              layout: {
                hLineWidth: (i, node) =>
                  i === 0 || i === 1 || i === node.table.body.length ? 1 : 0.5,
                vLineWidth: () => 0.5,
                hLineColor: (i) => (i === 1 ? COLORS.primary : COLORS.border),
                vLineColor: () => COLORS.border,
              },
              margin: [0, 0, 0, 15],
            }
          : {
              stack: [
                {
                  text: "Budget categories will appear here once you add them in the Budget Builder.",
                  fontSize: 11,
                  italics: true,
                  color: COLORS.textMuted,
                  alignment: "center",
                  margin: [0, 20, 0, 20],
                },
                {
                  text: "Recommended Budget Allocations:",
                  fontSize: 12,
                  bold: true,
                  color: COLORS.text,
                  margin: [0, 0, 0, 12],
                },
                {
                  columns: [
                    {
                      ul: [
                        "Venue & Catering: 40-50%",
                        "Attire & Accessories: 10-15%",
                        "Photography/Video: 10-12%",
                        "Decorations: 8-10%",
                      ],
                      fontSize: 10,
                      color: COLORS.textLight,
                      markerColor: COLORS.gold,
                    },
                    {
                      ul: [
                        "Music & Entertainment: 5-8%",
                        "Makeup & Hair: 3-5%",
                        "Transportation: 2-3%",
                        "Contingency: 10-15%",
                      ],
                      fontSize: 10,
                      color: COLORS.textLight,
                      markerColor: COLORS.gold,
                    },
                  ],
                  margin: [0, 0, 0, 20],
                },
              ],
            },
        // Budget tips box
        {
          table: {
            widths: ["*"],
            body: [
              [
                {
                  stack: [
                    {
                      text: "Budget Management Tips",
                      fontSize: 12,
                      bold: true,
                      color: COLORS.secondary,
                      margin: [0, 0, 0, 10],
                    },
                    {
                      ul: [
                        "Track all expenses immediately to avoid surprises",
                        "Always negotiate with vendors—most have flexibility",
                        "Keep 10-15% as emergency contingency fund",
                        "Get written quotes from at least 3 vendors",
                        "Consider off-peak dates for better rates",
                      ],
                      fontSize: 10,
                      color: COLORS.text,
                      lineHeight: 1.4,
                      markerColor: COLORS.gold,
                    },
                  ],
                  margin: [18, 15, 18, 15],
                  fillColor: COLORS.goldLight,
                },
              ],
            ],
          },
          layout: {
            hLineWidth: () => 1,
            vLineWidth: () => 1,
            hLineColor: () => COLORS.gold,
            vLineColor: () => COLORS.gold,
          },
          margin: [0, 10, 0, 15],
        },
        // Quick expense log
        {
          text: "Quick Expense Log",
          fontSize: 12,
          bold: true,
          color: COLORS.text,
          margin: [0, 10, 0, 10],
        },
        {
          table: {
            headerRows: 1,
            widths: ["*", 90, 70],
            body: [
              [
                {
                  text: "Description",
                  bold: true,
                  fontSize: 9,
                  color: COLORS.white,
                  fillColor: COLORS.secondary,
                  margin: [8, 8, 8, 8],
                },
                {
                  text: "Amount",
                  bold: true,
                  fontSize: 9,
                  color: COLORS.white,
                  fillColor: COLORS.secondary,
                  alignment: "right",
                  margin: [8, 8, 8, 8],
                },
                {
                  text: "Date",
                  bold: true,
                  fontSize: 9,
                  color: COLORS.white,
                  fillColor: COLORS.secondary,
                  margin: [8, 8, 8, 8],
                },
              ],
              ...Array(5)
                .fill(null)
                .map((_, i) => [
                  {
                    text: "",
                    margin: [8, 14, 8, 14],
                    fillColor: i % 2 === 0 ? COLORS.white : COLORS.cream,
                  },
                  {
                    text: "",
                    margin: [8, 14, 8, 14],
                    fillColor: i % 2 === 0 ? COLORS.white : COLORS.cream,
                  },
                  {
                    text: "",
                    margin: [8, 14, 8, 14],
                    fillColor: i % 2 === 0 ? COLORS.white : COLORS.cream,
                  },
                ]),
            ],
          },
          layout: {
            hLineWidth: () => 0.5,
            vLineWidth: () => 0.5,
            hLineColor: () => COLORS.border,
            vLineColor: () => COLORS.border,
          },
        },
      ].filter(Boolean),
      pageBreak: "after",
    };

    // PAGE 4: VENDORS with brand colors
    const vendorPage = {
      stack: [
        createSectionHeader("Vendor Contact Directory", "◆◆◆"),
        {
          text: "Keep this page handy for quick vendor contact during planning",
          fontSize: 10,
          italics: true,
          color: COLORS.textMuted,
          margin: [0, 0, 0, 16],
        },
        bookedVendors.length > 0
          ? {
              stack: [
                {
                  text: "Confirmed Vendors",
                  fontSize: 13,
                  bold: true,
                  color: COLORS.sage,
                  margin: [0, 0, 0, 10],
                },
                ...bookedVendors.map((vendor) => ({
                  table: {
                    widths: ["*"],
                    body: [
                      [
                        {
                          stack: [
                            {
                              text:
                                (vendor.category || "Vendor") +
                                ": " +
                                vendor.name,
                              fontSize: 11,
                              bold: true,
                              color: COLORS.text,
                            },
                            {
                              columns: [
                                {
                                  text: "Phone: ",
                                  fontSize: 10,
                                  bold: true,
                                  color: COLORS.textLight,
                                  width: 45,
                                },
                                {
                                  text:
                                    vendor.phone ||
                                    vendor.contact ||
                                    "________________",
                                  fontSize: 10,
                                  color: COLORS.text,
                                },
                              ],
                              margin: [0, 5, 0, 0],
                            },
                            {
                              columns: [
                                {
                                  text: "Cost: ",
                                  fontSize: 10,
                                  bold: true,
                                  color: COLORS.textLight,
                                  width: 45,
                                },
                                {
                                  text: vendor.cost
                                    ? formatCurrency(vendor.cost)
                                    : "________________",
                                  fontSize: 10,
                                  color: vendor.cost
                                    ? COLORS.text
                                    : COLORS.textMuted,
                                },
                              ],
                              margin: [0, 4, 0, 0],
                            },
                          ],
                          margin: [14, 10, 14, 10],
                        },
                      ],
                    ],
                  },
                  layout: {
                    hLineWidth: () => 1,
                    vLineWidth: (i) => (i === 0 ? 4 : 1),
                    hLineColor: () => COLORS.border,
                    vLineColor: (i) => (i === 0 ? COLORS.sage : COLORS.border),
                  },
                  margin: [0, 0, 0, 8],
                })),
              ],
              margin: [0, 0, 0, 16],
            }
          : null,
        pendingVendors.length > 0
          ? {
              stack: [
                {
                  text: "Vendors in Progress",
                  fontSize: 13,
                  bold: true,
                  color: COLORS.terracotta,
                  margin: [0, 5, 0, 10],
                },
                ...pendingVendors.map((vendor) => ({
                  table: {
                    widths: ["*"],
                    body: [
                      [
                        {
                          stack: [
                            {
                              text:
                                (vendor.category || "Vendor") +
                                ": " +
                                vendor.name,
                              fontSize: 11,
                              bold: true,
                              color: COLORS.text,
                            },
                            {
                              columns: [
                                {
                                  text: "Phone: ",
                                  fontSize: 10,
                                  bold: true,
                                  color: COLORS.textLight,
                                  width: 45,
                                },
                                {
                                  text:
                                    vendor.phone ||
                                    vendor.contact ||
                                    "________________",
                                  fontSize: 10,
                                  color: COLORS.text,
                                },
                              ],
                              margin: [0, 5, 0, 0],
                            },
                            {
                              text: "Status: " + (vendor.status || "Pending"),
                              fontSize: 9,
                              italics: true,
                              color: COLORS.terracotta,
                              margin: [0, 4, 0, 0],
                            },
                          ],
                          margin: [14, 10, 14, 10],
                        },
                      ],
                    ],
                  },
                  layout: {
                    hLineWidth: () => 1,
                    vLineWidth: (i) => (i === 0 ? 4 : 1),
                    hLineColor: () => COLORS.border,
                    vLineColor: (i) =>
                      i === 0 ? COLORS.terracotta : COLORS.border,
                  },
                  margin: [0, 0, 0, 8],
                })),
              ],
              margin: [0, 0, 0, 16],
            }
          : null,
        missingCategories.length > 0
          ? {
              stack: [
                {
                  text: "Vendors Still Needed",
                  fontSize: 13,
                  bold: true,
                  color: COLORS.primary,
                  margin: [0, 10, 0, 12],
                },
                {
                  table: {
                    widths: [110, "*", 90, 90],
                    headerRows: 1,
                    body: [
                      [
                        {
                          text: "Category",
                          bold: true,
                          fontSize: 9,
                          color: COLORS.white,
                          fillColor: COLORS.secondary,
                          margin: [8, 8, 8, 8],
                        },
                        {
                          text: "Vendor Name",
                          bold: true,
                          fontSize: 9,
                          color: COLORS.white,
                          fillColor: COLORS.secondary,
                          margin: [8, 8, 8, 8],
                        },
                        {
                          text: "Phone",
                          bold: true,
                          fontSize: 9,
                          color: COLORS.white,
                          fillColor: COLORS.secondary,
                          margin: [8, 8, 8, 8],
                        },
                        {
                          text: "Status",
                          bold: true,
                          fontSize: 9,
                          color: COLORS.white,
                          fillColor: COLORS.secondary,
                          margin: [8, 8, 8, 8],
                        },
                      ],
                      ...missingCategories.slice(0, 8).map((category, i) => [
                        {
                          text: category,
                          fontSize: 10,
                          color: COLORS.text,
                          margin: [8, 10, 8, 10],
                          fillColor: i % 2 === 0 ? COLORS.white : COLORS.cream,
                        },
                        {
                          text: "",
                          margin: [8, 10, 8, 10],
                          fillColor: i % 2 === 0 ? COLORS.white : COLORS.cream,
                        },
                        {
                          text: "",
                          margin: [8, 10, 8, 10],
                          fillColor: i % 2 === 0 ? COLORS.white : COLORS.cream,
                        },
                        {
                          text: "",
                          margin: [8, 10, 8, 10],
                          fillColor: i % 2 === 0 ? COLORS.white : COLORS.cream,
                        },
                      ]),
                    ],
                  },
                  layout: {
                    hLineWidth: () => 0.5,
                    vLineWidth: () => 0.5,
                    hLineColor: () => COLORS.border,
                    vLineColor: () => COLORS.border,
                  },
                },
              ],
            }
          : null,
        vendors.length === 0
          ? {
              stack: [
                {
                  text: "Start Building Your Vendor Team!",
                  fontSize: 16,
                  bold: true,
                  color: COLORS.primary,
                  alignment: "center",
                  margin: [0, 25, 0, 12],
                },
                {
                  text: "Use the table below to record vendor contacts as you find them:",
                  fontSize: 10,
                  color: COLORS.textMuted,
                  alignment: "center",
                  margin: [0, 0, 0, 20],
                },
                {
                  table: {
                    widths: [100, "*", 90, 80],
                    headerRows: 1,
                    body: [
                      [
                        {
                          text: "Category",
                          bold: true,
                          fontSize: 9,
                          color: COLORS.white,
                          fillColor: COLORS.primary,
                          margin: [8, 8, 8, 8],
                        },
                        {
                          text: "Vendor Name",
                          bold: true,
                          fontSize: 9,
                          color: COLORS.white,
                          fillColor: COLORS.primary,
                          margin: [8, 8, 8, 8],
                        },
                        {
                          text: "Phone",
                          bold: true,
                          fontSize: 9,
                          color: COLORS.white,
                          fillColor: COLORS.primary,
                          margin: [8, 8, 8, 8],
                        },
                        {
                          text: "Quote",
                          bold: true,
                          fontSize: 9,
                          color: COLORS.white,
                          fillColor: COLORS.primary,
                          margin: [8, 8, 8, 8],
                        },
                      ],
                      ...essentialVendorCategories.map((category, i) => [
                        {
                          text: category,
                          fontSize: 10,
                          color: COLORS.text,
                          margin: [8, 12, 8, 12],
                          fillColor: i % 2 === 0 ? COLORS.white : COLORS.cream,
                        },
                        {
                          text: "",
                          margin: [8, 12, 8, 12],
                          fillColor: i % 2 === 0 ? COLORS.white : COLORS.cream,
                        },
                        {
                          text: "",
                          margin: [8, 12, 8, 12],
                          fillColor: i % 2 === 0 ? COLORS.white : COLORS.cream,
                        },
                        {
                          text: "",
                          margin: [8, 12, 8, 12],
                          fillColor: i % 2 === 0 ? COLORS.white : COLORS.cream,
                        },
                      ]),
                    ],
                  },
                  layout: {
                    hLineWidth: () => 0.5,
                    vLineWidth: () => 0.5,
                    hLineColor: () => COLORS.border,
                    vLineColor: () => COLORS.border,
                  },
                },
              ],
            }
          : null,
      ].filter(Boolean),
      pageBreak: "after",
    };

    // PAGE 5: TIMELINE with improved spacing and readability
    const timelinePage = {
      stack: [
        createSectionHeader("Timeline & Task Checklist", "◆◆◆"),
        countdown
          ? {
              table: {
                widths: ["*"],
                body: [
                  [
                    {
                      text: countdown.text,
                      fontSize: 12,
                      bold: true,
                      color: COLORS.terracotta,
                      alignment: "center",
                      margin: [0, 10, 0, 10],
                    },
                  ],
                ],
              },
              layout: {
                hLineWidth: () => 1,
                vLineWidth: () => 1,
                hLineColor: () => COLORS.terracotta,
                vLineColor: () => COLORS.terracotta,
              },
              margin: [70, 0, 70, 18],
            }
          : null,
        tasks.length > 0
          ? {
              stack: [
                pendingTasks.length > 0
                  ? {
                      stack: [
                        {
                          text: "My Pending Tasks",
                          fontSize: 13,
                          bold: true,
                          color: COLORS.primary,
                          margin: [0, 0, 0, 10],
                        },
                        {
                          columns: [
                            {
                              width: "50%",
                              stack: pendingTasks
                                .slice(0, Math.ceil(pendingTasks.length / 2))
                                .map((task) =>
                                  createCheckbox(
                                    task.task +
                                      (task.date
                                        ? " (" +
                                          formatShortDate(task.date) +
                                          ")"
                                        : ""),
                                    false
                                  )
                                ),
                            },
                            {
                              width: "50%",
                              stack: pendingTasks
                                .slice(Math.ceil(pendingTasks.length / 2))
                                .map((task) =>
                                  createCheckbox(
                                    task.task +
                                      (task.date
                                        ? " (" +
                                          formatShortDate(task.date) +
                                          ")"
                                        : ""),
                                    false
                                  )
                                ),
                            },
                          ],
                        },
                      ],
                      margin: [0, 0, 0, 18],
                    }
                  : null,
                completedTasks.length > 0
                  ? {
                      stack: [
                        {
                          text: "Completed",
                          fontSize: 13,
                          bold: true,
                          color: COLORS.sage,
                          margin: [0, 0, 0, 10],
                        },
                        ...completedTasks.map((task) =>
                          createCheckbox(task.task, true)
                        ),
                      ],
                      margin: [0, 0, 0, 18],
                    }
                  : null,
              ].filter(Boolean),
            }
          : {
              stack: [
                {
                  text: "Wedding Planning Timeline",
                  fontSize: 15,
                  bold: true,
                  color: COLORS.primary,
                  alignment: "center",
                  margin: [0, 6, 0, 5],
                },
                {
                  text: "Use this standard timeline as your guide, checking off items as you complete them:",
                  fontSize: 9,
                  italics: true,
                  color: COLORS.textMuted,
                  alignment: "center",
                  margin: [0, 0, 0, 18],
                },
                ...defaultTimeline.map((phase) => ({
                  stack: [
                    {
                      table: {
                        widths: ["*"],
                        body: [
                          [
                            {
                              text: phase.phase,
                              fontSize: 10,
                              bold: true,
                              color: COLORS.secondary,
                              margin: [10, 5, 10, 5],
                              fillColor: COLORS.cream,
                            },
                          ],
                        ],
                      },
                      layout: {
                        hLineWidth: () => 0,
                        vLineWidth: (i) => (i === 0 ? 3 : 0),
                        vLineColor: () => COLORS.terracotta,
                      },
                      margin: [0, 10, 0, 6],
                    },
                    {
                      columns: [
                        {
                          width: "50%",
                          stack: phase.tasks
                            .slice(0, Math.ceil(phase.tasks.length / 2))
                            .map((task) => createCheckbox(task, false)),
                        },
                        {
                          width: "50%",
                          stack: phase.tasks
                            .slice(Math.ceil(phase.tasks.length / 2))
                            .map((task) => createCheckbox(task, false)),
                        },
                      ],
                      margin: [12, 0, 0, 0],
                    },
                  ],
                })),
              ],
            },
        {
          text: "This Week's Priority Tasks:",
          fontSize: 11,
          bold: true,
          color: COLORS.text,
          margin: [0, 20, 0, 10],
        },
        {
          table: {
            widths: [22, "*"],
            body: Array(4)
              .fill(null)
              .map((_, i) => [
                {
                  text: i + 1 + ".",
                  fontSize: 10,
                  bold: true,
                  color: COLORS.primary,
                  margin: [5, 8, 5, 8],
                },
                { text: "", margin: [5, 8, 5, 8], fillColor: COLORS.cream },
              ]),
          },
          layout: {
            hLineWidth: () => 0.5,
            vLineWidth: () => 0.5,
            hLineColor: () => COLORS.border,
            vLineColor: () => COLORS.border,
          },
        },
      ].filter(Boolean),
      pageBreak: "after",
    };

    // PAGE 6: ESSENTIAL CHECKLISTS with brand colors
    const checklistCategories = [
      {
        name: "Week Before Wedding",
        color: COLORS.primary,
        items: [
          "Confirm all vendor arrival times",
          "Final dress fitting completed",
          "Prepare wedding day emergency kit",
          "Confirm transportation arrangements",
          "Review ceremony program",
          "Prepare vendor final payments",
          "Pack honeymoon luggage",
          "Confirm rehearsal dinner details",
          "Delegate day-of responsibilities",
        ],
      },
      {
        name: "Wedding Day Morning",
        color: COLORS.secondary,
        items: [
          "Eat a good breakfast",
          "Begin hair and makeup on schedule",
          "Keep phone charged",
          "Have emergency kit accessible",
          "Stay hydrated",
          "Take moment for yourself",
        ],
      },
      {
        name: "Items to Bring to Venue",
        color: COLORS.terracotta,
        items: [
          "Marriage license",
          "Rings (both!)",
          "Vows (if written)",
          "Emergency kit",
          "Phone charger",
          "Touch-up makeup",
          "Comfortable shoes for dancing",
          "Cards/gifts for wedding party",
          "Cash for tips",
        ],
      },
    ];

    const checklistsPage = {
      stack: [
        createSectionHeader("Essential Checklists", "✓"),
        ...checklistCategories.map((category) => ({
          stack: [
            {
              table: {
                widths: ["*"],
                body: [
                  [
                    {
                      text: category.name.toUpperCase(),
                      fontSize: 11,
                      bold: true,
                      color: COLORS.white,
                      fillColor: category.color,
                      alignment: "center",
                      margin: [0, 10, 0, 10],
                    },
                  ],
                ],
              },
              layout: {
                hLineWidth: () => 0,
                vLineWidth: () => 0,
              },
              margin: [0, 18, 0, 12],
            },
            {
              columns: [
                {
                  width: "50%",
                  stack: category.items
                    .slice(0, Math.ceil(category.items.length / 2))
                    .map((item) => createCheckbox(item, false)),
                },
                {
                  width: "50%",
                  stack: category.items
                    .slice(Math.ceil(category.items.length / 2))
                    .map((item) => createCheckbox(item, false)),
                },
              ],
            },
          ],
        })),
        {
          text: "My Personal Checklist Items:",
          fontSize: 12,
          bold: true,
          color: COLORS.text,
          margin: [0, 30, 0, 12],
        },
        ...Array(5)
          .fill(null)
          .map(() => createCheckbox("", false, true)),
      ],
      pageBreak: "after",
    };

    // PAGE 7: EMERGENCY CONTACTS & NOTES with elegant footer
    const emergencyRoles = [
      { role: "Bride", name: brideName || "" },
      { role: "Groom", name: "" },
      { role: "Maid of Honor", name: "" },
      { role: "Best Man", name: "" },
      { role: "Wedding Coordinator", name: "" },
      { role: "Venue Contact", name: "" },
      { role: "Photographer", name: "" },
      { role: "Caterer", name: "" },
      { role: "DJ / Band", name: "" },
      { role: "Transportation", name: "" },
    ];

    const emergencyPage = {
      stack: [
        createSectionHeader("Emergency Contacts & Notes", "◆◆◆"),
        {
          table: {
            headerRows: 1,
            widths: ["28%", "37%", "35%"],
            body: [
              [
                {
                  text: "Role",
                  fontSize: 10,
                  bold: true,
                  color: COLORS.white,
                  fillColor: COLORS.primary,
                  margin: [8, 10, 8, 10],
                },
                {
                  text: "Name",
                  fontSize: 10,
                  bold: true,
                  color: COLORS.white,
                  fillColor: COLORS.primary,
                  margin: [8, 10, 8, 10],
                },
                {
                  text: "Phone Number",
                  fontSize: 10,
                  bold: true,
                  color: COLORS.white,
                  fillColor: COLORS.primary,
                  margin: [8, 10, 8, 10],
                },
              ],
              ...emergencyRoles.map((contact, i) => [
                {
                  text: contact.role,
                  fontSize: 10,
                  color: COLORS.text,
                  fillColor: i % 2 === 0 ? COLORS.white : COLORS.cream,
                  margin: [8, 10, 8, 10],
                },
                {
                  text: contact.name || "",
                  fontSize: 10,
                  fillColor: i % 2 === 0 ? COLORS.white : COLORS.cream,
                  margin: [8, 10, 8, 10],
                },
                {
                  text: "",
                  fontSize: 10,
                  fillColor: i % 2 === 0 ? COLORS.white : COLORS.cream,
                  margin: [8, 10, 8, 10],
                },
              ]),
            ],
          },
          layout: {
            hLineWidth: () => 0.5,
            vLineWidth: () => 0.5,
            hLineColor: () => COLORS.border,
            vLineColor: () => COLORS.border,
          },
          margin: [0, 0, 0, 30],
        },
        {
          text: "Wedding Day Notes & Reminders",
          fontSize: 14,
          bold: true,
          color: COLORS.secondary,
          margin: [0, 15, 0, 15],
        },
        // Dot grid area for notes
        {
          table: {
            widths: ["*"],
            body: [
              [
                {
                  stack: Array(8)
                    .fill(null)
                    .map(() => ({
                      canvas: [
                        {
                          type: "line",
                          x1: 0,
                          y1: 0,
                          x2: 495,
                          y2: 0,
                          lineWidth: 0.5,
                          lineColor: COLORS.border,
                        },
                      ],
                      margin: [0, 0, 0, 22],
                    })),
                  margin: [15, 15, 15, 15],
                  fillColor: COLORS.cream,
                },
              ],
            ],
          },
          layout: {
            hLineWidth: () => 1,
            vLineWidth: () => 1,
            hLineColor: () => COLORS.border,
            vLineColor: () => COLORS.border,
          },
          margin: [0, 0, 0, 30],
        },
        createOrnamentalDivider(),
        {
          columns: [
            { width: "*", text: "" },
            {
              width: "auto",
              stack: [
                {
                  text: "Created with love using",
                  fontSize: 9,
                  color: COLORS.textMuted,
                  alignment: "center",
                },
                {
                  text: "The Hausa Wedding Guide",
                  fontSize: 12,
                  bold: true,
                  color: COLORS.primary,
                  alignment: "center",
                  margin: [0, 4, 0, 0],
                },
                {
                  text: "hausaroom.com",
                  fontSize: 10,
                  color: COLORS.terracotta,
                  link: "https://hausaroom.com",
                  alignment: "center",
                  margin: [0, 5, 0, 0],
                },
              ],
              margin: [0, 15, 0, 0],
            },
            { width: "*", text: "" },
          ],
        },
      ],
    };

    // ASSEMBLE DOCUMENT
    const docDefinition = {
      pageSize: "A4",
      pageMargins: [40, 40, 40, 40],
      content: [
        coverPage,
        visionPage,
        budgetPage,
        vendorPage,
        timelinePage,
        checklistsPage,
        emergencyPage,
      ],
      defaultStyle: { font: "Roboto", fontSize: 10, lineHeight: 1.3 },
      styles: {
        header: { fontSize: 20, bold: true, color: COLORS.primary },
        subheader: { fontSize: 14, bold: true, color: COLORS.secondary },
      },
      footer: function (currentPage, pageCount) {
        if (currentPage === 1) return null;
        return {
          columns: [
            {
              text: brideName
                ? brideName + "'s Wedding Plan"
                : "My Wedding Plan",
              fontSize: 8,
              color: COLORS.textMuted,
              margin: [40, 10, 0, 0],
            },
            {
              text: "Page " + currentPage + " of " + pageCount,
              fontSize: 8,
              color: COLORS.textMuted,
              alignment: "right",
              margin: [0, 10, 40, 0],
            },
          ],
        };
      },
    };

    // Generate PDF
    const pdfDocGenerator = pdfMake.createPdf(docDefinition);
    pdfDocGenerator.download(
      brideName
        ? brideName.replace(/\s+/g, "_") + "_Wedding_Plan.pdf"
        : "My_Wedding_Plan.pdf"
    );
  } catch (error) {
    console.error("PDF Generation Error:", error);
    throw error;
  }
};

// React Component
export default function PersonalizedPDFExport({ data, onClose }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  const handleDownload = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      await generatePersonalizedPDF(data);
      if (onClose) setTimeout(onClose, 1000);
    } catch (err) {
      setError("Failed to generate PDF. Please try again.");
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="text-center p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Download Your Wedding Plan
      </h3>
      <p className="text-gray-600 mb-6">
        Your personalized 7-page wedding planner is ready to download!
      </p>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <button
        onClick={handleDownload}
        disabled={isGenerating}
        className="px-6 py-3 bg-[#740015] text-white rounded-lg font-medium hover:bg-[#5a0011] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isGenerating ? "Generating PDF..." : "Download PDF"}
      </button>
    </div>
  );
}
