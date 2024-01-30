"use client";

import axios from "axios";
import * as z from "zod";
import { useForm } from "react-hook-form";
import qs from "query-string";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useRouter } from "next/navigation";
import { useModal } from "@/app/hooks/use-modal-store";

export const DeleteServerModal = () => {
  const { data, type, isOpen, onClose } = useModal();
  const isModalOpen = isOpen && type === "deleteModal";
  const { server } = data;
  const router = useRouter();

  const formSchema = z.object({
    name: z
      .string()
      .min(1, { message: "Please enter your server name." })
      .includes(`${server?.name}`, {
        message: "You didn't enter the server name correctly.",
      }),
  });
  type formSchemaValidator = z.infer<typeof formSchema>;
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async () => {
    try {
      await axios.delete(`/api/servers/${server?.id}`);
      form.reset();
      router.refresh();
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[440px] bg-white dark:bg-darkBg dark:text-darkBgText text-black p-0 overflow-hidden">
        <DialogHeader className="pt-4 px-6">
          <DialogTitle className="text-xl text-dark text-left font-semibold">
            Delete {`'${server?.name}' server`}
          </DialogTitle>
          <DialogDescription className="bg-[#AF7615] dark:bg-[#F0B132] text-left text-white p-3 rounded-md">
            Are you sure you want to delete <strong>{server?.name} server</strong>? This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-[#DBDEE1]">
                      Enter server name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-300/50 dark:bg-[#1E1F22] border-0 focus-visible:ring-0 text-black dark:text-[#DBDEE1] focus-visible:ring-offset-0"
                        placeholder="Enter server name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="bg-gray-100 dark:bg-darkBgFooter px-6 py-4">
              <DialogClose
                disabled={isLoading}
                className="mr-2 hover:underline hover:underline-offset-4 text-sm"
              >
                Cancel
              </DialogClose>
              <Button
                disabled={isLoading}
                className="bg-rose-500 hover:bg-rose-500/60 dark:text-white"
              >
                Delete Server
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
