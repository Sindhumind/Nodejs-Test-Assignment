// Scenario 3: Promise.all silently creates partial failure
// Difficulty: Hard · Promise handling

import axios from "axios";

export async function fetchUser(id: number | string) {
  const response = await axios.get(`http://localhost:4004/users/${id}`);
  return response.data;
}

export async function processUsers() {
  const results = await Promise.all([
    fetchUser(1),
    fetchUser(2),
    fetchUser(3),
  ]);
  return results;
}

if (require.main === module) {
  processUsers().catch(console.error);
}

