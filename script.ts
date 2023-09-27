import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

enum PrismaAction {
    'CREATE' = 1,
    'READ' = 2,
    'DELETE' = 3
}

async function main(action: PrismaAction) {
    switch (action) {
        case PrismaAction.CREATE:
            return await prisma.user.create({
                data: {
                    name: 'Vojta',
                    age: 28,
                    email: "vojta@gmail.com",
                    isAdmin: true
                }
            })
        case PrismaAction.READ:
            return await prisma.user.findMany()
        case PrismaAction.DELETE:
            return await prisma.user.deleteMany()
    }
}

main(PrismaAction.DELETE).then((resp) => console.log('success', resp)).catch(err => console.log('error', err)).finally(() => prisma.$disconnect())
