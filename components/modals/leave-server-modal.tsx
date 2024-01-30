"use client";

import axios from "axios";

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

export const LeaveServerModal = () => {
  const { data, type, isOpen, onClose } = useModal();
  const [isLoading, setIsLoading] = useState(false);
  const isModalOpen = isOpen && type === "leaveModal";
  const { server } = data;
  const router = useRouter();

  const onLeave = async () => {
    try {
      setIsLoading(true);

      await axios.patch(`/api/servers/${server?.id}/leave`);

      onClose();
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
        <DialogHeader className="pt-4 px-6">
          <DialogTitle className="text-xl text-dark text-left font-semibold">
            Leave {`'${server?.name}' server`}
          </DialogTitle>
          <DialogDescription className="text-left text-dark dark:text-darkLabelText">
            Are you sure you want to leave <strong>{server?.name} server</strong>? You won&apos;t be
            able to rejoin this server unless you are re-invited.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 dark:bg-darkBgFooter px-6 py-4">
          <DialogClose
            disabled={isLoading}
            className="mr-2 hover:underline hover:underline-offset-4 text-sm"
          >
            Cancel
          </DialogClose>
          <Button
            onClick={onLeave}
            disabled={isLoading}
            className="bg-rose-500 hover:bg-rose-500/60 dark:text-white"
          >
            Leave server
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
