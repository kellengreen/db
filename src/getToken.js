import { Signer } from "@aws-sdk/rds-signer";
import { fromIni } from "@aws-sdk/credential-providers";

import { region } from "./config.js";

export default async function getToken(cluster) {
  const signer = new Signer({
    region,
    hostname: cluster.config.host,
    port: cluster.config.port,
    username: cluster.config.user,
    credentials: fromIni({
      profile: "dev-test",
    }),
  });
  return await signer.getAuthToken();
}
