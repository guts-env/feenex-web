import React from 'react'
import startCase from 'lodash/startCase'
import type { IExpenseOtherDetailsRes } from '@/types/api'

function ExpenseOtherDetails({ otherDetails }: { otherDetails: IExpenseOtherDetailsRes[] }) {
  return (
    <table className="w-full">
      <tbody>
        {otherDetails.map((otherDetail) => (
          <React.Fragment key={otherDetail.key}>
            <tr className="even:bg-muted m-0 border-t p-0">
              <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                {startCase(otherDetail.key.replace(/_/g, ' '))}
              </td>
              <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                {otherDetail.value}
              </td>
            </tr>
          </React.Fragment>
        ))}
      </tbody>
    </table>
  )
}

export default ExpenseOtherDetails
