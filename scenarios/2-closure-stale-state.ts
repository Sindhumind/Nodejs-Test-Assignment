// Scenario 2: Closure and stale state in asynchronous callbacks
// Difficulty: Hard · Closures

let count = 0;

export function incrementLater() {
  setTimeout(() => {
    count++;
    console.log(count);
  }, 1000);
}

export function getCount() {
  return count;
}

if (require.main === module) {
  incrementLater();
  incrementLater();
  incrementLater();
}

