# Test_Tasks Back End Viso
## Description:
This project serves as the back end for a test task. It provides various API endpoints for managing. The application is built using NestJS, a powerful framework for building scalable and maintainable
server-side applications.
I used for check on this endpoint- http://localhost:3000/.

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
prisma migrate dev --name customer-email

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
## For local testing WS:
### Load library to front end page:
```
const script = document.createElement('script');
script.src = "https://cdn.socket.io/4.0.1/socket.io.min.js";
script.onload = () => {
   console.log('Socket.IO loaded');
};
document.head.appendChild(script);
```

### Start soketIo conection on front in dev tools before send post request:
```
const socket = io('http://localhost:3000');

socket.on('connect', () => {
   console.log('WebSocket connection established:', socket.id);
});

socket.on('message', (data) => {
   console.log('Message from server:', data);
});

socket.on('error', (err) => {
   console.error('WebSocket error:', err);
});

socket.on('disconnect', () => {
   console.log('WebSocket disconnected');
});
```

### Send post request and you can see WS conection in console:
```
fetch('http://localhost:3000/rows/create', {
    method: 'POST',  
    headers: {
        'Content-Type': 'application/json'  
    },
    body: JSON.stringify({
        row_sheets: "1",
        column_sheets: "B",
        text: "WEBSOKET Info Test"
    }) 
})
.then(response => response.json()) 
.then(data => console.log('Success:', data)) 
.catch(error => console.error('Error:', error)); 

```
