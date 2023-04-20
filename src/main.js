import pg from "pg";
import crypto from "crypto";

import sleep from "./sleep.js";
import Logger from "./Logger.js";
import getToken from "./getToken.js";

import {
  dropTable,
  insertRow,
  createTable,
  selectCount,
  enableSubscription,
  disableSubscription,
  createPublication,
  dropSubscription,
  dropPublication,
  createSubscription,
  clearTable,
} from "./query.js";

import {
  readDelay,
  writeDelay,
  poolConfig,
  clusterBlue,
  clusterProxy,
  clusterGreen,
} from "./config.js";

async function main() {
  const command = process.argv[2];

  const cluster = new Map([
    ["blue", clusterBlue],
    ["green", clusterGreen],
    [undefined, clusterProxy],
  ]).get(process.argv[3]);

  switch (command) {
    case "init":
      const otherCluster = cluster === clusterBlue ? clusterGreen : clusterBlue;
      await init(cluster, otherCluster);
      break;
    case "reset":
      await reset(cluster);
      break;
    case "sub":
      await sub(cluster);
      break;
    case "unsub":
      await unsub(cluster);
      break;
    case "read":
      await read(cluster);
      break;
    case "write":
      await write(cluster);
      break;
    default:
      throw Error(`Unknown command "${command}"`);
  }
}

async function init(cluster, subCluster) {
  const client = new pg.Client(cluster.config);
  await client.connect();
  await client.query(dropSubscription());
  await client.query(dropPublication());
  await client.query(dropTable());
  await client.query(createTable());
  await client.query(createPublication());
  await client.query(createSubscription(subCluster.config));
  await client.end();
}

async function reset(cluster) {
  const client = new pg.Client(cluster.config);
  await client.connect();
  await client.query(clearTable());
  await client.end();
}

async function sub(cluster) {
  const client = new pg.Client(cluster.config);
  await client.connect();
  await client.query(enableSubscription());
  await client.end();
}

async function unsub(cluster) {
  const client = new pg.Client(cluster.config);
  await client.connect();
  await client.query(disableSubscription());
  await client.end();
}

async function read(cluster) {
  const pool = new pg.Pool({
    ...poolConfig,
    ...cluster.config,
    password: cluster.config.password ?? (await getToken(cluster)),
  });

  const logger = new Logger(`Reading from ${cluster.name}`);

  pool.on("error", (err) => {
    logger.log(err);
  });

  while (true) {
    try {
      const res = await pool.query(selectCount());
      logger.log(`${res.rows[0].count} Total Rows`);
    } catch (err) {
      logger.log(err);
    }
    await sleep(readDelay);
  }
}

async function write(cluster) {
  const pool = new pg.Pool({
    ...poolConfig,
    ...cluster.config,
    password: cluster.config.password ?? (await getToken(cluster)),
  });

  const logger = new Logger(`Writing to ${cluster.name}`);

  pool.on("error", (err) => {
    logger.log(err);
  });

  while (true) {
    try {
      const id = crypto.randomUUID();
      await pool.query(insertRow(), [
        id,
        JSON.stringify({
          time: new Date().toISOString(),
        }),
      ]);
      logger.log(id);
    } catch (err) {
      logger.log(err);
    }
    await sleep(writeDelay);
  }
}

await main();
