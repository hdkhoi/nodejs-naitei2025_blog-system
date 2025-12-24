"use client";

import articleApi from "@/api/article.api";
import Editor from "@/components/tiptap";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save, Upload, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const MAX_FILE_SIZE = 500000; // 500KB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

// 1. Cập nhật Schema: Bỏ .max(5000) ở body
const schema = z.object({
  title: z
    .string("Vui lòng nhập tiêu đề")
    .min(1, "Tiêu đề không được để trống"),
  description: z
    .string("Vui lòng nhập mô tả")
    .min(1, "Mô tả không được để trống")
    .max(100, "Mô tả không được vượt quá 100 ký tự"),
  body: z
    .string("Vui lòng nhập nội dung bài viết")
    .min(1, "Nội dung bài viết không được để trống"),
  tagList: z.array(z.string()).max(5, "Tối đa 5 thẻ"), // Thêm dòng này
  cover_image: z
    .any()
    .refine((file) => file instanceof File, "Vui lòng chọn ảnh bìa")
    .refine(
      (file) => file?.size <= MAX_FILE_SIZE,
      `Kích thước ảnh tối đa là 500KB.`
    )
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Chỉ hỗ trợ định dạng .jpg, .jpeg, .png và .webp."
    ),
});

// --- HELPER FUNCTION: Chuyển Base64 thành File object ---
const dataURLtoFile = (dataurl: string, filename: string) => {
  const arr = dataurl.split(",");
  const mime = arr[0].match(/:(.*?);/)?.[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

const Page = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      body: "",
      tagList: [],
    },
  });

  useEffect(() => {
    register("cover_image");
  }, [register]);

  const [file, setFile] = useState<File | null>(null);
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [blob, setBlob] = useState("");
  const [editorContent, setEditorContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { token } = user || "";

  // Tạo URL preview khi file thay đổi
  useEffect(() => {
    if (!file) {
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setBlob(objectUrl);

    // Cleanup function: Xóa URL khi component unmount hoặc file đổi
    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFile = e.target.files?.[0];
    if (newFile) {
      if (!newFile.type.match("image.*")) {
        alert("Vui lòng chọn file ảnh!");
        return;
      }
      setFile(newFile);
      // Cập nhật giá trị cho React Hook Form và kích hoạt validate ngay lập tức
      setValue("cover_image", newFile, { shouldValidate: true });
    }
  };

  const removeImage = () => {
    setFile(null);
    setBlob("");
    setValue("cover_image", null as any, { shouldValidate: true }); // Xóa giá trị trong form
    if (inputFileRef.current) {
      inputFileRef.current.value = "";
    }
  };

  // --- HÀM MỚI: Xử lý ảnh trong nội dung Editor ---
  const processEditorContent = async (htmlContent: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");
    const images = doc.querySelectorAll("img");

    // Tạo mảng các promise để upload ảnh song song
    const uploadPromises = Array.from(images).map(async (img, index) => {
      const src = img.getAttribute("src");
      // Chỉ xử lý ảnh dạng Base64
      if (src && src.startsWith("data:image")) {
        try {
          const file = dataURLtoFile(src, `content_image_${index}.png`);
          const newUrl = await articleApi.uploadImage(file);
          if (newUrl) {
            img.setAttribute("src", newUrl); // Thay thế src cũ bằng URL Cloudinary
          }
        } catch (error) {
          console.error("Lỗi upload ảnh trong editor:", error);
        }
      }
    });

    await Promise.all(uploadPromises);
    return doc.body.innerHTML; // Trả về HTML mới
  };

  const onSubmit = async (data: any, status: "draft" | "pending") => {
    setIsLoading(true);
    try {
      // 1. Upload ảnh bìa (Cover Image)
      let coverImageUrl = "";
      if (data.cover_image instanceof File) {
        const url = await articleApi.uploadImage(data.cover_image);
        if (url) {
          coverImageUrl = url;
        } else {
          throw new Error("Upload ảnh bìa thất bại");
        }
      }

      // 2. Xử lý ảnh trong nội dung bài viết (Body)
      const processedBody = await processEditorContent(data.body);

      // --- THÊM: Kiểm tra độ dài nội dung SAU KHI đã upload ảnh xong (nếu cần) ---
      if (processedBody.length > 10000) {
        // Ví dụ giới hạn 10.000 ký tự
        alert("Nội dung bài viết quá dài, vui lòng rút ngắn lại.");
        setIsLoading(false);
        return;
      }

      // 3. Chuẩn bị payload
      const payload = {
        title: data.title,
        description: data.description,
        body: processedBody, // Sử dụng body đã xử lý ảnh
        tagList: data.tagList,
        cover_image: coverImageUrl,
        status: status,
      };

      const response = await articleApi.createArticle(token, payload);

      if (response.success) {
        const newArticle = response.data;
        console.log("Payload gửi về server:", payload);
        console.log("Bài viết mới tạo:", newArticle);
        alert(`Đã ${status === "draft" ? "lưu nháp" : "đăng bài"} thành công!`);
      }

      // Reset form logic here if needed
    } catch (error) {
      console.error("Lỗi submit form:", error);
      alert("Có lỗi xảy ra khi xử lý.");
    } finally {
      setIsLoading(false);
    }
  };

  // 2. State quản lý tagList và Input nhập tag
  const [tagList, settagList] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  // Hàm thêm tag khi nhấn Enter
  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // QUAN TRỌNG: Chặn form submit khi nhấn Enter ở ô này

      const value = tagInput.trim();
      if (!value) return; // Không thêm rỗng

      if (tagList.includes(value)) {
        setTagInput(""); // Đã tồn tại thì xóa input thôi
        return;
      }

      if (tagList.length >= 5) {
        return; // Giới hạn 5 tagList
      }

      const newtagList = [...tagList, value];
      settagList(newtagList);
      setValue("tagList", newtagList, { shouldValidate: true }); // Cập nhật vào form
      setTagInput("");
    }
  };

  // Hàm xóa tag
  const removeTag = (tagToRemove: string) => {
    const newtagList = tagList.filter((tag) => tag !== tagToRemove);
    settagList(newtagList);
    setValue("tagList", newtagList, { shouldValidate: true });
  };

  return (
    // SỬA: Bỏ onSubmit ở thẻ form vì ta sẽ xử lý ở từng nút button
    <form className="space-y-4">
      <div className="p-4 border rounded-lg shadow-sm">
        <div className="grid gap-3">
          <Label>Ảnh bìa</Label>

          {/* Input File */}
          <Input
            ref={inputFileRef}
            type="file"
            accept="image/*"
            onChange={onFileChange}
            className="cursor-pointer"
            // BỎ dòng {...register("cover_image")} ở đây đi để tránh xung đột
          />
          {errors.cover_image && (
            <p className="text-red-500 text-sm">
              {errors.cover_image.message as string}
            </p>
          )}

          {/* Khu vực hiển thị Preview */}
          {blob && (
            <div className="relative mt-2 aspect-video w-full max-h-72 overflow-hidden rounded-md border">
              <Image src={blob} alt="Preview" fill className="object-cover" />
              {/* Nút xóa ảnh */}
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6 rounded-full"
                onClick={removeImage}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      </div>
      <Input
        style={{ fontSize: "30px" }}
        type="text"
        className="h-16 font-bold"
        placeholder="Tiêu đề bài viết"
        {...register("title")}
      />
      {errors.title && (
        <p className="text-red-500 text-sm">{errors.title.message as string}</p>
      )}

      {/* --- PHẦN tagList MỚI THÊM VÀO --- */}
      <div className="space-y-2">
        <Input
          type="text"
          placeholder="Thêm thẻ (Nhấn Enter để thêm)..."
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleAddTag}
        />

        {/* Hiển thị danh sách tagList */}
        <div className="flex flex-wrap gap-2">
          {tagList.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
            >
              #{tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-2 text-blue-600 hover:text-blue-800 focus:outline-none"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
        {errors.tagList && (
          <p className="text-red-500 text-sm">
            {errors.tagList.message as string}
          </p>
        )}
      </div>
      {/* ------------------------------- */}

      <Input
        type="text"
        className=""
        placeholder="Mô tả ngắn gọn về bài viết"
        {...register("description")}
      />
      {errors.description && (
        <p className="text-red-500 text-sm">
          {errors.description.message as string}
        </p>
      )}
      <Separator />
      <Editor
        onChange={(content: string) => {
          setEditorContent(content);
          setValue("body", content);
        }}
      />
      {errors.body && (
        <p className="text-red-500 text-sm">{errors.body.message as string}</p>
      )}
      <div className="flex gap-2">
        {/* Nút Lưu bản nháp */}
        <Button
          variant="ghost"
          type="button" // SỬA: Đổi thành type="button"
          disabled={isLoading}
          className="flex gap-2"
          // THÊM: Xử lý click riêng với status 'draft'
          onClick={handleSubmit((data) => onSubmit(data, "draft"))}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang xử lý...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>Lưu bản nháp</span>
            </>
          )}
        </Button>

        {/* Nút Đăng bài viết */}
        <Button
          type="button" // SỬA: Đổi thành type="button"
          disabled={isLoading}
          className="flex gap-2"
          // THÊM: Xử lý click riêng với status 'pending'
          onClick={handleSubmit((data) => onSubmit(data, "pending"))}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Đang xử lý...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              <span>Đăng bài viết</span>
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default Page;
