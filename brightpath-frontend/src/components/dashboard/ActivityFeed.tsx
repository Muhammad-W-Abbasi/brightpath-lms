import { Activity, BookOpenCheck, UserPlus } from "lucide-react";

type ActivityItem = {
  id: string;
  text: string;
  time: string;
};

type ActivityFeedProps = {
  items: ActivityItem[];
};

const icons = [UserPlus, BookOpenCheck, Activity];

export default function ActivityFeed({ items }: ActivityFeedProps) {
  return (
    <aside className="bg-white border border-[#e4e4e7] rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-medium text-[#18181b]">Recent Activity</h3>
      <div className="mt-5 space-y-4">
        {items.map((item, idx) => {
          const Icon = icons[idx % icons.length];
          return (
            <div key={item.id} className="flex items-start gap-3 text-sm">
              <span className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                <Icon className="w-4 h-4" />
              </span>
              <div>
                <p className="text-[#52525b] leading-relaxed">{item.text}</p>
                <p className="text-xs text-[#a1a1aa] mt-1">{item.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
