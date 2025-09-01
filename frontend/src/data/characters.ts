export interface Character {
  id: string;
  name: string;
  tone: string;
  image: string;
  description: string;
  color: string;
  bgGradient: string;
}

export const characters: Character[] = [
  {
    id: 'calm-collected',
    name: 'Calm and Collected',
    tone: 'calm-collected',
    image: '/characters/KBW Calm and collected.png',
    description: 'Composed, rational, and level-headed. Masters the art of logical discourse.',
    color: '#3B82F6',
    bgGradient: 'from-blue-500/20 to-cyan-500/20'
  },
  {
    id: 'aggressive',
    name: 'Aggressive',
    tone: 'aggressive',
    image: '/characters/KBW Aggressive.png',
    description: 'Direct, forceful, and confrontational. Never backs down from a challenge.',
    color: '#EF4444',
    bgGradient: 'from-red-500/20 to-orange-500/20'
  },
  {
    id: 'cunning',
    name: 'Cunning',
    tone: 'cunning',
    image: '/characters/KBW Cunning.png',
    description: 'Strategic, clever, and subtly manipulative. A master of psychological tactics.',
    color: '#8B5CF6',
    bgGradient: 'from-purple-500/20 to-pink-500/20'
  },
  {
    id: 'girly',
    name: 'Girly',
    tone: 'girly',
    image: '/characters/KBW Girly.png',
    description: 'Playful, emotional, and expressive. Wins with personality and charm.',
    color: '#EC4899',
    bgGradient: 'from-pink-500/20 to-rose-500/20'
  },
  {
    id: 'custom',
    name: 'Custom',
    tone: 'custom',
    image: '/characters/KBW Sarcastic.png',
    description: 'Define your own unique style and personality.',
    color: '#F59E0B',
    bgGradient: 'from-amber-500/20 to-yellow-500/20'
  },
  {
    id: 'nerd',
    name: 'Nerd',
    tone: 'nerd',
    image: '/characters/KBW Nerd.png',
    description: 'Academic, sophisticated, and analytical. Employs complex reasoning.',
    color: '#10B981',
    bgGradient: 'from-emerald-500/20 to-green-500/20'
  },
  {
    id: 'casual',
    name: 'Casual',
    tone: 'casual',
    image: '/characters/KBW Casual.png',
    description: 'Relaxed, informal, and conversational. Keeps it simple and friendly.',
    color: '#06B6D4',
    bgGradient: 'from-cyan-500/20 to-sky-500/20'
  },
  {
    id: 'professional',
    name: 'Professional',
    tone: 'professional',
    image: '/characters/KBW Professional.png',
    description: 'Formal, diplomatic, and business-like. Maintains utmost professionalism.',
    color: '#6B7280',
    bgGradient: 'from-gray-500/20 to-slate-500/20'
  }
];

export const mainCharacter = {
  name: 'Keyboard Warrior',
  image: '/characters/KBW Main.png',
  description: 'Master of digital debates and champion of keyboard combat!',
  color: '#FFD700',
  bgGradient: 'from-yellow-400/30 to-amber-500/30'
};