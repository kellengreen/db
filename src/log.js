export default function log(action, success, errors, error) {
  process.stdout.clearLine(0);
  process.stdout.clearLine(0);
  process.stdout.clearLine(0);
  process.stdout.clearLine(0);
  process.stdout.clearLine(0);

  process.stdout.write(`\n`);
  process.stdout.write(`${action}\n`);
  process.stdout.write(`Time\t\t${new Date().toISOString()}\n`);
  process.stdout.write(`Success\t\t${success}\n`);
  process.stdout.write(`Errors:\t\t${errors}\n`);
  process.stdout.write(`Current Error:\t${error?.message ?? "None"}`);

  process.stdout.moveCursor(0, -5);
  process.stdout.cursorTo(0);
}
