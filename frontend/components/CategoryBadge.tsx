const categoryStyles: Record<string, string> = {
  coding: "bg-blue-50 text-blue-600 border-blue-100",
  writing: "bg-purple-50 text-purple-600 border-purple-100",
  research: "bg-amber-50 text-amber-600 border-amber-100",
  business: "bg-emerald-50 text-emerald-600 border-emerald-100",
  study: "bg-orange-50 text-orange-600 border-orange-100",
  creative: "bg-pink-50 text-pink-600 border-pink-100",
  general: "bg-slate-50 text-slate-600 border-slate-200",
}

export default function CategoryBadge({ category }: { category: string }) {
  const style = categoryStyles[category] || categoryStyles.general
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${style}`}>
      {category.charAt(0).toUpperCase() + category.slice(1)}
    </span>
  )
}