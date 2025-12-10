"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { X } from "lucide-react"; // Import icon X để xóa ảnh
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const Page = () => {
  const [file, setFile] = useState<File | null>(null);
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [blob, setBlob] = useState("");

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
    const newFile = e.target.files?.[0]; // Sửa: e.target.files
    if (newFile) {
      if (!newFile.type.match("image.*")) {
        alert("Vui lòng chọn file ảnh!");
        return;
      }
      setFile(newFile);
    }
  };

  const removeImage = () => {
    setFile(null);
    setBlob("");
    if (inputFileRef.current) {
      inputFileRef.current.value = ""; // Reset input file
    }
  };

  return (
    <>
      <div className="p-4 border rounded-lg shadow-sm">
        <div className="grid gap-3">
          <Label>Ảnh bìa</Label>

          {/* Input File */}
          <Input
            ref={inputFileRef}
            type="file"
            accept="image/*" // Chỉ cho phép chọn ảnh
            onChange={onFileChange} // Thêm sự kiện onChange
            className="cursor-pointer"
          />

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
      />
      <Input
        type="text"
        className=""
        placeholder="Mô tả ngắn gọn về bài viết"
      />
      <Separator />
      
    </>
  );
};

export default Page;
