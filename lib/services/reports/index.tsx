// app/reports/pdf/ReportDocument.tsx

import { ActivityRecord, Profile } from "@/lib/db/schema";
import { CPDCycle } from "@/lib/types/generic";
import { Document } from "@react-pdf/renderer";
import SummaryPage from "./summary-page";
import ActivityPage from "./activity-page";
import { User } from "@supabase/supabase-js";

export default function ReportDocument({
  selectedCycle,
  activities,
  profile,
  user,
}: {
  selectedCycle: CPDCycle;
  activities: ActivityRecord[];
  profile: Profile;
  user: User;
}) {
  return (
    <Document>
      <SummaryPage
        selectedCycle={selectedCycle}
        activities={activities}
        profile={profile}
        user={user}
      />
      {/* Individual Activity Pages */}
      {activities.map((activity, index) => {
        return (
          <ActivityPage
            key={activity.id}
            activity={activity}
            index={index}
            totalActivities={activities.length}
          />
        );
      })}
    </Document>
  );
}
