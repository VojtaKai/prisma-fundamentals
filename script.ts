import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

enum PrismaAction {
    'CREATE' = 1,
    'READ' = 2
}

async function main(action: PrismaAction) {
    switch (action) {
        case PrismaAction.CREATE:
            return await prisma.user.create({
                data: {
                    name: 'Vojta'
                }
            })
        case PrismaAction.READ:
            return await prisma.user.findMany()
    }
}

main(PrismaAction.READ).then((resp) => console.log('success', resp)).catch(err => console.log('error', err)).finally(() => prisma.$disconnect())
