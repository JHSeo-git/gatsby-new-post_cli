const path = require("path");
const fs = require("fs-extra");
const dateFns = require("date-fns");
const _ = require("lodash");
const rr = require("recursive-readdir");
const matter = require("gray-matter");
const inquirer = require("inquirer");
const log = require("signale");

const cwd = process.cwd();

const RELATIVE_POST_DIR = "/content/posts";
const ABSOLUTE_POST_DIR = `${cwd}${RELATIVE_POST_DIR}`;

let markdownFiles = [];

const readMarkdownFiles = async () => {
  markdownFiles = await rr(ABSOLUTE_POST_DIR);
};

const getCategoryByPosts = () => {
  return _.uniq(
    markdownFiles
      .map((file) => fs.readFileSync(file, "utf8"))
      .map((str) => matter(str).data.category)
      .filter((val) => !!val)
      .map((str) => str.trim().toLowerCase())
  );
};

const getTagsByPosts = () => {
  return _.uniq(
    markdownFiles
      .filter(({ tags }) => !!tags)
      .forEach(({ tags }) => {
        tags.map((tag) => tag.trim()).forEach((tag) => matterTags.add(tag));
      })
  );
};

const getSlug = (title) => title.split(" ").join("-").toLowerCase();

const fetchCategory = async () => {
  let category;
  const customCategoryOption = "[ CREATE NEW CATEGORY ]";
  const categories = getCategoryByPosts();
  const categoryChoices = [
    ...categories,
    new inquirer.Separator(),
    customCategoryOption,
  ];
  const { selectedCategory } = await inquirer.prompt([
    {
      type: "list",
      name: "selectedCategory",
      message: "Select a category: ",
      choices: categoryChoices,
    },
  ]);

  if (selectedCategory === customCategoryOption) {
    const { customizedCategory } = await inquirer.prompt([
      {
        type: "input",
        name: "customizedCategory",
        message: "Enter the customized category",
        validate: (val) => {
          if (val.includes("'")) {
            return "Cannot use single quote";
          }

          if (categories.includes(val)) {
            return `Already exist category name:: ${val}`;
          }

          return true;
        },
      },
    ]);
    category = customizedCategory;
  } else {
    category = selectedCategory;
  }

  if (!category) {
    log.error("Cannot find category :(\n");
    throw Error("Unknown Error...");
  }

  return category;
};

const fetchTitle = async (category, destDir) => {
  const { title } = await inquirer.prompt([
    {
      type: "input",
      name: "title",
      message: "Enter the title: ",
      default: () => "New post title",
      validate: async (val) => {
        if (val.includes("'")) {
          return "Cannot use single quote";
        }

        const fileName = getFilePostName(val);
        const dest = `${destDir}/${fileName}.md`;
        const destFileExists = await fs.pathExists(dest);

        if (destFileExists) {
          return `⚠️  Already exist file name:: ${fileName}.md.`;
        }

        return true;
      },
    },
  ]);

  return title;
};

const fetchExistTags = async () => {
  let tags;
  const customTagsOption = "[ CREATE NEW TAGS ]";
  const tags = getTagsByPosts();
  const tagChoices = [...tags, new inquirer.Separator(), customTagsOption];
  const { selectedTags } = await inquirer.prompt([
    {
      type: "checkbox",
      name: "selectedTags",
      message: "Select Tags: ",
      choices: tagChoices,
    },
  ]);

  if (selectedTags === customTagsOption) {
    return null;
  } else {
    tags = selectedTags;
  }

  if (!tags) {
    log.error("Cannot find tags :(\n");
    throw Error("Unknown Error...");
  }

  return tags;
};

const fetchCustomTags = async () => {
  const { customizedTags } = await inquirer.prompt([
    {
      type: "input",
      name: "customizedTag",
      message: "Enter the customized tags({tag1}^{tag2}...)",
      validate: (val) => {
        if (val.includes("'")) {
          return "Cannot use single quote";
        }

        return true;
      },
    },
  ]);
  customizedTags =
    customizedTags && customizedTags.length > 0
      ? customizedTags.split(" ")
      : [];
  return customizedTags;
};

module.exports = async () => {
  const now = new Date();
  const dateDir = format(now, "yyyy-MM");
  const destDir = `${ABSOLUTE_POST_DIR}/${dateDir}`;
  const destDirExists = await fs.pathExists(destDir);

  readMarkdownFiles();

  const category = await fetchCategory();

  if (!destDirExists) {
    await fs.ensureDir(destDir);
  }

  const title = await fetchTitle(category, destDir);
  const date = format(now, "yyyy-MM-dd HH:mm:ss");
  const template = "post";
  const draft = false;
  const slug = getSlug(title);

  const description = await getDescriptionFromUser();
  const existTags = await fetchExistTags();
  const customTags = await fetchCustomTags();
  const tagsArray = [...tagsFromExisting, ...tagsFromUser];
  const now = new Date();
  const date = format(now, "yyyy-MM-dd HH:mm:ss");
  const refinedTitle = title.trim().split(" ").join("-");
  const filename = format(now, "yyyy-MM-dd") + "---" + refinedTitle;
  const slug = refinedTitle.replace(/\[|\]/g, "");

  let tags = "";
  if (tagsArray.length) {
    tags += `tags:\n`;
    tagsArray.forEach((tag) => (tags += `  - "${tag}"\n`));
  }
};
