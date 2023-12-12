import Link from "next/link";
import React from "react";
import { ModeToggle } from "./mode-toggler";
import { Button } from "./ui/button";
import { signOut, useSession } from "next-auth/react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const Navbar = () => {
  const { data: session } = useSession();

  return (
    <div className="bg-background sticky top-0 flex items-center justify-between border-b-2 px-12 py-2 text-center">
      <div className="flex items-center space-x-8">
        <Link
          href="/"
          className="mr-12 bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-xl font-bold tracking-wide text-transparent"
        >
          modabul.
        </Link>
        <Link href="/about">about</Link>
        <Link href="/pricing">pricing</Link>
      </div>
      <div className="flex items-center space-x-4">
        <ModeToggle />
        {session ? (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant={"outline"} size={"icon"}>
                <User />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                Team
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                Subscription
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive cursor-pointer"
                onClick={() => signOut()}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button asChild variant="purple">
            <Link href="/login">Giriş Yap</Link>
          </Button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
