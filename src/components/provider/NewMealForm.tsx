"use client"

import React, { useState } from "react"
import { Category, Meal } from "@/types"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ImagePlus, Package, DollarSign, FileText, CheckCircle2, XCircle } from "lucide-react"

interface NewMealFormProps {
  initialData?: Meal
  categories: Category[]
  onSubmit: (data: any) => Promise<void>
  isLoading: boolean
  onCancel: () => void
}

export function NewMealForm({
  initialData,
  categories,
  onSubmit,
  isLoading,
  onCancel,
}: NewMealFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    price: initialData?.price?.toString() || "",
    image: initialData?.image || "",
    categoryId: initialData?.categoryId || (categories.length > 0 ? categories[0].id : ""),
    isAvailable: initialData?.isAvailable ?? true,
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement
    const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value
    setFormData((prev) => ({ ...prev, [name]: val }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const submissionData = {
      ...formData,
      price: parseFloat(formData.price),
    }
    await onSubmit(submissionData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 flex items-center">
              <Package size={16} className="mr-2 text-orange-500" />
              Meal Title
            </label>
            <Input
              name="title"
              placeholder="e.g. Spicy Grilled Chicken"
              value={formData.title}
              onChange={handleChange}
              required
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 flex items-center">
              <DollarSign size={16} className="mr-2 text-orange-500" />
              Price (TK)
            </label>
            <Input
              name="price"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.price}
              onChange={handleChange}
              required
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 flex items-center">
              <FileText size={16} className="mr-2 text-orange-500" />
              Description
            </label>
            <textarea
              name="description"
              placeholder="Describe your delicious meal..."
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 flex items-center">
              <ImagePlus size={16} className="mr-2 text-orange-500" />
              Image URL
            </label>
            <Input
              name="image"
              placeholder="e.g. /images/my-meal.jpg"
              value={formData.image}
              onChange={handleChange}
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 flex items-center">
              Category
            </label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              required
              className="w-full h-12 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="" disabled>Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2 pt-4">
            <input
              type="checkbox"
              id="isAvailable"
              name="isAvailable"
              checked={formData.isAvailable}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
            />
            <label htmlFor="isAvailable" className="text-sm font-bold text-gray-700">
              Mark as Available for Order
            </label>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-100">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
          className="h-12 px-6 font-bold"
        >
          <XCircle size={18} className="mr-2" />
          Cancel
        </Button>
        <Button
          type="submit"
          isLoading={isLoading}
          className="h-12 px-8 font-bold"
        >
          <CheckCircle2 size={18} className="mr-2" />
          {initialData ? "Update Meal" : "Add to Menu"}
        </Button>
      </div>
    </form>
  )
}
