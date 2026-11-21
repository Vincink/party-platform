'use client';

import React, { useMemo, useState } from 'react';

type ChoiceKey = 'A' | 'B' | 'C' | 'D';

interface ChoiceOption {
  key: ChoiceKey;
  label?: string;
  bgClass: string;
}

interface PlayerScreenProps {
  playerName: string;
  playerColor?: string;
  score: number;
  questionNumber: number;
  timeLeft: number;
  correctAnswer?: ChoiceKey;
  isAnswerRevealed?: boolean;
  onSubmitAnswer: (payload: {
    choice: ChoiceKey;
    pointsEarned: number;
    answeredAt: number;
  }) => void;
}

const CHOICES: ChoiceOption[] = [
  { key: 'A', bgClass: 'bg-red-600 active:bg-red-700' },
  { key: 'B', bgClass: 'bg-amber-400 text-slate-950 active:bg-amber-500' },
  { key: 'C', bgClass: 'bg-blue-600 active:bg-blue-700' },
  { key: 'D', bgClass: 'bg-emerald-600 active:bg-emerald-700' },
];

export default function PlayerQuizScreen({
  playerName,
  playerColor = '#10b981',
  score,
  questionNumber,
  timeLeft,
  correctAnswer,
  isAnswerRevealed = false,
  onSubmitAnswer,
}: PlayerScreenProps) {
  const [selectedChoice, setSelectedChoice] = useState<ChoiceKey | null>(null);
  const [lockedQuestion, setLockedQuestion] = useState<number | null>(null);

  const hasAnsweredCurrent = lockedQuestion === questionNumber && selectedChoice !== null;

  const computedPoints = useMemo(() => {
    if (!correctAnswer || !selectedChoice || selectedChoice !== correctAnswer) {
      return 0;
    }
    // Bonus de rapidité simple (ex. : base 100 pts + jusqu'à 50 pts selon le temps restant)
    const speedBonus = Math.max(0, Math.min(50, timeLeft * 3));
    return 100 + speedBonus;
  }, [correctAnswer, selectedChoice, timeLeft]);

  const handleSelect = (choice: ChoiceKey) => {
    if (hasAnsweredCurrent || timeLeft <= 0) return;

    setSelectedChoice(choice);
    setLockedQuestion(questionNumber);

    const earned =
      correctAnswer && choice === correctAnswer
        ? 100 + Math.max(0, Math.min(50, timeLeft * 3))
        : 0;

    onSubmitAnswer({
      choice,
      pointsEarned: earned,
      answeredAt: Date.now(),
    });
  };

  return (
    <div className="h-[100dvh] w-full overflow-hidden bg-slate-950 text-white flex flex-col justify-between px-3 py-2.5 select-none touch-manipulation">
      {/* Barre haute : Pastille joueur + Score */}
      <div className="flex items-center justify-between gap-2 rounded-2xl bg-slate-900/90 border border-white/10 px-3 py-2 shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <span
            className="h-4 w-4 rounded-full shrink-0 ring-2 ring-white/40"
            style={{ backgroundColor: playerColor }}
          />
          <span className="font-bold text-base truncate">{playerName}</span>
          <span
            className={`text-xs font-semibold px-2.5 py-0.5 rounded-full shrink-0 ${
              hasAnsweredCurrent
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                : 'bg-white/10 text-slate-300'
            }`}
          >
            {hasAnsweredCurrent ? `Répondu (${selectedChoice})` : 'En attente'}
          </span>
        </div>

        <div className="bg-emerald-600 text-white font-extrabold text-sm px-3 py-1 rounded-xl shrink-0">
          {score} pts
        </div>
      </div>

      {/* Infos question + chrono */}
      <div className="flex items-center justify-between px-1 py-1.5 shrink-0">
        <span className="text-xs font-bold tracking-widest uppercase text-slate-400">
          Question {questionNumber}
        </span>
        <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-slate-800 text-slate-100">
          {timeLeft}s
        </span>
      </div>

      {/* Grille compacte A / B / C / D */}
      <div className="grid grid-cols-2 gap-2.5 flex-1 min-h-0 max-h-[62dvh]">
        {CHOICES.map((item) => {
          const isSelected = selectedChoice === item.key;
          const isCorrect = isAnswerRevealed && correctAnswer === item.key;

          return (
            <button
              key={item.key}
              type="button"
              disabled={hasAnsweredCurrent || timeLeft <= 0}
              onClick={() => handleSelect(item.key)}
              className={`relative rounded-2xl border-2 flex flex-col items-center justify-center font-black text-3xl sm:text-4xl transition-transform ${
                item.bgClass
              } ${
                isSelected
                  ? 'border-white scale-[0.98] ring-4 ring-white/40'
                  : 'border-white/25'
              } ${
                isCorrect ? 'ring-4 ring-lime-300 border-lime-200' : ''
              } disabled:opacity-80`}
            >
              <span>{item.key}</span>
              {isSelected && (
                <span className="mt-1 text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/35 text-white">
                  Choisi
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Pied de page : Pastille détaillée du joueur */}
      <div className="mt-2 rounded-2xl bg-slate-900 border border-white/10 px-3.5 py-2 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <span
            className="h-3.5 w-3.5 rounded-full"
            style={{ backgroundColor: playerColor }}
          />
          <span className="text-sm font-semibold text-slate-200">
            {hasAnsweredCurrent
              ? `Réponse enregistrée : ${selectedChoice}`
              : 'Touchez une case pour répondre'}
          </span>
        </div>

        {isAnswerRevealed && hasAnsweredCurrent && (
          <span className="text-xs font-bold text-emerald-400">
            +{computedPoints} pts
          </span>
        )}
      </div>
    </div>
  );
}
