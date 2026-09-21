// Weekly plan content — English.
// Structure, links and tasks live in js/plan-data.js; this file only holds display text.
// Any field missing here falls back to js/content/vi.js.
I18N.content("en", {
  0: {
    title: "Preparation & baseline test",
    note: "No new material this week. Goals: find your real score in each skill, set up your tools, and fix your study times.",
  },
  1: {
    title: "Present simple & present continuous",
    gNote: "The present simple is for habits, facts and fixed schedules (I work in a bank). The present continuous is for things happening around now or temporary situations (I'm working from home this week). Stative verbs such as know, like and want are rarely used in the -ing form.",
    journal: "Write 150–200 words: a normal working day in your life (present simple), and what is different this week (present continuous).",
  },
  2: {
    title: "Past simple & past continuous",
    gNote: "The past continuous sets the scene (I was walking home...); the past simple is the main event that interrupts it (...when it started to rain). Used to + verb describes past habits that are no longer true.",
    journal: "Describe a memorable trip or day (150–200 words). Include at least 3 sentences like: I was ...ing when ...",
  },
  3: {
    title: "Talking about the future",
    gNote: "be going to: an existing plan, or a prediction based on present evidence. Present continuous: an arrangement (with a time or a person). will: a decision made while speaking, a promise, or an opinion-based prediction. In Writing, add certainty: will probably, is likely to.",
    journal: "Your plans for the next 12 months (150–200 words): what you are going to do (going to), what you have arranged for next week (present continuous), and what you think will happen (will / is likely to).",
  },
  4: {
    title: "Comparatives & superlatives",
    gNote: "Short adjectives take -er/-est; long adjectives take more/most. To show how big the difference is, add much, far, slightly or a little: far more expensive, slightly higher. These structures appear constantly in Writing Task 1.",
    journal: "Compare your hometown with a city you have visited (150–200 words): size, cost, people, transport. Use much/far/slightly + a comparative at least twice.",
  },
  5: {
    title: "Articles & countable / uncountable nouns",
    gNote: "a/an: first mention, the listener doesn't know which one. the: both people know which one, or there is only one. No article: talking in general with plural or uncountable nouns (Sugar is bad for you. Children need sleep). This is the most common error for Vietnamese learners, and it pulls down your Writing grammar score.",
    journal: "What did you eat yesterday, and is your diet healthy (150–200 words)? When you finish, circle EVERY noun and check the article before it.",
  },
  6: {
    title: "Modal verbs: obligation, advice, possibility",
    gNote: "must: the speaker feels it is necessary. have to: a rule from outside. don't have to: not necessary (DIFFERENT from mustn't: forbidden). should: advice. might/may/could: possibility. In Writing, modals let you soften opinions instead of making absolute claims.",
    journal: "Give advice to someone starting English from zero (150–200 words): what they must, should, don't have to and mustn't do.",
  },
  7: {
    title: "Prepositions of time & place",
    gNote: "at: a point (at 7 pm, at the station). on: a day or a surface (on Monday, on the wall). in: a larger period or inside something (in May, in 2026, in the city). Learn prepositions after adjectives as chunks: interested in, good at, worried about.",
    journal: "Describe your home and your journey to work or school (150–200 words): where things are, what time you leave and arrive, what you pass on the way. Underline every preposition.",
  },
  8: {
    title: "Questions & relative clauses · End of phase 1",
    gNote: "English questions need an auxiliary before the subject (Do you..., Have you..., Where did you...). Relative clauses attach information to a noun without starting a new sentence: The teacher who helped me most was..., The city where I grew up is...",
    journal: "Write about a person who has influenced you (150–200 words), using at least 4 relative clauses (who, which, that, where).",
    override: {
      4: [
        { b: "am", m: 10, h: "Review flashcards", s: ["Review every card that is due."] },
        { b: "eve", m: 50, h: "Review the 8 grammar topics of phase 1", s: ["Reopen the British Council pages from weeks 1 → 8 and redo the exercises (without the answers).", "Any topic with more than 30% wrong → add it to your error log and rewatch that week's video on Sunday."], l: ["bcPresSimple", "bcPastCont", "bcFuture", "bcComparative", "bcArticles", "bcModalOblig", "bcPrepTime", "bcQuestions"] },
        { b: "eve", m: 40, h: "Self-check before phase 2", s: ["Speak about yourself for 3 minutes, record it, and compare with your Week 0 recording.", "Count your learned flashcards (target: 400+ words/phrases).", "Ready for phase 2 when: you follow the main ideas of 6 Minute English without the transcript, and get 12/20 or more in Listening Parts 1–2."] },
      ],
    },
  },
  9: {
    title: "Present perfect",
    gNote: "The present perfect links the past to the present: experience (I've been to Japan), a recent action with a result now (I've lost my keys), something continuing until now (I've lived here for 5 years). With a finished time (yesterday, in 2020), use the past simple.",
  },
  10: {
    title: "Past perfect & present perfect continuous",
    gNote: "Past perfect: something that happened BEFORE another past point (When I arrived, the film had started). Present perfect continuous stresses a process lasting until now (I've been studying for two hours). Both make the order of events clear in Speaking Part 2 stories.",
  },
  11: {
    title: "Zero, first & second conditionals",
    gNote: "Zero: always true (If you heat ice, it melts). First: a real possibility (If it rains, I'll stay home). Second: an unreal present situation (If I had more time, I would travel). In Writing Task 2, conditionals express the consequences of a proposal.",
  },
  12: {
    title: "Reported speech",
    gNote: "Reported speech usually shifts the tense back (She said she was tired), but if it is still true you don't have to. Learn reporting verbs instead of said: claim, argue, suggest, admit, insist. They are a key way to present other people's views in Writing Task 2.",
  },
  13: {
    title: "Defining & non-defining relative clauses",
    gNote: "A defining clause (no commas) tells you WHICH one. A non-defining clause (with commas) only adds information and cannot use that: My brother, who lives in Hanoi, is a doctor. Using them correctly keeps long Writing sentences clear — that is Grammatical Range.",
    extra: {
      6: [{ tag: "optional", m: 0, opt: true, h: "Book one Writing/Speaking session with a teacher", s: ["Halfway through is the right time for a human to mark your work once, to check whether the AI scores are off. Bring 2 Task 2 essays and 1 Part 2 recording."] }],
    },
  },
  14: {
    title: "The passive",
    gNote: "Use the passive when the action or result matters more than who did it, or when we don't know who: The bridge was built in 1990. The passive is the key to Writing Task 1 process diagrams: Leaves are picked, then they are dried...",
  },
  15: {
    title: "-ing or to + infinitive",
    gNote: "Some verbs take -ing (enjoy, avoid, consider), others take to + infinitive (want, decide, plan). Remember/forget/stop/try change meaning: stop smoking (quit) is different from stop to smoke (pause in order to smoke). Learn them as chunks, not as abstract rules.",
  },
  16: {
    title: "Speculating about the past",
    gNote: "must have + past participle: almost certainly happened. might/could have: possibly happened. can't have: certainly didn't happen. should have: it would have been better (regret). Very natural in Speaking Part 3 about history: People must have worked extremely hard...",
  },
  17: {
    title: "Linking words for contrast · Writing focus week",
    gNote: "although + clause (Although it was expensive, ...); despite/in spite of + noun or -ing (Despite the cost, ...); however starts a new sentence, followed by a comma. Use whereas to compare two things in Task 1. Using linking words correctly is part of Coherence & Cohesion.",
  },
  18: {
    title: "Phrasal verbs · Speaking focus week",
    gNote: "Phrasal verbs make speech sound natural: find out, set up, carry on, come up with. With separable ones, a pronoun must go in the middle: turn it off (not turn off it). Use them a lot in Speaking; in formal Writing choose a single-word equivalent (investigate instead of find out).",
    extra: {
      5: [{ b: "pm", m: 30, h: "Speaking mock with a real person", s: ["Ask a friend, colleague or tutor to run all 3 parts (about 14 minutes) using the official sample tasks.", "Record it so you can listen back and log your errors."], l: ["speakSample", "bdS"] }],
    },
  },
  19: {
    title: "Phase 2 review · work on weak points",
    grammar: "Review of tenses (narrative tenses)",
    gNote: "No new topic this week. Take out your error log, pick the 3 errors you repeat most, and spend every grammar session on them.",
  },
  20: {
    title: "Mid-plan mock test",
    grammar: "Nothing new — review from your error log",
    gNote: "This week's goal: measure your progress with a full mock test and compare it with Weeks 0 and 8. If Listening/Reading are already at 6.0–6.5, you are on track.",
    satNote: "FULL MOCK TEST, type your Writing on a computer",
    extra: {
      5: [{ b: "eve", m: 20, h: "Compare with Weeks 0 and 8", s: ["Put your Listening/Reading scores from Week 0, Week 8 and today in one table.", "Whichever skill improved least gets more time in phase 3 (for example, swap Monday's vocabulary session for extra practice in that skill)."] }],
    },
  },
  21: {
    title: "Third & mixed conditionals",
    gNote: "The third conditional imagines a different past (If I had studied harder, I would have passed). Mixed conditionals link the past and the present (If I had chosen medicine, I would be a doctor now). A natural fit for Speaking Part 2 topics like 'an important decision'.",
  },
  22: {
    title: "Emphasis: cleft sentences & inverted conditionals",
    gNote: "Cleft sentences put the key point first: What worries me most is..., It is the government that should... Inverted conditionals are more formal than if: Should you need help, ... / Had I known, ... Once or twice per essay is enough — don't overdo it.",
  },
  23: {
    title: "Inversion after negative adverbials",
    gNote: "When a sentence starts with Not only, Rarely, Seldom, Never before or Only when..., the auxiliary comes before the subject: Not only does AI save time, but it also... It sounds formal, so it suits Writing. Use it sparingly in Speaking.",
  },
  24: {
    title: "Wishes & unreal time",
    gNote: "wish + past simple: wanting the present to be different (I wish I lived closer to work). wish + past perfect: regret about the past. wish + would: complaining about someone else's behaviour. It's time we + past simple: we should do it now.",
  },
  25: {
    title: "Formal & informal register",
    gNote: "Writing needs a formal register: children rather than kids, a large number of rather than a lot of, no contractions (do not rather than don't). Speaking is the opposite: sound natural and use phrasal verbs. Getting the register wrong is a common Lexical Resource problem at band 6.",
  },
  26: {
    title: "Connotation & synonyms",
    gNote: "Synonyms are not always interchangeable: slim (a compliment) is not skinny (a criticism); determined is not stubborn. Whenever you look up a new word in Oxford, read the examples to learn its connotation before using it. Avoid repetition with substitutes and pronouns — not with unfamiliar words you are unsure of.",
    extra: {
      0: [{ tag: "todo", m: 0, h: "Book your exam date", s: ["Book the test for around week 33 (after the last week of the plan), on computer.", "A fixed exam date gives you a clear deadline for the remaining 7 weeks."], l: ["famInfo"] }],
    },
  },
  27: {
    title: "Intonation & linking · Pronunciation focus week",
    grammar: "No new grammar — grammar time goes to pronunciation",
    gNote: "Pronunciation is a quarter of your Speaking score. Band 7 needs clear speech with natural sentence stress and intonation — not a native accent. Common issues for Vietnamese speakers: dropping final sounds, a flat word-by-word rhythm, and not stressing key words.",
  },
  28: {
    title: "Phrasal verbs (advanced)",
    gNote: "This week, learn phrasal verbs on the topic of family: take after, bring up, look after, get on with, grow apart. Watch the object position with separable verbs.",
  },
  29: {
    title: "Participle clauses · concise sentences for Writing",
    gNote: "Participle clauses shorten sentences: Having finished the report, she went home. / Built in 1990, the bridge... They keep Writing concise while varying your structures. Both parts must share the same subject, or the meaning goes wrong.",
  },
  30: {
    title: "Hedging & balanced arguments",
    gNote: "Band 7 shows balanced, non-absolute arguments: It could be argued that..., This is likely to..., To some extent..., While it is true that... In Speaking Part 3, use them to open an answer before giving reasons and examples.",
  },
  31: {
    title: "Final review · fixing last errors",
    grammar: "Review from your error log: the 3 most repeated errors",
    gNote: "Nothing new. Open your error log, count errors by type, and spend every grammar session on the 3 most frequent types. The goal is to stop repeating old errors, not to learn new structures.",
    satNote: "the last Cambridge test",
  },
  32: {
    title: "Dress rehearsal & exam preparation",
    grammar: "—",
    gNote: "A light week: one dress rehearsal on the official computer interface, then gradually ease off. Sleep matters more than extra study now.",
  },
});
