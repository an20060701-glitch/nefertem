import { compressImage } from "@/lib/collection/image";
import type { CollectionRepo } from "@/lib/collection/types";
import type { FragranceFormResult } from "./FragranceForm";

/** Form result → repo: shrink the photo first, only where photos are supported. */
export async function addFromForm(repo: CollectionRepo, { draft, image }: FragranceFormResult) {
  const blob = image && repo.supportsImages ? await compressImage(image) : undefined;
  return repo.add(draft, { image: blob });
}

export async function updateFromForm(
  repo: CollectionRepo,
  id: string,
  { draft, image }: FragranceFormResult,
) {
  const blob = image && repo.supportsImages ? await compressImage(image) : image === null ? null : undefined;
  return repo.update(id, draft, { image: blob });
}
