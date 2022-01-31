# DOCKER ENV:DEVELOPMENT

MONGO_URI=<your-mongo-instance>

ACCESS_CONTROL_URI=http://accesscontrol_service:5000/accessControlService

LESSON_URI=http://lessons_service:5001/lessonService

MCQUESTION_URI=http://multiple_choice_service:5005/mcQuestionService

CONTENT_PAGE_URI=http://content_page_service:5002/contentPageService

PHRASE_URI=http://phrases_service:5003/phraseService

TEXT_CONTENT_URI=http://text_service:5004/textContentService

# LOCAL ENV:DEVELOPMENT

MONGO_URI=<your-mongo-instance>

ACCESS_CONTROL_URI=http://localhost:5000/accessControlService

CONTENT_PAGE_URI=http://localhost:5002/contentPageService

LESSON_URI=http://localhost:5001/lessonService

TEXT_CONTENT_URI=http://localhost:5004/textContentService

PHRASE_URI=http://localhost:5003/phraseService

MCQUESTION_URI=http://localhost:5005/mcQuestionService

# Access Control Service ONLY

ENABLE_HELPER_ROUTE=false

# BOTH

JWT_SECRET=<your-JWT-secret>


```sh
#DEV
MONGO_URI=mongodb://nisotakUser:mongotak20User20@mongotak:27017/nisotakApp
ACCESS_CONTROL_URI=http://accesscontrol_service/accessControlService
CONTENT_PAGE_URI=http://content_page_service/contentPageService
LESSON_URI=http://lessons_service/lessonService
TEXT_CONTENT_URI=http://text_service/textContentService
PHRASE_URI=http://phrase_service/phraseService
MCQUESTION_URI=http://mcquestion_service/mcQuestionService

JWT_SECRET=777260d18cc010063ceaaa5c58b222ecbd750c0815b055e4e2a7e617870d3a2f
```