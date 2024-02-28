import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface ServerIdPageProps {
  params: {
    serverId: string;
  };
}

const ServerIdPage = async ({ params }: ServerIdPageProps) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const server = await db.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
    include: {
      channels: { where: { type: "TEXT" } },
    },
  });

  const initialChannelText = server?.channels[0];

  return (
    <>
      {!initialChannelText ? (
        <div className="flex flex-col justify-center items-center w-full h-full">
          <div className="max-w-md">
            <h2 className="text-lg font-semibold leading-5 uppercase text-center text-zinc-400">
              No text channels
            </h2>
            <div className="text-center pt-3 leading-5 text-zinc-400">
              You find yourself in a strange place. You don&apos;t have access to any text channels,
              or there are none in this server.
            </div>
          </div>
        </div>
      ) : (
        redirect(`/servers/${params.serverId}/channels/${initialChannelText.id}`)
      )}
    </>
  );
};

export default ServerIdPage;
