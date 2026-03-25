export default async function globalSetup() {
  const BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001';
  console.log(`\n🧪 Running API tests against: ${BASE_URL}/api\n`);
}
