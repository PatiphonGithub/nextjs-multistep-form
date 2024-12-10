"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { NumericFormat } from "react-number-format";

/**
 * Interface representing an individual item.
 */
export interface Item {
  id: number; // Unique identifier for the item
  amount: number; // Quantity of the item
  price: string; // Price per unit as a formatted string
  description: string; // Description of the item
}

/**
 * Props for the ItemForm component.
 * @param items - Current array of items.
 * @param onItemsChange - Callback to update the items array in the parent component.
 */
interface ItemFormProps {
  items: Item[]; // List of items to be displayed
  onItemsChange: (items: Item[]) => void; // Function to handle changes in items
}

/**
 * ItemForm Component
 * Allows users to manage a list of items with fields for amount, price, and description.
 *
 * Features:
 * - Add new items
 * - Edit existing items
 * - Remove items
 * - Calculate totals per item and overall grand total
 *
 * @param items - List of current items.
 * @param onItemsChange - Callback to update the items array.
 */
export default function ItemForm({ items, onItemsChange }: ItemFormProps) {
  const [nextId, setNextId] = useState(items.length + 1); 

  /**
   * Adds a new item with default values.
   */
  const addItem = () => {
    const newItems = [
      ...items,
      { id: nextId, amount: 1, price: "", description: "" },
    ];
    onItemsChange(newItems);
    setNextId(nextId + 1);
  };

  /**
   * Updates a specific field of an item by its 'id'.
   * @param id - The identifier of the item to update.
   * @param field - The specific field to update (e.g., 'amount', 'price', 'description').
   * @param value - The new value to assign to the field.
   */
  const updateItem = (
    id: number,
    field: keyof Item,
    value: number | string
  ) => {
    onItemsChange(
      items.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item }; // Create a copy to avoid mutating the original
          if (field === "amount") {
            updatedItem[field] = Number(value); // Parse numeric values
          } else if (field === "price" || field === "description") {
            updatedItem[field] = value as string; // Assign string values directly
          }
          return updatedItem;
        }
        return item; // Return unmodified items
      })
    );
  };

  /**
   * Removes commas from the value string (e.g., for parsing prices).
   * @param value - The value to sanitize.
   * @returns A string without commas.
   */
  const removeComma = (value: string) => {
    if (typeof value !== "string") {
      return value; // Return as-is if not a string
    }
    return value.replace(/,/g, "");
  };

  /**
   * Removes an item from the list by its 'id'.
   * @param id - The identifier of the item to remove.
   */
  const removeItem = (id: number) => {
    onItemsChange(items.filter((item) => item.id !== id));
  };

  /**
   * Calculates the total cost of an item (amount * price).
   * @param item - The item for which to calculate the total.
   * @returns The calculated total cost.
   */
  const calculateItemTotal = (item: Item) => {
    return item.amount * Number(removeComma(item.price));
  };

  /**
   * Calculates the grand total cost for all items.
   * @returns The aggregated total cost of all items.
   */
  const calculateGrandTotal = () => {
    return items.reduce((total, item) => total + calculateItemTotal(item), 0);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Table displaying items */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Amount</TableHead>
            <TableHead className="w-[120px]">Price</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="w-[120px] text-right">Total</TableHead>
            <TableHead className="w-[100px]">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                {/* Input for item amount */}
                <Input
                  type="number"
                  value={item.amount}
                  onChange={(e) =>
                    updateItem(item.id, "amount", e.target.value)
                  }
                  className="w-full"
                />
              </TableCell>
              <TableCell>
                {/* Numeric input for item price */}
                <NumericFormat
                  thousandSeparator=","
                  type="text"
                  value={item.price}
                  onChange={(e) => updateItem(item.id, "price", e.target.value)}
                  className="h-10 px-4 py-2 border-[1px] rounded-md text-sm"
                />
              </TableCell>
              <TableCell>
                {/* Input for item description */}
                <Input
                  value={item.description}
                  onChange={(e) =>
                    updateItem(item.id, "description", e.target.value)
                  }
                  className="w-full"
                />
              </TableCell>
              <TableCell className="text-right font-medium">
                ${calculateItemTotal(item).toFixed(2)}
              </TableCell>
              <TableCell>
                {/* Remove item button */}
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeItem(item.id)}
                >
                  Remove
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Footer with Add Item button and Grand Total */}
      <div className="flex justify-between items-center">
        <Button onClick={addItem}>
          <Plus className="mr-2 h-4 w-4" /> Add Item
        </Button>
        <div className="text-lg font-semibold">
          Grand Total:{" "}
          <span className="text-2xl">${calculateGrandTotal().toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
