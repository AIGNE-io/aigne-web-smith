export default async function exit() {
  process.exit(0);
}

exit.description =
  "Exits the chat session. This is equivalent to saying goodbye, quit, exit, or close. A farewell message should be printed before calling this tool, as it will exit the process immediately.";
