// Bug: Event loop starvation
export function heavyTask() {
  while (true) {
    // CPU-intensive operation
  }
}

export function triggerStarvation() {
  setTimeout(() => {
    console.log("Timer executed");
  }, 100);
  heavyTask();
}

