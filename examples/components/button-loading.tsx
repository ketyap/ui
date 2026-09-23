"use client";
import { useState } from "react";

import { Button } from "@/components/ui/button";

export const ButtonLoadingDemo = () => {
  const [loading, setLoading] = useState(false);
  return (
    <div className="flex gap-2">
      <Button loading={loading} onClick={() => setLoading(true)}>
        Save
      </Button>
      <Button variant="ghost" onClick={() => setLoading(false)}>
        Reset loading
      </Button>
    </div>
  );
};
