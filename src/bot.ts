import { Configuration, OpenAIApi } from "openai";
import colors from "colors";

import { messages, addAssistantMessage } from './message.js';
let openApi: OpenAIApi;

export function initBot() {
  console.log('api',process.env.OPEN_API_KEY)
  openApi = new OpenAIApi(
    new Configuration({
      basePath: "https://api.rhinelab.com.cn/v1",
      apiKey: process.env.OPEN_API_KEY,
    })
  );
}

export async function botAnswer() {
  const chatCompletion = await openApi.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages,
  });

  const answer = chatCompletion.data.choices[0].message?.content;

  addAssistantMessage(answer as string)

  console.log(colors.bold.red("Bot: "), answer);
}
