# prisma-fundamentals
Playing around with Prisma ORM

# Setup a database
In this project I am working with PostgreSQL ORDBMS

# important Prisma commands
## creates prisma.schema file with a dummy connection to a postgresql database
- npx prisma init --datasource-provider postgresql
## format prisma.schema file
- npx prisma format
## create a migration script from prisma.schema and run it against the database
- npx prisma migrate dev --name init // init is a name of the folder where the migration 
## generate new Prisma client from prisma.schema
- npx prisma generate

