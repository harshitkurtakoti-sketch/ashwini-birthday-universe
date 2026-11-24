import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import SecretEntryGate from './components/SecretEntryGate';
import Navbar from './components/Navbar';
import FloatingParticles from './components/FloatingParticles';
import AnimatedPandaBackground from './components/AnimatedPandaBackground';
import NotificationToastAndSettings from './components/NotificationToastAndSettings';
import SectionWrapper from './components/SectionWrapper';
import Section01Welcome from './sections/Section01Welcome';
import Section02Reasons from './sections/Section02Reasons';
import Section03Awards from './sections/Section03Awards';
import Section04Letter from './sections/Section04Letter';
import Section05Quiz from './sections/Section05Quiz';
import Section06WishesJar from './sections/Section06WishesJar';
import Section07Finale from './sections/Section07Finale';
import progressService from './services/progressService';

export default function App() {
  const [progress, setProgress] = useState(() => progressService.load());
  const [currentSection, setCurrentSection] = useState(() => {
    const loaded = progressService.load();
    return Math.min(loaded.currentSection || 0, loaded.unlockedMaxSection || 0);
  });

  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Synchronize unlockedMaxSection whenever progress updates
  const handleUpdateProgress = (partialUpdates) => {
    setProgress((prev) => {
      const updated = {
        ...prev,
        ...partialUpdates
      };

      // Recalculate max unlocked section
      let maxUnlocked = 0;
      for (let i = 0; i <= 6; i++) {
        if (progressService.isSectionComplete(i, updated)) {
          maxUnlocked = Math.max(maxUnlocked, i + 1);
        } else {
          break;
        }
      }
      updated.unlockedMaxSection = Math.max(updated.unlockedMaxSection || 0, maxUnlocked);
      updated.currentSection = currentSection;

      progressService.save(updated);
      return updated;
    });
  };

  const handleSecretGateComplete = () => {
    handleUpdateProgress({ secretPassed: true });
    setCurrentSection(0);
  };

  const handleNavigate = (targetIndex) => {
    if (targetIndex <= progress.unlockedMaxSection) {
      setCurrentSection(targetIndex);
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Save current position
      setProgress((prev) => {
        const updated = { ...prev, currentSection: targetIndex };
        progressService.save(updated);
        return updated;
      });
    }
  };

  const handleNextSection = () => {
    const nextIdx = currentSection + 1;
    if (nextIdx <= 6) {
      handleNavigate(nextIdx);
    }
  };

  // 1. MANDATORY ENTRY GATE: Secret question "Bewadi" + Automatic Video Intro
  if (!progress.secretPassed) {
    return <SecretEntryGate onComplete={handleSecretGateComplete} />;
  }

  // 2. MAIN BIRTHDAY UNIVERSE WEBSITE (Only shown after secret is solved & video watched)
  return (
    <div className="relative min-h-screen w-full bg-slate-950 font-sans selection:bg-pink-300 selection:text-pink-950 overflow-x-hidden">
      
      {/* Ambient Floating Elements */}
      <FloatingParticles count={22} theme={currentSection === 6 ? 'dark' : 'light'} />

      {/* Adorable Animated Background Pandas */}
      <AnimatedPandaBackground />

      {/* Top Floating Navbar (Chapter Progress with Checkmarks & Locks, Back button, Audio controls) */}
      <Navbar
        currentSection={currentSection}
        onNavigate={handleNavigate}
        progress={progress}
        isPlayingMusic={isPlayingMusic}
        setIsPlayingMusic={setIsPlayingMusic}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
      />

      {/* Slide-by-Slide Locked Experience: Exactly ONE Fullscreen Section at a time */}
      <main className="w-full min-h-screen">
        <AnimatePresence mode="wait">
          {currentSection === 0 && (
            <SectionWrapper key="s0" id="welcome" theme="dreamy">
              <Section01Welcome
                onEnter={() => {
                  handleUpdateProgress({ welcomeCompleted: true });
                  handleNextSection();
                }}
              />
            </SectionWrapper>
          )}

          {currentSection === 1 && (
            <SectionWrapper key="s1" id="reasons" theme="dreamy">
              <Section02Reasons
                progress={progress}
                onUpdateProgress={handleUpdateProgress}
                onNext={handleNextSection}
              />
            </SectionWrapper>
          )}

          {currentSection === 2 && (
            <SectionWrapper key="s2" id="awards" theme="dreamy">
              <Section03Awards
                progress={progress}
                onUpdateProgress={handleUpdateProgress}
                onNext={handleNextSection}
              />
            </SectionWrapper>
          )}

          {currentSection === 3 && (
            <SectionWrapper key="s3" id="letter" theme="sunset">
              <Section04Letter
                progress={progress}
                onUpdateProgress={handleUpdateProgress}
                onNext={handleNextSection}
              />
            </SectionWrapper>
          )}

          {currentSection === 4 && (
            <SectionWrapper key="s4" id="quiz" theme="dreamy">
              <Section05Quiz
                progress={progress}
                onUpdateProgress={handleUpdateProgress}
                onNext={handleNextSection}
              />
            </SectionWrapper>
          )}

          {currentSection === 5 && (
            <SectionWrapper key="s5" id="wishes" theme="dreamy">
              <Section06WishesJar
                progress={progress}
                onUpdateProgress={handleUpdateProgress}
                onNext={handleNextSection}
              />
            </SectionWrapper>
          )}

          {currentSection === 6 && (
            <SectionWrapper key="s6" id="finale" theme="night">
              <Section07Finale
                progress={progress}
                onUpdateProgress={handleUpdateProgress}
              />
            </SectionWrapper>
          )}
        </AnimatePresence>
      </main>

      {/* Live EmailJS Dispatches Toast & Setup Modal */}
      <NotificationToastAndSettings />

    </div>
  );
}
