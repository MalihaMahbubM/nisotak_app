function MCQuestionParser(url) {
  let brokenUrl = url.split("/");
  let questionid = brokenUrl[brokenUrl.length - 1];
  let lessonid = brokenUrl[brokenUrl.length - 3];

  return {
    question_id: questionid,
    lesson_id: lessonid,
  };
}

function TextContentParser(url) {
  const ids = breakContentPageLevelURL(url);

  return {
    contentPage_id: ids.contentPage_id,
    lesson_id: ids.lesson_id,
    text_id: ids.elementid,
  };
}

function PhraseContentParser(url) {
  const ids = breakContentPageLevelURL(url);

  return {
    contentPage_id: ids.contentPage_id,
    lesson_id: ids.lesson_id,
    phrase_id: ids.elementid,
  };
}

function ContentPageParser(url) {
  let brokenUrl = url.split("/");
  let contentPage_id = brokenUrl[brokenUrl.length - 1];
  let lessonid = brokenUrl[brokenUrl.length - 3];

  return {
    contentPage_id: contentPage_id,
    lesson_id: lessonid,
  };
}

function breakContentPageLevelURL(url) {
  let brokenUrl = url.split("/");
  let elementid = brokenUrl[brokenUrl.length - 1];
  let contentPageid = brokenUrl[brokenUrl.length - 3];
  let lessonid = brokenUrl[brokenUrl.length - 5];

  return {
    contentPage_id: contentPageid,
    lesson_id: lessonid,
    elementid: elementid,
  };
}

function LessonPageParser(url) {
  let brokenUrl = url.split("/");
  let lessonid = brokenUrl[brokenUrl.length - 1];

  return {
    lesson_id: lessonid,
  };
}

export default {
  MCQuestionParser,
  TextContentParser,
  PhraseContentParser,
  ContentPageParser,
  LessonPageParser,
};
