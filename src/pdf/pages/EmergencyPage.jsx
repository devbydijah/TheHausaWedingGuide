// src/pdf/pages/EmergencyPage.jsx
// Emergency contacts and notes page

import React from "react";
import { Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import { PageLayout } from "../Layout";
import { theme } from "../theme";
import { Divider } from "../components/shared";

const styles = StyleSheet.create({
  // Contact table
  table: {
    marginBottom: 20,
  },

  tableHeader: {
    flexDirection: "row",
    backgroundColor: theme.colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 8,
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
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
    minHeight: 35,
  },

  tableRowAlt: {
    backgroundColor: theme.colors.background,
  },

  tableCell: {
    fontFamily: theme.fonts.body,
    fontSize: 9,
    color: theme.colors.text,
  },

  // Notes section
  notesSection: {
    marginTop: 15,
  },

  notesTitle: {
    fontFamily: theme.fonts.bold,
    fontSize: 13,
    color: theme.colors.secondary,
    marginBottom: 12,
  },

  notesArea: {
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 6,
    padding: 15,
    minHeight: 180,
  },

  noteLine: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginBottom: 20,
  },

  // Final branding
  brandingSection: {
    marginTop: "auto",
    alignItems: "center",
    paddingTop: 20,
  },

  brandDivider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },

  brandLine: {
    width: 50,
    height: 1,
    backgroundColor: theme.colors.gold,
  },

  brandDiamond: {
    width: 8,
    height: 8,
    backgroundColor: theme.colors.gold,
    transform: "rotate(45deg)",
    marginHorizontal: 10,
  },

  brandText: {
    fontFamily: theme.fonts.body,
    fontSize: 9,
    color: theme.colors.textMuted,
    marginBottom: 4,
  },

  brandTitle: {
    fontFamily: theme.fonts.header,
    fontSize: 14,
    color: theme.colors.primary,
    marginBottom: 4,
  },

  brandLink: {
    fontFamily: theme.fonts.body,
    fontSize: 10,
    color: theme.colors.terracotta,
  },
});

// Default emergency contact roles
const contactRoles = [
  { role: "Bride", name: "" },
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

export const EmergencyPage = ({ brideName, vendors = [] }) => {
  // Pre-fill with any known vendor contacts
  const contacts = contactRoles.map((contact) => {
    if (contact.role === "Bride" && brideName) {
      return { ...contact, name: brideName };
    }
    // Try to match vendor by category
    const matchedVendor = vendors.find(
      (v) =>
        v.category?.toLowerCase().includes(contact.role.toLowerCase()) ||
        contact.role.toLowerCase().includes(v.category?.toLowerCase() || "")
    );
    if (matchedVendor) {
      return {
        ...contact,
        name: matchedVendor.name,
        phone: matchedVendor.phone || matchedVendor.contact,
      };
    }
    return contact;
  });

  return (
    <Page size="A4">
      <PageLayout title="Emergency Contacts" subtitle="Quick Reference Sheet">
        {/* Contact Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, { flex: 1.2 }]}>Role</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1.5 }]}>Name</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1.3 }]}>
              Phone Number
            </Text>
          </View>

          {contacts.map((contact, index) => (
            <View
              key={index}
              style={[styles.tableRow, index % 2 === 1 && styles.tableRowAlt]}
            >
              <Text style={[styles.tableCell, { flex: 1.2 }]}>
                {contact.role}
              </Text>
              <Text style={[styles.tableCell, { flex: 1.5 }]}>
                {contact.name || ""}
              </Text>
              <Text style={[styles.tableCell, { flex: 1.3 }]}>
                {contact.phone || ""}
              </Text>
            </View>
          ))}
        </View>

        {/* Notes Section */}
        <View style={styles.notesSection}>
          <Text style={styles.notesTitle}>Wedding Day Notes & Reminders</Text>
          <View style={styles.notesArea}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((_, i) => (
              <View key={i} style={styles.noteLine} />
            ))}
          </View>
        </View>

        {/* Final Branding */}
        <View style={styles.brandingSection}>
          <View style={styles.brandDivider}>
            <View style={styles.brandLine} />
            <View style={styles.brandDiamond} />
            <View style={styles.brandLine} />
          </View>
          <Text style={styles.brandText}>Created with love using</Text>
          <Text style={styles.brandTitle}>The Hausa Wedding Guide</Text>
          <Text style={styles.brandLink}>hausaroom.com</Text>
        </View>
      </PageLayout>
    </Page>
  );
};

export default EmergencyPage;
