// src/pdf/pages/ChecklistsPage.jsx
// Essential wedding checklists page

import React from "react";
import { Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import { PageLayout } from "../Layout";
import { theme } from "../theme";
import { CheckboxItem } from "../components/shared";

const styles = StyleSheet.create({
  // Category header
  categoryHeader: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginTop: 15,
    marginBottom: 10,
  },

  categoryHeaderSecondary: {
    backgroundColor: theme.colors.secondary,
  },

  categoryHeaderTerracotta: {
    backgroundColor: theme.colors.terracotta,
  },

  categoryTitle: {
    fontFamily: theme.fonts.bold,
    fontSize: 11,
    color: theme.colors.white,
    textTransform: "uppercase",
    letterSpacing: 1,
    textAlign: "center",
  },

  // Two columns for checklist items
  twoColumns: {
    flexDirection: "row",
  },

  column: {
    flex: 1,
    paddingRight: 8,
  },

  // Personal checklist section
  personalSection: {
    marginTop: 25,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },

  personalTitle: {
    fontFamily: theme.fonts.bold,
    fontSize: 11,
    color: theme.colors.text,
    marginBottom: 10,
  },
});

// Predefined checklist categories
const checklistCategories = [
  {
    name: "Week Before Wedding",
    color: "primary",
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
    color: "secondary",
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
    color: "terracotta",
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

const getCategoryStyle = (color) => {
  switch (color) {
    case "secondary":
      return styles.categoryHeaderSecondary;
    case "terracotta":
      return styles.categoryHeaderTerracotta;
    default:
      return {};
  }
};

export const ChecklistsPage = () => {
  return (
    <Page size="A4">
      <PageLayout
        title="Essential Checklists"
        subtitle="Don't Forget These Items"
      >
        {checklistCategories.map((category, catIndex) => (
          <View key={catIndex}>
            {/* Category Header */}
            <View
              style={[styles.categoryHeader, getCategoryStyle(category.color)]}
            >
              <Text style={styles.categoryTitle}>{category.name}</Text>
            </View>

            {/* Checklist Items in Two Columns */}
            <View style={styles.twoColumns}>
              <View style={styles.column}>
                {category.items
                  .slice(0, Math.ceil(category.items.length / 2))
                  .map((item, i) => (
                    <CheckboxItem key={i} text={item} isChecked={false} />
                  ))}
              </View>
              <View style={styles.column}>
                {category.items
                  .slice(Math.ceil(category.items.length / 2))
                  .map((item, i) => (
                    <CheckboxItem key={i} text={item} isChecked={false} />
                  ))}
              </View>
            </View>
          </View>
        ))}

        {/* Personal Checklist Items */}
        <View style={styles.personalSection}>
          <Text style={styles.personalTitle}>My Personal Checklist Items:</Text>
          {[1, 2, 3, 4, 5].map((_, i) => (
            <CheckboxItem key={i} text="" isEmpty={true} />
          ))}
        </View>
      </PageLayout>
    </Page>
  );
};

export default ChecklistsPage;
