// Bug: TypeScript type safety disappears at runtime
export interface User {
  id: number;
  name: string;
}

export function parseAndFormatExternalUser(
  rawJson: string = '{"id":"101","name":null}'
): User {
  const user = JSON.parse(rawJson) as User;
  console.log(user.id.toFixed(2));
  console.log(user.name.toUpperCase());
  return user;
}

