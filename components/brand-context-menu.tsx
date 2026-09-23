"use client";

import { DownloadIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useCallback } from "react";

import { LogoMark, getLogoMarkSVG } from "@/components/logo";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { toastManager } from "@/components/ui/toast";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

export const BrandContextMenu = ({
  children,
}: {
  children: React.ReactElement;
}) => {
  const { resolvedTheme } = useTheme();
  const { copyToClipboard } = useCopyToClipboard();

  const logoMarkSvgString = getLogoMarkSVG(
    resolvedTheme === "light" ? "#000" : "#fff"
  );

  const handleCopy = useCallback(() => {
    copyToClipboard(logoMarkSvgString);
    toastManager.add({ title: "Icon as SVG copied", type: "success" });
  }, [logoMarkSvgString, copyToClipboard]);

  const handleDownload = useCallback(() => {
    const blob = new Blob([logoMarkSvgString], {
      type: "image/svg+xml;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "icon.svg";
    a.click();
    URL.revokeObjectURL(url);
    toastManager.add({ title: "Icon as SVG downloaded", type: "success" });
  }, [logoMarkSvgString]);

  return (
    <ContextMenu>
      <ContextMenuTrigger render={children} />

      <ContextMenuContent>
        <ContextMenuItem onClick={handleCopy}>
          <LogoMark />
          Copy as SVG
        </ContextMenuItem>

        <ContextMenuItem onClick={handleDownload}>
          <DownloadIcon /> Download as SVG
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};
