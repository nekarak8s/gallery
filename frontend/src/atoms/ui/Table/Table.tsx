import { PropsWithChildren } from 'react'
import './Table.scss'

type TableProps = {
  caption: string
}

const Table = ({ caption, children }: PropsWithChildren<TableProps>) => {
  return (
    <table className="table">
      <caption>{caption}</caption>
      {children}
    </table>
  )
}

export default Table
