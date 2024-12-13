# Test_Tasks Back End Viso
## Description:
This project serves as the back end for a test task. It provides various API endpoints for managing. The application is built using NestJS, a powerful framework for building scalable and maintainable
server-side applications.
I used for check on this endpoint- http://localhost:3008/.

## Installation:
Before running the application, create a .env file with the necessary environment variables, as specified in the sample
file. Then, install the dependencies and start the application:
```
yarn install

nest start --watch
```
## Creating an Initial Migration:
To create an initial migration, execute the following command:
For create empty migration for handler contains execute next command:
```
yarn prisma generate
prisma db push

```
This will generate a new migration file in the "migrations" directory named {TIMESTAMP}_name_of_migration. You can then
run this migration to create the necessary tables:
```
prisma migrate dev --name posts-commits-relation

```
Applying Migrations:
Apply the migrations and create the tables in the database, execute in automatically if deployed all project in hosting :
```
npx prisma migrate deploy
```
Reverting Migrations:
If needed, you can revert the migrations and remove the tables by running:
```
prisma  migrate diff 
```

forGoogl() {
!(function onEdit(e) {
console.log('range-',e.range.getA1Notation());
console.log('values-',e.range.getValues());

         const url = "https://viso-nest-googl.onrender.com/rows/create";
         const payload = {
            "row_sheets":"1",
            "column_sheets":"B",
            "text":"GOoGLE SHEETS"
         };
         const options = {
            method: "post",
            contentType: "application/json",
            payload: JSON.stringify(payload),
         };
         UrlFetchApp.fetch(url, options);
      })()


}