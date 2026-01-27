"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Category, Meal } from "@/types";

interface NewMealFormProps {
  initialData?: Meal;
  categories: Category[];
  onSubmit: (data: any) => void;
  isLoading: boolean;
  onCancel: () => void;
}

export function NewMealForm({ initialData, categories, onSubmit, isLoading, onCancel }: NewMealFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<any>({
    defaultValues: initialData ? {
      title: initialData.title,
      description: initialData.description || "",
      price: String(initialData.price),
      image: initialData.image || "",
      categoryId: initialData.categoryId,
      isAvailable: initialData.isAvailable,
    } : {
      isAvailable: true,
      price: "",
    },
  });

  const handleFormSubmit = (data: any) => {
    // Manual validation or type conversion
    const price = Math.round(parseFloat(data.price));
    onSubmit({
      ...data,
      price: price
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 ml-1">Meal Title</label>
          <Input
            placeholder="Butter Chicken"
            {...register("title", { required: "Title is required", minLength: { value: 3, message: "Min 3 chars" } })}
          />
          {errors.title && <p className="text-xs text-red-500 ml-1">{errors.title.message as string}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 ml-1">Category</label>
          <select
            {...register("categoryId", { required: "Category is required" })}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          {errors.categoryId && <p className="text-xs text-red-500 ml-1">{errors.categoryId.message as string}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 ml-1">Price (BDT)</label>
          <Input
            type="number"
            placeholder="250"
            {...register("price", { required: "Price is required" })}
          />
          {errors.price && <p className="text-xs text-red-500 ml-1">{errors.price.message as string}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 ml-1">Image URL</label>
          <Input
            placeholder="https://example.com/meal.jpg"
            {...register("image")}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700 ml-1">Description</label>
        <textarea
          {...register("description")}
          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Describe your delicious meal..."
        />
      </div>

      <div className="flex items-center space-x-2">
        <input type="checkbox" {...register("isAvailable")} id="isAvailable" className="h-4 w-4 rounded border-gray-300 text-[#FF5200] focus:ring-[#FF5200]" />
        <label htmlFor="isAvailable" className="text-sm font-bold text-gray-700">Available for Order</label>
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" isLoading={isLoading}>
          {initialData ? "Update Meal" : "Add Meal"}
        </Button>
      </div>
    </form>
  );
}
