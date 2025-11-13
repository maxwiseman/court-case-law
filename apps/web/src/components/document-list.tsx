/** biome-ignore-all lint/style/noNestedTernary: It's ok to have some nesting once in a while, just ask the nearest bird */
"use client";

import {
  IconFile,
  IconFileText,
  IconGavel,
  IconScale,
} from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useQueryState } from "nuqs";
import type { ReactNode } from "react";
import documentLibrary from "@/../library.json";
import { searchDocuments } from "@/actions/search";
import { cn, dedupeObjectList } from "@/lib/utils";

export type Document = (typeof documentLibrary)[number];

type DocumentListProps = {
  searchQuery: string;
  fullscreen?: boolean;
};

type DocumentItemProps = {
  doc: Document & Awaited<ReturnType<typeof searchDocuments>>[number];
  fullscreen?: boolean;
};

const iconMap = {
  "icj judgement": IconGavel,
  "other court case": IconScale,
  "other document": IconFileText,
};

function DocumentItem({ doc, fullscreen }: DocumentItemProps) {
  const [selectedDocumentId, setSelectedDocumentId] =
    useQueryState("selectedDoc");
  const selectedDocument = documentLibrary.find(
    (item) => item.filename === selectedDocumentId
  );
  const isSelected = !fullscreen && selectedDocument?.filename === doc.filename;

  const Icon = iconMap[doc?.type as keyof typeof iconMap] ?? IconFile;

  return (
    <button
      className={cn(
        "w-full rounded-lg p-4 text-left transition-colors",
        fullscreen
          ? "border border-border bg-muted/50 hover:bg-muted"
          : isSelected
            ? "bg-primary text-primary-foreground"
            : "text-foreground hover:bg-accent"
      )}
      onClick={() => setSelectedDocumentId(doc.filename)}
      type="button"
    >
      <div className="flex items-start gap-3">
        <Icon className="mt-0.5 h-5 w-5 shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-sm">{doc.shortTitle}</p>
          <p
            className={cn(
              "mb-1 text-xs",
              fullscreen ? "text-muted-foreground" : "opacity-75"
            )}
          >
            {/*{doc.citation}*/}
          </p>
          <p
            className={cn(
              "line-clamp-2 text-xs",
              fullscreen ? "text-muted-foreground" : "opacity-60"
            )}
          >
            {doc.content.map((c) => c.text).join("")}
          </p>
          {fullscreen && (
            <div className="mt-2 inline-block rounded bg-muted px-2.5 py-1 font-medium text-muted-foreground text-xs">
              {Math.round(doc.score * 100)}% match
            </div>
          )}
        </div>
      </div>
    </button>
  );
}

export default function DocumentList({
  searchQuery,
  fullscreen,
}: DocumentListProps) {
  const {
    data: searchResults,
    isFetched,
    isLoading,
  } = useQuery({
    queryFn: async () => await searchDocuments(searchQuery),
    queryKey: ["search", searchQuery],
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    gcTime: Number.POSITIVE_INFINITY,
    staleTime: Number.POSITIVE_INFINITY,
    enabled: searchQuery.trim().length >= 1,
  });
  if (isFetched && !isLoading) console.log("results", searchResults);

  if (searchQuery.trim().length < 1)
    return (
      <div className={cn(fullscreen ? "space-y-3" : "p-2")}>
        {documentLibrary.map((doc) => (
          <DocumentItem
            doc={{
              ...doc,
              score: 0,
              content: [{ type: "text", text: doc.shortSummary }],
              file_id: "",
              attributes: {},
            }}
            fullscreen={fullscreen}
            key={doc.filename}
          />
        ))}
      </div>
    );

  if (!searchResults) return <div>Loading...</div>;

  const formattedDocuments = dedupeObjectList(
    searchResults.map((result) => {
      const document = documentLibrary.find(
        (doc) => doc.filename === result.filename
      )!;
      return { ...result, ...document };
    }),
    (i) => i.filename
  );

  let content: ReactNode;

  if (formattedDocuments.length === 0) {
    content = (
      <div className="py-8 text-center text-muted-foreground">
        <p className="text-sm">No results found</p>
      </div>
    );
  } else {
    content = formattedDocuments.map((doc) => (
      <DocumentItem doc={doc} fullscreen={fullscreen} key={doc.filename} />
    ));
  }

  return <div className={cn(fullscreen ? "space-y-3" : "p-2")}>{content}</div>;
}
