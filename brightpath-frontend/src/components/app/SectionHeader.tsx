type SectionHeaderProps = {
  title: string;
  subtitle: string;
};

export default function SectionHeader({ title, subtitle }: SectionHeaderProps) {
  return (
    <div className="mb-8">
      <h2 className="text-3xl font-semibold text-[#18181b]">{title}</h2>
      <p className="text-sm text-[#71717a] mt-1">{subtitle}</p>
    </div>
  );
}
