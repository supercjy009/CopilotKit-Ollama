// import { TextMessage } from "../graphql/types/converted";
import { ChatOllamaInput } from "@langchain/ollama";
import {
  CopilotRuntimeChatCompletionRequest,
  CopilotRuntimeChatCompletionResponse,
  CopilotServiceAdapter,
} from "@copilotkit/runtime";
import { randomId, randomUUID } from "@/utils/random-id";

const DEFAULT_MODEL = "llama3:latest";

export class OllamaAdapter implements CopilotServiceAdapter {
  private options: ChatOllamaInput = {
    model: DEFAULT_MODEL,
    streaming: true,
  };

  constructor(options?: ChatOllamaInput) {
    this.options = { ...this.options, ...options };
  }

  async process(
    request: CopilotRuntimeChatCompletionRequest
  ): Promise<CopilotRuntimeChatCompletionResponse> {
    const { messages, actions, eventSource, forwardedParameters } = request;
    eventSource.stream(async (eventStream$) => {
      console.log("66666666666666666666666");
      // eventStream$.sendTextMessageStart({ messageId: "1" });
      // eventStream$.sendTextMessageContent({
      //   messageId: "1",
      //   content: "hello world",
      // });
      // eventStream$.sendTextMessageEnd({ messageId: "1" });
      const toolId = randomUUID();
      eventStream$.sendActionExecutionStart({
        actionExecutionId: toolId,
        actionName: "sayHello",
        parentMessageId: randomUUID(),
      });

      // eventStream$.sendActionExecutionArgs({
      //   actionExecutionId: toolId,
      //   args: JSON.stringify({ name: "CYY" }),
      // });

      eventStream$.sendActionExecutionEnd({
        actionExecutionId: toolId,
      });
      eventStream$.complete();
    });
    return {
      threadId: request.threadId || randomUUID(),
    };
  }
}
