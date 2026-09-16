import React, { useState } from "react";
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  Calendar,
  Sparkles,
  HelpCircle,
  GraduationCap,
  MessageSquare,
  BookOpen,
  X,
  AlertCircle,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { AppNotification, NotificationType, AppView } from "../types";

interface NotificationCenterProps {
  notifications: AppNotification[];
  isOpen: boolean;
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDismiss: (id: string) => void;
  onNavigate: (view: AppView, payload?: any) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  isOpen,
  onClose,
  onMarkAsRead,
  onMarkAllAsRead,
  onDismiss,
  onNavigate
}) => {
  const [activeFilter, setActiveFilter] = useState<"all" | "unread" | "urgent">("all");

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === "unread") return !n.read;
    if (activeFilter === "urgent") return n.priority === "urgent";
    return true;
  });

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case "exam":
        return <Calendar className="w-4 h-4 text-rose-500" />;
      case "summary":
        return <Sparkles className="w-4 h-4 text-sky-500" />;
      case "fee":
        return <GraduationCap className="w-4 h-4 text-emerald-500" />;
      case "quiz":
        return <HelpCircle className="w-4 h-4 text-indigo-500" />;
      case "forum":
        return <MessageSquare className="w-4 h-4 text-blue-500" />;
      case "curriculum":
        return <BookOpen className="w-4 h-4 text-teal-500" />;
      default:
        return <Bell className="w-4 h-4 text-slate-500" />;
    }
  };

  const handleNotificationClick = (notif: AppNotification) => {
    if (!notif.read) {
      onMarkAsRead(notif.id);
    }
    if (notif.targetView) {
      onNavigate(notif.targetView, notif.targetPayload);
      onClose();
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Notification Dropdown Drawer */}
      <div
        id="notification-center-panel"
        className="fixed top-16 right-4 sm:right-6 md:right-12 z-50 w-full max-w-sm sm:max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150 text-slate-900 dark:text-slate-100"
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-950/70">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 flex items-center justify-center font-bold">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-sky-600 text-white">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Academic alerts, licensure deadlines & lecture summaries
              </p>
            </div>
          </div>

          <button
            id="close-notifications-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-200/70 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
            title="Close notifications"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter bar & Actions */}
        <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 text-xs">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                activeFilter === "all"
                  ? "bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-extrabold"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setActiveFilter("unread")}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                activeFilter === "unread"
                  ? "bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-extrabold"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              Unread ({unreadCount})
            </button>
            <button
              onClick={() => setActiveFilter("urgent")}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                activeFilter === "urgent"
                  ? "bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-extrabold"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              Urgent
            </button>
          </div>

          {unreadCount > 0 && (
            <button
              id="mark-all-read-btn"
              onClick={onMarkAllAsRead}
              className="text-[11px] font-bold text-sky-600 dark:text-sky-400 hover:text-sky-800 dark:hover:text-sky-300 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark all read</span>
            </button>
          )}
        </div>

        {/* Notification Item List */}
        <div className="overflow-y-auto flex-1 divide-y divide-slate-100 dark:divide-slate-800">
          {filteredNotifications.length === 0 ? (
            <div className="py-12 px-4 text-center">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center mb-3">
                <Check className="w-6 h-6 text-slate-400 dark:text-slate-300" />
              </div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">All caught up!</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
                No notifications matching this filter. You're up to date on your nursing and midwifery tasks.
              </p>
            </div>
          ) : (
            filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif)}
                className={`p-4 transition-all cursor-pointer flex gap-3 relative group ${
                  notif.read
                    ? "bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/60 opacity-80"
                    : "bg-sky-50/40 dark:bg-sky-950/30 hover:bg-sky-50/70 dark:hover:bg-sky-950/60"
                }`}
              >
                {/* Unread indicator dot */}
                {!notif.read && (
                  <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-sky-600 dark:bg-sky-400" />
                )}

                {/* Type Icon Container */}
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    notif.priority === "urgent"
                      ? "bg-rose-100/80 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {getNotificationIcon(notif.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4
                      className={`text-xs font-bold leading-tight ${
                        notif.read ? "text-slate-800 dark:text-slate-200" : "text-slate-950 dark:text-white font-extrabold"
                      }`}
                    >
                      {notif.title}
                    </h4>
                    {notif.priority === "urgent" && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase tracking-wide bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                        Urgent
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed line-clamp-2">
                    {notif.message}
                  </p>

                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
                    <span>{notif.timestamp}</span>

                    {notif.targetView && (
                      <span className="text-sky-700 dark:text-sky-400 font-bold flex items-center gap-1 group-hover:underline">
                        <span>Open {notif.targetView}</span>
                        <ChevronRight className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                </div>

                {/* Action buttons (hover) */}
                <div
                  className="opacity-0 group-hover:opacity-100 transition-opacity absolute right-3 top-3 flex items-center gap-1 bg-white/90 dark:bg-slate-800/90 p-1 rounded-lg border border-slate-200 dark:border-slate-700 shadow-2xs"
                  onClick={(e) => e.stopPropagation()}
                >
                  {!notif.read && (
                    <button
                      onClick={() => onMarkAsRead(notif.id)}
                      className="p-1 rounded text-slate-500 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-sky-50 dark:hover:bg-slate-700 transition-colors"
                      title="Mark as read"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => onDismiss(notif.id)}
                    className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 transition-colors"
                    title="Dismiss"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 text-center">
          <button
            onClick={() => {
              onNavigate("quizzes");
              onClose();
            }}
            className="text-xs font-bold text-sky-700 dark:text-sky-400 hover:text-sky-800 dark:hover:text-sky-300 transition-colors cursor-pointer"
          >
            Review Licensure Readiness & Mock Quizzes →
          </button>
        </div>
      </div>
    </>
  );
};
