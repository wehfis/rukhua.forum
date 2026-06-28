"use client";

import { useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function UploadPanel() {
  const [file, setFile] = useState<File | null>(null);
  const [prefix, setPrefix] = useState("posts");
  const [publicUrl, setPublicUrl] = useState("");
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  async function onUpload() {
    if (!file) {
      setMessage("Choose a file first.");
      return;
    }

    setIsUploading(true);
    setMessage("");

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase();
    const key = `${prefix}/${Date.now()}-${safeName}`;
    const presignResponse = await fetch("/api/uploads/presign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, contentType: file.type })
    });
    const presign = await presignResponse.json();

    if (!presignResponse.ok || !presign.ok) {
      setMessage(presign.message ?? "Unable to sign upload.");
      setIsUploading(false);
      return;
    }

    const uploadResponse = await fetch(presign.uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file
    });

    if (!uploadResponse.ok) {
      setMessage("Upload failed.");
      setIsUploading(false);
      return;
    }

    setPublicUrl(presign.publicUrl);
    setMessage("Upload complete.");
    setIsUploading(false);
  }

  return (
    <section className="rounded-lg border border-border bg-white p-5">
      <div className="grid gap-5 md:grid-cols-[12rem_1fr]">
        <div>
          <h2 className="font-serif text-2xl">Upload Images</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Uses S3 presigned URLs for post, document, upload and avatar assets.
          </p>
        </div>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="upload-prefix">Folder</Label>
            <select
              id="upload-prefix"
              value={prefix}
              onChange={(event) => setPrefix(event.target.value)}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="posts">posts/</option>
              <option value="documents">documents/</option>
              <option value="uploads">uploads/</option>
              <option value="avatars">avatars/</option>
            </select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="upload-file">File</Label>
            <Input
              id="upload-file"
              type="file"
              accept="image/*,.pdf,.doc,.docx"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button type="button" onClick={onUpload} disabled={isUploading}>
              <Upload className="h-4 w-4" />
              Upload
            </Button>
            {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
          </div>
          {publicUrl ? (
            <Input value={publicUrl} readOnly aria-label="Uploaded public URL" />
          ) : null}
        </div>
      </div>
    </section>
  );
}
