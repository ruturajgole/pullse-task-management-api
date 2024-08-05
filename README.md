# pullse task management api

## This is the back-end for the assessment by Pullse AI. 

## How to Run
1) Please ensure you have Node installed on your system. If not, please do so from https://nodejs.org/en.
2) Clone the project.
3) In the directory, please run "npm run build".
4) When that finishes, please run "npm start"

## Pros
1) Implemented Fastify and MongoDB packages to seamlessly interact with the MongoDB database and provide a comprehensible API for the same.
2) Performed proper authentication using JWT verification and error handling.
3) Structured the code in a simplified and efficied manner using routes.
4) Amended the response the data to suit the needs of the client.

## Cons
1) There is residual incorrect documentation at the time of this commit.
2) The connection string is currently hardcoded and environment variables should be used instead.
3) Hardcoded string literals are used in place of database names and collection names.
4) API does not cover all possibilities of an incorrect response. 
