const dateFns = require("date-fns");
const path = require("path");
const fs = require("fs-extra");
const log = require("signale");

const { getSlug, makeMatterByTagArr, createFrontMatter } = require("./utils");
const {
  ABSOLUTE_POST_DIR,
  DATE_FORMAT,
  DATE_FOLDER_FORMAT,
  DATE_POST_FILENAME_FORMAT,
} = require("./constants");
const {
  titlePrompt,
  categoryPrompt,
  tagsPrompt,
  descriptionPrompt,
  commentsFlagPrompt,
} = require("./prompts");

const completeLogPrint = (
  title,
  date,
  template,
  draft,
  slug,
  category,
  tags,
  description,
  comments,
  filePath
) => {
  log.note("title", title);
  log.note("date", date);
  log.note("template", template);
  log.note("draft", draft);
  log.note("slug", slug);
  log.note("category", category);
  log.note("tags", tags);
  log.note("description", description);
  log.note("comments", comments);

  log.complete(`✅ Complete and Save : ${filePath}`);
};

module.exports = async () => {
  const now = new Date();
  const date = dateFns.format(now, DATE_FORMAT);
  const dateDir = dateFns.format(now, DATE_FOLDER_FORMAT);
  const preFileName = dateFns.format(now, DATE_POST_FILENAME_FORMAT);
  const destDir = path.join(ABSOLUTE_POST_DIR, dateDir);

  log.start("New Posts Create:", date);

  const title = await titlePrompt(destDir);
  const template = "post";
  const draft = false;
  const slug = getSlug(title);
  const category = await categoryPrompt();
  const tags = await tagsPrompt();
  const description = await descriptionPrompt();
  const commentsFlag = await commentsFlagPrompt();

  const filePath = `${destDir}/${preFileName}---${slug}.md`;

  const matterTags = makeMatterByTagArr(tags);
  const contents = createFrontMatter(
    title,
    date,
    template,
    draft,
    slug,
    category,
    matterTags,
    description,
    commentsFlag
  );

  fs.outputFile(filePath, contents, (err) => {
    if (err) {
      log.error("Unknown Error: Cannot write file!");
      log.info(err);
      return;
    }

    log.complete(`✅ Success! /${filePath}\n`);
    log.star(`✏️  Start to write Content!\n`);
  });
};
