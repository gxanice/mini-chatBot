import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import { dirname,resolve } from 'path';

import { askQuestion } from "./user.js";
import { botAnswer, initBot } from "./bot.js";
import { startLoading, stopLoading } from "./loading.js";

dotenv.config({
  path: resolve(dirname(fileURLToPath(import.meta.url)), "../.env"),
});

// 初始化bot
initBot();

(async () => {
  while (true) {
    const userInput = askQuestion();
    // 退出
    checkOut(userInput);
    
    // 开始对话
    startLoading()
    // 问答
    await botAnswer();
    // 结束对话
    stopLoading()
  }
})();

// 退出
function checkOut(userInput: string) {
  if (userInput.toLocaleLowerCase() === "exit") {
    process.exit();
  }
}
