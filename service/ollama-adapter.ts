// import { TextMessage } from "../graphql/types/converted";
import { Ollama } from "@langchain/ollama";
import { CopilotRuntimeChatCompletionRequest, CopilotRuntimeChatCompletionResponse, CopilotServiceAdapter } from "@copilotkit/runtime";
import { randomId, randomUUID } from "@/utils/random-id";

const DEFAULT_MODEL = "llama3:latest";

interface OllamaAdapterOptions {
  model?: string;
}

export class OllamaAdapter implements CopilotServiceAdapter {
  private model: string;

  constructor(options?: OllamaAdapterOptions) {
    if (options?.model) {
      this.model = options.model;
    } else {
      this.model = DEFAULT_MODEL;
    }
  }

  async process(
    request: CopilotRuntimeChatCompletionRequest,
  ): Promise<CopilotRuntimeChatCompletionResponse> {
    const { messages, actions, eventSource } = request;
    // const messages = this.transformMessages(forwardedProps.messages);

    const ollama = new Ollama({
      model: this.model,
      baseUrl: process.env.OLLAMA_BASE_URL,
    });
    const contents = (messages.filter((m) => m.isTextMessage()) as any[]).map(
      (m) => m.content,
    );
    const _stream = await ollama.stream(contents); // [TODO] role info is dropped...

    eventSource.stream(async (eventStream$) => {
      const currentMessageId = randomId();
      eventStream$.sendTextMessageStart({ messageId: currentMessageId });
      for await (const chunkText of _stream) {
        eventStream$.sendTextMessageContent({
          messageId: currentMessageId,
          content: chunkText,
        });
      }
      eventStream$.sendTextMessageEnd({ messageId: currentMessageId });
      // we may need to add this later.. [nc]
      // let calls = (await result.response).functionCalls();

      eventStream$.complete();
    });
    return {
      threadId: request.threadId || randomUUID(),
    };
  }
}