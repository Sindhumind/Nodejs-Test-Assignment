// Scenario 4: TypeScript type safety disappears at runtime
// Difficulty: Hard · Type system

export interface User {
  id: number;
  name: string;
}

export function runTypeSafetyScenario() {
  const user = JSON.parse('{"id":"101","name":null}') as User;
  console.log(user.id.toFixed(2));
  console.log(user.name.toUpperCase());
  return user;
}

if (require.main === module) {
  try {
    runTypeSafetyScenario();
  } catch (error) {
    console.error("Runtime error caught:", error);
  }
}

