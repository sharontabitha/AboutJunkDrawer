import { seedContent } from "../data/seedData.js";

const contentKey = "junkdrawer-content-v1";
const versionKey = `${contentKey}-seed`;
const listeners = new Set();
const copy = value => JSON.parse(JSON.stringify(value));

function readContent() {
  try {
    return JSON.parse(localStorage.getItem(contentKey)) || copy(seedContent);
  } catch {
    return copy(seedContent);
  }
}

let content = readContent();

if (localStorage.getItem(versionKey) !== String(seedContent.version)) {
  const partIds = new Set(content.parts.map(item => item.id));
  const articleIds = new Set(content.articles.map(item => item.id));
  content.parts = [...seedContent.parts.filter(item => !partIds.has(item.id)), ...content.parts];
  content.articles = [...seedContent.articles.filter(item => !articleIds.has(item.id)), ...content.articles];
  localStorage.setItem(versionKey, String(seedContent.version));
}

function notify() {
  listeners.forEach(listener => listener());
}

window.addEventListener("storage", event => {
  if (event.key !== contentKey || !event.newValue) return;
  try {
    content = JSON.parse(event.newValue);
    notify();
  } catch {
    // Ignore malformed content from another tab.
  }
});

export const contentService = {
  getSnapshot: () => content,
  subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  update(updater) {
    const next = updater(content);
    try {
      localStorage.setItem(contentKey, JSON.stringify(next));
      content = next;
      notify();
      return true;
    } catch {
      return false;
    }
  }
};