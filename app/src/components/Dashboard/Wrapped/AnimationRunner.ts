export class AnimationRunner {
  counter: number = 0;

  isActive: boolean = false;

  events: Map<number, () => void> = new Map();

  durationInSecs: number = 10;

  tickListener?: (arg0: number) => void = () => {};

  existingTimeout?: NodeJS.Timeout;

  constructor(durationInSecs: number, tickListener?: (arg0: number) => void) {
    this.tickListener = tickListener;
    this.counter = 0;
    this.events = new Map();
    this.durationInSecs = durationInSecs;
  }

  start() {
    if (this.existingTimeout) {
      clearTimeout(this.existingTimeout);
    }
    this.isActive = true;
    this.tick();
  }

  pause() {
    this.isActive = false;
  }

  addEvent(time: number, callback: () => void) {
    this.events.set(time, callback);
  }

  reset() {
    this.counter = 0;
  }

  tick() {
    this.existingTimeout = setTimeout(() => {
      if (this.counter >= this.durationInSecs * 1000) {
        this.isActive = false;
      }

      if (this.isActive) {
        this.counter += 100;

        const possibleEvent = this.events.get(this.counter);
        if (possibleEvent) {
          possibleEvent();
        }

        if (this.counter % 1000 === 0 && this.tickListener) {
          this.tickListener(this.counter);
        }

        this.tick();
      }
    }, 100);
  }
}
