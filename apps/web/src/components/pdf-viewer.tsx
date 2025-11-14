"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { Streamdown } from "streamdown";
import type { Document as DocumentType } from "@/components/document-list";
import { toTitleCase } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

type PDFViewerProps = {
  document: DocumentType;
};

export default function PDFViewer({ document }: PDFViewerProps) {
  const [isSummaryOpen, setIsSummaryOpen] = useState(true);

  return (
    <div className="flex h-full flex-col">
      {/* Document Header */}
      <div className="min-h-[85px] border-border border-b bg-card p-4">
        <h2 className="font-bold text-xl">{document.shortTitle}</h2>
        <p className="mt-1 text-muted-foreground text-sm">
          {`${toTitleCase(document.type).replace("Icj", "ICJ")} ⋅ ${document.date}`}
        </p>
      </div>

      {/* Summary Section */}
      <div className="border-border border-b">
        <button
          className="flex w-full items-center justify-between px-4 py-3 transition-colors hover:bg-accent"
          onClick={() => setIsSummaryOpen(!isSummaryOpen)}
          type="button"
        >
          <span className="font-semibold text-sm">Summary</span>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${isSummaryOpen ? "rotate-180" : ""}`}
          />
        </button>

        {isSummaryOpen && (
          <div className="border-border border-t bg-muted/30 px-4 py-3">
            <p className="text-foreground text-sm leading-relaxed">
              {document.shortSummary}{" "}
              <Dialog>
                <DialogTrigger asChild>
                  <span className="cursor-pointer text-muted-foreground hover:underline">
                    Read more...
                  </span>
                </DialogTrigger>
                <DialogContent className="max-h-[calc(100vh-4rem)] max-w-2xl! overflow-auto">
                  <DialogHeader className="-m-6 -top-6 sticky mb-0 border-b bg-background p-6 pt-6">
                    <DialogTitle>{document.shortTitle}</DialogTitle>
                    <DialogDescription>{`${toTitleCase(document.type).replace("Icj", "ICJ")} ⋅ ${document.date}`}</DialogDescription>
                  </DialogHeader>
                  {/*<p className="text-foreground text-sm leading-relaxed">
                    {document.detailedSummary}
                  </p>*/}
                  <Streamdown>{document.detailedSummary}</Streamdown>
                  <div className="-mx-6 border-border border-t px-6 pt-4">
                    <p className="mb-2 font-semibold text-muted-foreground text-xs">
                      Key Points:
                    </p>
                    <ul className="space-y-1 text-muted-foreground text-xs">
                      {/*<li>• Established important legal principle</li>
                        <li>• Relevant to constitutional interpretation</li>
                        <li>• Influenced subsequent decisions</li>*/}
                      {document.keyPoints.map((kp) => (
                        <li key={kp}>{`• ${kp}`}</li>
                      ))}
                    </ul>
                  </div>
                </DialogContent>
              </Dialog>
            </p>
            <div className="mt-3 border-border border-t pt-3">
              <p className="mb-2 font-semibold text-muted-foreground text-xs">
                Key Points:
              </p>
              <ul className="space-y-1 text-muted-foreground text-xs">
                {/*<li>• Established important legal principle</li>
                <li>• Relevant to constitutional interpretation</li>
                <li>• Influenced subsequent decisions</li>*/}
                {document.keyPoints.map((kp) => (
                  <li key={kp}>{`• ${kp}`}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* PDF Viewer Placeholder */}
      <div className="flex flex-1 items-center justify-center overflow-auto bg-background">
        {/*<PDFPreview filename={document.filename} />*/}
        <embed
          height="100%"
          src={`/documents/${document.filename}#toolbar=0`}
          type="application/pdf"
          width="100%"
        />
      </div>
    </div>
  );
}
