import { currentProfile } from "@/lib/current-profile";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { ServerSidebar } from "@/components/server/server-sidebar";
import { ServerMember } from "@/components/server/server-member";

const ServerIdLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { serverId: string };
}) => {
  const profile = await currentProfile();

  if (!profile) return redirectToSignIn();

  const server = await db.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (!server) {
    return redirect("/");
  }

  return (
    <div className=" flex justify-between h-full">
      <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
        <ServerSidebar serverId={params.serverId} />
      </div>
      <main className="h-full md:pl-60">{children}</main>
      <div className="flex flex-col line-clamp-1 w-[240px] h-full pb-5 bg-white-bg-secondary dark:bg-dark-bg-secondary">
        <ServerMember serverId={params.serverId} />
      </div>
    </div>
  );
};

export default ServerIdLayout;
