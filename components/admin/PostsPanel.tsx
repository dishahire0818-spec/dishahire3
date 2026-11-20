"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ExternalLink, ImagePlus, Loader2, Pencil, Trash2, X } from "lucide-react";
import type { PostDTO } from "@/lib/posts";
import { FormError, inputCls } from "../forms/fields";
import { btn, cn } from "../ui";

const CATEGORIES = ["Company news", "Hiring tips", "Career advice", "Industry insights"];
type Call = (url: string, method: string, body?: unknown) => Promise<Record<string, unknown>>;

export function PostsPanel({ posts, query, call, onChanged, onEdit }: { posts: PostDTO[]; query: string; call: Call; onChanged: () => void; onEdit: (p: PostDTO) => void }) {
  const q = query.trim().toLowerCase();
  const rows = posts.filter((p) => !q || `${p.title} ${p.category} ${p.excerpt}`.toLowerCase().includes(q));
  if (rows.length === 0) {
    return (
      <div className="grid place-items-center rounded-2xl border border-dashed border-line bg-white p-12 text-center text-sm text-muted">
        <p className="font-display text-2xl text-brand-900">No updates yet</p>
        <p className="mt-1">Click &ldquo;New update&rdquo; to write your first post: company news, hiring tips or career advice.</p>
      </div>
    );
  }
  const iconBtn = "grid h-9 w-9 place-items-center rounded-lg border border-line text-muted hover:border-brand-900 hover:text-brand-900";
  return (
    <ul className="space-y-3">
      {rows.map((p) => (
        <li key={p.id} className="flex flex-col gap-4 rounded-2xl border border-line bg-white p-4 sm:flex-row sm:items-center">
          <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-xl bg-brand-900 sm:w-32">
            {p.coverUrl ? (
              // eslint-disable-next-line @next/next/no-img-element -- admin thumbnail
              <img src={p.coverUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="absolute inset-0 grid place-items-center px-2 text-center font-display text-sm text-shine-light">{p.category}</span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className={cn("rounded-full px-2.5 py-0.5 font-medium", p.status === "published" ? "bg-emerald-50 text-emerald-800" : "bg-gray-100 text-gray-600")}>
                {p.status === "published" ? "Published" : "Draft"}
              </span>
              <span className="text-muted">{p.category}</span>
              <span className="text-muted">· edited {new Date(p.updatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
            </div>
            <p className="mt-1.5 font-display text-2xl leading-tight text-brand-900">{p.title}</p>
            {p.excerpt && <p className="mt-1 line-clamp-1 text-sm text-muted">{p.excerpt}</p>}
          </div>
          <div className="flex gap-2">
            {p.status === "published" && (
              <Link href={`/updates/${p.slug}`} target="_blank" className={iconBtn} aria-label="View on website" title="View on website">
                <ExternalLink size={16} />
              </Link>
            )}
            <button type="button" onClick={() => onEdit(p)} className={iconBtn} aria-label="Edit" title="Edit">
              <Pencil size={16} />
            </button>
            <button
              type="button"
              className={cn(iconBtn, "hover:border-red-600 hover:text-red-600")}
              aria-label="Delete"
              title="Delete"
              onClick={async () => {
                if (!confirm(`Delete "${p.title}" permanently?`)) return;
                try {
                  await call(`/api/admin/posts/${p.id}`, "DELETE");
                  onChanged();
                } catch (err) {
                  alert((err as Error).message);
                }
              }}
            >
              <Trash2 size={16} />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function PostEditor({ post, call, onClose, onSaved }: { post: PostDTO | null; call: Call; onClose: () => void; onSaved: () => void }) {
  const [f, setF] = useState({
    title: post?.title ?? "",
    slug: post?.slug ?? "",
    category: post?.category ?? CATEGORIES[0],
    excerpt: post?.excerpt ?? "",
    content: post?.content ?? "",
    coverId: post?.coverId ?? "",
  });
  const [cover, setCover] = useState(post?.coverUrl ?? "");
  const [busy, setBusy] = useState<"" | "draft" | "published" | "upload">("");
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF((v) => ({ ...v, [k]: e.target.value }));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function upload(file: File) {
    setBusy("upload");
    setError("");
    try {
      const fd = new FormData();
      fd.set("file", file);
      const res = await fetch("/api/admin/media", { method: "POST", body: fd });
      const out = await res.json();
      if (!res.ok) throw new Error(out.error || "Upload failed");
      setF((v) => ({ ...v, coverId: out.id }));
      setCover(out.url);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy("");
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function save(status: "draft" | "published") {
    if (!f.title.trim()) return setError("Add a title first.");
    setBusy(status);
    setError("");
    try {
      await call(post ? `/api/admin/posts/${post.id}` : "/api/admin/posts", post ? "PATCH" : "POST", { ...f, status });
      onSaved();
    } catch (err) {
      setError((err as Error).message);
      setBusy("");
    }
  }

  const label = "mb-1.5 block text-sm font-medium text-brand-900";
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-brand-950/60 p-4 backdrop-blur-sm" role="dialog" aria-modal aria-labelledby="post-editor-title">
      <div className="mx-auto my-6 w-full max-w-3xl rounded-[1.75rem] bg-white p-6 shadow-2xl sm:p-8">
        <div className="mb-6 flex items-start justify-between gap-4">
          <h2 id="post-editor-title" className="text-3xl text-brand-900">{post ? "Edit update" : "New update"}</h2>
          <button type="button" onClick={onClose} className="rounded-full p-1.5 text-muted hover:bg-cream" aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div className="grid gap-5">
          {/* Cover */}
          <div>
            <span className={label}>Cover image <span className="font-normal text-muted">(optional, JPG/PNG/WebP up to 2 MB, wide 16:9 works best)</span></span>
            <div className="relative grid aspect-[16/7] place-items-center overflow-hidden rounded-2xl border border-dashed border-line bg-cream">
              {cover ? (
                // eslint-disable-next-line @next/next/no-img-element -- local preview
                <img src={cover} alt="" className="absolute inset-0 h-full w-full object-cover" />
              ) : (
                <span className="text-sm text-muted">No cover image</span>
              )}
              <div className="absolute right-3 bottom-3 flex gap-2">
                {cover && (
                  <button type="button" onClick={() => { setCover(""); setF((v) => ({ ...v, coverId: "" })); }} className="rounded-full bg-white/90 px-3 py-1.5 text-xs text-brand-900 shadow">
                    Remove
                  </button>
                )}
                <button type="button" onClick={() => fileRef.current?.click()} disabled={busy === "upload"} className="inline-flex items-center gap-1.5 rounded-full bg-brand-900 px-3 py-1.5 text-xs text-white shadow">
                  {busy === "upload" ? <Loader2 size={13} className="animate-spin" /> : <ImagePlus size={13} />}
                  {cover ? "Change" : "Upload image"}
                </button>
              </div>
              <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
            </div>
          </div>

          <label>
            <span className={label}>Title *</span>
            <input className={cn(inputCls, "font-display text-2xl")} maxLength={160} value={f.title} onChange={set("title")} placeholder="e.g. 5 tips to ace your next interview" />
          </label>
          <div className="grid gap-5 sm:grid-cols-2">
            <label>
              <span className={label}>Category</span>
              <select className={cn(inputCls, "appearance-none")} value={f.category} onChange={set("category")}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </label>
            <label>
              <span className={label}>Web address <span className="font-normal text-muted">(auto from title if empty)</span></span>
              <div className="flex items-center rounded-xl border border-line px-3 text-sm focus-within:border-brand-900">
                <span className="text-muted">/updates/</span>
                <input className="min-w-0 flex-1 bg-transparent py-3 outline-none" value={f.slug} onChange={(e) => setF((v) => ({ ...v, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") }))} maxLength={80} />
              </div>
            </label>
          </div>
          <label>
            <span className={label}>Short summary <span className="font-normal text-muted">(shown on cards and in Google, max 300 characters)</span></span>
            <textarea className={cn(inputCls, "resize-y")} rows={2} maxLength={300} value={f.excerpt} onChange={set("excerpt")} />
          </label>
          <label>
            <span className={label}>Content</span>
            <textarea className={cn(inputCls, "min-h-72 resize-y font-mono text-[13px] leading-relaxed")} maxLength={50000} value={f.content} onChange={set("content")} placeholder={"Write your post here. Leave an empty line between paragraphs.\n\n## A heading\n\n- A bullet point\n- Another point\n\n**Bold text**, *italic text* and [a link](https://example.com)"} />
            <span className="mt-1.5 block text-xs text-muted">
              Formatting: <code>## Heading</code> · <code>- bullet</code> · <code>1. numbered</code> · <code>&gt; quote</code> · <code>**bold**</code> · <code>*italic*</code> · <code>[text](https://link)</code>
            </span>
          </label>

          <FormError>{error}</FormError>
          <div className="flex flex-col-reverse gap-3 border-t border-line pt-5 sm:flex-row sm:justify-end">
            <button type="button" onClick={onClose} className={btn.outline}>Cancel</button>
            <button type="button" onClick={() => save("draft")} disabled={!!busy} className={btn.outline}>
              {busy === "draft" && <Loader2 size={16} className="animate-spin" />}
              {post?.status === "published" ? "Unpublish (save as draft)" : "Save draft"}
            </button>
            <button type="button" onClick={() => save("published")} disabled={!!busy} className={btn.dark}>
              {busy === "published" && <Loader2 size={16} className="animate-spin" />}
              {post?.status === "published" ? "Update" : "Publish"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
