import React, { useState } from "react";
import { Flashcard, FlashcardDeck } from "../types";
import {
  Layers,
  Sparkles,
  RotateCw,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Plus,
  RefreshCw,
  Award,
  BookOpen,
  Check,
  X,
  HelpCircle,
  Tag
} from "lucide-react";

interface FlashcardsViewProps {
  decks: FlashcardDeck[];
  cards: Flashcard[];
  onUpdateCards: (cards: Flashcard[]) => void;
  onAddDeck?: (deck: FlashcardDeck) => void;
  initialTopic?: string;
}

export const FlashcardsView: React.FC<FlashcardsViewProps> = ({
  decks,
  cards,
  onUpdateCards,
  initialTopic
}) => {
  const [selectedDeckId, setSelectedDeckId] = useState<string>(decks[0]?.id || "");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // AI Generator Modal state
  const [showGenModal, setShowGenModal] = useState(false);
  const [genTopic, setGenTopic] = useState(initialTopic || "Maternal & Midwifery Emergencies");
  const [genCount, setGenCount] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);

  // Filter cards by deck
  const deckCards = cards.filter(
    (c) => c.deckId === selectedDeckId || (selectedDeckId === "all" ? true : false)
  );

  const currentCard = deckCards[currentIndex] || deckCards[0];
  const activeDeck = decks.find((d) => d.id === selectedDeckId) || decks[0];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % (deckCards.length || 1));
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + deckCards.length) % (deckCards.length || 1));
  };

  const handleRateCard = (rating: "again" | "hard" | "good" | "easy") => {
    if (!currentCard) return;

    const updatedCards = cards.map((c) => {
      if (c.id === currentCard.id) {
        let newStatus: "new" | "learning" | "mastered" = c.status;
        let newInterval = c.intervalDays || 1;

        if (rating === "again") {
          newStatus = "learning";
          newInterval = 1;
        } else if (rating === "hard") {
          newStatus = "learning";
          newInterval = Math.max(2, Math.round(newInterval * 1.2));
        } else if (rating === "good") {
          newStatus = "learning";
          newInterval = Math.max(4, Math.round(newInterval * 1.6));
        } else if (rating === "easy") {
          newStatus = "mastered";
          newInterval = Math.max(7, Math.round(newInterval * 2.2));
        }

        return {
          ...c,
          status: newStatus,
          intervalDays: newInterval,
          timesReviewed: (c.timesReviewed || 0) + 1
        };
      }
      return c;
    });

    onUpdateCards(updatedCards);
    handleNext();
  };

  const handleGenerateCards = async () => {
    if (!genTopic.trim()) return;

    setIsGenerating(true);
    try {
      const response = await fetch("/api/gemini/flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: genTopic,
          count: genCount
        })
      });

      if (!response.ok) {
        throw new Error("Failed to generate flashcards");
      }

      const data = await response.json();
      const generatedCards: Flashcard[] = (data.flashcards || []).map((item: any, idx: number) => ({
        id: `card-gen-${Date.now()}-${idx}`,
        deckId: selectedDeckId || "deck-obs-high-yield",
        deckTitle: activeDeck?.title || "Clinical Deck",
        question: item.question,
        answer: item.answer,
        explanation: item.explanation,
        difficulty: item.difficulty || "Medium",
        tag: item.tag || "Clinical",
        status: "new",
        intervalDays: 1,
        timesReviewed: 0
      }));

      onUpdateCards([...cards, ...generatedCards]);
      setShowGenModal(false);
      setIsFlipped(false);
      setCurrentIndex(deckCards.length); // jump to newly added
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const masteredCount = deckCards.filter((c) => c.status === "mastered").length;
  const masteryPct = deckCards.length > 0 ? Math.round((masteredCount / deckCards.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header & Deck Info */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-emerald-600" />
                <span>Spaced Repetition Flashcards</span>
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 font-display">
              Clinical Recall & Flashcard Decks
            </h1>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed max-w-2xl">
              Reinforce high-yield nursing dosages, obstetric protocols, and anatomy with interactive spaced repetition. Master every concept before your licensure examination.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="ai-generate-cards-btn"
              onClick={() => setShowGenModal(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-sky-200" />
              <span>Generate Cards with AI</span>
            </button>
          </div>
        </div>

        {/* Deck Pills Switcher */}
        <div className="flex items-center gap-2 overflow-x-auto pt-4 border-t border-slate-100 mt-4 scrollbar-none">
          {decks.map((deck) => {
            const isSelected = deck.id === selectedDeckId;
            const countForDeck = cards.filter((c) => c.deckId === deck.id).length;
            return (
              <button
                key={deck.id}
                onClick={() => {
                  setSelectedDeckId(deck.id);
                  setCurrentIndex(0);
                  setIsFlipped(false);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                  isSelected
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                }`}
              >
                <span>{deck.title}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20 text-current font-semibold">
                  {countForDeck} cards
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Flashcard Practice Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Columns: Card Stage */}
        <div className="lg:col-span-8 space-y-4">
          {deckCards.length > 0 && currentCard ? (
            <div className="space-y-4">
              {/* Progress & Card Counter */}
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
                <span>
                  Card {currentIndex + 1} of {deckCards.length}
                </span>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800">
                    {currentCard.difficulty}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                    {currentCard.tag}
                  </span>
                </div>
              </div>

              {/* 3D Interactive Flip Card */}
              <div
                id="active-flashcard"
                onClick={() => setIsFlipped(!isFlipped)}
                className="relative min-h-[300px] sm:min-h-[340px] w-full rounded-2xl border-2 border-slate-200 bg-white p-6 sm:p-8 shadow-sm hover:shadow-md transition-all cursor-pointer select-none flex flex-col justify-between overflow-hidden"
              >
                {/* Top card header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <Layers className="w-4 h-4 text-sky-500" />
                    <span>{isFlipped ? "Answer & Clinical Rationale" : "Question / Clinical Trigger"}</span>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                    <RotateCw className="w-3.5 h-3.5 text-slate-400" /> Click anywhere to flip
                  </span>
                </div>

                {/* Card Center Content */}
                <div className="py-6 my-auto">
                  {!isFlipped ? (
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug font-display">
                        {currentCard.question}
                      </h2>
                      <p className="text-xs text-slate-400 mt-4">
                        💡 Think through your clinical answer, then tap to reveal the rationale.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4 animate-in fade-in duration-200">
                      <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 mb-1">
                          Core Answer
                        </div>
                        <p className="text-sm sm:text-base font-bold text-emerald-950 leading-relaxed whitespace-pre-line">
                          {currentCard.answer}
                        </p>
                      </div>

                      {currentCard.explanation && (
                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
                          <strong className="text-slate-900 block mb-0.5">Clinical Pearl & Council Rationale:</strong>
                          {currentCard.explanation}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Bottom Card Footer */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span>Status: <strong className="text-slate-700 uppercase">{currentCard.status}</strong></span>
                  <span>Reviewed: {currentCard.timesReviewed || 0} times</span>
                </div>
              </div>

              {/* Spaced Repetition Rating Controls */}
              {isFlipped ? (
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
                  <div className="text-center text-xs font-bold text-slate-600 mb-2">
                    How well did you recall this answer?
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    <button
                      onClick={() => handleRateCard("again")}
                      className="py-2.5 px-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-bold border border-rose-200 transition-colors cursor-pointer text-center"
                    >
                      <div className="font-extrabold text-sm">Again</div>
                      <div className="text-[10px] text-rose-600 font-normal mt-0.5">&lt; 1 day</div>
                    </button>
                    <button
                      onClick={() => handleRateCard("hard")}
                      className="py-2.5 px-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold border border-amber-200 transition-colors cursor-pointer text-center"
                    >
                      <div className="font-extrabold text-sm">Hard</div>
                      <div className="text-[10px] text-amber-600 font-normal mt-0.5">2 days</div>
                    </button>
                    <button
                      onClick={() => handleRateCard("good")}
                      className="py-2.5 px-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-bold border border-sky-200 transition-colors cursor-pointer text-center"
                    >
                      <div className="font-extrabold text-sm">Good</div>
                      <div className="text-[10px] text-sky-600 font-normal mt-0.5">4 days</div>
                    </button>
                    <button
                      onClick={() => handleRateCard("easy")}
                      className="py-2.5 px-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 transition-colors cursor-pointer text-center"
                    >
                      <div className="font-extrabold text-sm">Easy</div>
                      <div className="text-[10px] text-emerald-600 font-normal mt-0.5">Mastered</div>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-3">
                  <button
                    onClick={handlePrev}
                    className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>

                  <button
                    onClick={() => setIsFlipped(true)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-all cursor-pointer text-center"
                  >
                    Reveal Answer
                  </button>

                  <button
                    onClick={handleNext}
                    className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
              <Layers className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-bold text-base text-slate-700">No cards in this deck yet</h3>
              <button
                onClick={() => setShowGenModal(true)}
                className="mt-3 px-4 py-2 rounded-xl bg-sky-600 text-white font-bold text-xs cursor-pointer"
              >
                Generate Cards with AI
              </button>
            </div>
          )}
        </div>

        {/* Right 4 Columns: Deck Mastery Stats & Card List */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Deck Mastery Progress
            </h3>

            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-800">{activeDeck.title}</span>
              <span className="text-xs font-extrabold text-emerald-600">{masteryPct}%</span>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${masteryPct}%` }}
              ></div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-100">
                <div className="font-extrabold text-base">{masteredCount}</div>
                <div className="text-[10px] text-emerald-700 font-semibold">Mastered</div>
              </div>
              <div className="p-2.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-100">
                <div className="font-extrabold text-base">{deckCards.length - masteredCount}</div>
                <div className="text-[10px] text-amber-700 font-semibold">In Learning</div>
              </div>
            </div>
          </div>

          {/* Quick Cards List in Deck */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
              Cards in this Deck ({deckCards.length})
            </h4>
            <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
              {deckCards.map((card, idx) => (
                <div
                  key={card.id}
                  onClick={() => {
                    setCurrentIndex(idx);
                    setIsFlipped(false);
                  }}
                  className={`p-2 rounded-lg text-xs transition-all cursor-pointer flex items-center justify-between ${
                    currentIndex === idx
                      ? "bg-sky-50 text-sky-900 font-bold border border-sky-200"
                      : "hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <span className="truncate max-w-[200px]">{card.question}</span>
                  {card.status === "mastered" && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 ml-1" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AI Generate Flashcards Modal */}
      {showGenModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-sky-600" />
                <h3 className="font-bold text-base text-slate-900">
                  Generate Flashcards with Gemini
                </h3>
              </div>
              <button
                onClick={() => setShowGenModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 mt-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Topic or Clinical Subject
                </label>
                <input
                  type="text"
                  value={genTopic}
                  onChange={(e) => setGenTopic(e.target.value)}
                  placeholder="e.g. Episiotomy indications, APGAR scoring, Methergine"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Target Deck
                </label>
                <select
                  value={selectedDeckId}
                  onChange={(e) => setSelectedDeckId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                >
                  {decks.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Number of Flashcards
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[4, 6, 8].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setGenCount(n)}
                      className={`py-1.5 text-xs font-bold rounded-lg border text-center transition-all cursor-pointer ${
                        genCount === n
                          ? "bg-sky-50 border-sky-400 text-sky-800"
                          : "bg-white border-slate-200 text-slate-600"
                      }`}
                    >
                      {n} Cards
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowGenModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  id="submit-generate-flashcards-btn"
                  type="button"
                  onClick={handleGenerateCards}
                  disabled={isGenerating || !genTopic.trim()}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-sky-200" />
                      <span>Create Flashcards</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
