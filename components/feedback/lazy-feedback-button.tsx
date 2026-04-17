"use client";

import dynamic from "next/dynamic";

const FeedbackButton = dynamic(
  () => import("@/components/feedback/feedback-button"),
  { ssr: false }
);

export default function LazyFeedbackButton() {
  return <FeedbackButton />;
}
