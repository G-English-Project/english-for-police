import { initialLessons } from "../src/data/lesson/lessons.ts";

const response = await fetch("http://localhost:1600/api/v1/lessons");
const payload = await response.json();
const dbLessons = payload.data || [];

const issues = [];

const typeOf = (value) => {
  if (Array.isArray(value)) return "array";
  if (value === null) return "null";
  return typeof value;
};

const compare = (mockValue, dbValue, path) => {
  const mockType = typeOf(mockValue);
  const dbType = typeOf(dbValue);
  if (mockType !== dbType) {
    issues.push(`${path}: type ${mockType} != ${dbType}`);
    return;
  }

  if (mockType === "array") {
    if (mockValue.length === 0 || dbValue.length === 0) return;
    compare(mockValue[0], dbValue[0], `${path}[0]`);
    return;
  }

  if (mockType === "object") {
    const mockKeys = Object.keys(mockValue).sort();
    const dbKeys = Object.keys(dbValue).sort();
    const missingInDb = mockKeys.filter((k) => !dbKeys.includes(k));
    const extraInDb = dbKeys.filter((k) => !mockKeys.includes(k));

    if (missingInDb.length) {
      issues.push(`${path}: missing in db -> ${missingInDb.join(",")}`);
    }
    if (extraInDb.length) {
      issues.push(`${path}: extra in db -> ${extraInDb.join(",")}`);
    }

    for (const key of mockKeys) {
      if (key in dbValue) compare(mockValue[key], dbValue[key], `${path}.${key}`);
    }
  }
};

if (initialLessons.length !== dbLessons.length) {
  issues.push(`root: lesson count ${initialLessons.length} != ${dbLessons.length}`);
}

for (let i = 0; i < Math.min(initialLessons.length, dbLessons.length); i += 1) {
  compare(initialLessons[i], dbLessons[i], `lesson[${i}]`);
}

console.log(`LESSON_COUNT_MOCK=${initialLessons.length}`);
console.log(`LESSON_COUNT_DB=${dbLessons.length}`);
console.log(`ISSUE_COUNT=${issues.length}`);
if (issues.length) {
  console.log(issues.join("\n"));
}
