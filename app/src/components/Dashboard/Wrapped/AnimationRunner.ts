export class AnimationRunner {
  counter: number = 0;

  isActive: boolean = false;

  events: Map<number, () => void> = new Map();

  tickListener?: (arg0: number) => void = () => {};

  constructor(tickListener?: (arg0: number) => void) {
    this.tickListener = tickListener;
  }

  start() {
    this.isActive = true;
    this.tick();
  }

  pause() {
    this.isActive = false;
  }

  addEvent(time: number, callback: () => void) {
    this.events.set(time, callback);
  }

  tick() {
    setTimeout(() => {
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
