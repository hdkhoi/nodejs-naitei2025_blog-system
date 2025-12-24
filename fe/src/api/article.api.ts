import { ArticleDetail } from "@/interfaces/article.interface";
import http from "@/lib/http";
import { time } from "console";

const articleApi = {
  getArticles: (params: any) => http.get("/articles"),
  getArticleBySlug: (slug: string) => http.get<ArticleDetail>(`/articles/${slug}`),
  approveArticle: (slug: string, token: string) =>
    http.put(`/articles/${slug}/approve`, null, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }),
  rejectArticle: (slug: string, token: string) =>
    http.put(`/articles/${slug}/reject`, null, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }),
  uploadImage: async (image: File) => {
    try {
      // 1. Chuẩn bị các tham số cần ký
      const timestamp = Math.round(new Date().getTime() / 1000);
      const paramsToSign = {
        timestamp: timestamp,
        folder: "blog", // Folder trên Cloudinary
      };

      // 2. Gọi API nội bộ của Next.js để lấy chữ ký
      const res = await fetch("/api/sign-cloudinary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paramsToSign }),
      });
      const { signature } = await res.json();

      // 3. Upload lên Cloudinary
      const formData = new FormData();
      formData.append("file", image);
      formData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY);
      formData.append("timestamp", timestamp);
      formData.append("signature", signature);
      formData.append("folder", "blog");
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: "POST", body: formData }
      );

      const data = await uploadRes.json();
      return data.secure_url;
    } catch (error) {
      console.error("Lỗi:", error);
    }
  },
  createArticle: (token: string, payload: any) =>
    http.post(
      "/articles",
      payload, // Sửa: Truyền trực tiếp payload, không bọc trong { }
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ),
};

export default articleApi;
