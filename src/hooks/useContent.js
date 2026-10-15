import { useSyncExternalStore } from "react";
import { contentService } from "../services/contentService.js";

export function useContent() {
  return useSyncExternalStore(contentService.subscribe, contentService.getSnapshot, contentService.getSnapshot);
}