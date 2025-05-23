import { ActionInput } from "./action.input";

export function convertActionInputToOpenAITool(action: ActionInput) {
    return {
      type: "function",
      function: {
        name: action.name,
        description: action.description,
        parameters: parseJson(action.jsonSchema, {}),
      },
    };
  }

  export function parseJson(json: string, fallback: any = "unset") {
    try {
      return JSON.parse(json);
    } catch (e) {
      return fallback === "unset" ? null : fallback;
    }
  }