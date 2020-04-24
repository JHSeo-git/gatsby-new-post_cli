const rr = require("recursive-readdir");
const _ = require("lodash");
const fs = require("fs-extra");
const matter = require("gray-matter");

const { ABSOLUTE_POST_DIR } = require("./constants");

const getPostFileName = (title) => title.split(" ").join("-").toLowerCase();
const getSlug = (title) => title.split(" ").join("-").toLowerCase();

let frontMatters = [];

const getCategory = async () => {
  const posts = await rr(ABSOLUTE_POST_DIR);

  frontMatters = posts
    .map((post) => fs.readFileSync(post, "utf8"))
    .map((content) => matter(content).data);

  return _.uniq(
    frontMatters
      .filter(({ category }) => !!category)
      .map(({ category }) => category.trim().toLowerCase())
  );
};

const getTags = async () => {
  let resTags = [];

  frontMatters
    .filter(({ tags }) => !!tags)
    .forEach(({ tags }) => {
      tags.map((tag) => tag.trim()).forEach((tag) => resTags.push(tag));
    });

  return _.uniq(resTags);
};

const makeMatterByTagArr = (tags) => {
  let res = "";
  if (tags.length) {
    res += `tags:\n`;
    tags.forEach((tag) => (res += `  - "${tag}"\n`));
  }
  return res;
};

const createFrontMatter = (
  title,
  date,
  template,
  draft,
  slug,
  category,
  tags,
  description,
  comments
) =>
  `---\n` +
  `title: "${title}"\n` +
  `date: "${date}"\n` +
  `template: "${template}"\n` +
  `draft: ${draft}\n` +
  `slug: "${slug}"\n` +
  `category: "${category}"\n` +
  `${tags}` +
  `description: "${description}"\n` +
  `comments: ${comments}\n` +
  `---\n`;

module.exports = {
  getPostFileName,
  getCategory,
  getSlug,
  getTags,
  makeMatterByTagArr,
  createFrontMatter,
};
