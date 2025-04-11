import { faker } from "@faker-js/faker";
import { type Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clear existing data (optional)
  // await prisma.like.deleteMany({});
  // await prisma.comment.deleteMany({});
  // await prisma.article.deleteMany({});
  // await prisma.user.deleteMany({});

  // Create users
  const usersToCreate = 20;

  // Insert users into the database
  const createdUsers: Prisma.UserUpdateInput & { id: number }[] = [];
  for (let i = 0; i < usersToCreate; i++) {
    const user = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        name: faker.person.fullName(),
        password: faker.internet.password(),
      },
    });
    createdUsers.push(user);
  }

  // Create articles
  const articlesCount = 50;
  const createdArticles: Prisma.ArticleUpdateInput & { id: number }[] = [];

  for (let i = 0; i < articlesCount; i++) {
    const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];

    const article = await prisma.article.create({
      data: {
        title: faker.lorem.sentence({ min: 3, max: 8 }),
        content: faker.lorem.paragraphs({ min: 5, max: 10 }),
        authorId: randomUser.id,
      },
    });

    createdArticles.push(article);
  }

  // Create comments
  const commentsCount = 120;

  for (let i = 0; i < commentsCount; i++) {
    const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
    const randomArticle = createdArticles[Math.floor(Math.random() * createdArticles.length)];

    await prisma.comment.create({
      data: {
        content: faker.lorem.paragraph(),
        authorId: randomUser.id,
        articleId: randomArticle.id,
      },
    });
  }

  // Create likes (ensuring unique user-article combinations)
  const likesCount = 200;
  const likeSet = new Set();

  for (let i = 0; i < likesCount; i++) {
    const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
    const randomArticle = createdArticles[Math.floor(Math.random() * createdArticles.length)];

    // Create a unique key to prevent duplicate likes
    const likeKey = `${randomUser.id}-${randomArticle.id}`;

    if (!likeSet.has(likeKey)) {
      likeSet.add(likeKey);

      try {
        await prisma.like.create({
          data: {
            userId: randomUser.id,
            articleId: randomArticle.id,
          },
        });
      } catch (error) {
        // Skip duplicates if they somehow occur despite our check
        // biome-ignore lint/correctness/noUnnecessaryContinue: <explanation>
        continue;
      }
    }
  }

  // biome-ignore lint/suspicious/noConsole: <explanation>
  console.log(`Database has been seeded with:
  - ${usersToCreate} users
  - ${articlesCount} articles
  - ${commentsCount} comments
  - ${likeSet.size} likes`);
}

main()
  .catch((e) => {
    // biome-ignore lint/suspicious/noConsole: <explanation>
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // Close Prisma client connection
    await prisma.$disconnect();
  });
