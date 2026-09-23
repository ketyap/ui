"use client";
import type { ReactNode } from "react";

import { PreviewStyle } from "@/components/preview-preferences";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const DocsPreview = ({
  children,
  code,
}: {
  children: ReactNode;
  code: ReactNode;
}) => (
  <Tabs
    data-docs-preview
    variant="subtle"
    defaultValue="preview"
    className="not-prose my-6 min-w-0"
  >
    <TabsList aria-label="Example display">
      <TabsTrigger value="preview">Preview</TabsTrigger>
      <TabsTrigger value="code">Code</TabsTrigger>
    </TabsList>
    <TabsContent
      value="preview"
      className="min-w-0 rounded-xl border p-6 md:p-8"
    >
      <PreviewStyle>{children}</PreviewStyle>
    </TabsContent>
    <TabsContent value="code" className="min-w-0">
      {code}
    </TabsContent>
  </Tabs>
);
