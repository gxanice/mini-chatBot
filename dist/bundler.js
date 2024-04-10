#!/usr/bin/env node

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { resolve, dirname } from 'path';
import readlineSync from 'readline-sync';
import colors from 'colors';
import { OpenAIApi, Configuration } from 'openai';
import ora from 'ora';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol */


function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

const messages = [];
function addUserMessage(message) {
    messages.push({
        role: "user",
        content: message,
    });
}
function addAssistantMessage(message) {
    messages.push({
        role: "assistant",
        content: message,
    });
}

function askQuestion() {
    const userInput = readlineSync.question(colors.rainbow("You: "));
    addUserMessage(userInput);
    return userInput;
}

let openApi;
function initBot() {
    console.log('api', process.env.OPEN_API_KEY);
    openApi = new OpenAIApi(new Configuration({
        basePath: "https://api.rhinelab.com.cn/v1",
        apiKey: process.env.OPEN_API_KEY,
    }));
}
function botAnswer() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const chatCompletion = yield openApi.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages,
        });
        const answer = (_a = chatCompletion.data.choices[0].message) === null || _a === void 0 ? void 0 : _a.content;
        addAssistantMessage(answer);
        console.log(colors.bold.red("Bot: "), answer);
    });
}

let spinner;
function startLoading() {
    spinner = ora("正在回答中，请稍等\r").start();
}
function stopLoading() {
    spinner.stop();
}

dotenv.config({
    path: resolve(dirname(fileURLToPath(import.meta.url)), "../.env"),
});
// 初始化bot
initBot();
(() => __awaiter(void 0, void 0, void 0, function* () {
    while (true) {
        const userInput = askQuestion();
        // 退出
        checkOut(userInput);
        // 开始对话
        startLoading();
        // 问答
        yield botAnswer();
        // 结束对话
        stopLoading();
    }
}))();
// 退出
function checkOut(userInput) {
    if (userInput.toLocaleLowerCase() === "exit") {
        process.exit();
    }
}
