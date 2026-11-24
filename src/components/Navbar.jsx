import React from 'react';
import { Volume2, VolumeX, Music, Lock, Check, ChevronLeft } from 'lucide-react';
import audioService from '../services/audioService';
import progressService from '../services/progressService';

const CHAPTERS = [
  { id: 0, label: 'Welcome', short: '01' },
  { id: 1, label: 'Reasons', short: '02' },
  { id: 2, label: 'Awards', short: '03' },
  { id: 3, label: 'Letter', short: '04' },
  { id: 4, label: 'Quiz', short: '05' },
  { id: 5, label: 'Wishes', short: '06' },
  { id: 6, label: 'Finale', short: '07' }
];

export default function Navbar({
  currentSection,
  onNavigate,
  progress,
  isPlayingMusic,
  setIsPlayingMusic,
  isMuted,
  setIsMuted
}) {
  const handleToggleMusic = () => {
    const playing = audioService.toggleMusic((state) => {
      setIsPlayingMusic(state);
    });
    setIsPlayingMusic(playing);
  };

  const handleToggleMute = () => {
    const muted = audioService.toggleMute();
    setIsMuted(muted);
  };

  const handleSelectChapter = (targetIndex) => {
    if (targetIndex <= progress.unlockedMaxSection) {
      audioService.playPop();
      onNavigate(targetIndex);
    } else {
      audioService.playPop();
    }
  };

  const handleBack = () => {
    if (currentSection > 0) {
      audioService.playPop();
      onNavigate(currentSection - 1);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-2 py-2 sm:px-4 md:px-6 sm:py-3 pointer-events-none">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-1.5 sm:gap-2">
        
        {/* Left: Back Button & Logo */}
        <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2">
          {currentSection > 0 && (
            <button
              onClick={handleBack}
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full glass-pill text-purple-900 font-semibold text-xs shadow-md border border-white/80 hover:bg-white active:scale-95 transition-all cursor-pointer"
              title="Return to previous section"
            >
              <ChevronLeft className="w-4 h-4 text-pink-600" />
              <span className="hidden sm:inline">Back</span>
            </button>
          )}

          <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full glass-pill text-purple-950 font-semibold text-xs shadow-md border border-white/80">
            <span className="flex h-2 w-2 rounded-full bg-pink-500 animate-ping" />
            <span className="font-serif-title tracking-wide text-pink-600 hidden xs:inline">Ashwini's Universe</span>
            <span className="font-serif-title tracking-wide text-pink-600 xs:hidden">Ashu 🐼</span>
            <span className="text-purple-400">|</span>
            <span className="text-purple-700 text-[11px] font-medium">Ch 0{currentSection + 1}</span>
          </div>
        </div>

        {/* Center: Desktop Interactive Progress Flow */}
        <div className="pointer-events-auto hidden md:flex items-center gap-1.5 glass-pill px-3 py-1.5 rounded-full shadow-md border border-white/80">
          {CHAPTERS.map((chap, idx) => {
            const isCompleted = progressService.isSectionComplete(chap.id, progress);
            const isCurrent = currentSection === chap.id;
            const isUnlocked = chap.id <= progress.unlockedMaxSection;

            let pillStyle = 'text-gray-400 bg-white/30 cursor-not-allowed opacity-60';
            if (isCurrent) {
              pillStyle = 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-sm font-bold scale-105';
            } else if (isCompleted) {
              pillStyle = 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 font-semibold cursor-pointer border border-emerald-200';
            } else if (isUnlocked) {
              pillStyle = 'text-purple-800 bg-white/70 hover:bg-white font-semibold cursor-pointer';
            }

            return (
              <React.Fragment key={chap.id}>
                <button
                  onClick={() => handleSelectChapter(chap.id)}
                  disabled={!isUnlocked}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] transition-all ${pillStyle}`}
                  title={
                    !isUnlocked
                      ? `${chap.label} is locked. Complete earlier sections first.`
                      : isCompleted
                      ? `${chap.label} completed ✓`
                      : chap.label
                  }
                >
                  <span>{chap.label}</span>
                  {isCompleted ? (
                    <Check className="w-3 h-3 text-emerald-600" />
                  ) : !isUnlocked ? (
                    <Lock className="w-3 h-3 text-gray-400" />
                  ) : isCurrent ? (
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  ) : null}
                </button>
                {idx < CHAPTERS.length - 1 && (
                  <span className="text-purple-300 text-[10px]">→</span>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Mobile Mini Progress Indicator */}
        <div className="pointer-events-auto md:hidden flex items-center gap-1 glass-pill px-2 sm:px-2.5 py-1 rounded-full text-[11px] text-purple-900 font-semibold shadow-md">
          <span>{currentSection + 1}/7</span>
          <span className="text-pink-500 text-[10px]">
            {progressService.isSectionComplete(currentSection, progress) ? '✓' : '🔒'}
          </span>
        </div>

        {/* Right: Audio Controls */}
        <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={handleToggleMusic}
            title={isPlayingMusic ? "Pause Music" : "Play Ambient Melody"}
            className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-medium transition-all shadow-md backdrop-blur-md border cursor-pointer ${
              isPlayingMusic
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white border-pink-300 shadow-pink-300/40'
                : 'bg-white/85 text-purple-800 border-white/90 hover:bg-white'
            }`}
          >
            <Music className={`w-3.5 h-3.5 ${isPlayingMusic ? 'animate-bounce text-pink-200' : ''}`} />
            <span className="hidden sm:inline">
              {isPlayingMusic ? 'Music On' : 'Music'}
            </span>
            {isPlayingMusic && (
              <span className="flex gap-0.5 ml-0.5">
                <span className="w-0.5 h-2.5 bg-white rounded-full animate-[pulse_0.6s_ease-in-out_infinite]" />
                <span className="w-0.5 h-1.5 bg-white rounded-full animate-[pulse_0.4s_ease-in-out_infinite]" />
              </span>
            )}
          </button>

          <button
            onClick={handleToggleMute}
            title={isMuted ? "Unmute Sound Effects" : "Mute Sound Effects"}
            className="p-1.5 sm:p-2 rounded-full glass-pill text-purple-700 hover:text-pink-600 hover:bg-white transition-all shadow-sm cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-400" /> : <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
          </button>
        </div>

      </div>
    </header>
  );
}
