// What students actually say, in Roman Hinglish, Devanagari, Tamil, Bengali and English.
// Entries are matched by prefix ("samjha" matches "samjhaiye"), "=" means exact token,
// "~" marks a known mishearing. See text.js#compileKeyword.
import { compileList } from './text.js';

const raw = {
  yes: ['=yes', '=yeah', '=yep', '=yup', 'correct', '=right', '=ok', '=okay', '=sure', 'haan', '=han', '=haa', '=ha', 'haanji', '=ji', 'sahi', 'theek', 'thik', 'bilkul',
    'हां', '=हा', '=जी', 'सही', 'ठीक', 'बिल्कुल', 'ஆமா', 'ஆம', 'சரி', 'ஓகே', 'হ্যা', 'হাঁ', 'ঠিক', 'আচ্ছা', '=হুম'],
  no: ['=no', '=nope', '=nah', 'wrong', 'nahi', 'nahin', '=nai', '=na', 'galat',
    'नहीं', '=नही', '=ना', '=न', 'गलत', 'இல்லை', 'இல்ல', 'வேண்டாம்', 'தப்பு', '=না', 'ভুল', '=নাহ'],
  next: ['next', 'aage', 'agla', 'agle', 'aagla', 'आगे', 'अगला', 'अगले', 'அடுத்து', 'அடுத்த', 'পরের', 'পরেরটা', 'এগোও', 'সামনে'],
  back: ['=back', 'go back', 'previous', '=prev', 'pichla', 'pichhla', 'peeche', 'piche', 'wapas', 'vapas', 'पिछला', 'पीछे', 'वापस',
    'முந்தைய', 'பின்னால்', 'பின்னாடி', '=திரும்பு', 'আগের', 'পিছনে', 'পেছনে', 'ফিরে'],
  repeat: ['repeat', '=again', 'say again', 'once more', 'phir se', 'fir se', 'firse', 'phirse', 'dobara', 'dubara', 'फिर से', 'दोबारा', 'दोहरा', 'एक बार और',
    'மறுபடியும்', 'மீண்டும்', 'திரும்ப', 'আবার', 'আরেকবার'],
  slower: ['slower', 'slow', 'dheere', 'dhire', 'dheeme', 'aaram se', 'धीरे', 'आराम से', 'மெதுவா', 'மெல்ல', 'আস্তে', 'ধীরে'],
  faster: ['faster', '=fast', 'speed up', 'quick', 'tez', 'jaldi', 'तेज', 'जल्दी', 'வேகமா', 'சீக்கிரம்', 'দ্রুত', 'তাড়াতাড়ি', 'জলদি'],
  stop: ['stop', 'pause', 'quiet', 'shut up', 'ruko', 'ruk jao', 'chup', '=bas', 'रुको', 'रुक', 'चुप', '=बस', 'நிறுத்து', 'நிறுத்த', 'போதும்', 'থামো', 'থাম', 'চুপ'],
  cancel: ['cancel', 'exit', 'quit', 'leave it', 'band karo', 'बंद करो', 'रद्द', 'ரத்து', 'வெளியேறு', 'বাতিল', 'বেরোও'],
  explain: ['explain', 'samjha', 'samjao', 'samajh', 'batao', 'bataiye', 'bata do', 'समझ', 'बताओ', 'बताइए', 'बता दो',
    'விளக்கு', 'விளக்க', 'விளக்கி', 'புரிய வை', 'புரியல', 'புரியவில்லை', 'বোঝাও', 'বুঝিয়ে', 'বোঝা', 'বুঝিনি', 'ব্যাখ্যা'],
  explainDifferent: ['another example', 'different example', 'other example', 'new example', 'explain differently', 'aur example', 'doosra example', 'dusra example', 'naya example',
    'दूसरा उदाहरण', 'और उदाहरण', 'नया उदाहरण', 'வேறு உதாரணம்', 'இன்னொரு உதாரணம்', 'অন্য উদাহরণ', 'আরেকটা উদাহরণ'],
  read: ['=read', 'read aloud', 'read it', 'read this', 'read the', 'padh', 'padho', 'sunao', 'पढ़', 'पढो', 'सुनाओ', 'படி', 'படிச்சு', 'வாசி', 'পড়ো', 'পড়ে', 'শোনাও'],
  test: ['test', 'quiz', 'check me', 'feynman', 'exam me', 'टेस्ट', 'परीक्षा', 'சோதி', 'சோதனை', 'டெஸ்ட்', 'পরীক্ষা', 'টেস্ট', 'যাচাই'],
  notes: ['notes', '=note', 'nots', 'revision', 'नोट्स', 'नोट', 'நோட்ஸ்', 'நோட்', 'குறிப்பு', 'নোট', 'নোটস'],
  library: ['chapters', 'chapter list', 'library', '=home', '=menu', 'all chapter', 'saare chapter', 'sab chapter', 'सारे अध्याय', 'सब अध्याय', 'सारे chapter', 'सब chapter',
    'அனைத்து chapter', 'எல்லா chapter', 'பாடங்கள்', 'সব chapter', 'সব অধ্যায়', 'অধ্যায়গুলো'],
  help: ['help', 'what can i say', 'commands', 'madad', 'मदद', 'सहायता', 'உதவி', 'সাহায্য', 'হেল্প'],
  progress: ['progress', 'streak', 'my score', 'how am i doing', 'प्रगति', 'முன்னேற்றம்', 'অগ্রগতি'],
  tryAgain: ['try again', 'retry', 'one more try', '=try', 'dobara try', 'phir try', 'कोशिश', 'முயற்சி', 'try பண்ற', 'চেষ্টা'],
  grade: ['grade', 'score it', 'check it', 'continue', 'जाँचो', 'जांचो', 'जाँच', 'மதிப்பிடு', 'চালিয়ে যাও'],
  skip: ['skip', 'chhodo', 'chodo', 'छोड़ो', 'छोडो', 'விடு', 'বাদ দাও'],
  sample: ['sample', 'demo answer', 'example answer', 'सैंपल', 'சாம்பிள்', 'স্যাম্পল'],
  addText: ['paste', 'add text', 'add my text', 'my own text', 'own chapter', 'अपना text', 'சொந்த text', 'নিজের text'],
  open: ['open', 'start', 'go to', 'kholo', 'khol', 'shuru', 'chalo', 'खोलो', 'खोल', 'शुरू', 'திற', 'தொடங்கு', 'খোলো', 'খোল', 'শুরু'],
  question: ['what', 'whats', '=why', '=how', 'define', 'meaning', '=mean', 'means', 'kya', 'kyu', 'kyon', 'kaise', 'matlab', 'kise', 'kisko', 'kaun',
    'क्या', 'क्यों', 'कैसे', 'मतलब', 'किसे', 'अर्थ', 'कौन', 'என்ன', 'ஏன்', 'எப்படி', 'அர்த்தம்', 'என்றால்', 'யார்', '=কী', '=কি', 'কেন', 'কীভাবে', 'কিভাবে', 'মানে', 'কাকে', 'অর্থ'],
  section: ['section', 'part', 'सेक्शन', 'भाग', 'हिस्सा', 'செக்ஷன்', 'பகுதி', 'সেকশন', 'অংশ'],
};

/** Numbers students use when they jump to a section. */
const NUMBER_WORDS = {
  1: ['=1', '=one', '=first', '=ek', 'pehla', 'pahla', 'pehle', '=एक', 'पहला', 'पहले', 'ஒன்று', 'முதல்', '=এক', 'প্রথম'],
  2: ['=2', '=two', '=second', '=do', 'doosra', 'dusra', '=दो', 'दूसरा', 'இரண்டு', 'ரெண்டு', '=দুই', 'দ্বিতীয়'],
  3: ['=3', '=three', '=third', '=teen', 'teesra', 'tisra', '=तीन', 'तीसरा', 'மூன்று', 'மூணு', '=তিন', 'তৃতীয়'],
  4: ['=4', '=four', '=fourth', '=char', 'chautha', '=चार', 'चौथा', 'நான்கு', 'நாலு', '=চার', 'চতুর্থ'],
  5: ['=5', '=five', '=fifth', '=paanch', '=पांच', 'पाँचवा', 'ஐந்து', '=পাঁচ', 'পঞ্চম'],
};

/** Language names in every script, for "explain in Tamil" or picking a language at onboarding. */
const LANGUAGE_WORDS = {
  hinglish: ['hinglish', 'हिंग्लिश', 'ஹிங்கிலிஷ்', 'হিংলিশ'],
  hi: ['hindi', 'hindee', 'हिंदी', 'हिन्दी', 'ஹிந்தி', 'இந்தி', 'হিন্দি'],
  ta: ['tamil', 'thamizh', 'tamizh', 'तमिल', 'தமிழ்', 'তামিল'],
  bn: ['bengali', 'bangla', 'bangali', 'bengoli', 'बंगाली', 'बांग्ला', 'বাংলা', 'বেঙ্গলি', 'பெங்காலி', 'வங்காள'],
  en: ['english', 'inglish', 'angrezi', 'इंग्लिश', 'अंग्रेज', 'ஆங்கில', 'இங்கிலீஷ்', 'ইংরেজি', 'ইংলিশ'],
};

/** Words that flip a statement, so "energy cannot be created" is not flagged as a misconception. */
export const NEGATIONS = new Set(['not', 'never', 'no', 'cannot', 'cant', 'dont', 'doesnt', 'isnt', 'wont', 'neither', 'nor',
  'na', 'nahi', 'nahin', 'nai', 'mat', 'न', 'नहीं', 'नही', 'ना', 'मत', 'இல்லை', 'முடியாது', 'கூடாது', 'மாட்டாது',
  'না', 'নয', 'নেই', 'নি']);
export const NEGATION_SUFFIXES = ['ாது', 'வில்லை', 'இல்லை', 'য়নি', 'য়না'];

export const LEX = Object.fromEntries(Object.entries(raw).map(([k, v]) => [k, compileList(v)]));
export const NUMBERS = Object.entries(NUMBER_WORDS).map(([n, words]) => ({ n: Number(n), compiled: compileList(words) }));
export const LANGUAGES = Object.entries(LANGUAGE_WORDS).map(([code, words]) => ({ code, compiled: compileList(words) }));
