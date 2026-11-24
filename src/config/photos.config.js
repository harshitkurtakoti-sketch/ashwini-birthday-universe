/**
 * PHOTOGRAPH CONFIGURATION & SLIDESHOW MAPPING
 * 
 * Organized photo collections for automatic changing slideshows
 * and photo frames across all 7 chapters.
 */

const awardsSlideshowList = [
  { src: '/images/awards/award-01.jpg', caption: 'Late Reply Champion in action 📱', alt: 'Late reply certificate award photo' },
  { src: '/images/awards/award-02.jpg', caption: 'Certified Panda Mode 🐼', alt: 'Certified panda award photo' },
  { src: '/images/awards/award-03.jpg', caption: 'Queen of Random Expressions 🎭', alt: 'Dramatic expressions award photo' },
  { src: '/images/awards/award-04.jpg', caption: 'High energy & pure trouble ✨', alt: 'Professional bewadi award photo' }
];

export const photosConfig = {
  // Section 01: Welcome Screen (Exclusively features Ashwini's childhood birthday photo)
  welcome: {
    main: '/images/welcome/childhood-birthday.jpg',
    photo: '/images/welcome/childhood-birthday.jpg',
    subtitle: 'From little panda to the Queen of late replies',
    slideshow: [
      {
        src: '/images/welcome/childhood-birthday.jpg',
        caption: 'The Little Birthday Queen, Ashu 🐼🎂',
        alt: 'Ashwini childhood birthday photo under Happy Birthday banner'
      }
    ]
  },

  // Section 02: 26 Little Reasons
  reasons: {
    feature1: '/images/reasons/reason-01.jpg',
    feature2: '/images/reasons/reason-02.jpg',
    photo: '/images/reasons/reason-01.jpg',
    slideshow: [
      { src: '/images/reasons/reason-01.jpg', caption: 'That iconic Ash laugh 🌸', alt: 'Ashwini joyful smile outdoors' },
      { src: '/images/reasons/reason-02.jpg', caption: 'Moments of laughter & magic ✨', alt: 'Ashwini in lilac saree' },
      { src: '/images/reasons/reason-special.jpg', caption: 'A bond that needs zero filter 🤍', alt: 'Ashwini portrait' }
    ]
  },

  // Section 03: Crazy Awards / Certified Ashwini
  awards: {
    slideshow: awardsSlideshowList,
    list: [
      {
        id: 'award-1',
        title: 'Late Reply Champion',
        image: '/images/awards/award-01.jpg',
        badge: '👑 Official 3-5 Business Days Responder'
      },
      {
        id: 'award-2',
        title: 'Certified Panda Behaviour Award',
        image: '/images/awards/award-02.jpg',
        badge: '🐼 100% Nap & Snack Certified'
      },
      {
        id: 'award-3',
        title: 'Queen of Random Reactions',
        image: '/images/awards/award-03.jpg',
        badge: '🎭 Dramatic & Unpredictable'
      },
      {
        id: 'award-4',
        title: 'Professional Bewadi & Chaos Maker',
        image: '/images/awards/award-04.jpg',
        badge: '✨ Pure Energy & Trouble'
      }
    ]
  },
  // Backwards-compatible alias for awards slideshow
  awardsSlideshow: awardsSlideshowList,

  // Section 04: A Letter For You
  letter: {
    photo: '/images/letter/letter-photo.jpg',
    slideshow: [
      { src: '/images/letter/letter-photo.jpg', caption: 'To my favorite disturber 💌', alt: 'Ashwini special memory' },
      { src: '/images/reasons/reason-02.jpg', caption: 'Always wishing you happiness 🌸', alt: 'Ashwini portrait in traditional attire' }
    ]
  },

  // Section 05: Ashwini Quiz
  quiz: {
    photo: '/images/quiz/quiz-photo.jpg',
    slideshow: [
      { src: '/images/quiz/quiz-photo.jpg', caption: "Let's see how well you score! 🎯", alt: 'Ashwini portrait outdoors' },
      { src: '/images/awards/award-04.jpg', caption: 'No negative marking for pandas 🐼', alt: 'Ashwini smile' }
    ]
  },

  // Section 06: A Jar Full of Wishes
  wishes: {
    photo: '/images/wishes/wish-photo.jpg',
    slideshow: [
      { src: '/images/wishes/wish-photo.jpg', caption: 'Endless wishes for a genuine soul 🌟', alt: 'Ashwini smiling bright' },
      { src: '/images/reasons/reason-01.jpg', caption: 'May your year be packed with smiles 💖', alt: 'Ashwini cheerful memory' }
    ]
  },

  // Section 07: Grand Finale — The Long Drive
  finale: {
    photo: '/images/finale/finale-photo.jpg',
    slideshow: [
      { src: '/images/finale/finale-photo.jpg', caption: 'Ready for our midnight adventure? 🚗🌙', alt: 'Ashwini in white outfit smiling' },
      { src: '/images/letter/letter-photo.jpg', caption: 'Under the starry night sky ✨', alt: 'Ashwini night portrait' },
      { src: '/images/reasons/reason-special.jpg', caption: 'Good tunes & endless conversations 🌸', alt: 'Ashwini memorable moment' }
    ]
  }
};

export default photosConfig;
