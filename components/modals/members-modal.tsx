"use client";

import axios from "axios";
import { useModal } from "@/app/hooks/use-modal-store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ServerWithMembersWithProfiles } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";

export const MembersModal = () => {
  const { onOpen, type, isOpen, onClose, data } = useModal();

  const isModalOpen = isOpen && type === "members";

  const { server } = data as { server: ServerWithMembersWithProfiles };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="dark:bg-darkBg dark:text-darkBgText p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className=" text-left font-medium">Manager members</DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-center text-zinc-500 dark:text-darkLabelText">
          {server?.members?.length}
        </DialogDescription>
        <ScrollArea></ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
