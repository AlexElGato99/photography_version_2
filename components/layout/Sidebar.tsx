"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Bell,
  MessageSquare,
  Settings,
  ChevronDown,
  ChevronRight,
  Type,
  Layers,
  Image as ImageIcon,
  AlignLeft,
  HelpCircle,
  Ticket,
  Star,
  FileText,
  Phone,
  CreditCard,
  BarChart2,
  Sliders,
  Megaphone,
  Map,
  PanelLeft,
  Camera,
  Briefcase,
  Tag,
  TrendingUp,
  Workflow,
  Users2,
  PiggyBank,
  Quote,
  Instagram,
  Navigation as NavIcon,
  Globe,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href?: string;
  icon: React.ComponentType<{ size?: number | string; className?: string }>;
  badge?: number | string;
  children?: NavItem[];
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: "Main",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "Analytics", href: "/dashboard/analytics", icon: BarChart2 },
    ],
  },
  {
    title: "Frontend — Site",
    items: [
      { label: "Brand & General", href: "/dashboard/site/general", icon: Type },
      { label: "Navigation", href: "/dashboard/site/navigation", icon: NavIcon },
      { label: "Marquee", href: "/dashboard/site/marquee", icon: AlignLeft },
      { label: "Footer", href: "/dashboard/site/footer", icon: Map },
      { label: "SEO", href: "/dashboard/site/seo", icon: Globe },
    ],
  },
  {
    title: "Frontend — Sections",
    items: [
      { label: "Hero", href: "/dashboard/sections/hero", icon: ImageIcon },
      { label: "About", href: "/dashboard/sections/about", icon: FileText },
      { label: "Services", href: "/dashboard/sections/services", icon: Briefcase },
      { label: "Categories", href: "/dashboard/sections/categories", icon: Tag },
      { label: "Portfolio", href: "/dashboard/sections/portfolio", icon: Camera },
      { label: "Stats", href: "/dashboard/sections/stats", icon: TrendingUp },
      { label: "Process", href: "/dashboard/sections/process", icon: Workflow },
      { label: "Team", href: "/dashboard/sections/team", icon: Users2 },
      { label: "Pricing", href: "/dashboard/sections/pricing", icon: PiggyBank },
      { label: "Testimonials", href: "/dashboard/sections/testimonials", icon: Quote },
      { label: "Instagram", href: "/dashboard/sections/instagram", icon: Instagram },
      { label: "FAQ", href: "/dashboard/sections/faq", icon: HelpCircle },
      { label: "Contact", href: "/dashboard/sections/contact", icon: Phone },
    ],
  },
  {
    title: "Customers",
    items: [
      { label: "Users", href: "/dashboard/users", icon: Users },
      { label: "Orders", href: "/dashboard/orders", icon: ShoppingCart, badge: 3 },
      { label: "Submissions", href: "/dashboard/notifications", icon: Bell, badge: 1 },
      { label: "Live Chat", href: "/dashboard/live-chat", icon: MessageSquare },
      { label: "Plans", href: "/dashboard/pricing", icon: CreditCard },
    ],
  },
  {
    title: "System",
    items: [
      { label: "Settings", href: "/dashboard/settings", icon: Settings },
    ],
  },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

function NavItemComponent({
  item,
  collapsed,
  depth = 0,
}: {
  item: NavItem;
  collapsed: boolean;
  depth?: number;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isActive = item.href ? pathname === item.href : false;
  const Icon = item.icon;

  if (item.children) {
    return (
      <div>
        <button
          onClick={() => setOpen(!open)}
          className={cn(
            "sidebar-item w-full",
            isActive && "active",
            collapsed && "justify-center px-2"
          )}
        >
          <Icon size={16} className="shrink-0" />
          {!collapsed && (
            <>
              <span className="flex-1 text-left">{item.label}</span>
              {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </>
          )}
        </button>
        {open && !collapsed && (
          <div className="ml-4 mt-0.5 space-y-0.5 border-l border-[var(--border)] pl-3">
            {item.children.map((child) => (
              <NavItemComponent
                key={child.label}
                item={child}
                collapsed={collapsed}
                depth={depth + 1}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.href ?? "#"}
      className={cn(
        "sidebar-item",
        isActive && "active",
        collapsed && "justify-center px-2",
        depth > 0 && "text-[11px] py-1.5"
      )}
      title={collapsed ? item.label : undefined}
    >
      <Icon size={depth > 0 ? 14 : 16} className="shrink-0" />
      {!collapsed && (
        <>
          <span className="flex-1">{item.label}</span>
          {item.badge !== undefined && (
            <span className="ml-auto min-w-[16px] h-[16px] flex items-center justify-center rounded-full bg-green-500 text-white text-[9px] font-bold px-1">
              {item.badge}
            </span>
          )}
        </>
      )}
    </Link>
  );
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  return (
    <aside
      className={cn(
        "sidebar-transition flex flex-col h-screen bg-[var(--bg-sidebar)] border-r border-[var(--border)] shrink-0 overflow-hidden",
        collapsed ? "w-[60px]" : "w-[220px]"
      )}
    >
      <div
        className={cn(
          "flex shrink-0 border-b border-[var(--border)] bg-gradient-to-b from-[var(--bg-primary)] to-[var(--bg-sidebar)]",
          collapsed
            ? "flex-col items-center justify-center gap-1.5 px-1 py-2 min-h-[4.75rem]"
            : "flex-row items-center justify-between gap-2 px-4 py-2 min-h-[4.5rem]"
        )}
      >
        <Logo
          variant={collapsed ? "icon" : "full"}
          size={collapsed ? "sm" : "xl"}
          className="shrink-0"
        />
        <span
          className={cn(
            "font-semibold tabular-nums tracking-wide rounded-md shrink-0",
            "bg-green-100 text-green-700 ring-1 ring-inset ring-green-200",
            "dark:bg-green-500/10 dark:text-green-400 dark:ring-green-500/20",
            collapsed
              ? "text-[9px] px-1.5 py-0.5 leading-none"
              : "text-[11px] px-2 py-0.5"
          )}
        >
          v1.1.9
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 space-y-4">
        {navSections.map((section) => (
          <div key={section.title}>
            {!collapsed && <p className="section-title">{section.title}</p>}
            <div className={cn("space-y-0.5", collapsed ? "px-2" : "px-2")}>
              {section.items.map((item) => (
                <NavItemComponent
                  key={item.label}
                  item={item}
                  collapsed={collapsed}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-[var(--border)] p-2 shrink-0">
        <button
          onClick={onToggle}
          className={cn("sidebar-item w-full", collapsed && "justify-center px-2")}
          title="Toggle sidebar"
        >
          <PanelLeft
            size={16}
            className={cn("shrink-0 transition-transform", collapsed && "rotate-180")}
          />
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
