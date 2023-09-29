import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient() // always use only one PrismaClient for all the connections

enum PrismaAction {
    'CREATE',
    'READ',
    'DELETE',
    'DELETE_MANY',
    'CREATE_MANY',
    'CREATE_OR_CONNECT',
    'FIND_UNIQUE',
    'FIND_UNIQUE_2',
    'FIND_FIRST',
    'FIND_MANY',
    'FIND_MANY_2',
    'FIND_MANY_3',
    'FIND_MANY_4',
    'UPDATE_1',
    'UPDATE_2',
    'UPDATE_3',
    'UPDATE_4',
    'UPDATE_MANY_1',
    'UPDATE_DISCONNECT_RECONNECT'
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
        case PrismaAction.DELETE: {
            // delete everything
            await prisma.userPreference.deleteMany()
            await prisma.post.deleteMany()
            await prisma.user.deleteMany()

            // create new user
           await main(PrismaAction.CREATE)

           const user = await prisma.user.findUnique({
            where: {
                email: "vojta@gmail.com",
            }
           })

           // delete relation field - userPreference
           const deleteUserPreference = prisma.userPreference.deleteMany({where: {
            userId: user?.id
           }})

           // delete relation field - posts
           const deletePosts = prisma.post.deleteMany({where: {
            authorId: user?.id
           }})

           // delete the user
           const deleteUser = prisma.user.delete({
            where: {
                id: user?.id
            }
           })

           return await prisma.$transaction([deleteUserPreference, deletePosts, deleteUser])
        }
        case PrismaAction.DELETE_MANY:
            // create new user
            await main(PrismaAction.CREATE_MANY)
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
        case PrismaAction.CREATE_OR_CONNECT:
            // delete everything
            await prisma.userPreference.deleteMany()
            await prisma.post.deleteMany()
            await prisma.user.deleteMany()

            // create new user
            return await prisma.user.create({
                include: {
                    writtenPosts: {
                      include: {
                        categories: true,
                      },
                    },
                  },
                data: {
                    name: 'Jim',
                    age: 38,
                    email: 'jim@carrey.com',
                    userPreference: {
                        create: {
                            emailUpdates: false,
                            preferences: {
                                foods: ['burger'],
                                movies: ['Manhunt']
                            }
                        }
                    },
                    writtenPosts: {
                        create: [
                            {
                                title: 'First Post',
                                text: 'My first post eveeer',
                                createdAt: new Date(),
                                updatedAt: new Date(),
                                categories: {
                                    connectOrCreate: [
                                        {
                                            create: {
                                                name: 'Intro'
                                            },
                                            where: {
                                                name: 'Intro'
                                            }
                                        },
                                        {
                                            create: {
                                                name: 'Math'
                                            },
                                            where: {
                                                name: 'Math'
                                            }
                                        }
                                    ]
                                }
                            },
                            {
                                title: 'Initial Post',
                                text: 'My initial post',
                                createdAt: new Date(),
                                updatedAt: new Date(),
                                categories: {
                                    connectOrCreate: [
                                        {
                                            create: {
                                                name: 'Intro'
                                            },
                                            where: {
                                                name: 'Intro'
                                            }
                                        },
                                        {
                                            create: {
                                                name: 'Finance'
                                            },
                                            where: {
                                                name: 'Finance'
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                }
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
                // where: {
                //     NOT: {
                //         email: { endsWith: '@gmail.com' }
                //     }
                // },
                distinct: ["name", "age"],
                // take: 2, // pagination
                // skip: 1, // will skip first N-count
                // cursor: // LastEvaluatedKey in dynamoDB but you have to create it manually - take unique prop - id / unique field of the last returned item, always works with take 
                orderBy: {
                    age: 'desc'
                }
            })
        case PrismaAction.FIND_MANY_3:
            // delete everything
            await prisma.userPreference.deleteMany()
            await prisma.post.deleteMany()
            await prisma.user.deleteMany()

            // create new user
            await main(PrismaAction.CREATE)
            await prisma.user.createMany({
                data: [
                    {
                        name: 'Vojta',
                        age: 29,
                        email: "vojta29@gmail.com",
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
                where: {
                    userPreference: {
                        AND: [
                            {
                                emailUpdates: true,
                                preferences: {
                                    path: ['foods'],
                                    array_contains: ['healthy foods', 'pizza']
                                }
                            }
                        ],
                    },
                    favoritePosts: {
                        every: { // none, every or some will always return when favoritePosts is an empty array
                            text: {
                                contains: 'BLE-BLE-BLE'
                            }
                        }
                    }
                },
                include: {
                    userPreference: true
                }
            })
        case PrismaAction.FIND_MANY_4:
            // delete everything
            await prisma.userPreference.deleteMany()
            await prisma.post.deleteMany()
            await prisma.user.deleteMany()

            // create new user
            await main(PrismaAction.CREATE)
            await prisma.user.createMany({
                data: [
                    {
                        name: 'Vojta',
                        age: 29,
                        email: "vojta29@gmail.com",
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

            return await prisma.post.findMany({
                where: {
                    author: {
                        age: { gt: 20 },
                        name: {
                            startsWith: 'V'
                        }
                    }
                }
            })
        case PrismaAction.UPDATE_1:
            // delete everything
            await prisma.userPreference.deleteMany()
            await prisma.post.deleteMany()
            await prisma.user.deleteMany()

            // create new user
            await main(PrismaAction.CREATE)

            return await prisma.user.update({
                where: {
                    email: 'vojta@gmail.com'
                },
                data: {
                    name: 'Vojta Kaiser',
                    age: {
                        increment: 3
                    }
                }
            })
        case PrismaAction.UPDATE_2: {
            // delete everything
            await prisma.userPreference.deleteMany()
            await prisma.post.deleteMany()
            await prisma.user.deleteMany()

            // create new users
            await main(PrismaAction.CREATE)
            const postAuthor = await prisma.user.create({
                data: {
                    name: 'Ben',
                    age: 50,
                    email: 'bigben@gmail.com',
                    writtenPosts: {
                        create: {
                            title: 'Favorited Post',
                            text: 'I am so famous and favorited by many',
                            createdAt: new Date(),
                            updatedAt: new Date()
                        }
                    }
                }
            })

            return await prisma.user.update({
                where: {
                    email: 'vojta@gmail.com'
                },
                data: {
                    favoritePosts: {
                        create: {
                            title: 'Favorited Post',
                            text: 'I am so famous and favorited by many',
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            authorId: postAuthor.id
                        }
                    }
                },
                include: {
                    favoritePosts: true
                }
            })
        }
        case PrismaAction.UPDATE_3: {
            // delete everything
            await prisma.userPreference.deleteMany()
            await prisma.post.deleteMany()
            await prisma.user.deleteMany()

            // create new user
            await main(PrismaAction.CREATE)

            const author = await prisma.user.findUnique({
                where: {
                    email: 'vojta@gmail.com'
                },
                select: {
                    writtenPosts: true
                }
            })

            // create new post

            return await prisma.user.update({
                where: {
                    email: 'vojta@gmail.com'
                },
                data: {
                    favoritePosts: {
                        connect: {
                            id: author?.writtenPosts[0].id,
                        }
                    }
                },
                include: {
                    writtenPosts: true,
                    favoritePosts: true
                }
            })
        }
        case PrismaAction.UPDATE_4: {
            // delete everything
            await prisma.userPreference.deleteMany()
            await prisma.post.deleteMany()
            await prisma.user.deleteMany()

            // create new user
            await main(PrismaAction.CREATE)

            const author = await prisma.user.findUnique({
                where: {
                    email: 'vojta@gmail.com'
                },
                select: {
                    writtenPosts: true
                }
            })

            // create new post

            return await prisma.user.update({
                where: {
                    email: 'vojta@gmail.com'
                },
                data: {
                    favoritePosts: {
                        connect: {
                            id: author?.writtenPosts?.[0].id,
                        }
                    }
                },
                include: {
                    writtenPosts: true,
                    favoritePosts: true
                }
            })
        }
        case PrismaAction.UPDATE_MANY_1:
            // delete everything
            await prisma.userPreference.deleteMany()
            await prisma.post.deleteMany()
            await prisma.user.deleteMany()

            // create new user
            await prisma.user.createMany({
                data: [
                    {
                        name: 'Vojta',
                        age: 28,
                        email: "vojta29@gmail.com",
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

            return await prisma.user.updateMany({
                where: {
                    email: { contains: 'vojta' },
                    name: 'Vojta',
                    age: {
                        gt: 28
                    }
                },
                data: {
                    role: 'ADMIN',
                    email: 'vojta@admin.com'
                }
            })
        case PrismaAction.UPDATE_DISCONNECT_RECONNECT: {
            // this will not work when the relations are mandatory. Switch to optional to test this feature.
            // delete everything
            await prisma.userPreference.deleteMany()
            await prisma.post.deleteMany()
            await prisma.user.deleteMany()

            // create new users
            await main(PrismaAction.CREATE)
            const userJoe = await prisma.user.create({
                data: {
                    name: 'Joe',
                    age: 65,
                    email: 'joe@gmail.com',
                    writtenPosts: {
                        create: {
                            title: 'Joes Post',
                            text: 'This is my first post, my friends',
                            createdAt: new Date(),
                            updatedAt: new Date()
                        }
                    }
                },
                include: {
                    writtenPosts: true
                }
            })

            const [disconnectedUser1, disconnectedUser2] = await Promise.all([
                prisma.user.update({
                    where: {
                        email: 'vojta@gmail.com'
                    },
                    data: {
                        userPreference: {
                            disconnect: true
                        }
                    },
                    include: {
                        userPreference: true
                    }
                }),
                prisma.user.update({
                    where: {
                        email: 'joe@gmail.com'
                    },
                    data: {
                        writtenPosts: {
                            disconnect: {
                                id: userJoe.writtenPosts[0].id
                            }
                        }
                    },
                    include: {
                        writtenPosts: true
                    }
                })
            ])

            console.log('disconnectedUser1', disconnectedUser1)
            console.log('disconnectedUser2', disconnectedUser2)

            const disconnectedUserPreference = await prisma.userPreference.findFirst({
                where: {
                    emailUpdates: true,
                    preferences: {
                        path: ['foods'],
                        array_contains: ['burger', 'pizza', 'healthy foods']
                    }
                }
            })

            console.log('disconnectedUserPreference', disconnectedUserPreference)

            return await Promise.all([
                prisma.user.update({
                    where: {
                        email: 'vojta@gmail.com'
                    },
                    data: {
                        userPreference: {
                            connect: {
                                id: disconnectedUserPreference?.id
                            }
                        }
                    },
                    include: {
                        userPreference: true
                    }
                }),
                prisma.user.update({
                    where: {
                        email: 'joe@gmail.com'
                    },
                    data: {
                        writtenPosts: {
                            connect: {
                                id: userJoe.writtenPosts[0].id
                            }
                        }
                    },
                    include: {
                        writtenPosts: true
                    }
                })
            ])
        }
    }
}

main(PrismaAction.DELETE).then((resp) => console.log('success', resp)).catch(err => console.log('error', err)).finally(() => prisma.$disconnect())
