export default function ClassroomCard({ node, schedules }) {
  const nodeSchedules = schedules.filter((s) => s.nodeId === node.id);

  return (
    <div className="space-y-2">
      <div>
        <span className="text-[11px] font-semibold uppercase tracking-wide text-blue-800">
          {node.department}
        </span>
        <h2 className="text-base font-bold text-slate-900">{node.name}</h2>
        <p className="text-xs text-slate-500">Código: {node.code}</p>
      </div>

      {nodeSchedules.length > 0 && (
        <div className="rounded-xl bg-slate-50 p-2.5 text-xs">
          <p className="mb-1 font-semibold text-slate-700">Horarios registrados</p>
          {nodeSchedules.map((sch) => (
            <p key={sch.id} className="text-slate-600">
              {sch.day} {sch.startTime}-{sch.endTime} · {sch.subject} ({sch.professor})
            </p>
          ))}
        </div>
      )}
    </div>
  );
}