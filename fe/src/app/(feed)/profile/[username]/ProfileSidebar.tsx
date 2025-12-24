"use client";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { usePathname } from "next/navigation";
import { EditProfileDialog } from "./EditProfileDialog"; // Import component mới

export default function ProfileSidebar({ user }) {
  const pathname = usePathname();
  // Kiểm tra logic isOwnProfile của bạn (có thể cần check id thay vì pathname nếu user đổi username)
  const isOwnProfile =
    pathname.includes("/profile/me") || pathname.includes(user.username);

  return (
    <aside className="w-64 shrink-0">
      <Card>
        <CardHeader className="grid gap-1 items-center text-center">
          <Avatar className="h-24 w-24 mx-auto">
            <AvatarImage
              src={`${user.image || "/user_default.jpg"}`}
              className="object-cover"
            ></AvatarImage>
          </Avatar>
          <CardTitle className="mt-2">{user.name || "Jane Doe"}</CardTitle>
          <CardDescription>@{user.username}</CardDescription>
          <p className="text-sm text-muted-foreground mt-2 text-left w-full">
            {user.bio || "Chưa có tiểu sử."}
          </p>
        </CardHeader>

        {isOwnProfile && (
          <CardContent>
            {/* Thay thế Button cũ bằng Dialog Component */}
            <EditProfileDialog user={user} />
          </CardContent>
        )}
      </Card>
    </aside>
  );
}
