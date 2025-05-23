"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { useCopilotAction, useCopilotReadable } from "@copilotkit/react-core";
import { AreaChart } from "./ui/area-chart";
import { BarChart } from "./ui/bar-chart";
import { DonutChart } from "./ui/pie-chart";
import { SearchResults } from "./generative-ui/SearchResults";
import axios from "axios";
import { useState } from "react";

export function DrawingDashboard() {
  const [htmlContent, setHtmlContent] = useState("<div>hahah</div>");

  useCopilotAction({
    name: "searchIssueData",
    available: "disabled",
    description: "查询后端接口 获取Issue数据.",
    parameters: [
      {
        name: "priority",
        type: "string",
        description:
          "priority of the issue.if If not provided,default to Empty String",
        required: false,
      },
    ],
    render: ({ args, status }) => {
      console.log("args", args);
      console.log("status", status);
      return <SearchResults query={args.priority || "Issue"} status={status} />;
    },
  });

  useCopilotAction({
    name: "renderHtmlContent",
    // available: "disabled",
    description: "渲染HTML内容生成界面.",
    parameters: [
      {
        name: "htmlContent",
        type: "string",
        description: "html content",
        required: true,
      },
    ],
    handler: async (action) => {
      setHtmlContent(action.htmlContent);
      return "渲染成功";
    },
    render: ({ args, status }) => {
      console.log("args", args);
      console.log("status", status);
      return <div>{status === "complete" ? "生成完成" : "...生成中"}</div>;
    },
  });

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 w-full">
      <Card className="col-span-1 md:col-span-1 lg:col-span-2">
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
      </Card>
    </div>
  );
}
