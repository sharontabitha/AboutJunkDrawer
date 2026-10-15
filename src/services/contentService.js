import { getSupabase } from "./supabaseClient.js";

const imageBucket = "content-images";
const listeners = new Set();
let content = { parts: [], articles: [] };

function notify() {
  listeners.forEach(listener => listener());
}

function publicImageUrl(path) {
  if (!path) return "";
  return getSupabase().storage.from(imageBucket).getPublicUrl(path).data.publicUrl;
}

function mapPart(row) {
  return { id: row.id, cat: row.category, name: row.name, desc: row.description, spec: row.spec || "", img: publicImageUrl(row.image_path), imagePath: row.image_path };
}

function mapArticle(row) {
  return { id: row.id, title: row.title, by: row.author_name || "junkdrawer", body: row.body, img: publicImageUrl(row.image_path), imagePath: row.image_path };
}

function unwrap(result) {
  if (result.error) throw result.error;
  return result.data;
}

export const contentService = {
  getSnapshot: () => content,
  subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  async load() {
    const supabase = getSupabase();
    const [partsResult, articlesResult] = await Promise.all([
      supabase.from("parts").select("id, category, name, description, spec, image_path, created_at").order("created_at", { ascending: false }),
      supabase.from("articles").select("id, title, body, author_name, image_path, published, created_at").order("created_at", { ascending: false })
    ]);
    content = {
      parts: unwrap(partsResult).map(mapPart),
      articles: unwrap(articlesResult).map(mapArticle)
    };
    notify();
    return content;
  },
  async uploadImage(file, type, id) {
    if (!file || file.size === 0) return null;
    if (!file.type.startsWith("image/")) throw new Error("Choose an image file.");
    if (file.size > 5 * 1024 * 1024) throw new Error("Choose an image smaller than 5 MB.");

    const extension = file.name.split(".").pop()?.replace(/[^a-zA-Z0-9]/g, "") || "image";
    const path = `${type}/${id}/${crypto.randomUUID()}.${extension}`;
    const result = await getSupabase().storage.from(imageBucket).upload(path, file, {
      cacheControl: "3600",
      contentType: file.type,
      upsert: false
    });
    unwrap(result);
    return path;
  },
  async removeImage(path) {
    if (!path) return;
    unwrap(await getSupabase().storage.from(imageBucket).remove([path]));
  },
  async save(type, item, imagePath, isNew = false) {
    const supabase = getSupabase();
    const table = type === "part" ? "parts" : "articles";
    const values = type === "part"
      ? { category: item.cat, name: item.name, description: item.desc, spec: item.spec || "", image_path: imagePath ?? item.imagePath ?? null }
      : { title: item.title, body: item.body, author_name: item.by || "junkdrawer", image_path: imagePath ?? item.imagePath ?? null };
    const query = isNew
      ? supabase.from(table).insert({ id: item.id, ...values }).select("*").single()
      : supabase.from(table).update(values).eq("id", item.id).select("*").single();
    const row = unwrap(await query);
    const saved = type === "part" ? mapPart(row) : mapArticle(row);
    const key = type === "part" ? "parts" : "articles";
    content = { ...content, [key]: isNew ? [saved, ...content[key]] : content[key].map(entry => entry.id === saved.id ? saved : entry) };
    notify();
    return saved;
  },
  async delete(type, id) {
    const key = type === "part" ? "parts" : "articles";
    const table = type === "part" ? "parts" : "articles";
    const deleted = unwrap(await getSupabase().from(table).delete().eq("id", id).select("image_path").single());
    content = { ...content, [key]: content[key].filter(item => item.id !== id) };
    notify();
    if (deleted.image_path) await this.removeImage(deleted.image_path);
  }
};