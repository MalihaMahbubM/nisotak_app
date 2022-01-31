# Nisotak Project

This repo contains all the microservices and the author tool front-end required to run the Nisotak Author Tool solution.

Nisotak Author Tool was developed to offer a simple and easy way for content creators to add and update lessons, that will then be served to the learner interface.

For more detailed information, please refer to Nisotak.pdf

# File structure

## /author-tool-app

- Front-end tool
- Built in React.js

## /microservices

- Access Control:
  - Handles: Authentication and auhtorization
  - Uses Json Web tokens (JWT)
- Activities -> Multiple Choice Question:
  - A "quiz" type of question
- Content Pages:
  - Handles: A variety of pages of the following page types
  - Pages: The parent type which holds zero or more pages of types below
  - Phrases: Indigenous language phrases
  - Text: Text content
- Lessons: Composed by content pages and activities

- Helper:
  - NOT A MICROSERVICE
  - Holds functions used and shared by some microservices

## /batch

Scripts to automate running a local dev environment for the entire project (all microservices + author-tool) - see more in "Running the project"

## /Media

This folder is not part of the project but will be created as soon as a file is uploaded to your locally run instance of the project. This is the folder where any uploaded media is stored.

## Nisotak.postman_collection.json

Microservices' API calls that can be imported to Postman.

# Running the project

#### To Access the Development Server:
1. Login to `tuxworld.usask.ca`
2. ssh into `nisotak.usask.ca` with the follwing credentials:
    - **username**: `nisotak_admin`
    - **password**: `kikihk`
3. Here you will find the project located at `/var/www/nisotak-project`

**NOTE**: Because the repository has migrated, a new remote url will likely need to be set on the repository.

## Locally

- Every microservice folder must have a .env file following modelEnv.md
- Run batch/runAllMicroservices-DEV.bat
  - Basically it perform two commands for each microservice: npm install & nodemon server

## Docker

Please, refer to DockerInstructions.md

## Service file

All microservices contain a .service file that is used to setup a Linux prod environment (legacy version prior docker implementation)
