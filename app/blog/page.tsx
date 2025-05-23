import Posts from "@/app/ui/posts";
import { Suspense } from "react";

export default function Page() {
  const getPosts = (): Promise<{ id: string; title: string }[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: "1", title: "Post 1" },
          { id: "2", title: "Post 2" },
          { id: "3", title: "Post 3" },
        ]);
      }, 2000);
    });
  };
  // 不要等待数据获取函数
  const posts = getPosts();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Posts posts={posts} />
    </Suspense>
  );
}
