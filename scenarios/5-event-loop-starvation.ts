// Scenario 5: Event loop starvation
// Difficulty: Hard · Event loop

export function heavyTask() {
  while (true) {
    // CPU-intensive operation
  }
}

export function runEventLoopStarvation() {
  setTimeout(() => {
    console.log("Timer executed");
  }, 100);
  heavyTask();
}

if (require.main === module) {
  runEventLoopStarvation();
}

