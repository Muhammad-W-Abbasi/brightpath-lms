import { ReactNode } from "react";
import { FolderOpen } from "lucide-react";

type EmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
};

export default function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="bg-white border border-[#e4e4e7] rounded-lg p-8 text-center shadow-sm">
      <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
        <FolderOpen className="w-5 h-5" />
      </div>
      <h3 className="mt-4 text-lg font-medium text-[#18181b]">{title}</h3>
      <p className="mt-2 text-sm text-[#71717a] max-w-md mx-auto">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
