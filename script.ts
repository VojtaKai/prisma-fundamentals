import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient() // always use only one PrismaClient for all the connections

enum PrismaAction {
    'CREATE' = 1,
    'READ' = 2,
    'DELETE' = 3,
    'CREATE_MANY' = 4
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
    }
}

main(PrismaAction.CREATE_MANY).then((resp) => console.log('success', resp)).catch(err => console.log('error', err)).finally(() => prisma.$disconnect())
