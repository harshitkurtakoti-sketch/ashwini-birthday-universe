# 🌸 A Birthday Universe for Ashwini ✨ (Secret Gate & Cinematic Edition 🐼)

> A deeply personalized, slide-by-slide interactive birthday surprise celebrating the special bond between Ashwini and her best friend.

---

## 🔒 Mandatory Secret Question & Video Intro

Before any part of the website or top navigation can be viewed, Ashwini encounters a mandatory full-screen security gate:

1. **The Secret Question:**
   - **"What is the name only I can call you?" 🐼**
   - **Validation:** ONLY accepts **"Bewadi"** (case-insensitive, trims accidental spaces: *Bewadi*, *bewadi*, *BEWADI*).
   - **If incorrect:** Shows playful shake animation: *"Oops! That's not the secret name, Ashu! Try again 😂🐼"*. Cannot skip or bypass.
   - **If correct:** Plays unlocking sound & celebration: *"Hehe! You got it right, Bewadi! 💗"*.
2. **Automatic Video Intro:**
   - Located at `public/videos/ashwini-intro.mp4`.
   - Plays automatically in a full-screen cinematic player immediately upon answering correctly.
   - Attempted with audio; includes an intuitive unmute control if browser blocks autoplay audio.
   - Unskippable; smoothly fades out upon video completion.
3. **Transition to Birthday Universe:**
   - Displays *"Enter Your Surprise 💗"* button to begin Chapter 01 (Welcome).

---

## 🚗 Section 07: The Long Drive & Cinematic FOMO Experience

When Ashwini is invited to the long drive (*"CAN I JOIN YOU?"*):
- **If she selects "Yes! Let's plan it! 🚗✨":**
  - Opens the date/time/playlist form.
  - Submits RSVP and displays celebratory confirmation.
  - Reveals the final closing message card.
- **If she selects "Not now / No 🙈":**
  - Activates a playful cinematic FOMO scene:
    - Night drive scene with animated road, city skyline, moon, stars, and animated pandas.
    - Heading: **"WAIT… ASH! Are you sure, Bewadi?"** 🐼
    - Playful imagined moment:
      *"Imagine the cool night breeze on your face, your favorite songs blasting on the speakers, random jokes, deep conversations and pure unfiltered laughter... That would've been one beautiful memory."*
    - Added line: **"That would've been one beautiful memory."**
    - Two clear options:
      1. **"Okay fine, let's plan it! ❤️"** → Switches to planning form with celebration!
      2. **"Still not now 😂"** → Respects her choice completely with:
         *"Deal! No pressure, Ash. Maybe another day, another road, another memory. ❤️"*
         Records her response accurately and smoothly reveals the final personal closing message card.

---

## 🏆 Locked Step-by-Step Chapter Flow

1. **Chapter 01: Welcome Screen** — Must click **"Enter Your Surprise"** to unlock Chapter 02.
2. **Chapter 02: 26 Little Reasons** — Must reveal all **26 reason cards** AND open the secret *"Permission to Break the Wall?"* card and submit an answer.
3. **Chapter 03: Certified Ashwini Awards** — Must inspect/view all **6 awards** and certificates.
4. **Chapter 04: A Letter For You** — Must click the pink wax seal and open the personal letter.
5. **Chapter 05: The Bond Quiz** — Strict **1-question-at-a-time** flow across all 12 questions (Select → Submit Answer → Feedback → Next Question).
6. **Chapter 06: A Jar Full of Wishes** — Must click and reveal all **8 wishing stars** inside the glass jar.
7. **Chapter 07: Grand Finale — The Long Drive** — Interactive invitation with cinematic FOMO handling, date/time confirmation, and closing message card (*"That's all, Ashu! ❤️..."*).

---

## 🚀 Running the Project

```bash
# Start Frontend Dev Server
npm run dev

# Start Local Notification Server (Optional)
npm run server

# Build for Production
npm run build
```

The site runs at `http://localhost:5173/`.
