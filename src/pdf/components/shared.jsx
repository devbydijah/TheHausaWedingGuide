// src/pdf/components/shared.jsx
// Shared UI components for the PDF

import React from "react";
import { View, Text, StyleSheet } from "@react-pdf/renderer";
import { theme } from "../theme";

// Checkbox component for checklists
export const CheckboxItem = ({ text, isChecked = false, isEmpty = false }) => (
  <View style={checkboxStyles.row}>
    <View style={[checkboxStyles.box, isChecked && checkboxStyles.boxChecked]}>
      {isChecked && <Text style={checkboxStyles.checkmark}>✓</Text>}
    </View>
    <Text
      style={[
        checkboxStyles.text,
        isChecked && checkboxStyles.textChecked,
        isEmpty && checkboxStyles.textEmpty,
      ]}
    >
      {isEmpty ? "___________________________________" : text}
    </Text>
  </View>
);

const checkboxStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    paddingVertical: 2,
  },
  box: {
    width: 14,
    height: 14,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    borderRadius: 2,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.white,
  },
  boxChecked: {
    backgroundColor: theme.colors.sage,
    borderColor: theme.colors.sage,
  },
  checkmark: {
    color: theme.colors.white,
    fontSize: 10,
    fontFamily: theme.fonts.bold,
  },
  text: {
    fontSize: 10,
    fontFamily: theme.fonts.body,
    color: theme.colors.text,
    flex: 1,
  },
  textChecked: {
    color: theme.colors.textMuted,
    textDecoration: "line-through",
  },
  textEmpty: {
    color: theme.colors.border,
  },
});

// Section header component
export const SectionHeader = ({ title, color = theme.colors.primary }) => (
  <View style={sectionStyles.container}>
    <View style={[sectionStyles.bar, { backgroundColor: color }]} />
    <Text style={[sectionStyles.title, { color }]}>{title}</Text>
  </View>
);

const sectionStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    marginTop: 8,
  },
  bar: {
    width: 4,
    height: 18,
    marginRight: 10,
    borderRadius: 2,
  },
  title: {
    fontSize: 13,
    fontFamily: theme.fonts.bold,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
});

// Card component for grouping content
export const Card = ({ children, accent = false }) => (
  <View style={[cardStyles.container, accent && cardStyles.accent]}>
    {children}
  </View>
);

const cardStyles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    padding: 12,
    borderRadius: 6,
    marginBottom: 10,
  },
  accent: {
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.gold,
  },
});

// Bar chart item for budget visualization
export const BarChartItem = ({
  label,
  percentage,
  amount,
  color = theme.colors.terracotta,
}) => (
  <View style={barStyles.row}>
    <Text style={barStyles.label}>{label}</Text>
    <View style={barStyles.barContainer}>
      <View
        style={[
          barStyles.barFill,
          { width: `${Math.min(percentage, 100)}%`, backgroundColor: color },
        ]}
      />
    </View>
    <Text style={barStyles.value}>{amount}</Text>
  </View>
);

const barStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    width: 75,
    fontSize: 9,
    fontFamily: theme.fonts.body,
    color: theme.colors.text,
  },
  barContainer: {
    flex: 1,
    height: 12,
    backgroundColor: theme.colors.lightGray,
    borderRadius: 6,
    marginHorizontal: 8,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 6,
  },
  value: {
    width: 70,
    fontSize: 9,
    fontFamily: theme.fonts.body,
    color: theme.colors.textLight,
    textAlign: "right",
  },
});

// Divider line
export const Divider = ({ color = theme.colors.borderLight, margin = 15 }) => (
  <View
    style={{
      height: 1,
      backgroundColor: color,
      marginVertical: margin,
    }}
  />
);

// Two column layout
export const TwoColumns = ({ children }) => (
  <View style={{ flexDirection: "row", gap: 15 }}>{children}</View>
);

export const Column = ({ children, flex = 1 }) => (
  <View style={{ flex }}>{children}</View>
);

// Status badge
export const StatusBadge = ({ status }) => {
  const getStatusColor = () => {
    switch (status?.toLowerCase()) {
      case "booked":
      case "confirmed":
      case "completed":
        return theme.colors.sage;
      case "pending":
      case "in progress":
        return theme.colors.terracotta;
      default:
        return theme.colors.textMuted;
    }
  };

  return (
    <View style={[badgeStyles.badge, { backgroundColor: getStatusColor() }]}>
      <Text style={badgeStyles.text}>{status || "Pending"}</Text>
    </View>
  );
};

const badgeStyles = StyleSheet.create({
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  text: {
    fontSize: 7,
    fontFamily: theme.fonts.bold,
    color: theme.colors.white,
    textTransform: "uppercase",
  },
});
