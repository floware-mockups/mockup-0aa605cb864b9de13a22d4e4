// @ts-nocheck
import { customTicker, customTimers } from "../customGuard.ts";
const __mk = customTicker("ComuneCronoprogramma");
const { setTimeout, setInterval, clearTimeout, clearInterval } = customTimers("ComuneCronoprogramma");
import { useTable, type CellProps } from "../floware";

export default function ComuneCronoprogramma({ pageId, value }: CellProps) {__mk();
  const table = useTable(pageId);
  if (!table || table.column("Comune") < 0) return <span>{value}</span>;
  return <span className="text-(--mk-primary)">{value}</span>;
}
