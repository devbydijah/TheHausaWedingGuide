// src/pdf/pages/BudgetPage.jsx
// Budget breakdown with bar chart visualization

import React from "react";
import { Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import { PageLayout } from "../Layout";
import { theme, formatCurrency } from "../theme";
import { SectionHeader, Divider } from "../components/shared";

// Chart colors for budget categories
const CHART_COLORS = [
  theme.colors.primary,
  theme.colors.secondary,
  theme.colors.terracotta,
  theme.colors.sage,
  theme.colors.gold,
  "#6b2159",
  "#d89b7f",
  "#6fa385",
];

const styles = StyleSheet.create({
  // Summary card
  summaryCard: {
    backgroundColor: theme.colors.background,
    padding: 20,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  summaryLabel: {
    fontFamily: theme.fonts.body,
    fontSize: 10,
    color: theme.colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 5,
  },

  summaryAmount: {
    fontFamily: theme.fonts.header,
    fontSize: 28,
    color: theme.colors.primary,
    marginBottom: 10,
  },

  // Summary stats row
  statsRow: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderLight,
  },

  statItem: {
    alignItems: "center",
    paddingHorizontal: 20,
  },

  statLabel: {
    fontFamily: theme.fonts.body,
    fontSize: 8,
    color: theme.colors.textMuted,
    marginBottom: 2,
  },

  statValue: {
    fontFamily: theme.fonts.bold,
    fontSize: 12,
  },

  // Progress bar for overall spending
  progressContainer: {
    width: "100%",
    marginTop: 15,
  },

  progressBar: {
    height: 8,
    backgroundColor: theme.colors.lightGray,
    borderRadius: 4,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    borderRadius: 4,
  },

  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },

  progressLabel: {
    fontFamily: theme.fonts.body,
    fontSize: 8,
    color: theme.colors.textMuted,
  },

  // Bar chart section
  chartSection: {
    marginBottom: 20,
  },

  chartTitle: {
    fontFamily: theme.fonts.bold,
    fontSize: 12,
    color: theme.colors.secondary,
    marginBottom: 12,
  },

  barRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  barLabel: {
    width: 80,
    fontFamily: theme.fonts.body,
    fontSize: 9,
    color: theme.colors.text,
  },

  barContainer: {
    flex: 1,
    height: 14,
    backgroundColor: theme.colors.lightGray,
    borderRadius: 7,
    marginHorizontal: 10,
    overflow: "hidden",
  },

  barFill: {
    height: "100%",
    borderRadius: 7,
  },

  barValue: {
    width: 70,
    fontFamily: theme.fonts.body,
    fontSize: 9,
    color: theme.colors.textLight,
    textAlign: "right",
  },

  // Data table
  table: {
    marginTop: 10,
  },

  tableHeader: {
    flexDirection: "row",
    backgroundColor: theme.colors.secondary,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },

  tableHeaderCell: {
    fontFamily: theme.fonts.bold,
    fontSize: 9,
    color: theme.colors.white,
  },

  tableRow: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },

  tableRowAlt: {
    backgroundColor: theme.colors.background,
  },

  tableCell: {
    fontFamily: theme.fonts.body,
    fontSize: 9,
    color: theme.colors.text,
  },

  tableCellRight: {
    textAlign: "right",
  },

  // Legend
  legendRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
    justifyContent: "center",
  },

  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
    marginBottom: 5,
  },

  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 5,
  },

  legendText: {
    fontFamily: theme.fonts.body,
    fontSize: 8,
    color: theme.colors.textMuted,
  },
});

// Default budget categories if none provided
const defaultCategories = [
  { name: "Venue", percentage: 25, amount: 0, spent: 0 },
  { name: "Catering", percentage: 20, amount: 0, spent: 0 },
  { name: "Photography", percentage: 12, amount: 0, spent: 0 },
  { name: "Attire", percentage: 10, amount: 0, spent: 0 },
  { name: "Decor", percentage: 10, amount: 0, spent: 0 },
  { name: "Music/DJ", percentage: 8, amount: 0, spent: 0 },
  { name: "Transport", percentage: 5, amount: 0, spent: 0 },
  { name: "Other", percentage: 10, amount: 0, spent: 0 },
];

export const BudgetPage = ({ budgetData }) => {
  const totalBudget = budgetData?.total || 0;
  const totalSpent = budgetData?.spent || 0;
  const remaining = totalBudget - totalSpent;
  const spentPercentage =
    totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

  // Process categories
  const categories = budgetData?.categories
    ? Object.entries(budgetData.categories).map(([name, data], index) => ({
        name,
        percentage:
          totalBudget > 0 ? Math.round((data.amount / totalBudget) * 100) : 0,
        amount: data.amount || 0,
        spent: data.spent || 0,
        color: CHART_COLORS[index % CHART_COLORS.length],
      }))
    : defaultCategories.map((cat, index) => ({
        ...cat,
        color: CHART_COLORS[index % CHART_COLORS.length],
      }));

  return (
    <Page size="A4">
      <PageLayout title="Budget Breakdown" subtitle="Financial Planning">
        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total Wedding Budget</Text>
          <Text style={styles.summaryAmount}>
            {formatCurrency(totalBudget)}
          </Text>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.min(spentPercentage, 100)}%`,
                    backgroundColor:
                      spentPercentage > 100
                        ? theme.colors.primary
                        : theme.colors.sage,
                  },
                ]}
              />
            </View>
            <View style={styles.progressLabels}>
              <Text style={styles.progressLabel}>0%</Text>
              <Text style={styles.progressLabel}>{spentPercentage}% spent</Text>
              <Text style={styles.progressLabel}>100%</Text>
            </View>
          </View>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>SPENT</Text>
              <Text
                style={[styles.statValue, { color: theme.colors.terracotta }]}
              >
                {formatCurrency(totalSpent)}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>REMAINING</Text>
              <Text style={[styles.statValue, { color: theme.colors.sage }]}>
                {formatCurrency(remaining)}
              </Text>
            </View>
          </View>
        </View>

        {/* Bar Chart */}
        <View style={styles.chartSection}>
          <Text style={styles.chartTitle}>Budget Allocation</Text>

          {categories.slice(0, 8).map((cat, index) => (
            <View key={index} style={styles.barRow}>
              <Text style={styles.barLabel}>{cat.name}</Text>
              <View style={styles.barContainer}>
                <View
                  style={[
                    styles.barFill,
                    {
                      width: `${Math.min(cat.percentage, 100)}%`,
                      backgroundColor: cat.color,
                    },
                  ]}
                />
              </View>
              <Text style={styles.barValue}>{formatCurrency(cat.amount)}</Text>
            </View>
          ))}
        </View>

        {/* Data Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Category</Text>
            <Text
              style={[styles.tableHeaderCell, { flex: 1, textAlign: "center" }]}
            >
              %
            </Text>
            <Text
              style={[
                styles.tableHeaderCell,
                { flex: 1.5, textAlign: "right" },
              ]}
            >
              Budgeted
            </Text>
            <Text
              style={[
                styles.tableHeaderCell,
                { flex: 1.5, textAlign: "right" },
              ]}
            >
              Remaining
            </Text>
          </View>

          {categories.map((cat, index) => (
            <View
              key={index}
              style={[styles.tableRow, index % 2 === 1 && styles.tableRowAlt]}
            >
              <Text style={[styles.tableCell, { flex: 2 }]}>{cat.name}</Text>
              <Text
                style={[styles.tableCell, { flex: 1, textAlign: "center" }]}
              >
                {cat.percentage}%
              </Text>
              <Text
                style={[styles.tableCell, styles.tableCellRight, { flex: 1.5 }]}
              >
                {formatCurrency(cat.amount)}
              </Text>
              <Text
                style={[styles.tableCell, styles.tableCellRight, { flex: 1.5 }]}
              >
                {formatCurrency(cat.amount - cat.spent)}
              </Text>
            </View>
          ))}
        </View>
      </PageLayout>
    </Page>
  );
};

export default BudgetPage;
