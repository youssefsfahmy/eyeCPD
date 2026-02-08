import { ActivityWithTags, Profile } from "@/lib/db/schema";
import { CPDCycle } from "@/lib/types/generic";
import { Page, Text, View } from "@react-pdf/renderer";
import { styles } from "../styles";
import { User } from "@supabase/supabase-js";

function summarize(activities: ActivityWithTags[], requiredHours = 30) {
  const totalHours = activities.reduce(
    (s, a) => s + (parseFloat(a.hours) || 0),
    0,
  );

  // Category breakdown
  const byCategory: Record<string, number> = {
    Clinical: 0,
    "Non-Clinical": 0,
    Interactive: 0,
    Therapeutic: 0,
  };

  // Format breakdown
  const byFormat: Record<string, number> = {
    Interactive: 0,
    "Self-Paced": 0,
  };

  activities.forEach((a) => {
    const hours = parseFloat(a.hours) || 0;

    // Skip draft activities for most calculations
    if (a.isDraft) return;

    // Category breakdown
    if (a.clinical) byCategory["Clinical"] += hours;
    if (a.nonClinical) byCategory["Non-Clinical"] += hours;
    if (a.interactive) byCategory["Interactive"] += hours;
    if (a.therapeutic) byCategory["Therapeutic"] += hours;

    // Format breakdown
    if (a.interactive) byFormat["Interactive"] += hours;
    else byFormat["Self-Paced"] += hours;
  });

  const distinctProviders = new Set(
    activities
      .filter((a) => !a.isDraft)
      .map((a) => a.providerId || "Unknown Provider"),
  ).size;

  // CPD Requirements
  const progressPercentage = Math.min(100, (totalHours / requiredHours) * 100);

  return {
    totalHours,
    byCategory,
    byFormat,
    distinctProviders,
    requiredHours,
    progressPercentage,
    publishedActivities: activities.filter((a) => !a.isDraft).length,
    draftActivities: activities.filter((a) => a.isDraft).length,
  };
}

const SummaryPage = ({
  selectedCycle,
  activities,
  profile,
  user,
}: {
  selectedCycle: CPDCycle;
  activities: ActivityWithTags[];
  profile: Profile;
  user: User;
}) => {
  const requiredHours = profile.isTherapeuticallyEndorsed ? 30 : 20;
  const summary = summarize(activities, requiredHours);

  return (
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>
        CPD Annual Report — {selectedCycle.label}
      </Text>
      <Text style={styles.subheader}>
        Summary of Continuing Professional Development activities completed
        between {selectedCycle.startDate.toLocaleDateString()} and{" "}
        {selectedCycle.endDate.toLocaleDateString()}.
      </Text>

      {/* Optometrist Details */}
      <View
        style={{
          marginBottom: 20,
          padding: 12,
          backgroundColor: "#f8f9fa",
          borderRadius: 4,
        }}
      >
        <Text style={{ fontSize: 12, fontWeight: 700, marginBottom: 8 }}>
          Optometrist Details
        </Text>
        <View style={{ flexDirection: "row", marginBottom: 12 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 10, marginBottom: 2 }}>
              <Text style={{ fontWeight: 700 }}>Name:</Text> {profile.firstName}{" "}
              {profile.lastName}
            </Text>
            <Text style={{ fontSize: 10, marginBottom: 2 }}>
              <Text style={{ fontWeight: 700 }}>Registration:</Text>{" "}
              {profile.registrationNumber || "N/A"}
            </Text>
            <Text style={{ fontSize: 10, marginBottom: 2 }}>
              <Text style={{ fontWeight: 700 }}>Role:</Text>{" "}
              {profile.roles?.join(", ") || "N/A"}
            </Text>
            <Text style={{ fontSize: 10, marginBottom: 2 }}>
              <Text style={{ fontWeight: 700 }}>Phone:</Text>{" "}
              {profile.phone || "N/A"}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 10, marginBottom: 2 }}>
              <Text style={{ fontWeight: 700 }}>Therapeutically Endorsed:</Text>{" "}
              {profile.isTherapeuticallyEndorsed ? "Yes" : "No"}
            </Text>
            <Text style={{ fontSize: 10, marginBottom: 2 }}>
              <Text style={{ fontWeight: 700 }}>Email:</Text>{" "}
              {user.email || "N/A"}
            </Text>
          </View>
        </View>
      </View>

      {/* Key Metrics */}
      <View style={styles.cardRow}>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Total Hours</Text>
          <Text style={styles.cardValue}>{summary.totalHours.toFixed(1)}</Text>
          <Text style={[styles.cardLabel, { marginTop: 4 }]}>
            of {summary.requiredHours} required
          </Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Completion</Text>
          <Text style={styles.cardValue}>
            {summary.progressPercentage.toFixed(0)}%
          </Text>
          <Text style={[styles.cardLabel, { marginTop: 4 }]}>completed</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Activities</Text>
          <Text style={styles.cardValue}>{summary.publishedActivities}</Text>
          <Text style={[styles.cardLabel, { marginTop: 4 }]}>
            {summary.draftActivities > 0
              ? `(${summary.draftActivities} drafts)`
              : "published"}
          </Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Providers</Text>
          <Text style={styles.cardValue}>{summary.distinctProviders}</Text>
          <Text style={[styles.cardLabel, { marginTop: 4 }]}>unique</Text>
        </View>
      </View>

      {/* Hours by Category */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 12, fontWeight: 700, marginBottom: 8 }}>
          Hours by Category
        </Text>
        <View style={styles.cardRow}>
          {Object.entries(summary.byCategory).map(([cat, hrs]) => (
            <View key={cat} style={[styles.card, { minHeight: 60 }]}>
              <Text style={styles.cardLabel}>{cat}</Text>
              <Text style={[styles.cardValue, { fontSize: 14 }]}>
                {hrs.toFixed(1)}h
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Learning Formats */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 12, fontWeight: 700, marginBottom: 8 }}>
          Learning Formats
        </Text>
        <View style={styles.cardRow}>
          {Object.entries(summary.byFormat).map(([format, hrs]) => (
            <View key={format} style={[styles.card, { flex: 0.5 }]}>
              <Text style={styles.cardLabel}>{format}</Text>
              <Text style={[styles.cardValue, { fontSize: 14 }]}>
                {hrs.toFixed(1)}h
              </Text>
              <Text style={[styles.cardLabel, { marginTop: 4 }]}>
                {hrs > 0
                  ? `${((hrs / summary.totalHours) * 100).toFixed(0)}%`
                  : "0%"}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Activity Overview Table */}
      <View>
        <Text style={{ fontSize: 12, fontWeight: 700, marginBottom: 8 }}>
          Activity Overview
        </Text>
        <View style={styles.tableHeader}>
          <Text style={[styles.th, { flex: 1.2 }]}>Date</Text>
          <Text style={[styles.th, { flex: 2 }]}>Title</Text>
          <Text style={styles.th}>Provider</Text>
          <Text style={styles.th}>Status</Text>
          <Text style={[styles.th, { textAlign: "right" }]}>Hours</Text>
        </View>
        {activities
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
          )
          .map((a) => (
            <View key={a.id} style={styles.row}>
              <Text style={[styles.td, { flex: 1.2, fontSize: 9 }]}>
                {new Date(a.date).toLocaleDateString()}
              </Text>
              <Text style={[styles.td, { flex: 2, fontSize: 9 }]}>
                {a.name}
              </Text>
              <Text style={[styles.td, { fontSize: 9 }]}>
                {a.providerId || "Unknown"}
              </Text>
              <Text
                style={[
                  styles.td,
                  { fontSize: 9, color: a.isDraft ? "#f39c12" : "#27ae60" },
                ]}
              >
                {a.isDraft ? "Draft" : "Published"}
              </Text>
              <Text style={[styles.td, { textAlign: "right", fontSize: 9 }]}>
                {parseFloat(a.hours)?.toFixed(1) ?? "0.0"}
              </Text>
            </View>
          ))}
      </View>

      <Text style={styles.footer}>
        Generated by EyeCPD • {new Date().toLocaleString()}
      </Text>
    </Page>
  );
};

export default SummaryPage;
