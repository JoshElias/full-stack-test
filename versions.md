1. Backend is using Node.js, Database is using MongoDB, REST call is using JavaScript fetch.

2. jQuery library is loaded, simply because I used Boostrap which requires jQuery. It is not used for other purposes.

3. JWT is stored in cookie (can be in headers too) and is used together with Passport.js for authentication

4. View engine Pug is used

5. A to-be-created or to-be-updated album with the same title and genre as an existing one is considered duplication, and will not be saved. 
