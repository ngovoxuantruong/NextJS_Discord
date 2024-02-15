import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { ServerMembers } from "./server-members";
import { Member, MemberRole, Profile } from "@prisma/client";

interface ServerMemberProps {
  serverId: string;
}

type GroupedMember = {
  [role in MemberRole]: Member & { profile: Profile }[];
};

export const ServerMember = async ({ serverId }: ServerMemberProps) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirect("/");
  }

  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      channels: {
        orderBy: {
          createdAt: "asc",
        },
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: "asc",
        },
      },
    },
  });

  const members = server?.members?.filter((member) => member.profileId);

  if (!server) {
    return redirect("/");
  }

  if (!members) {
    return <div>No members available</div>;
  }

  const groupedMembers: GroupedMember = members.reduce((acc: any, member) => {
    const { role } = member;
    acc[role] = acc[role] || [];
    acc[role].push(member);
    return acc;
  }, {});

  return (
    <div>
      {Object.entries(groupedMembers).map(([role, members]: any) => (
        <>
          {members.map((member: any) => (
            <ServerMembers key={member.id} role={role} member={member} length={members.length} />
          ))}
        </>
      ))}
    </div>
  );
};
