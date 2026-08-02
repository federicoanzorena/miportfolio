import { ChevronRight, FileCode2, Folder, FolderOpen } from "lucide-react";
import { useState } from "react";
import { content } from "../../data/content";
import type { FolderNode } from "../../types";
import { cn } from "../../utils/cn";

function TreeItem({ node }: { node: FolderNode }) {
  const [open, setOpen] = useState(true);
  const isFolder = node.kind === "folder";

  if (!isFolder) {
    return (
      <li className="group flex items-center gap-2 rounded-md px-2 py-1 transition-colors hover:bg-surface-2">
        <span
          aria-hidden
          className="grid size-4 shrink-0 place-items-center text-zinc-600"
        >
          <FileCode2 className="size-4" />
        </span>
        <span className="truncate font-mono text-[13px] text-zinc-400">
          {node.name}
        </span>
      </li>
    );
  }

  return (
    <li>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="group flex w-full items-center gap-2 rounded-md px-2 py-1 text-left transition-colors hover:bg-surface-2"
      >
        <ChevronRight
          aria-hidden
          className={cn(
            "size-3.5 shrink-0 text-zinc-600 transition-transform duration-200",
            open && "rotate-90",
          )}
        />
        <span aria-hidden className="grid size-4 shrink-0 place-items-center">
          {open ? (
            <FolderOpen className="size-4 text-accent-400" />
          ) : (
            <Folder className="size-4 text-zinc-500" />
          )}
        </span>
        <span className="font-mono text-[13px] font-medium text-zinc-200">
          {node.name}
        </span>
        {node.description ? (
          <span className="ml-auto hidden font-sans text-[11px] text-subtle md:block">
            {node.description}
          </span>
        ) : null}
      </button>
      <ul
        className={cn(
          "ml-[13px] overflow-hidden border-l border-line pl-3 transition-[max-height,opacity] duration-300",
          open ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0",
        )}
      >
        {node.children?.map((child) => (
          <TreeItem key={child.name} node={child} />
        ))}
      </ul>
    </li>
  );
}

export function ArchitectureTree() {
  const { architecture } = content;
  const root = architecture.tree[0];

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-[#0e0e14] shadow-[0_24px_80px_-32px_rgba(0,0,0,0.8)]">
      <div className="flex items-center gap-2 border-b border-line bg-surface/80 px-4 py-3">
        <span aria-hidden className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-[#ff5f57]" />
          <span className="size-2.5 rounded-full bg-[#febc2e]" />
          <span className="size-2.5 rounded-full bg-[#28c840]" />
        </span>
        <span className="ml-2 truncate rounded-md bg-surface-2 px-2.5 py-0.5 font-mono text-xs text-muted">
          src / components / ui
        </span>
        <span className="ml-auto hidden font-mono text-[11px] text-subtle sm:block">
          proyecto — Explorador
        </span>
      </div>

      <div className="p-4 sm:p-5">
        <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-widest text-subtle">
          ARCHIVOS
        </p>
        <ul>
          <TreeItem node={root} />
        </ul>
      </div>

      <div className="flex items-center justify-between border-t border-line bg-surface/60 px-4 py-2.5 font-mono text-[11px] text-subtle">
        <span>TypeScript</span>
        <span className="hidden sm:block">UTF-8</span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden className="size-1.5 rounded-full bg-emerald-500" />
          Listo
        </span>
      </div>
    </div>
  );
}
