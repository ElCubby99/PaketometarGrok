import type { EscalationLogRow } from "@/data/types";
import { Badge } from "./Badge";

export function EscalationTable({ rows }: { rows: EscalationLogRow[] }) {
  return (
    <div className="panel" style={{ overflowX: "auto" }}>
      <table className="escalation-table">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Prijevoznik</th>
            <th scope="col">n</th>
            <th scope="col">Fokus</th>
            <th scope="col">Status</th>
            <th scope="col">Datum</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td className="data">{row.id}</td>
              <td>{row.carrierName}</td>
              <td className="data">{row.count}</td>
              <td>{row.focus}</td>
              <td>
                <Badge>{row.statusLabel}</Badge>
              </td>
              <td className="data">{row.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
