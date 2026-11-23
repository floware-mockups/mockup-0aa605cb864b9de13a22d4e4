// @ts-nocheck
import { customTicker, customTimers } from "../customGuard.ts";
const __mk = customTicker("GanttCronoprogramma");
const { setTimeout, setInterval, clearTimeout, clearInterval } = customTimers("GanttCronoprogramma");
import { useState } from "react";
import { Button, Card, Badge, Select, useTable, usePrototype, type SectionProps } from "../floware";

function giorno(testo: string) {__mk();
  const valore = Date.parse(testo);
  return Number.isFinite(valore) ? Math.floor(valore / 86400000) : null;
}
function dataBreve(g: number) {__mk();
  return new Date(g * 86400000).toLocaleDateString("it-IT", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" });
}
function indicatore(stato: string) {__mk();
  if (stato === "Completata") return "C";
  if (stato === "In corso") return "I";
  if (stato === "In attesa documenti") return "!";
  if (stato === "Da avviare") return "A";
  return "–";
}
export default function GanttCronoprogramma({ pageId }: SectionProps) {__mk();
  const table = useTable(pageId);
  const { openDetail } = usePrototype();
  const [filtro, setFiltro] = useState("Tutti");
  const [scala, setScala] = useState("Compatta");
  if (!table) return null;
  const opera = table.column("Opera");
  const inizio = table.column("Data prevista");
  const fine = table.column("Scadenza verifica");
  const stato = table.column("Stato");
  const comune = table.column("Comune");
  if (opera < 0 || inizio < 0 || fine < 0 || stato < 0) return <Card title="Gantt delle verifiche"><p>Servono le colonne Opera, Data prevista, Scadenza verifica e Stato.</p></Card>;
  const righe = table.rows.map((r, index) => ((__mk(), { index, nome: r[opera], comune: comune >= 0 ? r[comune] : "", stato: r[stato], da: giorno(r[inizio]), a: giorno(r[fine]) })));
  const valide = righe.filter(r => (__mk(), r.da !== null && r.a !== null && r.a >= r.da));
  const minimo = valide.reduce((v, r) => (__mk(), Math.min(v, Number(r.da))), Number.POSITIVE_INFINITY);
  const massimo = valide.reduce((v, r) => (__mk(), Math.max(v, Number(r.a))), Number.NEGATIVE_INFINITY);
  const durata = Math.max(1, massimo - minimo + 1);
  const visibili = righe.filter(r => (__mk(), filtro === "Tutti" || r.stato === filtro));
  const stati = ["Tutti", ...new Set(righe.map(r => (__mk(), r.stato)))];
  const tacche = [0, 1, 2, 3, 4].map(n => (__mk(), Math.round(n * Math.max(0, durata - 1) / 4))).filter((n, i, elenco) => (__mk(), elenco.indexOf(n) === i));
  return <Card title="Gantt delle verifiche">
    <div className="space-y-4">
      <p className="text-sm text-(--mk-muted)">Dalla Data prevista alla Scadenza verifica, estremi inclusi. Apri un’opera per consultarne il dettaglio.</p>
      <div className="flex flex-wrap gap-4">
        <Select label="Stato" value={filtro} options={stati} onChange={setFiltro} />
        <Select label="Scala temporale" value={scala} options={["Compatta", "Estesa"]} onChange={setScala} />
      </div>
      <div className="flex flex-wrap gap-3 text-sm">
        {["Da avviare", "In corso", "In attesa documenti", "Completata"].map(s => (__mk(), <span key={s}>{indicatore(s)}: {s}</span>))}
      </div>
      {!valide.length ? <p>Nessun intervallo valido da rappresentare.</p> : <div className="overflow-x-auto">
        <div style={{ minWidth: scala === "Estesa" ? "1200px" : "820px" }}>
          <div className="grid gap-4 border-b border-(--mk-border) pb-3" style={{ gridTemplateColumns: "260px 1fr" }}>
            <strong>Opera / Stato</strong>
            <div className="relative h-10 text-xs text-(--mk-muted)">
              {tacche.map((n, i) => (__mk(), <span key={n} className="absolute top-0" style={{ left: String(n / durata * 100) + "%", transform: i === tacche.length - 1 ? "translateX(-100%)" : "none" }}>{dataBreve(minimo + n)}</span>))}
            </div>
          </div>
          {visibili.map(r => {__mk();
            const valida = r.da !== null && r.a !== null && r.a >= r.da;
            const piena = r.stato === "In corso" || r.stato === "Completata";
            return <div key={r.index} className="grid items-center gap-4 border-b border-(--mk-divider) py-3" style={{ gridTemplateColumns: "260px 1fr" }}>
              <div className="space-y-1">
                <Button variant="link" onClick={() => (__mk(), openDetail(pageId, r.index))}>{r.nome}</Button>
                <p className="text-xs text-(--mk-primary)">{r.comune}</p>
                <Badge tone={r.stato === "In corso" ? "primary" : "neutral"}>{indicatore(r.stato)}: {r.stato}</Badge>
              </div>
              <div>
                {valida ? <>
                  <div className="relative h-7 rounded bg-(--mk-subtle)" title={r.nome + ": " + dataBreve(Number(r.da)) + " – " + dataBreve(Number(r.a)) + ", " + r.stato}>
                    <div className={piena ? "absolute top-0 flex h-7 items-center justify-center rounded border border-(--mk-border) bg-(--mk-primary) text-(--mk-on-primary)" : "absolute top-0 flex h-7 items-center justify-center rounded border border-(--mk-border) bg-(--mk-surface) text-(--mk-text)"} style={{ left: String((Number(r.da) - minimo) / durata * 100) + "%", width: String((Number(r.a) - Number(r.da) + 1) / durata * 100) + "%", borderStyle: r.stato === "In attesa documenti" ? "dashed" : "solid" }}>{indicatore(r.stato)}</div>
                  </div>
                  <p className="mt-1 text-xs text-(--mk-muted)">{dataBreve(Number(r.da))} – {dataBreve(Number(r.a))}</p>
                </> : <p className="text-sm text-(--mk-danger)">Date mancanti o intervallo non valido.</p>}
              </div>
            </div>;
          })}
        </div>
      </div>}
      {!visibili.length && <p>Nessuna opera per questo stato.</p>}
    </div>
  </Card>;
}
