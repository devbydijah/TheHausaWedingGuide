// src/pdf/pages/VendorPage.jsx
// Vendor contact directory page

import React from "react";
import { Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import { PageLayout } from "../Layout";
import { theme, formatCurrency } from "../theme";
import { SectionHeader, StatusBadge, Divider } from "../components/shared";

const styles = StyleSheet.create({
  subtitle: {
    fontFamily: theme.fonts.body,
    fontSize: 10,
    color: theme.colors.textMuted,
    fontStyle: "italic",
    marginBottom: 15,
  },

  // Section headers
  sectionTitle: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 5,
  },

  sectionBar: {
    width: 4,
    height: 16,
    borderRadius: 2,
    marginRight: 8,
  },

  sectionText: {
    fontFamily: theme.fonts.bold,
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  // Vendor card
  vendorCard: {
    backgroundColor: theme.colors.background,
    borderRadius: 6,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
  },

  vendorHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 6,
  },

  vendorName: {
    fontFamily: theme.fonts.bold,
    fontSize: 11,
    color: theme.colors.text,
    flex: 1,
  },

  vendorCategory: {
    fontFamily: theme.fonts.body,
    fontSize: 9,
    color: theme.colors.textMuted,
  },

  vendorDetail: {
    flexDirection: "row",
    marginTop: 4,
  },

  vendorLabel: {
    fontFamily: theme.fonts.bold,
    fontSize: 9,
    color: theme.colors.textLight,
    width: 50,
  },

  vendorValue: {
    fontFamily: theme.fonts.body,
    fontSize: 9,
    color: theme.colors.text,
    flex: 1,
  },

  // Empty vendor table
  table: {
    marginTop: 10,
  },

  tableHeader: {
    flexDirection: "row",
    backgroundColor: theme.colors.primary,
    paddingVertical: 8,
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

  // No vendors message
  emptyMessage: {
    textAlign: "center",
    marginTop: 20,
    marginBottom: 15,
  },

  emptyTitle: {
    fontFamily: theme.fonts.header,
    fontSize: 14,
    color: theme.colors.primary,
    marginBottom: 8,
  },

  emptySubtitle: {
    fontFamily: theme.fonts.body,
    fontSize: 10,
    color: theme.colors.textMuted,
  },
});

// Essential vendor categories
const essentialCategories = [
  "Venue",
  "Catering",
  "Photography",
  "Videography",
  "Makeup Artist",
  "Decorator",
  "DJ / Music",
  "Transportation",
];

const VendorCard = ({ vendor, statusColor }) => (
  <View style={[styles.vendorCard, { borderLeftColor: statusColor }]}>
    <View style={styles.vendorHeader}>
      <View style={{ flex: 1 }}>
        <Text style={styles.vendorCategory}>{vendor.category || "Vendor"}</Text>
        <Text style={styles.vendorName}>{vendor.name}</Text>
      </View>
      <StatusBadge status={vendor.status} />
    </View>

    <View style={styles.vendorDetail}>
      <Text style={styles.vendorLabel}>Phone:</Text>
      <Text style={styles.vendorValue}>
        {vendor.phone || vendor.contact || "________________"}
      </Text>
    </View>

    {vendor.cost && (
      <View style={styles.vendorDetail}>
        <Text style={styles.vendorLabel}>Cost:</Text>
        <Text style={styles.vendorValue}>{formatCurrency(vendor.cost)}</Text>
      </View>
    )}
  </View>
);

export const VendorPage = ({ vendors = [] }) => {
  // Filter out invalid vendor entries
  const validVendors = vendors.filter(
    (v) => v && v.name && typeof v.name === "string"
  );

  const bookedVendors = validVendors.filter(
    (v) =>
      v.status?.toLowerCase() === "booked" ||
      v.status?.toLowerCase() === "confirmed"
  );
  const pendingVendors = validVendors.filter(
    (v) =>
      v.status?.toLowerCase() !== "booked" &&
      v.status?.toLowerCase() !== "confirmed"
  );

  // Find categories that don't have vendors yet
  const vendorCategories = validVendors.map((v) => v.category?.toLowerCase());
  const missingCategories = essentialCategories.filter(
    (cat) => !vendorCategories.includes(cat.toLowerCase())
  );

  return (
    <Page size="A4">
      <PageLayout title="Vendor Directory" subtitle="Contact Information">
        <Text style={styles.subtitle}>
          Keep this page handy for quick vendor contact during planning
        </Text>

        {/* Confirmed Vendors */}
        {bookedVendors.length > 0 && (
          <>
            <View style={styles.sectionTitle}>
              <View
                style={[
                  styles.sectionBar,
                  { backgroundColor: theme.colors.sage },
                ]}
              />
              <Text style={[styles.sectionText, { color: theme.colors.sage }]}>
                Confirmed Vendors
              </Text>
            </View>
            {bookedVendors.map((vendor, index) => (
              <VendorCard
                key={index}
                vendor={vendor}
                statusColor={theme.colors.sage}
              />
            ))}
          </>
        )}

        {/* Pending Vendors */}
        {pendingVendors.length > 0 && (
          <>
            <View style={[styles.sectionTitle, { marginTop: 15 }]}>
              <View
                style={[
                  styles.sectionBar,
                  { backgroundColor: theme.colors.terracotta },
                ]}
              />
              <Text
                style={[styles.sectionText, { color: theme.colors.terracotta }]}
              >
                In Progress
              </Text>
            </View>
            {pendingVendors.map((vendor, index) => (
              <VendorCard
                key={index}
                vendor={vendor}
                statusColor={theme.colors.terracotta}
              />
            ))}
          </>
        )}

        {/* Vendors Still Needed Table */}
        {(validVendors.length === 0 || missingCategories.length > 0) && (
          <>
            {validVendors.length === 0 && (
              <View style={styles.emptyMessage}>
                <Text style={styles.emptyTitle}>
                  Start Building Your Vendor Team!
                </Text>
                <Text style={styles.emptySubtitle}>
                  Use the table below to record vendor contacts as you find them
                </Text>
              </View>
            )}

            {missingCategories.length > 0 && validVendors.length > 0 && (
              <View style={[styles.sectionTitle, { marginTop: 15 }]}>
                <View
                  style={[
                    styles.sectionBar,
                    { backgroundColor: theme.colors.primary },
                  ]}
                />
                <Text
                  style={[styles.sectionText, { color: theme.colors.primary }]}
                >
                  Vendors Still Needed
                </Text>
              </View>
            )}

            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderCell, { flex: 1.2 }]}>
                  Category
                </Text>
                <Text style={[styles.tableHeaderCell, { flex: 1.5 }]}>
                  Vendor Name
                </Text>
                <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Phone</Text>
                <Text style={[styles.tableHeaderCell, { flex: 0.8 }]}>
                  Quote
                </Text>
              </View>

              {(validVendors.length === 0
                ? essentialCategories
                : missingCategories
              ).map((category, index) => (
                <View
                  key={index}
                  style={[
                    styles.tableRow,
                    index % 2 === 1 && styles.tableRowAlt,
                  ]}
                >
                  <Text style={[styles.tableCell, { flex: 1.2 }]}>
                    {category}
                  </Text>
                  <Text style={[styles.tableCell, { flex: 1.5 }]}></Text>
                  <Text style={[styles.tableCell, { flex: 1 }]}></Text>
                  <Text style={[styles.tableCell, { flex: 0.8 }]}></Text>
                </View>
              ))}
            </View>
          </>
        )}
      </PageLayout>
    </Page>
  );
};

export default VendorPage;
