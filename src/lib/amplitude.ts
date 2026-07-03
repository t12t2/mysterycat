import * as amplitude from "@amplitude/unified";

let initialized = false;

export function initAmplitude() {
  if (typeof window === "undefined") return;
  if (initialized) return;
  initialized = true;
  amplitude.initAll("4be9a75d5031b42c4297c107c2980723", {
    analytics: { autocapture: true },
    sessionReplay: { sampleRate: 1 },
  });
}