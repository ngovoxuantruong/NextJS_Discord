"use client";

import axios from "axios";
import qs from "query-string";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useModal } from "@/app/hooks/use-modal-store";
import { useState } from "react";

export const DeleteChannelModal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { data, type, isOpen, onClose } = useModal();
  const router = useRouter();

  const isModalOpen = isOpen && type === "deleteChannel";
  const { server, channel } = data;

  const onSubmit = async () => {
    try {
      setIsLoading(true);
      const url = qs.stringifyUrl({
        url: `/api/channels/${channel?.id}`,
        query: {
          serverId: server?.id,
        },
      });
      await axios.delete(url);
      onClose();
      router.push(`/servers/${server?.id}`);
      router.refresh();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
  };
  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[440px] bg-white dark:bg-darkBg dark:text-darkBgText text-black p-0 overflow-hidden">
        <DialogHeader className="pt-5 px-4">
          <DialogTitle className="text-xl text-dark text-left font-semibold">
            Delete Channel
          </DialogTitle>
          <DialogDescription className="text-left text-white rounded-md">
            Are you sure you want to delete <strong>#{channel?.name} server</strong>? This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="bg-gray-100 dark:bg-dark-bg-secondary px-6 py-4">
          <DialogClose
            disabled={isLoading}
            className="mr-2 hover:underline hover:underline-offset-4 text-sm"
          >
            Cancel
          </DialogClose>
          <Button
            disabled={isLoading}
            type="submit"
            onClick={() => onSubmit()}
            className="bg-rose-500 hover:bg-rose-500/60 dark:text-white"
          >
            Delete Channel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
