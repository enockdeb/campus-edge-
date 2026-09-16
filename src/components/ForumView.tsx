import React, { useState } from "react";
import { ForumPost, ForumReply } from "../types";
import {
  MessageSquare,
  Sparkles,
  ThumbsUp,
  Send,
  Plus,
  Filter,
  CheckCircle2,
  Clock,
  User,
  Shield,
  Bot,
  RefreshCw,
  X,
  Tag
} from "lucide-react";

interface ForumViewProps {
  posts: ForumPost[];
  onAddPost: (post: ForumPost) => void;
  onAddReply: (postId: string, reply: ForumReply) => void;
  onLikePost: (postId: string) => void;
}

export const ForumView: React.FC<ForumViewProps> = ({
  posts,
  onAddPost,
  onAddReply,
  onLikePost
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activePostId, setActivePostId] = useState<string>(posts[0]?.id || "");
  const [replyText, setReplyText] = useState("");
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [isConsultingAI, setIsConsultingAI] = useState(false);

  // New post form state
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<ForumPost["category"]>("Midwifery Skills");
  const [newContent, setNewContent] = useState("");
  const [newTag, setNewTag] = useState("LabourWard");

  const activePost = posts.find((p) => p.id === activePostId) || posts[0];

  const categories = [
    { id: "all", label: "All Topics" },
    { id: "Midwifery Skills", label: "Midwifery Skills" },
    { id: "Clinical Placements", label: "Clinical Placements" },
    { id: "Licensure & Board Exams", label: "Licensure & Board Exams" },
    { id: "Case Discussions", label: "Case Discussions" },
    { id: "Study Groups", label: "Study Groups" }
  ];

  const filteredPosts = posts.filter((p) => {
    if (selectedCategory === "all") return true;
    return p.category === selectedCategory;
  });

  const handlePostReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activePost) return;

    const newReply: ForumReply = {
      id: `rep-${Date.now()}`,
      author: {
        name: "Ama Mensah",
        role: "Midwifery Student",
        college: "Presbyterian Nursing & Midwifery College",
        avatar: "https://images.unsplash.com/photo-1594824813527-897f259021fb?w=100&auto=format&fit=crop&q=80",
        verifiedStudent: true
      },
      content: replyText,
      timestamp: "Just now",
      upvotes: 0
    };

    onAddReply(activePost.id, newReply);
    setReplyText("");
  };

  const handleConsultAITutor = async () => {
    if (!activePost) return;

    setIsConsultingAI(true);
    try {
      const response = await fetch("/api/gemini/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: `${activePost.title}: ${activePost.content}`,
          context: activePost.category
        })
      });

      if (!response.ok) throw new Error("Failed to consult AI tutor");

      const data = await response.json();
      const aiReply: ForumReply = {
        id: `rep-ai-${Date.now()}`,
        author: {
          name: "EdgeAI Clinical Faculty Tutor",
          role: "Verified AI Evidence-Based Practice Guide",
          college: "CampusEdge Clinical AI Core",
          avatar: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=100&auto=format&fit=crop&q=80",
          verifiedStudent: true
        },
        content: data.reply || "Based on WHO protocols, immediate escalation and vital signs stabilization take clinical precedence.",
        timestamp: "Just now",
        upvotes: 4,
        isVerifiedSolution: true
      };

      onAddReply(activePost.id, aiReply);
    } catch (err) {
      console.error(err);
      const fallbackReply: ForumReply = {
        id: `rep-ai-${Date.now()}`,
        author: {
          name: "EdgeAI Clinical Faculty Tutor",
          role: "Verified AI Evidence-Based Practice Guide",
          college: "CampusEdge Clinical AI Core",
          avatar: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=100&auto=format&fit=crop&q=80",
          verifiedStudent: true
        },
        content: "Under WHO Safe Childbirth guidelines, active fetal monitoring and clear communication of vital signs to the attending obstetrician ensures maternal-fetal safety. Document any variations thoroughly on the partograph.",
        timestamp: "Just now",
        upvotes: 3,
        isVerifiedSolution: true
      };
      onAddReply(activePost.id, fallbackReply);
    } finally {
      setIsConsultingAI(false);
    }
  };

  const handleCreateNewPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const post: ForumPost = {
      id: `post-${Date.now()}`,
      title: newTitle,
      author: {
        name: "Ama Mensah",
        role: "Midwifery Student",
        college: "Presbyterian Nursing & Midwifery College",
        avatar: "https://images.unsplash.com/photo-1594824813527-897f259021fb?w=100&auto=format&fit=crop&q=80",
        verifiedStudent: true
      },
      category: newCategory,
      content: newContent,
      timestamp: "Just now",
      upvotes: 1,
      userUpvoted: true,
      tags: [newTag, "CampusEdge"],
      replies: [],
      solved: false,
      views: 1
    };

    onAddPost(post);
    setActivePostId(post.id);
    setShowNewPostModal(false);
    setNewTitle("");
    setNewContent("");
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-100 text-sky-800 flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5 text-sky-600" />
                <span>Peer-to-Peer College Community</span>
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 font-display">
              Clinical Discussion Forums & Case Debriefs
            </h1>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed max-w-2xl">
              Discuss complex clinical scenarios, share ward shift tips, study for licensure examinations, and consult our EdgeAI Clinical Faculty Tutor in real-time.
            </p>
          </div>

          <button
            id="start-discussion-btn"
            onClick={() => setShowNewPostModal(true)}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Start New Discussion</span>
          </button>
        </div>

        {/* Category Pills Switcher */}
        <div className="flex items-center gap-2 overflow-x-auto pt-4 border-t border-slate-100 mt-4 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? "bg-sky-700 text-white shadow-xs"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Forum Split: Left List (5 cols), Right Thread (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Post Feed (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 px-1">
              Active Topics ({filteredPosts.length})
            </h3>

            <div className="space-y-2.5">
              {filteredPosts.map((post) => {
                const isActive = post.id === activePost?.id;
                return (
                  <div
                    key={post.id}
                    onClick={() => setActivePostId(post.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isActive
                        ? "bg-sky-50/70 border-sky-300 ring-1 ring-sky-300 shadow-2xs"
                        : "bg-white border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 text-[11px] text-slate-500 mb-1">
                      <span className="font-bold text-sky-700 truncate">{post.category}</span>
                      <span className="shrink-0">{post.timestamp}</span>
                    </div>

                    <h4 className="font-bold text-xs text-slate-900 leading-snug line-clamp-2">
                      {post.title}
                    </h4>

                    <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                      {post.content}
                    </p>

                    <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <img
                          src={post.author.avatar || "/student-avatar.svg"}
                          alt={post.author.name}
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = "/student-avatar.svg";
                          }}
                          className="w-4 h-4 rounded-full object-cover"
                        />
                        <span className="truncate max-w-[120px]">{post.author.name}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-slate-600">
                          <ThumbsUp className="w-3 h-3 text-slate-400" /> {post.upvotes}
                        </span>
                        <span className="flex items-center gap-1 text-slate-600">
                          <MessageSquare className="w-3 h-3 text-slate-400" /> {post.replies.length}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Active Thread & Replies (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {activePost ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
              {/* Thread Header */}
              <div className="border-b border-slate-100 pb-4">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
                    {activePost.category}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {activePost.timestamp}
                  </span>
                </div>

                <h2 className="text-lg font-extrabold text-slate-900 font-display">
                  {activePost.title}
                </h2>

                <div className="mt-3 flex items-center gap-2.5">
                  <img
                    src={activePost.author.avatar || "/student-avatar.svg"}
                    alt={activePost.author.name}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "/student-avatar.svg";
                    }}
                    className="w-8 h-8 rounded-full object-cover border border-sky-300"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <span>{activePost.author.name}</span>
                      {activePost.author.verifiedStudent && (
                        <Shield className="w-3 h-3 text-sky-600 fill-sky-100" />
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500">{activePost.author.role} • {activePost.author.college}</div>
                  </div>
                </div>

                {/* Main Post Content */}
                <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 leading-relaxed whitespace-pre-line">
                  {activePost.content}
                </div>

                {/* Tags & Action row */}
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-1.5">
                    {activePost.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onLikePost(activePost.id)}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <ThumbsUp className="w-3.5 h-3.5 text-slate-500" />
                      <span>{activePost.upvotes} Helpful</span>
                    </button>

                    <button
                      id="consult-ai-tutor-btn"
                      onClick={handleConsultAITutor}
                      disabled={isConsultingAI}
                      className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                    >
                      {isConsultingAI ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Tutor Thinking...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5 text-sky-200" />
                          <span>Ask AI Clinical Tutor</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Replies List */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Discussion Responses ({activePost.replies.length})
                </h3>

                {activePost.replies.map((reply) => {
                  const isAI = reply.author.name.includes("EdgeAI");
                  return (
                    <div
                      key={reply.id}
                      className={`p-4 rounded-xl border leading-relaxed text-xs transition-all ${
                        isAI
                          ? "bg-sky-50/70 border-sky-300 ring-1 ring-sky-200"
                          : "bg-white border-slate-200"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <img
                            src={reply.author.avatar || "/student-avatar.svg"}
                            alt={reply.author.name}
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = "/student-avatar.svg";
                            }}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                          <div>
                            <span className="font-bold text-slate-900 mr-1.5">
                              {reply.author.name}
                            </span>
                            {isAI && (
                              <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200 uppercase">
                                Verified AI Clinical Tutor
                              </span>
                            )}
                            {reply.isVerifiedSolution && !isAI && (
                              <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase">
                                Verified Instructor
                              </span>
                            )}
                          </div>
                        </div>

                        <span className="text-[10px] text-slate-400">{reply.timestamp}</span>
                      </div>

                      <p className="text-slate-700 whitespace-pre-line pl-8">
                        {reply.content}
                      </p>

                      <div className="mt-2 pl-8 flex items-center gap-2 text-[11px] text-slate-500">
                        <span className="flex items-center gap-1 text-slate-400">
                          <ThumbsUp className="w-3 h-3" /> {reply.upvotes}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add Reply Input Box */}
              <form onSubmit={handlePostReply} className="pt-2 border-t border-slate-100">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Contribute your clinical perspective or peer advice..."
                    className="flex-1 px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                  />
                  <button
                    type="submit"
                    disabled={!replyText.trim()}
                    className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-40"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Reply</span>
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
              <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-500">Select a discussion to join the conversation</p>
            </div>
          )}
        </div>
      </div>

      {/* New Post Modal */}
      {showNewPostModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-sky-600" />
                <h3 className="font-bold text-base text-slate-900">
                  Start Peer Discussion
                </h3>
              </div>
              <button
                onClick={() => setShowNewPostModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewPost} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Discussion Title / Clinical Case Headline
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Managing shoulder dystocia maneuvers in primigravidae"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Category Channel
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                >
                  <option value="Midwifery Skills">Midwifery Skills</option>
                  <option value="Clinical Placements">Clinical Placements</option>
                  <option value="Licensure & Board Exams">Licensure & Board Exams</option>
                  <option value="Case Discussions">Case Discussions</option>
                  <option value="Study Groups">Study Groups</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Primary Tag
                </label>
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="e.g. LabourWard, DosageCalc, OSCE"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Question or Case Description
                </label>
                <textarea
                  rows={4}
                  required
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Describe the clinical situation, symptoms, or exam question you would like peer advice on..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium resize-none leading-relaxed"
                ></textarea>
              </div>

              <div className="pt-3 border-t border-slate-100 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewPostModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  id="submit-new-post-btn"
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold cursor-pointer shadow-xs"
                >
                  Post Discussion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
