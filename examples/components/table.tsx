"use client";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const TableDemo = () => {
  const [selected, setSelected] = useState("Dune");
  return (
    <Table>
      <TableCaption>Select a book to highlight its row.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Author</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[
          ["Dune", "Frank Herbert"],
          ["The Left Hand of Darkness", "Ursula K. Le Guin"],
          ["Foundation", "Isaac Asimov"],
        ].map(([title, author]) => (
          <TableRow key={title} interactive selected={selected === title}>
            <TableCell>{title}</TableCell>
            <TableCell>{author}</TableCell>
            <TableCell>
              <Button
                variant="ghost"
                size="compact"
                aria-pressed={selected === title}
                onClick={() => setSelected(title)}
              >
                Select {title}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
