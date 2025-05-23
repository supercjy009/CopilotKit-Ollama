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
import {
  salesData,
  productData,
  categoryData,
  regionalData,
  demographicsData,
  calculateTotalRevenue,
  calculateTotalProfit,
  calculateTotalCustomers,
  calculateConversionRate,
  calculateAverageOrderValue,
  calculateProfitMargin,
} from "../data/dashboard-data";
import axios from "axios";

export function Dashboard() {
  // Calculate metrics
  const totalRevenue = calculateTotalRevenue();
  const totalProfit = calculateTotalProfit();
  const totalCustomers = calculateTotalCustomers();
  const conversionRate = calculateConversionRate();
  const averageOrderValue = calculateAverageOrderValue();
  const profitMargin = calculateProfitMargin();

  // Make data available to the Copilot
  useCopilotReadable({
    description:
      "Dashboard data including sales trends, product performance, and category distribution",
    value: {
      salesData,
      productData,
      categoryData,
      regionalData,
      demographicsData,
      metrics: {
        totalRevenue,
        totalProfit,
        totalCustomers,
        conversionRate,
        averageOrderValue,
        profitMargin,
      },
    },
  });

  // Define render only search action
  useCopilotAction({
    name: "searchInternet",
    available: "disabled",
    description: "Searches the internet for information.",
    parameters: [
      {
        name: "query",
        type: "string",
        description: "The query to search the internet for.",
        required: true,
      },
    ],
    render: ({ args, status }) => {
      console.log("args", args);
      console.log("status", status);
      return (
        <SearchResults
          query={args.query || "No query provided"}
          status={status}
        />
      );
    },
  });

  useCopilotAction({
    name: "searchIssueData",
    available: "disabled",
    description: "查询后端接口 获取Issue数据.",
    parameters: [
      {
        name: "priority",
        type: "string",
        description: "priority of the issue.if If not provided,default to Empty String",
        required: false,
      },
    ],
    render: ({ args, status }) => {
      console.log("args", args);
      console.log("status", status);
      return (
        <SearchResults
          query={args.priority || ""}
          status={status}
        />
      );
    },
  });

  // useCopilotAction({
  //   name: "sayHello",
  //   description: "Say hello to someone.",
  //   parameters: [
  //     {
  //       name: "name",
  //       type: "string",
  //       description: "name of the person to say greet",
  //     },
  //   ],
  //   handler: async ({ name }) => {
  //     return console.log(`Hello, ${name}!`);
  //   },
  // });

  // Color palettes for different charts
  const colors = {
    salesOverview: ["#3b82f6", "#10b981", "#ef4444"], // Blue, Green, Red
    productPerformance: ["#8b5cf6", "#6366f1", "#4f46e5"], // Purple spectrum
    categories: ["#3b82f6", "#64748b", "#10b981", "#f59e0b", "#94a3b8"], // Mixed
    regional: ["#059669", "#10b981", "#34d399", "#6ee7b7", "#a7f3d0"], // Green spectrum
    demographics: ["#f97316", "#f59e0b", "#eab308", "#facc15", "#fde047"], // Orange to Yellow
  };
  const devHeaders = {
    "Content-Type": "application/json",
    "Accept-Language": "zh-cn",
    // "X-3DSLogin-ticket":
    //   "MThCOTBFNzgxRDI2NDM4NThEMUM1QzIwMEQwQ0U2QzV8SklBTkdZTnx8fHwwfA==", //10.10.72.158 JIANGYN
    // SecurityContext: "VPLMCreator.Winding BU Machine.Winding BU Space",

    'X-3DSLogin-ticket': 'MjZCMzk1NjE3OUVENDUxREI0NzdFQTM3QUY4MDlBODV8V0FOR0xKfHx8fDB8', //10.10.72.158 WLJ
    SecurityContext: 'VPLMCreator.New Product Development.New Product Development Space',
  };


  const postRequest = async (name: string) => {
    const url = `/api/proxy/3dspace/JDXPublicRest/JDXTicketService`;
    // const res = await fetch(url, {
    //   method: "POST",
    //   headers: devHeaders,
    //   body: JSON.stringify({
    //     JPOName: "Lead_VPMReferenceService",
    //     FuncName: "getMES3DPlayUrl",
    //     Params: {
    //       vName: name,
    //     },
    //   }),
    // });
    // const res = await axios.post(url, {
    //   JPOName: "Lead_VPMReferenceService",
    //   FuncName: "getMES3DPlayUrl",
    //   Params: {
    //     vName: name,
    //   },
    // }, {
    //   headers: devHeaders, // 你的自定义 headers
    // });
    const res = await axios.get('/api/test?name=test')
    console.log("res", res);
    return res;
  };

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 w-full">
      <button
        onClick={() => {
          postRequest("部件176");
        }}
      >
        Post Request
      </button>
      {/* Key Metrics */}
      <div className="col-span-1 md:col-span-2 lg:col-span-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
            <p className="text-xs text-gray-500">Total Revenue</p>
            <p className="text-xl font-semibold text-gray-900">
              ${totalRevenue.toLocaleString()}
            </p>
          </div>
          <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
            <p className="text-xs text-gray-500">Total Profit</p>
            <p className="text-xl font-semibold text-gray-900">
              ${totalProfit.toLocaleString()}
            </p>
          </div>
          <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
            <p className="text-xs text-gray-500">Customers</p>
            <p className="text-xl font-semibold text-gray-900">
              {totalCustomers.toLocaleString()}
            </p>
          </div>
          <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
            <p className="text-xs text-gray-500">Conversion Rate</p>
            <p className="text-xl font-semibold text-gray-900">
              {conversionRate}
            </p>
          </div>
          <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
            <p className="text-xs text-gray-500">Avg Order Value</p>
            <p className="text-xl font-semibold text-gray-900">
              ${averageOrderValue}
            </p>
          </div>
          <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
            <p className="text-xs text-gray-500">Profit Margin</p>
            <p className="text-xl font-semibold text-gray-900">
              {profitMargin}
            </p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <Card className="col-span-1 md:col-span-2 lg:col-span-4">
        <CardHeader className="pb-1 pt-3">
          <CardTitle className="text-base font-medium">
            Sales Overview
          </CardTitle>
          <CardDescription className="text-xs">
            Monthly sales and profit data
          </CardDescription>
        </CardHeader>
        <CardContent className="p-3">
          <div className="h-60">
            <AreaChart
              data={salesData}
              index="date"
              categories={["Sales", "Profit", "Expenses"]}
              colors={colors.salesOverview}
              valueFormatter={(value) => `$${value.toLocaleString()}`}
              showLegend={true}
              showGrid={true}
              showXAxis={true}
              showYAxis={true}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-1 md:col-span-1 lg:col-span-2">
        <CardHeader className="pb-1 pt-3">
          <CardTitle className="text-base font-medium">
            Product Performance
          </CardTitle>
          <CardDescription className="text-xs">
            Top selling products
          </CardDescription>
        </CardHeader>
        <CardContent className="p-3">
          <div className="h-60">
            <BarChart
              data={productData}
              index="name"
              categories={["sales"]}
              colors={colors.productPerformance}
              valueFormatter={(value) => `$${value.toLocaleString()}`}
              showLegend={false}
              showGrid={true}
              layout="horizontal"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-1 md:col-span-1 lg:col-span-2">
        <CardHeader className="pb-1 pt-3">
          <CardTitle className="text-base font-medium">
            Sales by Category
          </CardTitle>
          <CardDescription className="text-xs">
            Distribution across categories
          </CardDescription>
        </CardHeader>
        <CardContent className="p-3">
          <div className="h-60">
            <DonutChart
              data={categoryData}
              category="value"
              index="name"
              valueFormatter={(value) => `${value}%`}
              colors={colors.categories}
              centerText="Categories"
              paddingAngle={0}
              showLabel={false}
              showLegend={true}
              innerRadius={45}
              outerRadius="90%"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-1 md:col-span-1 lg:col-span-2">
        <CardHeader className="pb-1 pt-3">
          <CardTitle className="text-base font-medium">
            Regional Sales
          </CardTitle>
          <CardDescription className="text-xs">
            Sales by geographic region
          </CardDescription>
        </CardHeader>
        <CardContent className="p-3">
          <div className="h-60">
            <BarChart
              data={regionalData}
              index="region"
              categories={["sales"]}
              colors={colors.regional}
              valueFormatter={(value) => `$${value.toLocaleString()}`}
              showLegend={false}
              showGrid={true}
              layout="horizontal"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-1 md:col-span-1 lg:col-span-2">
        <CardHeader className="pb-1 pt-3">
          <CardTitle className="text-base font-medium">
            Customer Demographics
          </CardTitle>
          <CardDescription className="text-xs">
            Spending by age group
          </CardDescription>
        </CardHeader>
        <CardContent className="p-3">
          <div className="h-60">
            <BarChart
              data={demographicsData}
              index="ageGroup"
              categories={["spending"]}
              colors={colors.demographics}
              valueFormatter={(value) => `$${value}`}
              showLegend={false}
              showGrid={true}
              layout="horizontal"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
