import React from 'react'
import type { IExpenseLineItemRes } from '@/types/api'

function ExpenseItems({ items }: { items: IExpenseLineItemRes[] }) {
  return (
    <table className="w-full">
      <thead>
        <tr className="even:bg-muted m-0 border-t p-0">
          <th className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">
            Name
          </th>
          <th className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">
            Quantity
          </th>
          <th className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">
            Price
          </th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <React.Fragment key={item.name}>
            <tr className="even:bg-muted m-0 border-t p-0">
              <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                {item.name}
              </td>
              <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                {item.quantity}
              </td>
              <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                {Intl.NumberFormat('ph-PH', { style: 'currency', currency: 'PHP' }).format(item.price)}
              </td>
            </tr>
          </React.Fragment>
        ))}
      </tbody>
    </table>
  )
}

export default ExpenseItems
