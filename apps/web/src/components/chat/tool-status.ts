import { type Icon, IconFileText, IconWorld } from "@tabler/icons-react";

export const toolStatus: Record<string, { icon: Icon; text: string }> = {
  file_search: {
    icon: IconFileText,
    text: "Searching documents",
  },
  web_search: {
    icon: IconWorld,
    text: "Searching the web",
  },
};
