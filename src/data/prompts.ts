import { ReflectionPrompt } from '../context/types';

export const PROMPTS_LIBRARY: ReflectionPrompt[] = [
  // MEMORIES THEME
  {
    id: 'mem-001',
    text: "What is one small, ordinary moment you shared with your loved one that brings you comfort?",
    followUp: "What made this moment special to you?",
    griefStages: ['early', 'acute', 'adaptation', 'integration', 'meaning'],
    emotionalStates: ['sadness', 'longing', 'gratitude'],
    themes: ['memories'],
    difficulty: 'gentle',
    tags: ['comfort', 'ordinary moments', 'connection'],
  },
  {
    id: 'mem-002',
    text: "If you could have one more conversation with your loved one, what would you want to make sure they knew?",
    griefStages: ['acute', 'adaptation', 'integration'],
    emotionalStates: ['longing', 'guilt', 'gratitude'],
    themes: ['memories', 'emotions'],
    difficulty: 'moderate',
    tags: ['conversation', 'unsaid', 'connection'],
  },
  {
    id: 'mem-003',
    text: "How has your memory of your loved one changed over time? What details have become clearer, and what has softened?",
    griefStages: ['adaptation', 'integration', 'meaning'],
    emotionalStates: ['acceptance', 'sadness', 'gratitude'],
    themes: ['memories', 'growth'],
    difficulty: 'deep',
    tags: ['change', 'time', 'memory'],
  },
  {
    id: 'mem-004',
    text: "What was your loved one's laugh like? Can you recall a time when you made them laugh?",
    griefStages: ['early', 'acute', 'adaptation', 'integration', 'meaning'],
    emotionalStates: ['sadness', 'gratitude', 'longing'],
    themes: ['memories'],
    difficulty: 'gentle',
    tags: ['laughter', 'joy', 'connection'],
  },
  {
    id: 'mem-005',
    text: "What is a place that reminds you of your loved one? What memories does it hold?",
    griefStages: ['early', 'acute', 'adaptation', 'integration'],
    emotionalStates: ['sadness', 'longing', 'gratitude'],
    themes: ['memories', 'triggers'],
    difficulty: 'moderate',
    tags: ['places', 'memories', 'connection'],
  },

  // EMOTIONS THEME
  {
    id: 'emo-001',
    text: "Where do you feel grief in your body today? Can you describe the sensation?",
    followUp: "What might your body be trying to tell you?",
    griefStages: ['early', 'acute', 'adaptation'],
    emotionalStates: ['sadness', 'anger', 'anxiety', 'numbness'],
    themes: ['emotions', 'body'],
    difficulty: 'gentle',
    tags: ['body', 'sensations', 'awareness'],
  },
  {
    id: 'emo-002',
    text: "If your grief could speak, what would it say right now? What does it need?",
    griefStages: ['early', 'acute', 'adaptation'],
    emotionalStates: ['anger', 'sadness', 'anxiety', 'confusion'],
    themes: ['emotions'],
    difficulty: 'moderate',
    tags: ['expression', 'needs', 'inner voice'],
  },
  {
    id: 'emo-003',
    text: "What emotion have you been avoiding? What would happen if you let yourself feel it fully for a few minutes?",
    griefStages: ['acute', 'adaptation', 'integration'],
    emotionalStates: ['anger', 'guilt', 'anxiety', 'numbness'],
    themes: ['emotions'],
    difficulty: 'deep',
    tags: ['avoidance', 'facing emotions', 'courage'],
  },
  {
    id: 'emo-004',
    text: "What color would you give your grief today? What shape would it take?",
    griefStages: ['early', 'acute', 'adaptation', 'integration'],
    emotionalStates: ['sadness', 'anger', 'numbness', 'confusion'],
    themes: ['emotions'],
    difficulty: 'gentle',
    tags: ['creativity', 'expression', 'visualization'],
  },
  {
    id: 'emo-005',
    text: "When was the last time you felt a moment of lightness? What was happening?",
    griefStages: ['adaptation', 'integration', 'meaning'],
    emotionalStates: ['hope', 'gratitude', 'acceptance'],
    themes: ['emotions', 'growth'],
    difficulty: 'gentle',
    tags: ['lightness', 'hope', 'moments'],
  },

  // SELF-CARE THEME
  {
    id: 'care-001',
    text: "What is one small act of kindness you can do for yourself today?",
    followUp: "How might this small act ripple into your day?",
    griefStages: ['early', 'acute', 'adaptation', 'integration', 'meaning'],
    emotionalStates: ['sadness', 'anxiety', 'numbness', 'guilt'],
    themes: ['self_care'],
    difficulty: 'gentle',
    tags: ['kindness', 'self-care', 'small actions'],
  },
  {
    id: 'care-002',
    text: "How has your relationship with rest changed since your loss? What does your body need right now?",
    griefStages: ['early', 'acute', 'adaptation'],
    emotionalStates: ['anxiety', 'numbness', 'sadness'],
    themes: ['self_care', 'body'],
    difficulty: 'moderate',
    tags: ['rest', 'body', 'needs'],
  },
  {
    id: 'care-003',
    text: "Where are you holding yourself to standards that no longer serve you? What would it look like to release that expectation?",
    griefStages: ['adaptation', 'integration', 'meaning'],
    emotionalStates: ['guilt', 'anxiety', 'anger'],
    themes: ['self_care', 'boundaries'],
    difficulty: 'deep',
    tags: ['expectations', 'pressure', 'release'],
  },
  {
    id: 'care-004',
    text: "What is one thing you used to enjoy that you haven't done in a while? Would you like to try it again?",
    griefStages: ['adaptation', 'integration', 'meaning'],
    emotionalStates: ['numbness', 'sadness', 'hope'],
    themes: ['self_care', 'identity'],
    difficulty: 'moderate',
    tags: ['activities', 'joy', 'rediscovery'],
  },
  {
    id: 'care-005',
    text: "How did you nourish yourself today - body, mind, or spirit?",
    griefStages: ['early', 'acute', 'adaptation', 'integration', 'meaning'],
    emotionalStates: ['sadness', 'anxiety', 'numbness', 'acceptance'],
    themes: ['self_care'],
    difficulty: 'gentle',
    tags: ['nourishment', 'mindfulness', 'daily check'],
  },

  // FUTURE THEME
  {
    id: 'fut-001',
    text: "What is one small thing you're looking forward to, even if it's just tomorrow's coffee?",
    griefStages: ['acute', 'adaptation', 'integration', 'meaning'],
    emotionalStates: ['sadness', 'numbness', 'hope'],
    themes: ['future'],
    difficulty: 'gentle',
    tags: ['hope', 'looking forward', 'small things'],
  },
  {
    id: 'fut-002',
    text: "How has your perspective on the future changed? What feels different now?",
    griefStages: ['adaptation', 'integration', 'meaning'],
    emotionalStates: ['sadness', 'anxiety', 'hope', 'acceptance'],
    themes: ['future', 'growth'],
    difficulty: 'moderate',
    tags: ['perspective', 'change', 'future'],
  },
  {
    id: 'fut-003',
    text: "What parts of yourself have you discovered since your loss? How might these shape your future?",
    griefStages: ['integration', 'meaning'],
    emotionalStates: ['hope', 'gratitude', 'acceptance'],
    themes: ['future', 'identity', 'growth'],
    difficulty: 'deep',
    tags: ['discovery', 'identity', 'possibilities'],
  },
  {
    id: 'fut-004',
    text: "If you could write a letter to yourself one year from now, what would you want to remember about this time?",
    griefStages: ['acute', 'adaptation', 'integration'],
    emotionalStates: ['sadness', 'hope', 'anxiety', 'acceptance'],
    themes: ['future', 'emotions'],
    difficulty: 'moderate',
    tags: ['letter', 'future self', 'hope'],
  },

  // LEGACY THEME
  {
    id: 'leg-001',
    text: "What is one quality your loved one had that you admired? How might you embody that quality in your own life today?",
    griefStages: ['adaptation', 'integration', 'meaning'],
    emotionalStates: ['gratitude', 'longing', 'acceptance'],
    themes: ['legacy', 'memories'],
    difficulty: 'gentle',
    tags: ['qualities', 'admiration', 'living legacy'],
  },
  {
    id: 'leg-002',
    text: "What lesson did your loved one teach you that still guides you today?",
    griefStages: ['adaptation', 'integration', 'meaning'],
    emotionalStates: ['gratitude', 'acceptance', 'hope'],
    themes: ['legacy', 'growth'],
    difficulty: 'moderate',
    tags: ['lessons', 'guidance', 'wisdom'],
  },
  {
    id: 'leg-003',
    text: "How do you want your loved one to be remembered? What stories would you tell about them?",
    griefStages: ['integration', 'meaning'],
    emotionalStates: ['gratitude', 'acceptance', 'longing'],
    themes: ['legacy', 'memories'],
    difficulty: 'moderate',
    tags: ['stories', 'remembering', 'legacy'],
  },
  {
    id: 'leg-004',
    text: "What part of your loved one lives on in you?",
    griefStages: ['integration', 'meaning'],
    emotionalStates: ['gratitude', 'acceptance', 'hope'],
    themes: ['legacy', 'identity'],
    difficulty: 'deep',
    tags: ['living on', 'connection', 'identity'],
  },

  // IDENTITY THEME
  {
    id: 'idn-001',
    text: "Who are you today, separate from who you were with your loved one?",
    griefStages: ['adaptation', 'integration', 'meaning'],
    emotionalStates: ['confusion', 'sadness', 'hope', 'acceptance'],
    themes: ['identity'],
    difficulty: 'deep',
    tags: ['self', 'identity', 'change'],
  },
  {
    id: 'idn-002',
    text: "What parts of your identity have stayed the same since your loss?",
    griefStages: ['acute', 'adaptation', 'integration'],
    emotionalStates: ['confusion', 'acceptance', 'gratitude'],
    themes: ['identity'],
    difficulty: 'moderate',
    tags: ['stability', 'self', 'continuity'],
  },
  {
    id: 'idn-003',
    text: "How has grief changed you? What have you learned about yourself?",
    griefStages: ['integration', 'meaning'],
    emotionalStates: ['acceptance', 'gratitude', 'hope'],
    themes: ['identity', 'growth'],
    difficulty: 'deep',
    tags: ['change', 'learning', 'growth'],
  },

  // RELATIONSHIPS THEME
  {
    id: 'rel-001',
    text: "How has grief affected your relationships with others?",
    griefStages: ['acute', 'adaptation', 'integration'],
    emotionalStates: ['sadness', 'anger', 'anxiety', 'confusion'],
    themes: ['relationships', 'support'],
    difficulty: 'moderate',
    tags: ['relationships', 'change', 'support'],
  },
  {
    id: 'rel-002',
    text: "Who has been a source of support for you? Have you been able to let them in?",
    griefStages: ['early', 'acute', 'adaptation'],
    emotionalStates: ['sadness', 'gratitude', 'anxiety'],
    themes: ['relationships', 'support'],
    difficulty: 'moderate',
    tags: ['support', 'connection', 'letting in'],
  },
  {
    id: 'rel-003',
    text: "What do you wish others understood about your grief?",
    griefStages: ['early', 'acute', 'adaptation', 'integration'],
    emotionalStates: ['sadness', 'anger', 'frustration', 'longing'],
    themes: ['relationships', 'emotions'],
    difficulty: 'moderate',
    tags: ['understanding', 'communication', 'needs'],
  },

  // ANNIVERSARY THEME
  {
    id: 'ann-001',
    text: "As this anniversary approaches, what do you need to feel supported?",
    griefStages: ['early', 'acute', 'adaptation', 'integration', 'meaning'],
    emotionalStates: ['sadness', 'anxiety', 'longing', 'gratitude'],
    themes: ['anniversary', 'support', 'emotions'],
    difficulty: 'gentle',
    tags: ['anniversary', 'preparation', 'support'],
  },
  {
    id: 'ann-002',
    text: "On this day, what memory would you like to honor?",
    griefStages: ['early', 'acute', 'adaptation', 'integration', 'meaning'],
    emotionalStates: ['sadness', 'gratitude', 'longing', 'acceptance'],
    themes: ['anniversary', 'memories', 'rituals'],
    difficulty: 'gentle',
    tags: ['anniversary', 'honor', 'memories'],
  },
  {
    id: 'ann-003',
    text: "Looking back on the past year, how have you changed? What have you learned about yourself?",
    griefStages: ['adaptation', 'integration', 'meaning'],
    emotionalStates: ['acceptance', 'gratitude', 'hope', 'sadness'],
    themes: ['anniversary', 'growth', 'reflection'],
    difficulty: 'deep',
    tags: ['anniversary', 'growth', 'change'],
  },

  // RITUALS THEME
  {
    id: 'rit-001',
    text: "What small ritual could you create to honor your loved one?",
    griefStages: ['adaptation', 'integration', 'meaning'],
    emotionalStates: ['gratitude', 'longing', 'acceptance'],
    themes: ['rituals', 'legacy'],
    difficulty: 'gentle',
    tags: ['rituals', 'honoring', 'creating'],
  },
  {
    id: 'rit-002',
    text: "How do you mark the passage of time in your grief journey?",
    griefStages: ['integration', 'meaning'],
    emotionalStates: ['acceptance', 'gratitude', 'hope'],
    themes: ['rituals', 'growth'],
    difficulty: 'moderate',
    tags: ['time', 'marking', 'journey'],
  },

  // SUPPORT THEME
  {
    id: 'sup-001',
    text: "What kind of support have you found most helpful?",
    griefStages: ['early', 'acute', 'adaptation', 'integration'],
    emotionalStates: ['sadness', 'gratitude', 'anxiety'],
    themes: ['support'],
    difficulty: 'gentle',
    tags: ['support', 'help', 'connection'],
  },
  {
    id: 'sup-002',
    text: "What do you need right now that you're not getting? How might you ask for it?",
    griefStages: ['acute', 'adaptation', 'integration'],
    emotionalStates: ['sadness', 'anger', 'anxiety', 'frustration'],
    themes: ['support', 'boundaries'],
    difficulty: 'moderate',
    tags: ['needs', 'asking', 'support'],
  },

  // BOUNDARIES THEME
  {
    id: 'bnd-001',
    text: "What boundaries do you need to set for yourself right now?",
    griefStages: ['early', 'acute', 'adaptation', 'integration'],
    emotionalStates: ['anger', 'anxiety', 'sadness', 'frustration'],
    themes: ['boundaries', 'self_care'],
    difficulty: 'moderate',
    tags: ['boundaries', 'self-care', 'needs'],
  },
  {
    id: 'bnd-002',
    text: "How do you protect your energy when you need space?",
    griefStages: ['adaptation', 'integration', 'meaning'],
    emotionalStates: ['anxiety', 'anger', 'acceptance'],
    themes: ['boundaries', 'self_care'],
    difficulty: 'gentle',
    tags: ['energy', 'space', 'protection'],
  },

  // GROWTH THEME
  {
    id: 'grw-001',
    text: "What small sign of growth have you noticed in yourself recently?",
    griefStages: ['adaptation', 'integration', 'meaning'],
    emotionalStates: ['hope', 'gratitude', 'acceptance'],
    themes: ['growth'],
    difficulty: 'gentle',
    tags: ['growth', 'progress', 'awareness'],
  },
  {
    id: 'grw-002',
    text: "What does healing mean to you? How do you know when you're healing?",
    griefStages: ['integration', 'meaning'],
    emotionalStates: ['hope', 'acceptance', 'gratitude'],
    themes: ['growth', 'emotions'],
    difficulty: 'deep',
    tags: ['healing', 'meaning', 'awareness'],
  },

  // TRIGGERS THEME
  {
    id: 'trg-001',
    text: "What unexpected moment recently brought up feelings of grief? How did you respond?",
    griefStages: ['early', 'acute', 'adaptation', 'integration'],
    emotionalStates: ['sadness', 'anxiety', 'anger', 'confusion'],
    themes: ['triggers', 'emotions'],
    difficulty: 'moderate',
    tags: ['triggers', 'unexpected', 'response'],
  },
  {
    id: 'trg-002',
    text: "What helps you cope when grief hits you unexpectedly?",
    griefStages: ['acute', 'adaptation', 'integration'],
    emotionalStates: ['sadness', 'anxiety', 'anger'],
    themes: ['triggers', 'self_care'],
    difficulty: 'gentle',
    tags: ['coping', 'unexpected', 'strategies'],
  },

  // BODY THEME
  {
    id: 'bdy-001',
    text: "How has grief affected your sleep? What might help you rest better tonight?",
    griefStages: ['early', 'acute', 'adaptation'],
    emotionalStates: ['sadness', 'anxiety', 'numbness'],
    themes: ['body', 'self_care'],
    difficulty: 'gentle',
    tags: ['sleep', 'rest', 'body'],
  },
  {
    id: 'bdy-002',
    text: "What is your relationship with food since your loss? How are you nourishing yourself?",
    griefStages: ['early', 'acute', 'adaptation'],
    emotionalStates: ['sadness', 'anxiety', 'numbness'],
    themes: ['body', 'self_care'],
    difficulty: 'moderate',
    tags: ['food', 'nourishment', 'body'],
  },

  // HOPE & GRATITUDE (POSITIVE EMOTIONS)
  {
    id: 'hop-001',
    text: "What is one thing you're grateful for today, no matter how small?",
    griefStages: ['early', 'acute', 'adaptation', 'integration', 'meaning'],
    emotionalStates: ['gratitude', 'hope', 'acceptance'],
    themes: ['emotions', 'growth'],
    difficulty: 'gentle',
    tags: ['gratitude', 'small things', 'hope'],
  },
  {
    id: 'hop-002',
    text: "When was the last time you smiled? What brought that moment?",
    griefStages: ['acute', 'adaptation', 'integration', 'meaning'],
    emotionalStates: ['hope', 'gratitude', 'acceptance'],
    themes: ['emotions', 'memories'],
    difficulty: 'gentle',
    tags: ['smile', 'joy', 'moments'],
  },
  {
    id: 'hop-003',
    text: "What gives you hope right now?",
    griefStages: ['adaptation', 'integration', 'meaning'],
    emotionalStates: ['hope', 'gratitude', 'acceptance'],
    themes: ['future', 'emotions'],
    difficulty: 'gentle',
    tags: ['hope', 'future', 'possibilities'],
  },
];

// Function to get random prompts for variety
export function getRandomPrompts(count: number, exclude: string[] = []): ReflectionPrompt[] {
  const available = PROMPTS_LIBRARY.filter(p => !exclude.includes(p.id));
  const shuffled = [...available].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// Function to get prompts by theme
export function getPromptsByTheme(theme: string): ReflectionPrompt[] {
  return PROMPTS_LIBRARY.filter(p => p.themes.includes(theme as any));
}

// Function to get prompts by grief stage
export function getPromptsByGriefStage(stage: string): ReflectionPrompt[] {
  return PROMPTS_LIBRARY.filter(p => p.griefStages.includes(stage as any));
}

// Function to get prompts by emotional state
export function getPromptsByEmotionalState(state: string): ReflectionPrompt[] {
  return PROMPTS_LIBRARY.filter(p => p.emotionalStates.includes(state as any));
}

// Export alias for easier importing
export const PROMPTS = PROMPTS_LIBRARY;