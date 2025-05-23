// app/api/hello/route.js

import axios from "axios";
import {
  CopilotRuntime,
  LangChainAdapter,
  OpenAIAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
import { Action } from "@copilotkit/shared";
import { NextRequest } from "next/server";
import { ChatOllama } from "@langchain/ollama";
import { useCopilotReadable } from "@copilotkit/react-core";
const dataState = {
  issue: {},
};
const postIssueDataByJPO = async (priority: string) => {
  var myHeaders = new Headers();
  myHeaders.append(
    "X-3DSLogin-ticket",
    "MjZCMzk1NjE3OUVENDUxREI0NzdFQTM3QUY4MDlBODV8V0FOR0xKfHx8fDB8"
  );
  myHeaders.append(
    "SecurityContext",
    "VPLMCreator.New Product Development.New Product Development Space"
  );
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Accept", "*/*");

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify({
      Params: {
        priority: priority,
      },
    }),
  };

  // const res = await axios.post(
  //   "https://r2024.v6.com/3dspace/JDXPublicRest/JDXTicketService?FuncName=testIssue&JPOName=Lead_MegBomService",
  //   {
  //     Params: {
  //       priority: priority,
  //     },
  //   },
  //   {
  //     headers: {
  //       "X-3DSLogin-ticket":
  //         "MjZCMzk1NjE3OUVENDUxREI0NzdFQTM3QUY4MDlBODV8V0FOR0xKfHx8fDB8",
  //       SecurityContext:
  //         "VPLMCreator.New Product Development.New Product Development Space",
  //       "Content-Type": "application/json",
  //       Accept: "*/*",
  //     },
  //   }
  // );
  // console.log("res>>>>>>>", res.data);
  // if (res.data && res.data.length > 0) {
  //   dataState.issue = res.data.data;
  //   return "查询成功，已经帮用户储存了数据，请询问用户的下一步操作";
  // } else {
  //   return "后端未查询到数据";
  // }
  return "查询成功，已经帮用户储存了数据，请询问用户的下一步操作";
};

const generateHtmlAction: Action<any> = {
  name: "generateHtmlInterface",
  description: "根据数据生成HTML内容",
  parameters: [
    {
      name: "UserDemand",
      type: "string",
      description: "用户的需求描述",
      required: true,
    },
  ],
  handler: async ({ UserDemand }) => {
    return "<div>" + UserDemand + "</div>";
  },
};

const runtime = new CopilotRuntime({
  actions: [
    {
      name: "searchIssueData",
      description: "查询后端接口 获取Issue数据",
      parameters: [
        {
          name: "priority",
          type: "string",
          description:
            "priority of the issue.if If not provided,default to Empty String",
          required: true,
        },
      ],
      handler: async ({ priority }: { priority: string }) => {
        console.log("priority", priority);
        return postIssueDataByJPO(priority);
      },
    },
    {
      name: "generateHtmlInterface",
      description: "根据数据生成HTML内容",
      parameters: [
        {
          name: "userDemand",
          type: "string",
          description: "用户的需求描述",
          required: true,
        },
      ],
      handler: async ({ userDemand }: { userDemand: string }) => {
        console.log("userDemand", userDemand);
        return `<div class="card"> <h1 class="text-2xl font-bold mb-4">Issue 数据表格</h1> <div class="overflow-x-auto"> <table class="min-w-full divide-y divide-gray-200"> <thead class="bg-gray-50"> <tr> <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th> <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">标题</th> <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">优先级</th> <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th> </tr> </thead> <tbody class="bg-white divide-y divide-gray-200"> <tr> <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">ISSUE001</td> <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">系统登录异常</td> <td class="px-6 py-4 whitespace-nowrap text-sm text-yellow-600">medium</td> <td class="px-6 py-4 whitespace-nowrap text-sm text-green-600">已解决</td> </tr> <tr> <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">ISSUE002</td> <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">支付接口超时</td> <td class="px-6 py-4 whitespace-nowrap text-sm text-red-600">high</td> <td class="px-6 py-4 whitespace-nowrap text-sm text-blue-600">进行中</td> </tr> </tbody> </table> </div> </div>;`;
      },
    },
  ],
});

const model = new ChatOllama({
  model: "Qwen3:latest",
  temperature: 0.3,
  streaming: true,
  baseUrl: process.env.OLLAMA_BASE_URL,
});

export async function POST(req: NextRequest) {
  console.log("start.........");
  // const res = await fetch(
  //   "https://r2024.v6.com/3dpassport/api/v2/batch/ticket?identifier=XUF",
  //   {
  //     method: "GET",
  //     headers: {
  //       Accept: "application/json",
  //       "DS-Service-Name": "loginservice",
  //       "DS-Service-Secret": "7547521e-c582-41d5-902d-5eb3f2f49da0",
  //     },
  //   }
  // )
  // if (!res.ok) {
  //   throw new Error(`HTTP error! status: ${res.status}`);
  // }
  // return Response.json(res.json());
  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    // serviceAdapter,
    serviceAdapter: new LangChainAdapter({
      chainFn: async ({ messages, tools }) => {
        // console.log("messages", messages);
        return model.bindTools(tools).invoke(messages);
      },
    }),
    endpoint: "/api/test",
  });

  return handleRequest(req);
}
