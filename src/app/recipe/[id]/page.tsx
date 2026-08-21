"use client"

import { use } from "react"
import { RecipeCard } from "@/components/recipe-card"

export default function RecipePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  return <RecipeCard projectId={id} />
}
