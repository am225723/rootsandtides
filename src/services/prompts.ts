export const DAILY_PROMPTS: string[] = [
  "What trait of theirs lives in you? How does it show up in your daily life?",
  "What is one memory that still makes you smile, even through the tears?",
  "If you could tell them one thing today, what would it be?",
  "What did they teach you about love without ever saying a word?",
  "Where do you feel their presence most strongly?",
  "What part of yourself are you still discovering since the loss?",
  "What would they want you to know about how you're doing right now?",
  "What tradition or value do you want to carry forward into your future?",
  "Describe a moment when you felt them with you recently.",
  "What does grief feel like in your body today? Where do you hold it?",
  "What is one thing you forgive yourself for today?",
  "What does healing look like for you — not as an endpoint, but as a direction?",
  "What small act of self-care can you offer yourself today?",
  "What would you say to someone else who is grieving the same loss?",
  "What part of your relationship are you still processing?",
  "How has this loss changed the way you see time?",
  "What does their absence teach you about what truly matters?",
  "What is one way you've grown stronger since the loss?",
  "What memory do you want to preserve most carefully?",
  "How do you carry them with you into new experiences?",
  "What does 'continuing bonds' mean to you personally?",
  "What would a compassionate friend say to you right now?",
  "What are you most afraid of forgetting about them?",
  "How has your relationship with them evolved since they passed?",
  "What does your grief need from you today — rest, expression, or movement?",
  "What is one thing you wish you had said? Can you say it now?",
  "How do you honor them in the small, everyday moments?",
  "What part of your identity is tied to being their child?",
  "What new meaning have you found in something ordinary since the loss?",
  "What would it feel like to hold your grief gently, like something precious?",
  "What does love look like when the person is no longer physically here?",
  "How are you different — and how are you the same — as before the loss?",
  "What would you plant in a garden to represent your relationship with them?",
  "What song, scent, or place brings them closest to you?",
  "What does 'enough' look like for you today — in grief, in healing, in life?",
];

export function getTodayPrompt(): string {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  return DAILY_PROMPTS[dayOfYear % DAILY_PROMPTS.length];
}

export function getPromptByIndex(index: number): string {
  return DAILY_PROMPTS[Math.abs(index) % DAILY_PROMPTS.length];
}