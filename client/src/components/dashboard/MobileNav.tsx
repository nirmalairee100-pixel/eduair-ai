"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import Sidebar, { type Conversation } from "@/components/dashboard/Sidebar";

interface MobileNavProps {
  userEmail: string;
  conversations?: Conversation[];
  activeId?: string | null;
  onSelect?: (id: string | null) => void;
  onNewChat?: () => void;
}

export default function MobileNav({
  userEmail,
  conversations = [],
  activeId = null,
  onSelect,
  onNewChat,
}: MobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden sticky top-0 z-30 flex items-center gap-3 border-b border-slate-900/60 bg-[#030712]/80 backdrop-blur-xl px-4 py-3">
      <button
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 text-slate-300 hover:bg-slate-900/50 transition-colors"
      >
        <Menu size={16} />
      </button>
      <div className="flex items-center gap-2">
        <img
          src="/icon-192.png"
          alt="EduAir"
          className="h-6 w-6 rounded-md object-contain"
        />
        <span className="text-sm font-bold tracking-tight text-white">
          EduAir<span className="text-indigo-400">.ai</span>
        </span>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-3/4 p-0 border-slate-900 bg-[#030712]">
          <SheetTitle className="sr-only">Navigation menu</SheetTitle>
          <div onClick={() => setOpen(false)} className="h-full">
            <Sidebar
              userEmail={userEmail}
              conversations={conversations}
              activeId={activeId}
              onSelect={onSelect}
              onNewChat={onNewChat}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
