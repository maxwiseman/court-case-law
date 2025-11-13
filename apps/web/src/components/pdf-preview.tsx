"use client";

import { useQuery } from "@tanstack/react-query";
import type { PDFDocumentProxy } from "pdfjs-dist";
import { useEffect, useState } from "react";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Dynamic imports to avoid server-side rendering issues
let Document: any = null;
let Page: any = null;
let pdfjs: any = null;

const loadPDFJS = async () => {
  if (typeof window === "undefined") return;

  const {
    Document: Doc,
    Page: Pg,
    pdfjs: pdfjsLib,
  } = await import("react-pdf");

  Document = Doc;
  Page = Pg;
  pdfjs = pdfjsLib;

  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
  ).toString();
};

export function PDFPreview({ filename }: { filename: string }) {
  const [isPDFJSLoaded, setIsPDFJSLoaded] = useState(false);

  useEffect(() => {
    loadPDFJS().then(() => setIsPDFJSLoaded(true));
  }, []);

  const { data } = useQuery({
    queryFn: async () => {
      const res = await fetch(`/documents/${filename}`);
      const blob = await res.blob();
      return new File([blob], filename, {
        type: blob.type,
        lastModified: Date.now(),
      });
    },
    queryKey: [filename],
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
  const [numPages, setNumPages] = useState(0);

  console.log(data);

  if (!isPDFJSLoaded || !Document || !Page) {
    return <div>Loading PDF viewer...</div>;
  }

  if (data) {
    return (
      <div className="relative size-full">
        <div className="absolute inset-0 overflow-scroll bg-neutral-50">
          <div className="mx-auto w-[700px] bg-white">
            <Document
              className="divide-y"
              file={data}
              key={crypto.randomUUID()}
              onLoadSuccess={({ numPages: newNumPages }: PDFDocumentProxy) => {
                setNumPages(newNumPages);
              }}
            >
              {Array.from(new Array(numPages), (_el, index) => (
                <Page
                  key={`page_${index + 1}`}
                  pageNumber={index + 1}
                  width={700}
                  // width={containerWidth ? Math.min(containerWidth, maxWidth) : maxWidth}
                />
              ))}
            </Document>
          </div>
        </div>
      </div>
    );
  }
  return <div>Loading...</div>;
}
