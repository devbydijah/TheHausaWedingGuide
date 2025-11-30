// src/pdf/pages/CoverPage.jsx
// Beautiful cover page for the wedding planning PDF

import React from "react";
import { Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import { theme, formatDate, getCountdown } from "../theme";

const styles = StyleSheet.create({
  page: {
    backgroundColor: theme.colors.white,
    padding: 0,
  },

  // Full page container
  container: {
    height: "100%",
    padding: 20,
  },

  // Outer burgundy border
  outerBorder: {
    borderWidth: 4,
    borderColor: theme.colors.primary,
    height: "100%",
    padding: 6,
  },

  // Inner gold border
  innerBorder: {
    borderWidth: 2,
    borderColor: theme.colors.gold,
    height: "100%",
    padding: 30,
    justifyContent: "center",
    alignItems: "center",
  },

  // Corner decorations
  cornerDecoration: {
    position: "absolute",
    width: 30,
    height: 30,
  },

  // Main title area
  titleArea: {
    alignItems: "center",
    marginBottom: 40,
  },

  subtitle: {
    fontFamily: theme.fonts.body,
    fontSize: 11,
    color: theme.colors.textMuted,
    letterSpacing: 4,
    textTransform: "uppercase",
    marginBottom: 10,
  },

  mainTitle: {
    fontFamily: theme.fonts.header,
    fontSize: 32,
    color: theme.colors.primary,
    textAlign: "center",
    marginBottom: 8,
  },

  titleUnderline: {
    width: 80,
    height: 2,
    backgroundColor: theme.colors.gold,
    marginTop: 15,
  },

  // Bride name section
  brideSection: {
    alignItems: "center",
    marginVertical: 30,
  },

  forText: {
    fontFamily: theme.fonts.body,
    fontSize: 12,
    color: theme.colors.textMuted,
    marginBottom: 8,
  },

  brideName: {
    fontFamily: theme.fonts.header,
    fontSize: 26,
    color: theme.colors.secondary,
    textAlign: "center",
  },

  // Date section
  dateSection: {
    alignItems: "center",
    marginVertical: 25,
    paddingVertical: 20,
    paddingHorizontal: 40,
    backgroundColor: theme.colors.background,
    borderRadius: 8,
  },

  weddingDate: {
    fontFamily: theme.fonts.header,
    fontSize: 16,
    color: theme.colors.primary,
    textAlign: "center",
  },

  countdown: {
    fontFamily: theme.fonts.body,
    fontSize: 11,
    color: theme.colors.terracotta,
    marginTop: 8,
    fontStyle: "italic",
  },

  // Table of contents
  tocSection: {
    marginTop: 30,
    width: "80%",
    maxWidth: 280,
  },

  tocTitle: {
    fontFamily: theme.fonts.header,
    fontSize: 12,
    color: theme.colors.primary,
    textAlign: "center",
    marginBottom: 15,
    textTransform: "uppercase",
    letterSpacing: 2,
  },

  tocItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    paddingVertical: 4,
  },

  tocBullet: {
    width: 6,
    height: 6,
    backgroundColor: theme.colors.gold,
    borderRadius: 3,
    marginRight: 12,
  },

  tocText: {
    fontFamily: theme.fonts.body,
    fontSize: 10,
    color: theme.colors.text,
  },

  // Diamond divider
  diamondRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },

  diamondLine: {
    width: 50,
    height: 1,
    backgroundColor: theme.colors.gold,
  },

  diamond: {
    width: 10,
    height: 10,
    backgroundColor: theme.colors.gold,
    transform: "rotate(45deg)",
    marginHorizontal: 12,
  },

  // Footer
  footer: {
    position: "absolute",
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: "center",
  },

  footerText: {
    fontFamily: theme.fonts.body,
    fontSize: 9,
    color: theme.colors.textMuted,
    fontStyle: "italic",
  },
});

const DiamondDivider = () => (
  <View style={styles.diamondRow}>
    <View style={styles.diamondLine} />
    <View style={styles.diamond} />
    <View style={styles.diamondLine} />
  </View>
);

const tableOfContents = [
  "Your Wedding Vision & Style",
  "Complete Budget Breakdown",
  "Vendor Contact Directory",
  "Timeline & Task Checklist",
  "Essential Planning Checklists",
  "Emergency Contacts & Notes",
];

export const CoverPage = ({ brideName, weddingDate }) => {
  const formattedDate = formatDate(weddingDate);
  const countdown = getCountdown(weddingDate);

  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.container}>
        <View style={styles.outerBorder}>
          <View style={styles.innerBorder}>
            {/* Title Area */}
            <View style={styles.titleArea}>
              <Text style={styles.subtitle}>The Northern</Text>
              <Text style={styles.mainTitle}>Wedding Guide</Text>
              <View style={styles.titleUnderline} />
            </View>

            <DiamondDivider />

            {/* Bride Name */}
            <View style={styles.brideSection}>
              <Text style={styles.forText}>Prepared for</Text>
              <Text style={styles.brideName}>{brideName || "The Bride"}</Text>
            </View>

            {/* Wedding Date */}
            {weddingDate && (
              <View style={styles.dateSection}>
                <Text style={styles.weddingDate}>{formattedDate}</Text>
                {countdown && (
                  <Text style={styles.countdown}>{countdown.text}</Text>
                )}
              </View>
            )}

            {/* Table of Contents */}
            <View style={styles.tocSection}>
              <Text style={styles.tocTitle}>What's Inside</Text>
              {tableOfContents.map((item, index) => (
                <View key={index} style={styles.tocItem}>
                  <View style={styles.tocBullet} />
                  <Text style={styles.tocText}>{item}</Text>
                </View>
              ))}
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Prepared with love for your special day
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Page>
  );
};

export default CoverPage;
