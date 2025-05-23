import { OllamaAdapter } from "@/service/ollama-adapter";
import {
  CopilotRuntime,
  LangChainAdapter,
  OpenAIAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
import { ChatOllama, Ollama } from "@langchain/ollama";
import { tavily, TavilySearchResponse } from "@tavily/core";
import { NextRequest } from "next/server";
const mockTavilySearchFunction = (query: string): TavilySearchResponse => {
  return {
    answer: "This is a mock answer",
    query: query,
    responseTime: 123,
    images: [],
    results: [
      {
        title: "Result 1",
        url: "https://example.com/result1",
        content: "This is a mock content 1",
        score: 1,
        publishedDate: "2022-01-01",
      },
      {
        title: "Result 2",
        url: "https://example.com/result2",
        content: "This is a mock content 2",
        score: 2,
        publishedDate: "2022-01-02",
      },
    ],
  };
};

const serviceAdapter = new OllamaAdapter({
  model: "qwen2.5:32b",
  baseUrl: process.env.OLLAMA_BASE_URL,
}); //qwq
const runtime = new CopilotRuntime({
  actions: () => {
    return [
      {
        name: "searchInternet",
        description: "Searches the internet for information.",
        parameters: [
          {
            name: "query",
            type: "string",
            description: "The query to search the internet for.",
            required: true,
          },
        ],
        handler: async ({ query }: { query: string }) => {
          console.log("query", query);
          // can safely reference sensitive information like environment variables
          const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });
          const res = await tvly
            .search(query, { max_results: 5 })
            .catch((e) => {
              console.error("tavily search error", e);
              return mockTavilySearchFunction(query);
            });
          return res;
          // return mockTavilySearchFunction(query);
        },
      },
    ];
  },
});

const model = new ChatOllama({
  model: "qwen2.5:14b",// "qwen2.5:32b",
  temperature: 0.3,
  baseUrl: process.env.OLLAMA_BASE_URL,
});

export const POST = async (req: NextRequest) => {
  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    // serviceAdapter,
    serviceAdapter: new LangChainAdapter({
      chainFn: async ({ messages, tools }) => {
        // .bindTools(tools)
        return model.stream(messages);
      },
    }),
    endpoint: "/api/copilotkit",
  });

  return handleRequest(req);
};
