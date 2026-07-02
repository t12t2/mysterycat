import { StatsigClient } from "@statsig/js-client";
import { StatsigSessionReplayPlugin } from "@statsig/session-replay";
import { StatsigAutoCapturePlugin } from "@statsig/web-analytics";

let clientPromise: Promise<StatsigClient> | null = null;
let statsigClient: StatsigClient | null = null;

export function initStatsig(): Promise<StatsigClient> | null {
  if (typeof window === "undefined") return null;
  if (clientPromise) return clientPromise;

  const client = new StatsigClient(
    "client-oLNCMhUWliTGN64TdWS3R2c1fqZpLbOleCmviTY9JOR",
    { userID: "user-id" },
    {
      plugins: [new StatsigSessionReplayPlugin(), new StatsigAutoCapturePlugin()],
    },
  );

  clientPromise = client.initializeAsync().then(() => client);
  clientPromise.then((c) => {
    statsigClient = c;
  });
  return clientPromise;
}

export function getStatsigClient(): StatsigClient | null {
  return statsigClient;
}