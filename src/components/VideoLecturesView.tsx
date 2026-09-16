import React, { useState } from "react";
import { VideoLecture, FacultyDepartment } from "../types";
import {
  Play,
  Clock,
  UserCheck,
  BookOpen,
  Search,
  Filter,
  CheckCircle,
  Eye,
  Tag,
  Share2,
  Bookmark,
  Sparkles,
  ExternalLink,
  ChevronRight,
  X,
  Volume2
} from "lucide-react";

interface VideoLecturesViewProps {
  videos: VideoLecture[];
  onNavigateToCourse?: (courseId: string) => void;
  onOpenTutor?: (topic: string) => void;
}

export const VideoLecturesView: React.FC<VideoLecturesViewProps> = ({
  videos,
  onNavigateToCourse,
  onOpenTutor
}) => {
  const [selectedDept, setSelectedDept] = useState<"all" | FacultyDepartment>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeVideo, setActiveVideo] = useState<VideoLecture | null>(null);
  const [savedVideoIds, setSavedVideoIds] = useState<string[]>([]);

  const filteredVideos = videos.filter((video) => {
    const matchesDept = selectedDept === "all" || video.department === selectedDept || video.department === "dual";
    const matchesSearch =
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesDept && matchesSearch;
  });

  const toggleSaveVideo = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedVideoIds((prev) =>
      prev.includes(id) ? prev.filter((vId) => vId !== id) : [...prev, id]
    );
  };

  // Convert youtube standard watch URL to embed if needed
  const getEmbedUrl = (url: string) => {
    if (!url) return "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ";
    if (url.includes("youtube.com/watch?v=")) {
      const videoId = url.split("v=")[1]?.split("&")[0];
      return `https://www.youtube-nocookie.com/embed/${videoId}`;
    }
    if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1]?.split("?")[0];
      return `https://www.youtube-nocookie.com/embed/${videoId}`;
    }
    return url;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-500/20 text-sky-300 border border-sky-400/30">
              <Play className="w-3.5 h-3.5 fill-sky-300 text-sky-300" />
              <span>Facilitator Masterclasses & Clinical Simulations</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-white">
              Clinical Video Lectures & Demonstrations
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Watch high-yield procedural walkthroughs, WHO Partograph simulations, and OSCE clinical demonstrations recorded and published by college faculty and clinical preceptors.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
              <div className="text-2xl font-black text-sky-300">{videos.length}</div>
              <div className="text-[11px] text-slate-300 uppercase tracking-wider font-semibold">Masterclasses</div>
            </div>
            <div className="px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
              <div className="text-2xl font-black text-emerald-300">100%</div>
              <div className="text-[11px] text-slate-300 uppercase tracking-wider font-semibold">NMC Standard</div>
            </div>
          </div>
        </div>

        {/* Search and Filters Strip */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Department Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-800/80 rounded-xl border border-slate-700/60 overflow-x-auto scrollbar-none">
            {[
              { id: "all", label: "All Specialities" },
              { id: "midwifery", label: "Midwifery (RM)" },
              { id: "nursing", label: "General Nursing (RN)" },
              { id: "dual", label: "Dual Core Skills" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedDept(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedDept === tab.id
                    ? "bg-sky-500 text-white shadow-sm"
                    : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative min-w-[240px] sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search procedures, tutor, topic..."
              className="w-full pl-9 pr-4 py-2 bg-slate-800/80 text-xs rounded-xl border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </div>
        </div>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {filteredVideos.map((video) => {
          const isSaved = savedVideoIds.includes(video.id);
          return (
            <div
              key={video.id}
              onClick={() => setActiveVideo(video)}
              className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer hover:border-sky-300 dark:hover:border-sky-600"
            >
              {/* Thumbnail Container with Play Overlay */}
              <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
                <img
                  src={video.thumbnailUrl || "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&auto=format&fit=crop&q=80"}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent"></div>

                {/* Duration Badge */}
                <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-white font-mono text-[11px] font-bold flex items-center gap-1 border border-white/10">
                  <Clock className="w-3 h-3 text-sky-400" />
                  <span>{video.duration}</span>
                </div>

                {/* Department Tag */}
                <div className="absolute top-3 left-3">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                      video.department === "midwifery"
                        ? "bg-rose-500/90 text-white"
                        : video.department === "nursing"
                        ? "bg-sky-500/90 text-white"
                        : "bg-amber-500/90 text-white"
                    } shadow-sm`}
                  >
                    {video.department === "midwifery"
                      ? "Midwifery (RM)"
                      : video.department === "nursing"
                      ? "Nursing (RN)"
                      : "Dual Track"}
                  </span>
                </div>

                {/* Save Bookmark Button */}
                <button
                  onClick={(e) => toggleSaveVideo(video.id, e)}
                  className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition-all ${
                    isSaved
                      ? "bg-amber-500 text-white shadow-sm"
                      : "bg-black/50 text-white hover:bg-black/70"
                  }`}
                  title={isSaved ? "Saved to your list" : "Bookmark lecture"}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${isSaved ? "fill-white" : ""}`} />
                </button>

                {/* Centered Play Button */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-13 h-13 rounded-2xl bg-sky-500/90 group-hover:bg-sky-400 text-white flex items-center justify-center shadow-lg shadow-sky-900/50 group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 fill-white ml-0.5" />
                  </div>
                </div>
              </div>

              {/* Video Details Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="font-semibold flex items-center gap-1 text-sky-700 dark:text-sky-400">
                      <BookOpen className="w-3.5 h-3.5" />
                      {video.courseTitle || "Core Curriculum"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {video.viewsCount} views
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors line-clamp-2">
                    {video.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    {video.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 text-[10px] font-bold">
                      {video.instructor.charAt(0)}
                    </div>
                    <span className="text-xs text-slate-700 dark:text-slate-300 font-medium truncate max-w-[180px]">
                      {video.instructor}
                    </span>
                  </div>

                  <span className="text-xs font-bold text-sky-600 dark:text-sky-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Watch Now
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredVideos.length === 0 && (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
          <Play className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No video lectures found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1">
            Try adjusting your search criteria or clear the department filter to view all clinical masterclasses.
          </p>
        </div>
      )}

      {/* Active Video Player Modal */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400">
                  <Play className="w-4 h-4 fill-sky-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold truncate max-w-lg">{activeVideo.title}</h3>
                  <p className="text-[11px] text-sky-300">{activeVideo.instructor} • {activeVideo.duration}</p>
                </div>
              </div>

              <button
                onClick={() => setActiveVideo(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player Frame */}
            <div className="relative aspect-video w-full bg-black">
              <iframe
                src={getEmbedUrl(activeVideo.videoUrl)}
                title={activeVideo.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            {/* Scrollable Information Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 dark:text-slate-200 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                    {activeVideo.title}
                  </h4>
                  <p className="text-slate-500 dark:text-slate-400 text-xs">
                    Course: <strong className="text-slate-700 dark:text-slate-300">{activeVideo.courseTitle || "Accredited Module"}</strong> • Uploaded {activeVideo.uploadedAt}
                  </p>
                </div>

                {onOpenTutor && (
                  <button
                    onClick={() => {
                      onOpenTutor(activeVideo.title);
                      setActiveVideo(null);
                    }}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-semibold text-xs shadow-xs hover:scale-105 transition-all cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Ask EdgeAI About This Video</span>
                  </button>
                )}
              </div>

              {/* Key Clinical Takeaways */}
              <div className="space-y-3">
                <h5 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider flex items-center gap-2 text-sky-600 dark:text-sky-400">
                  <CheckCircle className="w-4 h-4" />
                  Key Clinical Takeaways & Board Rules
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {activeVideo.keyTakeaways.map((takeaway, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-start gap-2.5"
                    >
                      <span className="w-5 h-5 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-[11px]">
                        {takeaway}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Video Chapters / Timestamps */}
              {activeVideo.chapters && activeVideo.chapters.length > 0 && (
                <div className="space-y-2">
                  <h5 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                    <Clock className="w-4 h-4" />
                    Lesson Chapters & Timestamps
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {activeVideo.chapters.map((ch, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-[11px]"
                      >
                        <span className="text-slate-800 dark:text-slate-200 font-medium truncate">
                          {ch.title}
                        </span>
                        <span className="font-mono font-bold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 px-2 py-0.5 rounded border border-sky-200 dark:border-sky-800/50 shrink-0 ml-2">
                          {ch.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              <div className="flex flex-wrap items-center gap-1.5 pt-2">
                <Tag className="w-3 h-3 text-slate-400 mr-1" />
                {activeVideo.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-semibold"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
