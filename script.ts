import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient() // always use only one PrismaClient for all the connections

enum PrismaAction {
    'CREATE',
    'READ',
    'DELETE',
    'CREATE_MANY',
    'FIND_UNIQUE',
    'FIND_UNIQUE_2',
    'FIND_FIRST',
    'FIND_MANY',
    'FIND_MANY_2'
}

async function main(action: PrismaAction) {
    switch (action) {
        case PrismaAction.CREATE:
            await prisma.userPreference.deleteMany()
            await prisma.post.deleteMany()
            await prisma.user.deleteMany()
            return await prisma.user.create({
                data: {
                    name: 'Vojta',
                    age: 28,
                    email: "vojta@gmail.com",
                    userPreference: {
                        create: {
                            emailUpdates: true,
                            preferences: {
                                movies: ['Wolf of Wall Street', 'Titanic'],
                                foods: ['pizza', 'burger', 'healthy foods']
                            }
                        }
                    },
                    writtenPosts: {
                        create: {
                            title: 'title of the post',
                            text: 'text of the post',
                            createdAt: new Date(),
                            updatedAt: new Date()
                        } 
                    }
                },
                select: {
                    id: true,
                    name: true,
                    userPreference: {
                        select: {
                            preferences: true
                        }
                    },
                    writtenPosts: true
                }
            })
        case PrismaAction.READ:
            return await prisma.user.findMany()
        case PrismaAction.DELETE:
            return await prisma.user.deleteMany()
        case PrismaAction.CREATE_MANY:
            await prisma.userPreference.deleteMany()
            await prisma.post.deleteMany()
            await prisma.user.deleteMany()
            return await prisma.user.createMany({
                data: [
                    {
                        name: 'Ivan',
                        age: 40,
                        email: 'ivan@gmail.com',

                    },
                    {
                        name: 'Ivan',
                        age: 40,
                        email: 'ivan@gmail.com',
                        
                    },
                    {
                        name: 'Adminus Admarius',
                        age: 999,
                        email: 'admin@admin.admin',
                        role: 'ADMIN'
                    }
                ],
                skipDuplicates: true
            })
        case PrismaAction.FIND_UNIQUE:
            // delete everything
            await prisma.userPreference.deleteMany()
            await prisma.post.deleteMany()
            await prisma.user.deleteMany()

            // create new user
            await main(PrismaAction.CREATE)

            return await prisma.user.findUnique({
                where: {
                    email: 'vojta@gmail.com',
                    OR: [
                        {
                            age: { lt: 28 }
                        },
                        {
                            name: { startsWith: 'V' }
                        }
                    ]
                },
                include: {
                    userPreference: true,
                    favoritePosts: true,
                    writtenPosts: true
                }
            })
        case PrismaAction.FIND_UNIQUE_2:
            // delete everything
            await prisma.userPreference.deleteMany()
            await prisma.post.deleteMany()
            await prisma.user.deleteMany()

            // create new user
            await main(PrismaAction.CREATE)

            return await prisma.user.findUnique({
                where: {
                    name_age: {
                        name: 'Vojta',
                        age: 28
                    }
                },
                include: {
                    userPreference: true,
                    favoritePosts: true,
                    writtenPosts: true
                }
            })
        case PrismaAction.FIND_FIRST:
            // delete everything
            await prisma.userPreference.deleteMany()
            await prisma.post.deleteMany()
            await prisma.user.deleteMany()

            // create new user
            await main(PrismaAction.CREATE)

            return await prisma.user.findFirst({
                where: {
                    name: 'Vojta'
                },
                select: {
                    email: true,
                    userPreference: true
                }
            })
        case PrismaAction.FIND_MANY:
            // delete everything
            await prisma.userPreference.deleteMany()
            await prisma.post.deleteMany()
            await prisma.user.deleteMany()

            // create new user
            await main(PrismaAction.CREATE_MANY)

            return await prisma.user.findMany({
                where: {
                    role: 'ADMIN'
                },
                include: {
                    userPreference: true,
                    favoritePosts: true,
                    writtenPosts: true
                }
            })
        case PrismaAction.FIND_MANY_2:
            // delete everything
            await prisma.userPreference.deleteMany()
            await prisma.post.deleteMany()
            await prisma.user.deleteMany()

            // create new user
            await main(PrismaAction.CREATE_MANY)
            await prisma.user.createMany({
                data: [
                    {
                        name: 'Vojta',
                        age: 28,
                        email: "vojta@gmail.com",
                    },
                    {
                        name: 'Vojta',
                        age: 40,
                        email: "vojta40@gmail.com",
                    },
                    {
                        name: 'Vojta',
                        age: 13,
                        email: "vojta13@gmail.com",
                    }
                ]
            })

            return await prisma.user.findMany({
                // where: {
                //     AND: [
                //         {
                //             email: { endsWith: '@gmail.com' },
                //             name: { in: ['Vojta', 'Peter'] }
                //         },
                //         {
                //             email: { contains: 'vojta' }
                //         },
                //     ]
                // },
                // where: {
                //     OR: [
                //         {
                //             email: { endsWith: '@gmail.com' }
                //         },
                //         {
                //             email: { contains: 'vojta' }
                //         },
                //     ]
                // },
                where: {
                    NOT: {
                        email: { endsWith: '@gmail.com' }
                    }
                },
                distinct: ["name", "age"],
                // take: 2, // pagination
                // skip: 1, // will skip first N-count
                // cursor: // LastEvaluatedKey in dynamoDB but you have to create it manually - take unique prop - id / unique field of the last returned item, always works with take 
                orderBy: {
                    age: 'desc'
                }
            })
    }
}

main(PrismaAction.FIND_MANY_2).then((resp) => console.log('success', resp)).catch(err => console.log('error', err)).finally(() => prisma.$disconnect())
