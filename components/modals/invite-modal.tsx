"use client";

import axios from "axios";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useModal } from "@/app/hooks/use-modal-store";
import { useOrigin } from "@/app/hooks/use-origin";
import { RefreshCcw } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const InviteModal = () => {
  const { onOpen, type, isOpen, onClose, data } = useModal();
  const origin = useOrigin();

  const isModalOpen = isOpen && type === "invite";

  const { server } = data;

  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inviteUrl = `${origin}/invite/${`${server?.inviteCode}`}`;

  const onCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  const onNew = async () => {
    try {
      setIsLoading(true);
      const response = await axios.patch(`/api/servers/${server?.id}/invite-code`);

      onOpen("invite", { server: response.data });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#313338] text-[#F2F3F5] p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className=" text-left font-medium">
            Invite friends to {server?.name}
          </DialogTitle>
        </DialogHeader>
        <div className="p-6">
          <Label className="uppercase text-xs text-[#B5BAC1] font-bold">
            Send a server invite link to a friend
          </Label>
          <div className="flex bg-[#1E1F22] items-center mt-2 gap-x-2">
            <Input
              disabled={isLoading}
              className="text-[#DBDEE1] bg-[#1E1F22] border-0 focus-vissible:ring-0 focus-visible:ring-offset-0"
              readOnly
              spellCheck="false"
              aria-label="Invite link"
              type="text"
              value={inviteUrl}
            />
            <Button
              disabled={isLoading}
              className={cn(
                "w-1/5 h-8 mr-1 rounded-sm bg-indigo-500 hover:bg-indigo-500/75 text-white",
                copied && "bg-green-500/75 hover:bg-green-500/50"
              )}
              onClick={onCopy}
            >
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
          <Button
            disabled={isLoading}
            onClick={onNew}
            variant={"link"}
            size={"sm"}
            className="text-sm text-[#00A8FC] mt-3 px-0"
          >
            Generate a new link
            <RefreshCcw className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
