const cwd = process.cwd();
const RELATIVE_POST_DIR = "/content/posts";
const ABSOLUTE_POST_DIR = `${cwd}${RELATIVE_POST_DIR}`;
//const DATE_FORMAT = "yyyy-MM-dd HH:MM:SS";
const DATE_FORMAT = "yyyy-MM-dd HH:mm:ss.SSS";
const DATE_FOLDER_FORMAT = "yyyy-MM";
const DATE_POST_FILENAME_FORMAT = "yyyy-MM-dd";
const NEW_CATEGORY_COMMENT = "[ ADD NEW CATEGORY ]";
const NEW_TAG_COMMENT = "[ ADD NEW TAG ]";

module.exports = {
  RELATIVE_POST_DIR,
  ABSOLUTE_POST_DIR,
  DATE_FORMAT,
  DATE_FOLDER_FORMAT,
  NEW_CATEGORY_COMMENT,
  NEW_TAG_COMMENT,
  DATE_POST_FILENAME_FORMAT,
};
