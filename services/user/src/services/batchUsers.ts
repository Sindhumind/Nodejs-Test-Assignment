// Bug: Promise.all silently creates partial failure
import axios from "axios";

export async function fetchUser(id: string | number) {
  const response = await axios.get(`http://localhost:4004/users/${id}`);
  return response.data;
}

export async function processUsers(ids: (string | number)[] = [1, 2, 3]) {
  const results = await Promise.all([
    fetchUser(ids[0]),
    fetchUser(ids[1]),
    fetchUser(ids[2]),
  ]);
  return results;
}

