'use client';

import React, { useEffect, useState } from 'react';

type ChoiceKey = 'A' | 'B' | 'C' | 'D';

interface ChoiceItem {
  key: ChoiceKey;
  bgClass: string;
}

const CHOICES: ChoiceItem[] = [
  { key: 'A', bgClass: 'bg-red-600 active:bg-red-700' },
  { key: 'B', bgClass: 'bg-amber-400 text-slate-950 active:bg-amber-500' },
  { key: 'C', bgClass: 'bg-blue-600 active:bg-blue-700' },
  { key: 'D', bgClass: 'bg-emerald-600 active:bg-emerald-700' },
];

export default function PlayerPage() {
  const [playerName, setPlayerName] = useState<string>('Joueur');
  const [playerColor, setPlayerColor] = useState<string>('#10b981');
  const [score, setScore] = useState<number>(0);
  const [questionNumber, setQuestionNumber] = useState<number>(1);
  const [timeLeft, setTimeLeft] = useState<number>(15);
  const [selectedChoice, setSelectedChoice] = useState<ChoiceKey | null>(null);
  const [hasAnswered, setHasAnswered] = useState<boolean>(false);

  // Réinitialisation de la sélection quand le numéro de question change
  useEffect(() => {
    setSelectedChoice(null);
    setHasAnswered(false);
  }, [questionNumber]);

  const handleSelectChoice = (choice: ChoiceKey) => {
    if (hasAnswered || timeLeft <= 0) return;

    setSelectedChoice(choice);
    setHasAnswered(true);

    // Branche ici ton envoi d'état vers la TV / base (ex: choice, hasAnswered: true)
    // La mise à jour du score reste gérée via ta table `player` existante.
  };

  return (
    <main className="h-[100dvh] w-full overflow-hidden bg-slate-950 text-white flex flex-col justify-between px-3 py-2.5 select-none touch-manipulation">
      {/* Bandeau supérieur : Pastille joueur + Score */}
      <header className="flex items-center justify-between gap-2 rounded-2xl bg-slate-900/95 border border-white/10 px-3 py-2 shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <span
            className="h-4 w-4 rounded-full shrink-0 ring-2 ring-white/40"
            style={{ backgroundColor: playerColor }}
          />
          <span className="font-bold text-base truncate">{playerName}</span>
          <span
            className={`text-xs font-semibold px-2.5 py-0.5 rounded-full shrink-0 ${
              hasAnswered
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                : 'bg-white/10 text-slate-300'
            }`}
          >
            {hasAnswered && selectedChoice
              ? `Répondu (${selectedChoice})`
              : 'En attente'}
          </span>
        </div>

        <span className="bg-emerald-600 text-white font-extrabold text-sm px-3 py-1 rounded-xl shrink-0">
          {score} pts
        </span>
      </header>

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
      <section className="grid grid-cols-2 gap-2.5 flex-1 min-h-0 max-h-[60dvh]">
        {CHOICES.map((item) => {
          const isSelected = selectedChoice === item.key;

          return (
            <button
              key={item.key}
              type="button"
              disabled={hasAnswered || timeLeft <= 0}
              onClick={() => handleSelectChoice(item.key)}
              className={`rounded-2xl border-2 flex flex-col items-center justify-center font-black text-3xl sm:text-4xl transition-transform ${
                item.bgClass
              } ${
                isSelected
                  ? 'border-white scale-[0.98] ring-4 ring-white/40'
                  : 'border-white/25'
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
      </section>

      {/* Pastille joueur bien visible en bas */}
      <footer className="mt-2 rounded-2xl bg-slate-900 border border-white/10 px-3.5 py-2 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <span
            className="h-4 w-4 rounded-full shrink-0 ring-2 ring-white/30"
            style={{ backgroundColor: playerColor }}
          />
          <span className="text-sm font-semibold text-slate-200 truncate">
            {hasAnswered && selectedChoice
              ? `${playerName} — Réponse ${selectedChoice} envoyée`
              : `${playerName} — Touchez une case`}
          </span>
        </div>
      </footer>
    </main>
  );
}
