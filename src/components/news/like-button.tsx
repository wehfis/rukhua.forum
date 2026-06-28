"use client";

import { useEffect, useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

function getFingerprint() {
  const key = "rukhua:fingerprint";
  const existing = localStorage.getItem(key);

  if (existing) {
    return existing;
  }

  const fingerprint =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  localStorage.setItem(key, fingerprint);
  return fingerprint;
}

export function LikeButton({
  postId,
  initialCount,
  label
}: {
  postId: string;
  initialCount: number;
  label: string;
}) {
  const [count, setCount] = useState(initialCount);
  const [liked, setLiked] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setLiked(localStorage.getItem(`rukhua:liked:${postId}`) === "true");
  }, [postId]);

  function onLike() {
    if (liked || isPending) {
      return;
    }

    startTransition(async () => {
      const fingerprint = getFingerprint();
      const response = await fetch("/api/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, fingerprint })
      });

      if (response.ok) {
        localStorage.setItem(`rukhua:liked:${postId}`, "true");
        setLiked(true);
        setCount((value) => value + 1);
      }
    });
  }

  return (
    <Button
      type="button"
      variant={liked ? "default" : "secondary"}
      onClick={onLike}
      disabled={liked || isPending}
      aria-pressed={liked}
    >
      <Heart className="h-4 w-4" />
      {count} {label}
    </Button>
  );
}
