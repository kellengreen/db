import {
  defaultTable,
  defaultPublication,
  defaultSubscription,
} from "./config.js";

export function createTable({ table = defaultTable } = {}) {
  return `
    CREATE TABLE IF NOT EXISTS ${table} (
      id    CHAR(36) PRIMARY KEY,
      data  jsonb
    );
  `;
}

export function dropTable({ table = defaultTable } = {}) {
  return `
    DROP TABLE IF EXISTS ${table};
  `;
}

export function clearTable({ table = defaultTable } = {}) {
  return `
    TRUNCATE TABLE ${table};
  `;
}

export function insertRow({ table = defaultTable } = {}) {
  return `
    INSERT INTO ${table} VALUES ($1, $2);
  `;
}

export function selectCount({ table = defaultTable } = {}) {
  return `
    SELECT COUNT(*) FROM ${table};
  `;
}

export function createPublication({
  publication = defaultPublication,
  table = defaultTable,
} = {}) {
  return `
    CREATE PUBLICATION ${publication} FOR TABLE ${table};
`;
}

export function dropPublication({ publication = defaultPublication } = {}) {
  return `
  DROP PUBLICATION IF EXISTS ${publication};
`;
}

export function createSubscription({
  subscription = defaultSubscription,
  host,
  database,
  user,
  password,
  publication = defaultPublication,
} = {}) {
  return `
    CREATE SUBSCRIPTION ${subscription}
    CONNECTION 'host=${host} dbname=${database} user=${user} password=${password}'
    PUBLICATION ${publication}
    WITH (enabled = false);
  `;
}

export function dropSubscription({ subscription = defaultSubscription } = {}) {
  return `
    DROP SUBSCRIPTION IF EXISTS ${subscription};
  `;
}

export function enableSubscription({
  subscription = defaultSubscription,
} = {}) {
  return `
    ALTER SUBSCRIPTION ${subscription} enable;
  `;
}

export function disableSubscription({
  subscription = defaultSubscription,
} = {}) {
  return `
    ALTER SUBSCRIPTION ${subscription} disable;
  `;
}
