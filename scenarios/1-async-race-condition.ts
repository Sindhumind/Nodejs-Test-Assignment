// Scenario 1: Async race condition — stale API response
// Difficulty: Hard · Concurrency

let user: any = null;

export async function loadUser(id: string | number) {
  const response = await fetch(`http://localhost:4004/users/${id}`);
  user = await response.json();
  return user;
}

export function getCurrentUser() {
  return user;
}

if (require.main === module) {
  loadUser(1);
  loadUser(2);
}

