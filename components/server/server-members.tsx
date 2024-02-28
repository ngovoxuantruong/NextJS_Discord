"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Member, MemberRole, Profile, Server } from "@prisma/client";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { UserAvatar } from "../user-avatar";

type ServerMembersProps = {
  role: MemberRole;
  member: Member & { profile: Profile };
  length: number;
};

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: <ShieldCheck className="w-4 h-4 mr-2 text-indigo-500" />,
  [MemberRole.ADMIN]: <ShieldAlert className="w-4 h-4 mr-2 text-rose-500" />,
};

export const ServerMembers = ({ role, member, length }: ServerMembersProps) => {
  const params = useParams();
  const router = useRouter();
  const icon = roleIconMap[role];

  const onClick = () => {
    router.push(`/servers/${params?.serverId}/conversations/${member.id}`);
  };

  return (
    <ScrollArea>
      <h3 className="pt-6 pr-2 pl-4 h-10 line-clamp-1 text-xs uppercase whitespace-nowrap leading-4 tracking-wide font-semibold text-[#949BA8]">
        {role} — {length}
      </h3>
      <div
        onClick={onClick}
        className={cn(
          "group px-2 py-2 ml-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1 cursor-pointer",
          params?.memberId === member.id && "bg-zinc-700/20 dark:bg-zinc-700"
        )}
      >
        <UserAvatar src={member.profile.imageUrl} className="w-8 h-8 md:h-8 md:w-8" />
        <p
          className={cn(
            "font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
            params?.memberId === member.id &&
              "text-primary dark:text-zinc-200 dark:group-hover:text-white"
          )}
        >
          {member.profile.name}
        </p>
      </div>
    </ScrollArea>
  );
};
