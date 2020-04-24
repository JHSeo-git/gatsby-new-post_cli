const fs = require("fs-extra");
const inquirer = require("inquirer");
const log = require("signale");

const { getPostFileName, getCategory, getTags } = require("./utils");
const { NEW_CATEGORY_COMMENT, NEW_TAG_COMMENT } = require("./constants");

const titlePrompt = async (destDir) => {
  const { title } = await inquirer.prompt([
    {
      type: "input",
      name: "title",
      message: "Enter the title: ",
      default: () => "New post title",
      validate: async (titleVal) => {
        if (titleVal.includes("'") || titleVal.includes('"')) {
          return "Cannot use single quote or double quote";
        }

        const fileName = getPostFileName(titleVal);
        const dest = `${destDir}/${fileName}.md`;
        const destFileExists = await fs.pathExists(dest);

        if (destFileExists) {
          return `❌ Already exist file name:: ${fileName}.md.`;
        }

        return true;
      },
    },
  ]);

  return title;
};

const categoryPrompt = async () => {
  let category;
  const existCategories = await getCategory();

  const categoryList = [
    ...existCategories,
    new inquirer.Separator(),
    NEW_CATEGORY_COMMENT,
  ];

  const { selectCategory } = await inquirer.prompt([
    {
      type: "list",
      name: "selectCategory",
      message: "Select the category: ",
      choices: categoryList,
    },
  ]);

  if (selectCategory === NEW_CATEGORY_COMMENT) {
    const { userInputCategory } = await inquirer.prompt([
      {
        type: "input",
        name: "userInputCategory",
        message: "Enter the customized category",
        validate: (val) => {
          if (val.includes("'") || val.includes('"')) {
            return "Cannot use single quote or double quote";
          }

          if (categoryList.includes(val)) {
            return `Already exist category name:: ${val}`;
          }

          return true;
        },
      },
    ]);
    category = userInputCategory;
  } else {
    category = selectCategory;
  }

  if (!category) {
    log.error("Cannot find category :(\n");
    throw Error("Unknown Error...");
  }

  return category;
};

const tagsPrompt = async () => {
  let tags;
  const existsTags = await getTags();

  const tagList = [...existsTags, new inquirer.Separator(), NEW_TAG_COMMENT];

  const { selectTags } = await inquirer.prompt([
    {
      type: "checkbox",
      name: "selectTags",
      message: "Choose the tags: ",
      choices: tagList,
    },
  ]);

  if (selectTags.includes(NEW_TAG_COMMENT)) {
    const { userInputTags } = await inquirer.prompt([
      {
        type: "input",
        name: "userInputTags",
        message: "Enter the customized tags",
        validate: (val) => {
          if (val.includes("'") || val.includes('"')) {
            return "Cannot use single quote or double quote";
          }

          if (tagList.includes(val)) {
            return `Already exist category name:: ${val}`;
          }

          return true;
        },
      },
    ]);
    tags = selectTags.filter((t) => t !== NEW_TAG_COMMENT);
    tags = [...tags, userInputTags.split(" ")];
  } else {
    tags = selectTags.filter((t) => t !== NEW_TAG_COMMENT);
  }

  if (!tags) {
    log.error("Cannot find tags :(\n");
    throw Error("Unknown Error...");
  }

  return tags;
};

const descriptionPrompt = async () => {
  const { description } = await inquirer.prompt([
    {
      type: "input",
      name: "description",
      message: "Input the description: ",
      validate: async (val) => {
        if (val.includes("'") || val.includes('"')) {
          return "Cannot use single quote or double quote";
        }

        return true;
      },
    },
  ]);

  return description;
};

const commentsFlagPrompt = async () => {
  const { flag } = await inquirer.prompt([
    {
      type: "input",
      name: "description",
      message: "Comments use(y/N): ",
      default: "y",
      validate: async (val) => {
        if (val.toLowerCase() !== "y" && val.toLowerCase() !== "n") {
          return "You should input 'y' or 'N'";
        }

        return true;
      },
    },
  ]);

  return flag && flag.toLowerCase() === "n" ? false : true;
};

module.exports = {
  titlePrompt,
  categoryPrompt,
  tagsPrompt,
  descriptionPrompt,
  commentsFlagPrompt,
};
