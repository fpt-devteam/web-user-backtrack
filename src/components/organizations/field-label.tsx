export function FieldLabel({ label, required }: { label: string; required?: boolean }) {
  return (
    <p className="text-[12px] font-semibold text-[#444] mb-1.5">
      {label}
      {required
        ? <span className="text-rose-500 ml-0.5">*</span>
        : <span className="text-[#9CA3AF] ml-1 font-normal">(optional)</span>}
    </p>
  )
}
