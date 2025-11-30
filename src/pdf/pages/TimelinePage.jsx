// src/pdf/pages/TimelinePage.jsx
// Timeline and task checklist page

import React from "react";
import { Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import { PageLayout } from "../Layout";
import { theme, getCountdown } from "../theme";
import { CheckboxItem, Divider } from "../components/shared";

const styles = StyleSheet.create({
  // Countdown box
  countdownBox: {
    backgroundColor: theme.colors.background,
    borderWidth: 2,
    borderColor: theme.colors.terracotta,
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    marginBottom: 20,
    marginHorizontal: 50,
  },

  countdownText: {
    fontFamily: theme.fonts.header,
    fontSize: 13,
    color: theme.colors.terracotta,
    textAlign: "center",
  },

  // Section styling
  sectionTitle: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 10,
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

  // Two column layout for tasks
  twoColumns: {
    flexDirection: "row",
  },

  column: {
    flex: 1,
    paddingRight: 10,
  },

  // Phase header for default timeline
  phaseHeader: {
    backgroundColor: theme.colors.background,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.terracotta,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginTop: 12,
    marginBottom: 8,
  },

  phaseText: {
    fontFamily: theme.fonts.bold,
    fontSize: 10,
    color: theme.colors.secondary,
  },

  // Priority tasks section
  prioritySection: {
    marginTop: 20,
  },

  priorityTitle: {
    fontFamily: theme.fonts.bold,
    fontSize: 11,
    color: theme.colors.text,
    marginBottom: 10,
  },

  priorityRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    backgroundColor: theme.colors.background,
    borderRadius: 4,
    padding: 8,
  },

  priorityNumber: {
    fontFamily: theme.fonts.bold,
    fontSize: 10,
    color: theme.colors.primary,
    width: 20,
  },

  priorityLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.border,
  },
});

// Default timeline phases if no tasks provided
const defaultTimeline = [
  {
    phase: "12+ Months Before",
    tasks: [
      "Set wedding date",
      "Determine budget",
      "Create guest list",
      "Book venue",
      "Start vendor research",
    ],
  },
  {
    phase: "6-12 Months Before",
    tasks: [
      "Book photographer",
      "Book caterer",
      "Choose wedding party",
      "Shop for wedding attire",
      "Plan honeymoon",
    ],
  },
  {
    phase: "3-6 Months Before",
    tasks: [
      "Send invitations",
      "Book florist",
      "Arrange transportation",
      "Plan rehearsal dinner",
      "Finalize menu",
    ],
  },
  {
    phase: "1-3 Months Before",
    tasks: [
      "Final fittings",
      "Confirm all vendors",
      "Get marriage license",
      "Create seating chart",
      "Write vows",
    ],
  },
];

const formatShortDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

export const TimelinePage = ({ tasks = [], weddingDate }) => {
  const countdown = getCountdown(weddingDate);

  const pendingTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  return (
    <Page size="A4">
      <PageLayout title="Timeline & Tasks" subtitle="Your Planning Checklist">
        {/* Countdown Box */}
        {countdown && (
          <View style={styles.countdownBox}>
            <Text style={styles.countdownText}>{countdown.text}</Text>
          </View>
        )}

        {/* If user has tasks */}
        {tasks.length > 0 ? (
          <>
            {/* Pending Tasks */}
            {pendingTasks.length > 0 && (
              <>
                <View style={styles.sectionTitle}>
                  <View
                    style={[
                      styles.sectionBar,
                      { backgroundColor: theme.colors.primary },
                    ]}
                  />
                  <Text
                    style={[
                      styles.sectionText,
                      { color: theme.colors.primary },
                    ]}
                  >
                    Pending Tasks
                  </Text>
                </View>

                <View style={styles.twoColumns}>
                  <View style={styles.column}>
                    {pendingTasks
                      .slice(0, Math.ceil(pendingTasks.length / 2))
                      .map((task, i) => (
                        <CheckboxItem
                          key={i}
                          text={`${task.task}${task.date ? ` (${formatShortDate(task.date)})` : ""}`}
                          isChecked={false}
                        />
                      ))}
                  </View>
                  <View style={styles.column}>
                    {pendingTasks
                      .slice(Math.ceil(pendingTasks.length / 2))
                      .map((task, i) => (
                        <CheckboxItem
                          key={i}
                          text={`${task.task}${task.date ? ` (${formatShortDate(task.date)})` : ""}`}
                          isChecked={false}
                        />
                      ))}
                  </View>
                </View>
              </>
            )}

            {/* Completed Tasks */}
            {completedTasks.length > 0 && (
              <>
                <View style={[styles.sectionTitle, { marginTop: 15 }]}>
                  <View
                    style={[
                      styles.sectionBar,
                      { backgroundColor: theme.colors.sage },
                    ]}
                  />
                  <Text
                    style={[styles.sectionText, { color: theme.colors.sage }]}
                  >
                    Completed
                  </Text>
                </View>

                {completedTasks.map((task, i) => (
                  <CheckboxItem key={i} text={task.task} isChecked={true} />
                ))}
              </>
            )}
          </>
        ) : (
          /* Default Timeline */
          <>
            <Text
              style={{
                fontFamily: theme.fonts.header,
                fontSize: 14,
                color: theme.colors.primary,
                textAlign: "center",
                marginBottom: 5,
              }}
            >
              Wedding Planning Timeline
            </Text>
            <Text
              style={{
                fontFamily: theme.fonts.body,
                fontSize: 9,
                color: theme.colors.textMuted,
                textAlign: "center",
                fontStyle: "italic",
                marginBottom: 15,
              }}
            >
              Use this guide to stay on track with your planning
            </Text>

            {defaultTimeline.map((phase, phaseIndex) => (
              <View key={phaseIndex}>
                <View style={styles.phaseHeader}>
                  <Text style={styles.phaseText}>{phase.phase}</Text>
                </View>

                <View style={styles.twoColumns}>
                  <View style={styles.column}>
                    {phase.tasks
                      .slice(0, Math.ceil(phase.tasks.length / 2))
                      .map((task, i) => (
                        <CheckboxItem key={i} text={task} isChecked={false} />
                      ))}
                  </View>
                  <View style={styles.column}>
                    {phase.tasks
                      .slice(Math.ceil(phase.tasks.length / 2))
                      .map((task, i) => (
                        <CheckboxItem key={i} text={task} isChecked={false} />
                      ))}
                  </View>
                </View>
              </View>
            ))}
          </>
        )}

        {/* This Week's Priority Tasks */}
        <View style={styles.prioritySection}>
          <Text style={styles.priorityTitle}>This Week's Priority Tasks:</Text>
          {[1, 2, 3, 4].map((num) => (
            <View key={num} style={styles.priorityRow}>
              <Text style={styles.priorityNumber}>{num}.</Text>
              <View style={styles.priorityLine} />
            </View>
          ))}
        </View>
      </PageLayout>
    </Page>
  );
};

export default TimelinePage;
