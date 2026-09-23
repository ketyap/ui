import type { ReactNode } from "react";

import { ComponentSource } from "@/components/component-source";
import { DocsPreview } from "@/components/docs-preview";

export const ComponentPreview = ({
  name,
  src,
  title,
  children,
}: {
  name?: string;
  src?: string;
  title?: string;
  children?: ReactNode;
}) => (
  <DocsPreview
    code={
      <ComponentSource
        name={name}
        src={src}
        title={title}
        collapsible={false}
      />
    }
  >
    {children}
  </DocsPreview>
);
