import { db } from "../src/infrastructure/db/client";
import { projects } from "../src/infrastructure/db/schema/projects";

async function main() {
  console.log("Querying database projects...");
  try {
    const list = await db.select().from(projects);
    console.log(`Found ${list.length} projects:`);
    list.forEach((p) => {
      console.log({
        id: p.id,
        title: p.title,
        slug: p.slug,
        category: p.category,
        coverImage: p.coverImage,
        status: p.status,
      });
    });
  } catch (error) {
    console.error("DB Query failed:", error);
  }
  process.exit(0);
}

main();
