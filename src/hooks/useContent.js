import { useEffect, useState } from "react";
import { contentService } from "../services/contentService.js";

export function useContent() {
  const [state, setState] = useState({ content: contentService.getSnapshot(), loading: true, error: "" });

  useEffect(() => {
    let active = true;
    const unsubscribe = contentService.subscribe(() => {
      if (active) setState({ content: contentService.getSnapshot(), loading: false, error: "" });
    });
    contentService.load().catch(error => {
      if (active) setState(current => ({ ...current, loading: false, error: error.message || "Could not load content." }));
    });
    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  return state;
}