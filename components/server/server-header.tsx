"use client";

import { ServerWithMembersWithProfiles } from "@/types";
import { MemberRole } from "@prisma/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  ChevronDown,
  LogOut,
  PlusCircle,
  Settings,
  Trash2,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { useModal } from "@/app/hooks/use-modal-store";

interface ServerHeaderProps {
  server: ServerWithMembersWithProfiles;
  role?: MemberRole;
}

export const ServerHeader = ({ server, role }: ServerHeaderProps) => {
  const { onOpen } = useModal();
  const isAdmin = role === MemberRole.ADMIN;
  const isModerator = isAdmin || role === MemberRole.MODERATER;
  const [isMenuShow, setIsMenuShow] = useState(true);

  return (
    <DropdownMenu onOpenChange={() => setIsMenuShow(!isMenuShow)}>
      <DropdownMenuTrigger asChild className="focus:outline-none ">
        <button className="w-full text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition">
          {server.name}
          {isMenuShow ? (
            <ChevronDown className="h-5 w-5 ml-auto" />
          ) : (
            <X className="h-5 w-5 ml-auto" />
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px]">
        {isModerator && (
          <DropdownMenuItem
            onClick={() => onOpen("invite", { server })}
            className="text-indigo-6000 dark:text-indigo-400 px-3 py-2 text-sm cursor-pointer"
          >
            Invite People
            <UserPlus className="w-4 h-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isModerator && (
          <DropdownMenuItem
            onClick={() => onOpen("editServer", { server })}
            className=" px-3 py-2 text-sm cursor-pointer"
          >
            Server Settings
            <Settings className="w-4 h-4 ml-auto text-[#B5BAC1]" />
          </DropdownMenuItem>
        )}
        {isModerator && (
          <DropdownMenuItem
            onClick={() => onOpen("members", { server })}
            className=" px-3 py-2 text-sm cursor-pointer"
          >
            Manage Member
            <Users className="w-4 h-4 ml-auto text-[#B5BAC1]" />
          </DropdownMenuItem>
        )}
        {isModerator && (
          <DropdownMenuItem className=" px-3 py-2 text-sm cursor-pointer">
            Create Channel
            <PlusCircle className="w-4 h-4 ml-auto text-[#B5BAC1]" />
          </DropdownMenuItem>
        )}
        {isModerator && <DropdownMenuSeparator className="w-48 mx-auto" />}
        {isAdmin && (
          <DropdownMenuItem className="text-rose-500 px-3 py-2 text-sm cursor-pointer ">
            Delete Server
            <Trash2 className="w-4 h-4 ml-auto text-[#B5BAC1]" />
          </DropdownMenuItem>
        )}
        {!isAdmin && (
          <DropdownMenuItem className="text-rose-500 px-3 py-2 text-sm cursor-pointer ">
            Leave Server
            <LogOut className="w-4 h-4 ml-auto text-[#B5BAC1]" />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
