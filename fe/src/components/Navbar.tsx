import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Bell, PenLine, Search } from "lucide-react"; // Import thêm icon
import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* 1. Logo */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight">Blogify</span>
          </Link>
        </div>

        {/* 2. Search Bar (Ẩn trên mobile nhỏ, hiện trên md trở lên) */}
        <div className="hidden md:flex flex-1 items-center justify-center px-6">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Tìm kiếm bài viết..."
              className="w-full bg-muted/50 pl-9 focus-visible:bg-background"
            />
          </div>
        </div>
        <div className="md:hidden flex flex-1 items-center justify-center px-6">
          <div className="relative w-full max-w-md">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="">
                  <Search className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full p-2" align="start">
                <DropdownMenuItem>
                  <Input
                    type="search"
                    placeholder="Tìm kiếm bài viết..."
                    className="w-full bg-muted/50 pl-9 focus-visible:bg-background"
                  />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* 3. Actions */}
        <div className="flex items-center gap-2">
          {/* Nút Trang chủ (Dùng variant ghost cho nhẹ nhàng) */}
          <Button variant="ghost" className="hidden sm:flex">
            Trang chủ
          </Button>

          {/* Nút Viết bài (Nổi bật) */}
          <Button className="gap-2">
            <PenLine className="h-4 w-4" />
            <span className="hidden sm:inline">Viết bài</span>
          </Button>

          {/* Nút Thông báo (Icon only) */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {/* Dấu chấm đỏ thông báo */}
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-600 border border-background"></span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full p-2" align="start">
              <DropdownMenuItem>
                <Input
                  type="search"
                  placeholder="Tìm kiếm bài viết..."
                  className="w-full bg-muted/50 pl-9 focus-visible:bg-background"
                />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Avatar User (Nếu đã login) - Placeholder */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Image
                  src="/user_default.jpg"
                  alt="User Avatar"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full p-2" align="start">
              <DropdownMenuLabel>User Name</DropdownMenuLabel>
              <DropdownMenuGroup>
                <DropdownMenuItem className="cursor-pointer" asChild>
                  <Link href="/profile">Hồ sơ của tôi</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
