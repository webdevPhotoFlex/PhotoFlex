class WorkerMock {
  constructor() {
    this.onmessage = null;
    this.eventListeners = {
      message: [],
    };
  }

  addEventListener(type, callback) {
    if (this.eventListeners[type]) {
      this.eventListeners[type].push(callback);
    }
  }

  removeEventListener(type, callback) {
    if (this.eventListeners[type]) {
      this.eventListeners[type] = this.eventListeners[type].filter(
        (listener) => listener !== callback
      );
    }
  }

  postMessage(message) {
    if (this.eventListeners.message) {
      this.eventListeners.message.forEach((listener) =>
        listener({ data: message })
      );
    }

    if (this.onmessage) {
      this.onmessage({ data: message });
    }
  }

  terminate() {}
}

module.exports = WorkerMock;
