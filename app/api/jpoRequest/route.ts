import { OllamaAdapter } from "@/service/ollama-adapter";
import {
  CopilotRuntime,
  LangChainAdapter,
  OpenAIAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
import { ChatOllama, Ollama } from "@langchain/ollama";
import { tavily, TavilySearchResponse } from "@tavily/core";
import { log } from "console";
import { NextRequest } from "next/server";
import axios from "axios";
const devHeaders = {
  "Content-Type": "application/json",
  "Accept-Language": "zh-cn",
  "X-3DSLogin-ticket":
    "MThCOTBFNzgxRDI2NDM4NThEMUM1QzIwMEQwQ0U2QzV8SklBTkdZTnx8fHwwfA==", //10.10.72.158 JIANGYN
  SecurityContext: "VPLMCreator.Winding BU Machine.Winding BU Space",

  // 'X-3DSLogin-ticket': 'MjZCMzk1NjE3OUVENDUxREI0NzdFQTM3QUY4MDlBODV8V0FOR0xKfHx8fDB8', //10.10.72.158 WLJ
  // SecurityContext: 'VPLMCreator.New Product Development.New Product Development Space',
};

const https = require('https');

export const postRequest = async (name: string) => {
  const url = `https://r2024.v6.com/3dspace/JDXPublicRest/JDXTicketService?JPOName=Lead_VPMReferenceService_mxJPO&FuncName=getMES3DPlayUrl`;
  const agent = new https.Agent({
    rejectUnauthorized: false,
  });
  const res = await axios.post(url, {
    headers: devHeaders,
    body: JSON.stringify({
      JPOName: "Lead_VPMReferenceService",
      FuncName: "getMES3DPlayUrl",
      Params: {
        vName: name,
      },
    }),
    httpsAgent: agent,
  });
  log("res", res);
  return res;
};

//搜索爆炸图
const runtime = new CopilotRuntime({
  actions: () => {
    return [
      {
        name: "searchExplodedView",
        description: "根据name搜索爆炸图",
        parameters: [
          {
            name: "name",
            type: "string",
            description: "The name to search the exploded view for.",
            required: true,
          },
        ],
        handler: async ({ name }: { name: string }) => {
          console.log("name", name);
          return postRequest(name);
        },
      },
    ];
  },
});

const model = new ChatOllama({
  model: "qwen2.5:14b", // "qwen2.5:32b",
  temperature: 0.3,
  baseUrl: process.env.OLLAMA_BASE_URL,
});

export const POST = async (req: NextRequest) => {
  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    // serviceAdapter,
    serviceAdapter: new LangChainAdapter({
      chainFn: async ({ messages, tools }) => {
        return model.bindTools(tools).stream(messages);
      },
    }),
    endpoint: "/api/jpoRequest",
  });

  return handleRequest(req);
};
