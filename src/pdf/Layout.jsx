// src/pdf/Layout.jsx
// Master layout component with elegant double-border design

import React from "react";
import { View, Text, StyleSheet } from "@react-pdf/renderer";
import { theme } from "./theme";

const styles = StyleSheet.create({
  // Full page background
  pageBackground: {
    backgroundColor: theme.colors.white,
    height: "100%",
    padding: 18,
  },

  // The thick burgundy outer border
  outerBorder: {
    borderWidth: 3,
    borderColor: theme.colors.primary,
    height: "100%",
    padding: 4,
  },

  // The thin gold inner border
  innerBorder: {
    borderWidth: 1,
    borderColor: theme.colors.gold,
    height: "100%",
    padding: 20,
    display: "flex",
    flexDirection: "column",
  },

  // Page header with decorative elements
  header: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gold,
    paddingBottom: 10,
    alignItems: "center",
  },

  headerText: {
    fontFamily: theme.fonts.header,
    color: theme.colors.primary,
    fontSize: 16,
    textTransform: "uppercase",
    letterSpacing: 3,
  },

  headerSubtext: {
    fontFamily: theme.fonts.body,
    color: theme.colors.textMuted,
    fontSize: 9,
    marginTop: 4,
  },

  // Diamond decorative element
  diamondRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },

  diamondLine: {
    width: 40,
    height: 1,
    backgroundColor: theme.colors.gold,
  },

  diamond: {
    width: 8,
    height: 8,
    backgroundColor: theme.colors.gold,
    transform: "rotate(45deg)",
    marginHorizontal: 10,
  },

  // Content area
  content: {
    flex: 1,
  },

  // Footer
  footer: {
    marginTop: "auto",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderLight,
    alignItems: "center",
  },

  footerText: {
    fontFamily: theme.fonts.body,
    fontSize: 8,
    color: theme.colors.textMuted,
  },

  footerLink: {
    fontFamily: theme.fonts.body,
    fontSize: 8,
    color: theme.colors.terracotta,
    marginTop: 2,
  },
});

// Diamond divider component
const DiamondDivider = () => (
  <View style={styles.diamondRow}>
    <View style={styles.diamondLine} />
    <View style={styles.diamond} />
    <View style={styles.diamondLine} />
  </View>
);

// Main page layout wrapper
export const PageLayout = ({ children, title, subtitle }) => (
  <View style={styles.pageBackground}>
    <View style={styles.outerBorder}>
      <View style={styles.innerBorder}>
        {/* Header */}
        {title && (
          <View style={styles.header}>
            <Text style={styles.headerText}>{title}</Text>
            {subtitle && <Text style={styles.headerSubtext}>{subtitle}</Text>}
            <DiamondDivider />
          </View>
        )}

        {/* Page Content */}
        <View style={styles.content}>{children}</View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Prepared with love for your special day
          </Text>
          <Text style={styles.footerLink}>hausaroom.com</Text>
        </View>
      </View>
    </View>
  </View>
);

export default PageLayout;
