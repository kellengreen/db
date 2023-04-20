export default class Logger {
  constructor(title) {
    this.title = title;
    this.outageLast = 0;
    this.outageTotal = 0;
    this.lineCount = 0;
  }

  log(data) {
    if (data instanceof Error) {
      const now = Date.now();
      if (this.outageLast !== 0) {
        this.outageTotal += now - this.outageLast;
      }
      this.outageLast = now;
    } else {
      this.outageLast = 0;
    }
    this.resetLines();
    this.writeLine("");
    this.writeLine(`Action:          ${this.title}`);
    this.writeLine(`Message:         ${data}`);
    this.writeLine(`Outage Duration: ${this.outageTotal / 1000}s`);
  }

  writeLine(message = "") {
    this.lineCount += 1;
    const [x] = process.stdout.getWindowSize();
    process.stdout.write(message.toString().slice(0, x) + "\n");
  }

  resetLines() {
    for (let i = 0; i < this.lineCount; i++) {
      process.stdout.moveCursor(0, -1);
      process.stdout.clearLine(0);
    }
    this.lineCount = 0;
  }
}
