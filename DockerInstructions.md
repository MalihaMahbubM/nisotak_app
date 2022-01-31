# Instructions:

## Run with Docker compose

1. Navigate to the project's root folder
2. Make sure that the directory "Media" exists there.
   - If it doesn't, create it.
3. Make sure the .env file is available and updated for the desired build (development vs production) in...
   - `nisotak-project/.env`
4. Build and run the entire project: docker-compose up -d
5. Stop
   - Keeping containers: docker-compose stop
   - Removing containers: docker-compose down

The docker-compose and Dockerfiles are fully working to set up a development environment. For deployment in a production environment though, some configuration changes are required.

# .env file:

A .env file is expected to exist in the project's root directory - as mentioned above - containing the following variables:

```sh
MONGO_URI=MONGO_URI=mongodb://mongotak:27017/nisotakApp # Or other connection string.
ACCESS_CONTROL_URI=http://HOST:5000/accessControlService
CONTENT_PAGE_URI=http://HOST:5002/contentPageService
LESSON_URI=http://HOST:5001/lessonService
TEXT_CONTENT_URI=http://HOST:5004/textContentService
PHRASE_URI=http://HOST:5003/phraseService
MCQUESTION_URI=http://HOST:5005/mcQuestionService
JWT_SECRET=#<The JSON Web Token secret shared by all the services for user authorization>
```

Important: For the current docker-compose configuration, the <HOST> is the service's container name since they're deployed within the same network. Should this change for any reason, the links must be updated.


