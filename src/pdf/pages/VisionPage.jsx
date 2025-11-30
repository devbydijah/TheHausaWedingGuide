// src/pdf/pages/VisionPage.jsx
// Wedding vision and style results page

import React from "react";
import { Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import { PageLayout } from "../Layout";
import { theme } from "../theme";
import { Card, Divider } from "../components/shared";

const styles = StyleSheet.create({
  styleTitle: {
    fontFamily: theme.fonts.header,
    fontSize: 22,
    color: theme.colors.primary,
    textAlign: "center",
    marginBottom: 15,
  },

  descriptionCard: {
    backgroundColor: theme.colors.background,
    padding: 15,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.terracotta,
    marginBottom: 20,
  },

  description: {
    fontFamily: theme.fonts.body,
    fontSize: 11,
    color: theme.colors.text,
    lineHeight: 1.6,
    fontStyle: "italic",
  },

  sectionTitle: {
    fontFamily: theme.fonts.bold,
    fontSize: 12,
    color: theme.colors.secondary,
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  characteristicsList: {
    marginBottom: 20,
  },

  characteristic: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 6,
    paddingLeft: 5,
  },

  bullet: {
    width: 6,
    height: 6,
    backgroundColor: theme.colors.terracotta,
    borderRadius: 3,
    marginRight: 10,
    marginTop: 4,
  },

  characteristicText: {
    fontFamily: theme.fonts.body,
    fontSize: 10,
    color: theme.colors.text,
    flex: 1,
  },

  // Inspiration board section
  inspirationTitle: {
    fontFamily: theme.fonts.header,
    fontSize: 14,
    color: theme.colors.primary,
    textAlign: "center",
    marginBottom: 5,
  },

  inspirationSubtitle: {
    fontFamily: theme.fonts.body,
    fontSize: 9,
    color: theme.colors.textMuted,
    textAlign: "center",
    fontStyle: "italic",
    marginBottom: 15,
  },

  inspirationGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  inspirationBox: {
    width: "30%",
    aspectRatio: 1.2,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
  },

  inspirationLabel: {
    fontFamily: theme.fonts.body,
    fontSize: 8,
    color: theme.colors.textMuted,
    textAlign: "center",
    marginTop: 5,
  },

  // Notes section
  notesTitle: {
    fontFamily: theme.fonts.bold,
    fontSize: 11,
    color: theme.colors.text,
    marginBottom: 10,
  },

  noteLine: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginBottom: 18,
  },
});

// Default style if none selected
const defaultStyle = {
  title: "Classic Elegance",
  description:
    "A timeless celebration featuring traditional elements, refined details, and sophisticated touches that honor heritage while embracing modern luxury.",
  characteristics: [
    "Traditional ceremonial elements with modern presentation",
    "Rich, warm color palette with gold accents",
    "Elegant floral arrangements and décor",
    "Fine dining and impeccable service",
    "Attention to cultural traditions",
  ],
};

export const VisionPage = ({ visionData }) => {
  const style = visionData?.result || defaultStyle;

  return (
    <Page size="A4">
      <PageLayout title="Your Wedding Vision" subtitle="Style & Inspiration">
        {/* Style Title */}
        <Text style={styles.styleTitle}>{style.title}</Text>

        {/* Description */}
        <View style={styles.descriptionCard}>
          <Text style={styles.description}>{style.description}</Text>
        </View>

        {/* Key Characteristics */}
        <Text style={styles.sectionTitle}>Key Characteristics</Text>
        <View style={styles.characteristicsList}>
          {(style.characteristics || defaultStyle.characteristics).map(
            (item, index) => (
              <View key={index} style={styles.characteristic}>
                <View style={styles.bullet} />
                <Text style={styles.characteristicText}>{item}</Text>
              </View>
            )
          )}
        </View>

        <Divider color={theme.colors.gold} margin={20} />

        {/* Inspiration Board */}
        <Text style={styles.inspirationTitle}>My Inspiration Board</Text>
        <Text style={styles.inspirationSubtitle}>
          Paste photos, fabric swatches, or sketches of your dream wedding
        </Text>

        <View style={styles.inspirationGrid}>
          <View>
            <View style={styles.inspirationBox}>
              <Text style={{ color: theme.colors.border, fontSize: 20 }}>
                +
              </Text>
            </View>
            <Text style={styles.inspirationLabel}>Venue</Text>
          </View>
          <View>
            <View style={styles.inspirationBox}>
              <Text style={{ color: theme.colors.border, fontSize: 20 }}>
                +
              </Text>
            </View>
            <Text style={styles.inspirationLabel}>Attire</Text>
          </View>
          <View>
            <View style={styles.inspirationBox}>
              <Text style={{ color: theme.colors.border, fontSize: 20 }}>
                +
              </Text>
            </View>
            <Text style={styles.inspirationLabel}>Colors</Text>
          </View>
        </View>

        {/* Vision Notes */}
        <Text style={styles.notesTitle}>Vision Notes:</Text>
        {[1, 2, 3, 4, 5].map((_, i) => (
          <View key={i} style={styles.noteLine} />
        ))}
      </PageLayout>
    </Page>
  );
};

export default VisionPage;
