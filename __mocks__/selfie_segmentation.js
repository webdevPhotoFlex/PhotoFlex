export class SelfieSegmentation {
  constructor() {
    this.onResults = jest.fn();
  }

  setOptions() {}

  send() {
    setTimeout(() => {
      this.onResults({
        segmentationMask: {
          width: 300,
          height: 300,
        },
      });
    }, 0);
  }
}
