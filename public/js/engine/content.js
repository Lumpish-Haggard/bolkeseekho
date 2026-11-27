// Chapter packs. Each section carries: the English textbook passage, a simple explanation
// with an everyday Indian example in five languages, a Feynman rubric (concepts with
// multilingual keyword groups, hints, and an exam-ready English note), misconceptions,
// and sample answers so anyone can try the Feynman Check without speaking Hindi.
//
// Rubric keyword groups: a concept is fully covered when every group has a match.
// Keywords use the lexicon syntax in text.js ("=" exact, "~" mishearing, default prefix).

export const LANG_CODES = ['hinglish', 'hi', 'ta', 'bn', 'en'];

// ---------- shared keyword groups ----------
const ENERGY = ['energy', 'enerji', 'urja', 'shakti', 'ऊर्जा', 'एनर्जी', 'शक्ति', 'ஆற்றல்', 'எனர்ஜி', 'சக்தி', 'শক্তি', 'এনার্জি'];
const CONSERVE = ['conserv', 'create', 'destroy', 'constant', '=same', 'convert', 'transform', 'change', '=form', 'forms', 'badal', 'nasht', 'khatam', 'banti', 'banai', 'paida',
  'संरक्षण', 'नष्ट', 'खत्म', 'बदल', 'रूप', 'स्थिर', 'बनाई', 'बनती', 'पैदा', 'உருவாக்க', 'அழிக்க', 'அழிய', 'மாறு', 'மாற்ற', 'வடிவ', 'நிலையான',
  'তৈরি', 'ধ্বংস', 'রূপ', 'বদল', 'পরিবর্তন', 'সংরক্ষ', 'নষ্ট', 'স্থির'];
const SYSTEM = ['system', 'sistem', 'सिस्टम', 'निकाय', 'तंत्र', 'சிஸ்டம்', 'அமைப்பு', 'தொகுதி', 'সিস্টেম', 'তন্ত্র'];
const SURROUND = ['surrounding', 'environment', 'outside', 'bahar', 'baaki', '=baki', 'परिवेश', 'बाहर', 'बाकी', 'आसपास', 'वातावरण', 'சுற்றுப்புற', 'சுற்றி', 'வெளியே', 'மீதி',
  'পরিবেশ', 'চারপাশ', 'বাইরে', 'বাকি'];
const CLOSED_ISOLATED = ['closed', 'isolated', 'isolate', 'band system', 'बंद', 'विलगित', 'पृथक', 'आइसोलेटेड', 'क्लोज्ड', 'மூடிய', 'தனித்த', 'ஐசோலேட்டட்', 'க்ளோஸ்டு',
  'বদ্ধ', 'বন্ধ', 'বিচ্ছিন্ন', 'আইসোলেটেড', 'ক্লোজড'];
const MATTER = ['matter', 'mass', 'padarth', 'exchange', 'len den', 'leen den', 'पदार्थ', 'द्रव्य', 'लेन', 'பொருள்', 'பரிமா', 'পদার্থ', 'বস্তু', 'আদান', 'বিনিময়'];
const HEAT = ['heat', 'garmi', 'ushma', 'ऊष्मा', 'उष्मा', 'गर्मी', 'हीट', 'வெப்ப', 'ஹீட்', 'சூடு', 'তাপ', 'হিট', 'গরম'];
const WORK = ['work', 'kaam', 'kaarya', 'karya', 'कार्य', 'काम', 'वर्क', 'வேலை', 'ஒர்க்', 'কাজ', 'ওয়ার্ক'];
const INTERNAL = ['internal', 'aantrik', 'antrik', 'andar ki energy', 'andar ki urja', 'आंतरिक', 'आन्तरिक', 'अंदरूनी', 'इंटरनल', 'உள் ஆற்றல்', 'அக ஆற்றல்', 'இன்டர்னல்',
  'অভ্যন্তর', 'ভেতরের শক্তি', 'ইন্টারনাল', 'delta u', 'δu'];
const MINUS = ['minus', 'subtract', 'ghata', '=kam', 'घटा', '=कम', 'माइनस', 'கழி', 'மைனஸ்', 'বিয়োগ', '=বাদ', 'মাইনাস', '=q w'];
const COOKER_EXAMPLE = ['piston', 'whistle', 'cooker', 'seeti', 'siti', 'सीटी', 'कुकर', 'पिस्टन', 'பிஸ்டன்', 'விசில்', 'குக்கர்', 'পিস্টন', 'হুইসেল', 'কুকার', 'engine', 'balloon',
  '=100', '=40', '=60', 'joule'];
const ADIABATIC = ['adiabatic', 'एडियाबेटिक', 'रुद्धोष्म', 'अदियाबेटिक', 'அடியபாட்டிக்', 'அடியாபடிக்', 'அடியாபாடிக்', 'এডিয়াবেটিক', 'রুদ্ধতাপ', 'অ্যাডিয়াবেটিক'];
const ISOTHERMAL = ['isothermal', 'आइसोथर्मल', 'समतापी', 'समतापीय', 'ஐசோதெர்மல்', 'சமவெப்ப', 'আইসোথার্মাল', 'সমোষ্ণ'];
const TEMPERATURE_CONSTANT = ['temperature', '=temp', 'taapmaan', 'tapmaan', 'constant', 'तापमान', 'तापक्रम', 'टेम्परेचर', 'स्थिर', 'வெப்பநிலை', 'டெம்பரேச்சர்', 'மாறாது',
  'তাপমাত্রা', 'টেম্পারেচার', 'স্থির'];
const PUMP_EXAMPLE = ['pump', 'tyre', 'tire', 'cycle', 'bicycle', 'puncture', 'valve', 'spray', 'soda', 'compress', 'पंप', 'टायर', 'साइकिल', 'पंक्चर', 'பம்ப்', 'டயர்', 'சைக்கிள்',
  'பஞ்சர்', 'পাম্প', 'টায়ার', 'সাইকেল', 'পাংচার'];

const FUNCTION = ['function', 'method', 'recursion', 'recursive', 'फंक्शन', 'ஃபங்ஷன்', 'பங்ஷன்', 'ফাংশন'];
const ITSELF = ['itself', 'khud', 'apne aap', '=self', 'खुद', 'अपने आप', 'स्वयं', 'தன்னை', 'தானே', 'নিজেকে', 'নিজেই'];
const BASE = ['base', 'बेस', 'आधार', 'பேஸ்', 'அடிப்படை', 'বেস', 'ভিত্তি'];
const STOPS = ['stop', '=end', 'ends', 'ruk', 'khatam', 'smallest', 'simplest', 'terminat', 'रुक', 'रोक', 'खत्म', 'நிற்க', 'நின்று', 'நிறுத்த', 'முடி', 'থাম', 'শেষ'];
const SMALLER = ['smaller', '=small', 'chhota', 'chhoti', 'chota', 'choti', '=n 1', 'n minus 1', 'reduce', 'छोटा', 'छोटी', 'छोटे', 'சிறிய', 'சின்ன', 'குறைந்த', 'ছোট'];
const STACK = ['stack', 'pile', 'plate', 'dher', 'स्टैक', 'ढेर', 'ஸ்டாக்', 'அடுக்கு', 'স্ট্যাক', 'স্তূপ'];
const WAITS = ['wait', 'pause', 'store', 'pending', 'unfinished', 'incomplete', 'ruk', 'intezaar', 'intezar', 'adhura', 'adhoori', 'इंतजार', 'रुक', 'अधूर', 'காத்திரு', 'முடிக்கப்படாத',
  'অপেক্ষা', 'জমা', 'অসমাপ্ত'];
const LIFO = ['lifo', 'last in', '=top', 'upar', 'ऊपर', 'उपर', 'மேல', 'ওপর', 'উপর', 'reverse', 'ulta', 'उल्टा', 'return', 'वापस', 'திரும்ப', 'ফেরত', 'ফিরে'];
const OVERFLOW = ['overflow', 'crash', 'infinite', 'anant', 'memory', 'ओवरफ्लो', 'अनंत', 'मेमोरी', 'ஓவர்ஃப்ளோ', 'மெமரி', 'நினைவக', 'ওভারফ্লো', 'মেমরি'];
const SELF_SIMILAR = ['tree', 'folder', 'nested', 'divide', 'sort', 'smaller copies', 'same problem', 'फ़ोल्डर', 'फोल्डर', 'ट्री', 'ஃபோல்டர்', 'போல்டர்', 'ட்ரீ', 'ফোল্ডার', 'ট্রি'];
const COST = ['memory', 'slow', '=time', 'baar baar', 'bar bar', 'again and again', 'exponential', 'cost', 'keemat', 'overhead', 'बार बार', 'कीमत', 'मेमोरी', 'திரும்பத் திரும்ப',
  'மறுபடி', 'விலை', 'மெமரி', 'বারবার', 'দাম', 'মেমরি'];
const MEMO = ['memo', 'cache', 'store', '=save', 'saved', 'remember', 'likh', 'notebook', 'लिख', 'स्टोर', 'सेव', 'याद', 'எழுதி', 'சேமி', 'ஸ்டோர்', 'সেভ', 'লিখে', 'জমা', 'মনে রাখ', 'খাতা'];
const REUSE = ['reuse', '=again', 'next time', 'agli baar', 'dobara', 'phir se', 'अगली बार', 'दोबारा', 'फिर से', 'அடுத்த முறை', 'மீண்டும்', 'பயன்படுத்த', 'পরের বার', 'আবার', 'কাজে লাগা'];

const PRICE = ['price', 'cost', '=rate', 'daam', 'keemat', 'kimat', 'दाम', 'कीमत', 'मूल्य', 'रेट', 'விலை', 'ப்ரைஸ்', 'দাম', 'মূল্য', 'প্রাইস'];
const DEMAND = ['demand', '=buy', 'buyers', 'khareed', 'kharid', 'maang', 'डिमांड', 'मांग', 'खरीद', 'டிமாண்ட்', 'தேவை', 'வாங்க', 'வாங்கு', 'চাহিদা', 'কেনা', 'কিন', 'ডিমান্ড'];
const DOWN = ['less', 'fall', 'falls', '=down', 'decrease', 'drop', 'reduce', '=kam', 'ghat', 'inverse', 'opposite', 'ulta', '=कम', 'घट', 'उल्टा', 'विपरीत', 'குறை', 'எதிர்', '=কম', 'কমে', 'উল্টো', 'বিপরীত'];
const CURVE = ['curve', 'graph', '=line', 'वक्र', 'कर्व', 'ग्राफ', 'வளைவு', 'கர்வ்', 'கிராஃப்', 'গ্রাফ', 'রেখা', 'কার্ভ'];
const SLOPE_DOWN = ['downward', '=down', 'slope', 'neeche', 'niche', 'jhuk', 'नीचे', 'ढलान', 'झुक', 'கீழ', 'சாய', 'নিচ', 'নীচ', 'ঢাল', 'নামে'];
const DEMAND_SHIFT = ['shift', 'income', 'salary', 'taste', 'fashion', 'ceteris', 'other things', 'baaki sab', 'khisak', 'tankhwah', 'खिसक', 'शिफ्ट', '=आय', 'आमदनी', 'तनख्वाह',
  'ஷிஃப்ட்', 'நகர', 'சம்பளம்', 'வருமான', 'மற்றவை', 'সরে', 'শিফট', '=আয়', 'মাইনে', 'বেতন', 'বাকি সব'];
const SUPPLY = ['supply', 'sell', 'bech', 'offer', 'आपूर्ति', 'पूर्ति', 'सप्लाई', 'बेच', 'சப்ளை', 'வழங்கல்', 'விற்க', 'விற்ப', 'জোগান', 'যোগান', 'সাপ্লাই', 'বিক্রি', 'বেচ'];
const MORE = ['more', 'increase', 'rise', 'rises', '=up', 'zyada', 'jyada', 'badh', 'ज्यादा', 'अधिक', 'बढ', 'அதிக', 'கூடு', 'ஏறு', 'ஏற', 'বেশি', 'বাড়'];
const SLOPE_UP = ['upward', '=up', 'upar', 'slope', 'ऊपर', 'उपर', 'மேல்', 'ওপর', 'উপর', 'ওঠে'];
const SUPPLY_SHIFT = ['shift', 'cost', 'technology', 'weather', 'monsoon', 'rain', 'baarish', 'barish', 'fertili', 'khaad', 'crop', 'fasal', 'बारिश', 'मौसम', 'लागत', 'खाद', 'फसल',
  'मानसून', 'மழை', 'வானிலை', 'செலவு', 'உரம்', 'பயிர்', 'பருவமழை', 'বৃষ্টি', 'আবহাওয়া', 'খরচ', '=সার', 'ফসল', 'বর্ষা'];
const EQUILIBRIUM = ['equilibrium', 'balance', 'इक्विलिब्रियम', 'संतुलन', 'साम्य', 'ஈக்விலிப்ரியம்', 'சமநிலை', 'ভারসাম্য', 'ইকুইলিব্রিয়াম'];
const EQUAL_MEET = ['equal', '=same', 'match', 'meet', 'cross', 'intersect', 'barabar', 'milte', 'milta', 'बराबर', 'समान', 'मिल', 'சமம', 'சமமா', 'சந்தி', 'সমান', 'মিল', 'কাটে', 'মেলে'];
const SHORTAGE = ['shortage', 'kami', 'not enough', 'scarcity', 'कमी', 'किल्लत', 'शॉर्टेज', 'பற்றாக்குறை', 'ஷார்ட்டேஜ்', 'ঘাটতি', 'অভাব', 'শর্টেজ'];
const SURPLUS = ['surplus', 'excess', '=extra', 'glut', 'आधिक्य', 'अधिशेष', 'सरप्लस', 'உபரி', 'சர்ப்ளஸ்', 'அதிகப்படி', 'উদ্বৃত্ত', 'অতিরিক্ত', 'সারপ্লাস'];

// ---------- chapters ----------
export const CHAPTERS = [
  {
    id: 'thermo',
    title: 'Thermodynamics: The First Law',
    subject: 'Physics · Class 11 / first-year engineering',
    aliases: ['thermodynamics', 'thermo', 'first law', 'थर्मोडायनामिक्स', 'ऊष्मागतिकी', 'தெர்மோடைனமிக்ஸ்', 'வெப்ப இயக்கவியல்', 'থার্মোডাইনামিক্স', 'তাপগতিবিদ্যা'],
    glossary: [
      {
        term: 'system',
        generic: true,
        aliases: ['system', 'सिस्टम', 'निकाय', 'சிஸ்டம்', 'அமைப்பு', 'সিস্টেম', 'তন্ত্র'],
        def: {
          en: 'The part of the universe we choose to study; everything outside it is the surroundings.',
          hinglish: 'Universe ka woh hissa jise hum study karte hain; uske bahar sab kuch surroundings hai.',
          hi: 'ब्रह्मांड का वह हिस्सा जिसका हम अध्ययन करते हैं; उसके बाहर सब कुछ परिवेश (surroundings) है।',
          ta: 'நாம் படிக்கத் தேர்ந்தெடுக்கும் பிரபஞ்சத்தின் பகுதி; அதற்கு வெளியே உள்ள அனைத்தும் surroundings.',
          bn: 'মহাবিশ্বের যে অংশটা আমরা পড়ি; তার বাইরের সবকিছু হলো surroundings।',
        },
      },
      {
        term: 'closed system',
        aliases: ['closed system', '~close system', 'क्लोज्ड सिस्टम', 'बंद निकाय', 'बंद सिस्टम', 'band system', 'க்ளோஸ்டு சிஸ்டம்', 'மூடிய அமைப்பு', 'ক্লোজড সিস্টেম', 'বদ্ধ তন্ত্র', 'বন্ধ সিস্টেম'],
        def: {
          en: 'A system that can exchange energy with its surroundings, but not matter, like a sealed pressure cooker.',
          hinglish: 'Aisa system jo energy le-de sakta hai, par matter nahi, jaise band pressure cooker.',
          hi: 'ऐसा निकाय जो परिवेश से ऊर्जा का लेन-देन कर सकता है, पर पदार्थ का नहीं, जैसे बंद प्रेशर कुकर।',
          ta: 'Energy-ஐ பரிமாறிக்கொள்ளலாம், ஆனால் matter-ஐ அல்ல; மூடிய pressure cooker மாதிரி.',
          bn: 'যে system শক্তি আদান-প্রদান করতে পারে, কিন্তু পদার্থ নয়, যেমন বন্ধ প্রেশার কুকার।',
        },
      },
      {
        term: 'isolated system',
        aliases: ['isolated system', 'isolated', '~isolate system', 'आइसोलेटेड', 'विलगित निकाय', 'पृथक निकाय', 'ஐசோலேட்டட்', 'தனித்த அமைப்பு', 'আইসোলেটেড', 'বিচ্ছিন্ন তন্ত্র'],
        def: {
          en: 'A system that exchanges neither energy nor matter, so its total energy stays constant, like an ideal thermos flask.',
          hinglish: 'Aisa system jo na energy le-de, na matter; isliye uski total energy constant rehti hai, jaise ideal thermos flask.',
          hi: 'ऐसा निकाय जो न ऊर्जा का लेन-देन करता है, न पदार्थ का; इसलिए उसकी कुल ऊर्जा स्थिर रहती है, जैसे आदर्श थर्मस फ़्लास्क।',
          ta: 'Energy-ஐயும் matter-ஐயும் பரிமாறாத system; அதனால் அதன் மொத்த energy மாறாது, ideal thermos flask மாதிரி.',
          bn: 'যে system শক্তি বা পদার্থ কোনোটাই আদান-প্রদান করে না, তাই তার মোট শক্তি স্থির থাকে, যেমন আদর্শ থার্মোস ফ্লাস্ক।',
        },
      },
      {
        term: 'internal energy',
        aliases: ['internal energy', 'आंतरिक ऊर्जा', 'आन्तरिक ऊर्जा', 'aantrik urja', 'antrik urja', 'इंटरनल एनर्जी', 'உள் ஆற்றல்', 'அக ஆற்றல்', 'இன்டர்னல் எனர்ஜி', 'অভ্যন্তরীণ শক্তি', 'ইন্টারনাল এনার্জি'],
        def: {
          en: 'The total energy stored in the motion and arrangement of a system’s particles, written U.',
          hinglish: 'System ke particles ki motion aur arrangement mein stored total energy, jise U likhte hain.',
          hi: 'निकाय के कणों की गति और व्यवस्था में संचित कुल ऊर्जा, जिसे U लिखते हैं।',
          ta: 'ஒரு system-இன் துகள்களின் இயக்கத்திலும் அமைப்பிலும் சேமிக்கப்பட்ட மொத்த energy; இதை U என்று எழுதுவோம்.',
          bn: 'System-এর কণাগুলোর গতি আর বিন্যাসে জমে থাকা মোট শক্তি, যাকে U লেখা হয়।',
        },
      },
      {
        term: 'heat',
        generic: true,
        aliases: ['heat', 'ऊष्मा', 'उष्मा', 'ushma', 'हीट', 'வெப்பம்', 'ஹீட்', 'তাপ', 'হিট'],
        def: {
          en: 'Energy that flows because of a temperature difference, written Q; it is positive when it enters the system.',
          hinglish: 'Temperature ke difference ki wajah se behne wali energy, Q; system mein aaye to positive.',
          hi: 'तापमान के अंतर के कारण बहने वाली ऊर्जा, Q; निकाय में आए तो धनात्मक।',
          ta: 'Temperature வேறுபாட்டால் பாயும் energy, Q; system-க்குள் வந்தால் positive.',
          bn: 'তাপমাত্রার পার্থক্যের জন্য প্রবাহিত শক্তি, Q; system-এ ঢুকলে positive।',
        },
      },
      {
        term: 'work',
        generic: true,
        aliases: ['work done', '=work', 'कार्य', 'वर्क', 'ஒர்க்', 'ওয়ার্ক'],
        def: {
          en: 'Energy transferred when a force moves something, like gas pushing a piston, written W; positive when done by the system.',
          hinglish: 'Jab force kisi cheez ko hilaye tab transfer hui energy, jaise gas piston ko dhakka de; W, system kare to positive.',
          hi: 'जब बल किसी चीज़ को खिसकाए तब स्थानांतरित ऊर्जा, जैसे गैस पिस्टन को धकेले; W, निकाय करे तो धनात्मक।',
          ta: 'ஒரு force ஒன்றை நகர்த்தும்போது மாற்றப்படும் energy, gas piston-ஐத் தள்ளுவது போல; W, system செய்தால் positive.',
          bn: 'বল কিছুকে সরালে যে শক্তি স্থানান্তরিত হয়, যেমন গ্যাস পিস্টন ঠেলে; W, system করলে positive।',
        },
      },
      {
        term: 'adiabatic',
        aliases: ['adiabatic', '~adia batic', '~a diabetic', '~idiabatic', 'एडियाबेटिक', 'रुद्धोष्म', 'अदियाबेटिक', 'அடியபாட்டிக்', 'அடியாபடிக்', 'এডিয়াবেটিক', 'রুদ্ধতাপ'],
        def: {
          en: 'A process with no heat exchange (Q = 0), so ΔU = −W.',
          hinglish: 'Aisa process jismein heat ka koi len-den nahi hota (Q = 0), isliye ΔU = −W.',
          hi: 'ऐसा प्रक्रम जिसमें ऊष्मा का कोई लेन-देन नहीं होता (Q = 0), इसलिए ΔU = −W।',
          ta: 'Heat பரிமாற்றமே இல்லாத process (Q = 0), அதனால் ΔU = −W.',
          bn: 'যে প্রক্রিয়ায় কোনো তাপ আদান-প্রদান হয় না (Q = 0), তাই ΔU = −W।',
        },
      },
      {
        term: 'isothermal',
        aliases: ['isothermal', '~iso thermal', '~isothermic', 'आइसोथर्मल', 'समतापी', 'ஐசோதெர்மல்', 'சமவெப்ப', 'আইসোথার্মাল', 'সমোষ্ণ'],
        def: {
          en: 'A process at constant temperature; for an ideal gas ΔU = 0, so Q = W.',
          hinglish: 'Constant temperature wala process; ideal gas ke liye ΔU = 0, isliye Q = W.',
          hi: 'स्थिर तापमान पर होने वाला प्रक्रम; आदर्श गैस के लिए ΔU = 0, इसलिए Q = W।',
          ta: 'Temperature மாறாத process; ideal gas-க்கு ΔU = 0, அதனால் Q = W.',
          bn: 'স্থির তাপমাত্রার প্রক্রিয়া; ideal gas-এর জন্য ΔU = 0, তাই Q = W।',
        },
      },
      {
        term: 'entropy',
        aliases: ['entropy', '~entrophy', '~entropi', '~and tropy', '~en tropy', '~untropy', 'एन्ट्रॉपी', 'एंट्रॉपी', 'एंट्रोपी', 'एन्ट्रोपी', 'என்ட்ரோபி', 'என்ட்ராபி', 'এনট্রপি', 'এন্ট্রপি'],
        def: {
          en: 'A measure of how spread out, or disordered, energy is. In an isolated system it never decreases. It belongs to the Second Law.',
          hinglish: 'Energy kitni bikhri hui ya disorder mein hai, uska naap. Isolated system mein yeh kabhi kam nahi hoti. Yeh Second Law ka hissa hai.',
          hi: 'ऊर्जा कितनी बिखरी या अव्यवस्थित है, उसका माप। विलगित निकाय में यह कभी घटती नहीं। यह दूसरे नियम का हिस्सा है।',
          ta: 'Energy எவ்வளவு பரவி, ஒழுங்கற்று இருக்கிறது என்பதன் அளவு. Isolated system-இல் இது ஒருபோதும் குறையாது. இது Second Law-இன் பகுதி.',
          bn: 'শক্তি কতটা ছড়িয়ে বা বিশৃঙ্খল আছে তার মাপ। Isolated system-এ এটা কখনো কমে না। এটা Second Law-এর অংশ।',
        },
      },
    ],
    sections: [
      {
        id: 'thermo-1',
        title: 'Systems and the conservation of energy',
        askTerm: 'closed system',
        text: 'In thermodynamics, the part of the universe we choose to study is called the system, and everything outside it is the surroundings. A closed system can exchange energy with its surroundings but not matter; an isolated system exchanges neither. The First Law of Thermodynamics is the law of conservation of energy: energy can neither be created nor destroyed, only converted from one form to another. So the total energy of an isolated system always stays constant, even while heat, motion and chemical energy change into one another.',
        explain: {
          en: 'Think of a pressure cooker on a gas stove. The cooker and the food inside are your system; the kitchen around it is the surroundings. With the lid locked, no food or steam can escape, so it behaves like a closed system: heat comes in, but matter stays inside. The First Law simply says energy is never made from nothing and never disappears. The flame’s chemical energy becomes heat, and the heat becomes hotter food and steam. Energy only changes its form.',
          hinglish: 'Gas stove par rakha pressure cooker socho. Cooker aur uske andar ka khana tumhara system hai, aur baaki kitchen surroundings. Lid band hai to khana ya steam bahar nahi ja sakta, isliye yeh closed system jaisa hai: heat andar aati hai, par matter andar hi rehta hai. First Law bas itna kehta hai: energy na kabhi banti hai, na khatam hoti hai. Gas ki chemical energy heat banti hai, aur heat garam khana aur steam ban jaati hai. Energy sirf apna form badalti hai.',
          hi: 'गैस चूल्हे पर रखा प्रेशर कुकर सोचिए। कुकर और उसके अंदर का खाना आपका सिस्टम (system) है, और बाकी रसोई परिवेश (surroundings) है। ढक्कन बंद है तो खाना या भाप बाहर नहीं जा सकती, इसलिए यह बंद निकाय (closed system) जैसा है: ऊष्मा अंदर आती है, पर पदार्थ अंदर ही रहता है। पहला नियम बस इतना कहता है: ऊर्जा न कभी शून्य से बनती है, न कभी ग़ायब होती है। गैस की रासायनिक ऊर्जा ऊष्मा बनती है, और ऊष्मा गरम खाना और भाप बन जाती है। ऊर्जा सिर्फ़ अपना रूप बदलती है।',
          ta: 'Gas அடுப்பில் இருக்கும் pressure cooker-ஐ நினைத்துப் பாருங்கள். Cooker-உம் அதற்குள் இருக்கும் சாப்பாடும்தான் உங்கள் system; சுற்றியுள்ள சமையலறை surroundings. மூடி பூட்டியிருக்கும்போது சாப்பாடோ ஆவியோ வெளியே போக முடியாது, அதனால் இது closed system மாதிரி: heat உள்ளே வரும், ஆனால் matter உள்ளேயே இருக்கும். First Law சொல்வது இவ்வளவுதான்: energy-ஐ உருவாக்கவும் முடியாது, அழிக்கவும் முடியாது. Gas-இன் chemical energy heat ஆகிறது, அந்த heat சூடான சாப்பாடாகவும் ஆவியாகவும் மாறுகிறது. Energy தன் வடிவத்தை மட்டுமே மாற்றுகிறது.',
          bn: 'গ্যাসের উনুনে বসানো একটা প্রেশার কুকারের কথা ভাবো। কুকার আর তার ভেতরের খাবার হলো তোমার system, আর চারপাশের রান্নাঘর হলো surroundings। ঢাকনা বন্ধ থাকলে খাবার বা বাষ্প বাইরে যেতে পারে না, তাই এটা closed system-এর মতো: তাপ ভেতরে আসে, কিন্তু পদার্থ ভেতরেই থাকে। First Law শুধু এটুকুই বলে: শক্তি তৈরিও করা যায় না, ধ্বংসও করা যায় না। গ্যাসের রাসায়নিক শক্তি তাপ হয়, আর সেই তাপ গরম খাবার আর বাষ্পে পরিণত হয়। শক্তি শুধু তার রূপ বদলায়।',
        },
        concepts: [
          {
            label: 'Energy is conserved',
            groups: [ENERGY, CONSERVE],
            note: 'First Law: energy can neither be created nor destroyed; it only changes form (conservation of energy).',
            hint: {
              en: 'Can energy ever be made from nothing, or vanish? Say what happens to it.',
              hinglish: 'Energy kabhi banti ya khatam hoti hai kya? Batao uske saath kya hota hai.',
              hi: 'क्या ऊर्जा कभी बनती या ख़त्म होती है? बताइए उसके साथ क्या होता है।',
              ta: 'Energy-ஐ உருவாக்கவோ அழிக்கவோ முடியுமா? அதற்கு என்ன ஆகிறது என்று சொல்லுங்கள்.',
              bn: 'শক্তি কি কখনো তৈরি হয় বা শেষ হয়ে যায়? বলো তার কী হয়।',
            },
          },
          {
            label: 'System vs surroundings',
            groups: [SYSTEM, SURROUND],
            note: 'System = the part of the universe under study; surroundings = everything outside it.',
            hint: {
              en: 'Say what the system is in the pressure cooker example, and what the surroundings are.',
              hinglish: 'Pressure cooker example mein system kya hai aur surroundings kya, yeh bhi bolo.',
              hi: 'प्रेशर कुकर वाले उदाहरण में सिस्टम क्या है और परिवेश क्या, यह भी बताइए।',
              ta: 'Pressure cooker உதாரணத்தில் system எது, surroundings எது என்று சொல்லுங்கள்.',
              bn: 'প্রেশার কুকারের উদাহরণে system কোনটা আর surroundings কোনটা, সেটাও বলো।',
            },
          },
          {
            label: 'Closed vs isolated system',
            groups: [CLOSED_ISOLATED, MATTER],
            note: 'Closed system: exchanges energy but not matter. Isolated system: exchanges neither, so its total energy stays constant.',
            hint: {
              en: 'What can a closed system exchange, and what can an isolated system exchange?',
              hinglish: 'Closed system kya le-de sakta hai, aur isolated system kya?',
              hi: 'बंद निकाय किसका लेन-देन कर सकता है, और विलगित निकाय किसका?',
              ta: 'Closed system எதைப் பரிமாறலாம், isolated system எதைப் பரிமாறலாம்?',
              bn: 'Closed system কী আদান-প্রদান করতে পারে, আর isolated system কী?',
            },
          },
        ],
        misconceptions: [
          {
            phrases: ['energy can be created', 'energy is created', 'energy gets created', 'energy can be destroyed', 'energy is destroyed', 'energy gets used up',
              'energy create hoti', 'energy create ho sakti', 'energy ban sakti', 'energy banai ja sakti', 'energy paida hoti', 'energy khatam ho jaati',
              'ऊर्जा बनाई जा सकती', 'ऊर्जा बन सकती', 'ऊर्जा पैदा होती', 'ऊर्जा नष्ट हो जाती', 'energy ஐ உருவாக்க முடியும்', 'energy உருவாக்கலாம்', 'ஆற்றலை உருவாக்க முடியும்',
              'শক্তি তৈরি করা যায়', 'শক্তি তৈরি হয়', 'energy তৈরি করা যায়'],
            fix: {
              en: 'Energy is never created or destroyed; it only changes form.',
              hinglish: 'Energy kabhi banti ya khatam nahi hoti; sirf form badalti hai.',
              hi: 'ऊर्जा न कभी बनती है, न नष्ट होती है; बस रूप बदलती है।',
              ta: 'Energy-ஐ உருவாக்கவோ அழிக்கவோ முடியாது; அது வடிவம் மட்டுமே மாறும்.',
              bn: 'শক্তি কখনো তৈরি বা ধ্বংস হয় না; শুধু রূপ বদলায়।',
            },
          },
        ],
        examTip: 'Exam tip: state the First Law as conservation of energy, and define closed and isolated systems with one example each.',
        samples: {
          hinglish: 'Dekho, thermodynamics mein jis cheez ko hum study karte hain use system bolte hain, jaise pressure cooker, aur baaki sab surroundings hai. First law kehta hai ki energy na create hoti hai na destroy hoti hai, bas ek form se doosre form mein convert hoti hai, jaise gas ki chemical energy heat ban jaati hai. Closed system mein energy aa ja sakti hai par matter bahar nahi jaata, aur isolated system mein na energy na matter exchange hota hai.',
          hi: 'थर्मोडायनामिक्स में जिस हिस्से का हम अध्ययन करते हैं उसे सिस्टम कहते हैं, जैसे प्रेशर कुकर, और बाकी सब परिवेश है। पहला नियम कहता है कि ऊर्जा न बनाई जा सकती है न नष्ट की जा सकती है, वह बस एक रूप से दूसरे रूप में बदलती है। बंद निकाय में ऊर्जा आ-जा सकती है पर पदार्थ बाहर नहीं जाता, और विलगित निकाय में कुछ भी लेन-देन नहीं होता।',
          ta: 'Thermodynamics-ல நாம படிக்கிற பகுதிக்கு system-னு பேரு, உதாரணமா pressure cooker, மீதி எல்லாம் surroundings. First law என்ன சொல்லுதுன்னா energy-ஐ உருவாக்கவும் முடியாது அழிக்கவும் முடியாது, ஒரு வடிவத்துல இருந்து இன்னொரு வடிவத்துக்கு மாறும். Closed system-ல energy உள்ள வரலாம் ஆனா matter வெளிய போகாது; isolated system-ல எதுவுமே exchange ஆகாது.',
          bn: 'Thermodynamics-এ আমরা যে অংশটা পড়ি তাকে system বলে, যেমন প্রেশার কুকার, আর বাকি সব surroundings। First law বলে শক্তি তৈরিও করা যায় না, ধ্বংসও করা যায় না, শুধু এক রূপ থেকে আরেক রূপে বদলায়। Closed system-এ শক্তি ঢুকতে পারে কিন্তু পদার্থ বাইরে যায় না, আর isolated system-এ কিছুই আদান-প্রদান হয় না।',
          en: 'In thermodynamics the thing we study is called the system, like a pressure cooker, and everything around it is the surroundings. The first law says energy can never be made or destroyed, it just changes from one form into another, like the gas flame turning chemical energy into heat. A closed system lets energy in and out but keeps its matter, while an isolated system exchanges nothing at all.',
        },
      },
      {
        id: 'thermo-2',
        title: 'Internal energy, heat and work: ΔU = Q − W',
        askTerm: 'internal energy',
        text: 'Every system stores energy in the motion and arrangement of its particles; this is its internal energy, U. Internal energy changes in only two ways: by heat (Q) flowing in or out, and by work (W) done by or on the system. The First Law is written as ΔU = Q − W, where Q is positive when heat is added to the system and W is positive when the system does work on its surroundings, such as gas pushing a piston. If you add 100 J of heat and the gas does 40 J of work, its internal energy rises by 60 J.',
        explain: {
          en: 'Picture the pressure cooker again. The flame gives heat Q to the cooker. Part of that heat makes the water and steam hotter: that is the rise in internal energy, ΔU. Part of it is used up when the steam pushes and lifts the whistle: that is work W done by the system. So ΔU = Q − W. What you put in as heat, minus what goes out as work, is what stays inside. Example: 100 J of heat in and 40 J of work out leaves 60 J inside.',
          hinglish: 'Phir se pressure cooker socho. Flame cooker ko heat Q deti hai. Us heat ka kuch hissa paani aur steam ko aur garam karta hai: yahi internal energy ka badhna hai, ΔU. Kuch hissa tab lagta hai jab steam dhakka maar ke seeti uthati hai: yeh system ka kiya hua work W hai. Isliye ΔU = Q − W. Jitni heat andar daali, usme se jitna work bahar gaya, baaki andar reh gaya. Example: 100 J heat andar, 40 J work bahar, to 60 J andar internal energy mein jud gaya.',
          hi: 'फिर से प्रेशर कुकर सोचिए। लौ कुकर को ऊष्मा Q देती है। उस ऊष्मा का कुछ हिस्सा पानी और भाप को और गरम करता है: यही आंतरिक ऊर्जा (internal energy) का बढ़ना है, ΔU। कुछ हिस्सा तब ख़र्च होता है जब भाप धक्का देकर सीटी को ऊपर उठाती है: यह निकाय द्वारा किया गया कार्य (work) W है। इसलिए ΔU = Q − W। जितनी ऊष्मा अंदर दी, उसमें से जितना कार्य बाहर गया, बाकी अंदर रह गया। उदाहरण: 100 J ऊष्मा अंदर, 40 J कार्य बाहर, तो 60 J आंतरिक ऊर्जा में जुड़ गया।',
          ta: 'மறுபடியும் pressure cooker-ஐ நினைத்துப் பாருங்கள். தீ cooker-க்கு heat Q கொடுக்கிறது. அந்த heat-இன் ஒரு பகுதி தண்ணீரையும் ஆவியையும் இன்னும் சூடாக்குகிறது: அதுதான் internal energy அதிகரிப்பு, ΔU. இன்னொரு பகுதி, ஆவி தள்ளி whistle-ஐ மேலே தூக்கும்போது செலவாகிறது: அது system செய்யும் work W. அதனால் ΔU = Q − W. உள்ளே கொடுத்த heat-இலிருந்து வெளியே போன work-ஐக் கழித்தால், மீதி உள்ளேயே இருக்கும். உதாரணம்: 100 J heat உள்ளே, 40 J work வெளியே, அதனால் 60 J internal energy-ஆக சேர்கிறது.',
          bn: 'আবার প্রেশার কুকারের কথা ভাবো। আগুন কুকারকে তাপ Q দেয়। সেই তাপের কিছুটা জল আর বাষ্পকে আরও গরম করে: এটাই অভ্যন্তরীণ শক্তি (internal energy) বাড়া, ΔU। আর কিছুটা খরচ হয় যখন বাষ্প ঠেলে হুইসেলটা তুলে দেয়: এটা system-এর করা কাজ (work) W। তাই ΔU = Q − W। ভেতরে যত তাপ দিলে, তার থেকে যত কাজ বাইরে গেল, বাকিটা ভেতরে থেকে গেল। উদাহরণ: 100 J তাপ ভেতরে, 40 J কাজ বাইরে, তাই 60 J অভ্যন্তরীণ শক্তিতে যোগ হলো।',
        },
        concepts: [
          {
            label: 'Internal energy (U)',
            groups: [INTERNAL],
            note: 'Internal energy (U) is the energy stored in the motion and arrangement of a system’s particles.',
            hint: {
              en: 'Mention internal energy: where is energy stored inside the system?',
              hinglish: 'Internal energy ka zikr karo: system ke andar energy kahan store hoti hai?',
              hi: 'आंतरिक ऊर्जा का ज़िक्र कीजिए: निकाय के अंदर ऊर्जा कहाँ जमा होती है?',
              ta: 'Internal energy பற்றிச் சொல்லுங்கள்: system-க்குள் energy எங்கே சேமிக்கப்படுகிறது?',
              bn: 'অভ্যন্তরীণ শক্তির কথা বলো: system-এর ভেতরে শক্তি কোথায় জমা থাকে?',
            },
          },
          {
            label: 'ΔU = Q − W',
            groups: [HEAT, WORK, MINUS],
            note: 'First Law: ΔU = Q − W (Q > 0 when heat is added; W > 0 when the system does work).',
            hint: {
              en: 'Connect the three: heat in, work out, and what is left as ΔU.',
              hinglish: 'Teeno ko jodo: heat andar, work bahar, aur jo bacha woh ΔU.',
              hi: 'तीनों को जोड़िए: ऊष्मा अंदर, कार्य बाहर, और जो बचा वह ΔU।',
              ta: 'மூன்றையும் இணையுங்கள்: heat உள்ளே, work வெளியே, மீதி ΔU.',
              bn: 'তিনটেকে জোড়ো: তাপ ভেতরে, কাজ বাইরে, আর যা বাকি থাকল সেটা ΔU।',
            },
          },
          {
            label: 'A real-life example',
            groups: [COOKER_EXAMPLE],
            note: 'Example: 100 J of heat in and 40 J of work done by the gas gives ΔU = +60 J.',
            hint: {
              en: 'Give a real example: the cooker whistle, or a gas pushing a piston.',
              hinglish: 'Ek real example do: cooker ki seeti, ya piston ko dhakka deti gas.',
              hi: 'एक असली उदाहरण दीजिए: कुकर की सीटी, या पिस्टन को धकेलती गैस।',
              ta: 'ஒரு நிஜ உதாரணம் சொல்லுங்கள்: cooker whistle, அல்லது piston-ஐத் தள்ளும் gas.',
              bn: 'একটা বাস্তব উদাহরণ দাও: কুকারের হুইসেল, বা পিস্টন ঠেলা গ্যাস।',
            },
          },
        ],
        misconceptions: [
          {
            phrases: ['q plus w', 'heat plus work', 'q plus work', 'heat plus w', 'q प्लस w', 'q பிளஸ் w', 'q প্লাস w'],
            penalty: 1,
            fix: {
              en: 'Check the sign. Here W is work done BY the system, so ΔU = Q − W. Some chemistry books write ΔU = q + w, with w done ON the system.',
              hinglish: 'Sign check karo. Yahan W system ka kiya hua work hai, isliye ΔU = Q − W. Chemistry mein kabhi ΔU = q + w likhte hain, jab w system PAR kiya gaya ho.',
              hi: 'चिह्न जाँचिए। यहाँ W निकाय द्वारा किया गया कार्य है, इसलिए ΔU = Q − W। रसायन में कभी-कभी ΔU = q + w लिखते हैं, जब w निकाय पर किया गया हो।',
              ta: 'Sign-ஐக் கவனியுங்கள். இங்கே W என்பது system செய்யும் work, அதனால் ΔU = Q − W. சில chemistry புத்தகங்களில் system மீது செய்யப்படும் work-க்கு ΔU = q + w.',
              bn: 'চিহ্নটা দেখো। এখানে W হলো system-এর করা কাজ, তাই ΔU = Q − W। কিছু রসায়ন বইয়ে system-এর ওপর করা কাজের জন্য ΔU = q + w লেখে।',
            },
          },
        ],
        examTip: 'Exam tip: always write the sign convention next to ΔU = Q − W.',
        samples: {
          hinglish: 'Internal energy matlab system ke andar particles ki motion aur arrangement mein stored energy. Jab hum heat Q dete hain aur system work W karta hai, jaise steam cooker ki seeti uthati hai, to internal energy ka change delta U barabar Q minus W hota hai. Jaise 100 joule heat di aur 40 joule work hua to 60 joule internal energy badh gayi.',
          en: 'Internal energy is the energy hidden in how the particles move and are arranged. When we give heat Q and the system does work W, like the steam lifting the cooker whistle, the change delta U equals Q minus W. So if 100 joules of heat go in and 40 joules of work come out, 60 joules stay inside.',
        },
        weakSamples: {
          hinglish: 'Delta U barabar Q plus W hota hai, heat aur work dono milke internal energy badhate hain.',
          en: 'Delta U is Q plus W, because heat and work both add to the internal energy.',
        },
      },
      {
        id: 'thermo-3',
        title: 'Adiabatic and isothermal processes',
        askTerm: 'entropy',
        text: 'Two special cases make the First Law easy to apply. In an adiabatic process no heat enters or leaves (Q = 0), so ΔU = −W: when a gas expands and does work, it cools, and when it is compressed quickly, it warms up, which is why a bicycle pump gets hot. In an isothermal process the temperature stays constant; for an ideal gas, ΔU = 0, so Q = W, and all the heat supplied is turned into work. The First Law tells us energy is conserved, but not which direction a process goes; that is the job of the Second Law and entropy.',
        explain: {
          en: 'Pump air into a cycle tyre quickly and touch the pump: it is warm. Heat had no time to escape, so this is almost adiabatic (Q = 0). The work you did on the air became internal energy, and the air heated up. The opposite: air rushing out of a punctured tyre feels cold, because the expanding gas does work and loses internal energy. In an isothermal process the temperature never changes, so for an ideal gas ΔU = 0 and every joule of heat you give turns into work. Entropy comes next, with the Second Law: it tells which direction things happen on their own.',
          hinglish: 'Cycle ke tyre mein jaldi-jaldi hawa bharo aur pump chhoo ke dekho: garam hai. Heat ko bahar jaane ka time hi nahi mila, isliye yeh almost adiabatic hai (Q = 0). Jo work tumne hawa par kiya, woh internal energy mein gaya aur hawa garam ho gayi. Ulta case: puncture wale tyre se nikalti hawa thandi lagti hai, kyunki phailti hui gas work karti hai aur apni internal energy kho deti hai. Isothermal process mein temperature badalta hi nahi, isliye ideal gas ke liye ΔU = 0, aur jitni heat di, sab work ban jaati hai. Entropy aage Second Law ke saath aayegi: woh batati hai cheezein apne aap kis direction mein hoti hain.',
          hi: 'साइकिल के टायर में जल्दी-जल्दी हवा भरिए और पंप छूकर देखिए: गरम है। ऊष्मा को बाहर जाने का समय ही नहीं मिला, इसलिए यह लगभग रुद्धोष्म (adiabatic) प्रक्रम है (Q = 0)। जो कार्य आपने हवा पर किया, वह आंतरिक ऊर्जा में गया और हवा गरम हो गई। उल्टा उदाहरण: पंक्चर टायर से निकलती हवा ठंडी लगती है, क्योंकि फैलती गैस कार्य करती है और अपनी आंतरिक ऊर्जा खो देती है। समतापी (isothermal) प्रक्रम में तापमान बदलता ही नहीं, इसलिए आदर्श गैस के लिए ΔU = 0, और दी गई सारी ऊष्मा कार्य बन जाती है। एन्ट्रॉपी (entropy) आगे दूसरे नियम के साथ आएगी: वह बताती है कि चीज़ें अपने-आप किस दिशा में होती हैं।',
          ta: 'Cycle tyre-இல் வேகமாக காற்று அடித்துவிட்டு pump-ஐத் தொட்டுப் பாருங்கள்: சூடாக இருக்கும். Heat வெளியே போக நேரமே இல்லை, அதனால் இது கிட்டத்தட்ட adiabatic (Q = 0). நீங்கள் காற்றின் மீது செய்த work, internal energy-ஆக மாறி காற்று சூடாகிறது. எதிர் உதாரணம்: puncture ஆன tyre-இலிருந்து வரும் காற்று குளிர்ச்சியாக இருக்கும், ஏனெனில் விரியும் gas work செய்து தன் internal energy-ஐ இழக்கிறது. Isothermal process-இல் temperature மாறாது, அதனால் ideal gas-க்கு ΔU = 0, கொடுத்த heat முழுவதும் work-ஆக மாறுகிறது. Entropy அடுத்து Second Law-உடன் வரும்: விஷயங்கள் தானாக எந்த திசையில் நடக்கும் என்று அது சொல்லும்.',
          bn: 'সাইকেলের টায়ারে তাড়াতাড়ি হাওয়া ভরে পাম্পটা ছুঁয়ে দেখো: গরম। তাপ বাইরে যাওয়ার সময়ই পায়নি, তাই এটা প্রায় adiabatic (Q = 0)। তুমি হাওয়ার ওপর যে কাজ করলে, সেটা অভ্যন্তরীণ শক্তি হয়ে গেল আর হাওয়া গরম হলো। উল্টো উদাহরণ: পাংচার টায়ার থেকে বেরোনো হাওয়া ঠান্ডা লাগে, কারণ ছড়িয়ে পড়া গ্যাস কাজ করে আর নিজের অভ্যন্তরীণ শক্তি হারায়। Isothermal প্রক্রিয়ায় তাপমাত্রা বদলায় না, তাই ideal gas-এর জন্য ΔU = 0, আর যত তাপ দেওয়া হয় সবটাই কাজে পরিণত হয়। Entropy আসবে পরে, Second Law-এর সঙ্গে: জিনিস নিজে থেকে কোন দিকে ঘটে, সেটা ও-ই বলে দেয়।',
        },
        concepts: [
          {
            label: 'Adiabatic: Q = 0',
            groups: [ADIABATIC, HEAT],
            note: 'Adiabatic process: no heat exchange (Q = 0), so ΔU = −W; expansion cools a gas and compression warms it.',
            hint: {
              en: 'Say what adiabatic means for heat: how much heat goes in or out?',
              hinglish: 'Adiabatic ka heat ke liye kya matlab hai: kitni heat andar-bahar jaati hai?',
              hi: 'रुद्धोष्म (adiabatic) का ऊष्मा के लिए क्या मतलब है: कितनी ऊष्मा अंदर-बाहर जाती है?',
              ta: 'Adiabatic என்றால் heat-க்கு என்ன அர்த்தம்: எவ்வளவு heat உள்ளே-வெளியே போகிறது?',
              bn: 'Adiabatic মানে তাপের ক্ষেত্রে কী: কতটা তাপ ঢোকে বা বেরোয়?',
            },
          },
          {
            label: 'Isothermal: temperature constant',
            groups: [ISOTHERMAL, TEMPERATURE_CONSTANT],
            note: 'Isothermal process (ideal gas): temperature is constant, so ΔU = 0 and Q = W.',
            hint: {
              en: 'Explain isothermal: what stays constant, and what does that mean for ΔU?',
              hinglish: 'Isothermal samjhao: kya constant rehta hai, aur uska ΔU par kya asar?',
              hi: 'समतापी समझाइए: क्या स्थिर रहता है, और उसका ΔU पर क्या असर?',
              ta: 'Isothermal-ஐ விளக்குங்கள்: எது மாறாமல் இருக்கும், அதனால் ΔU-க்கு என்ன?',
              bn: 'Isothermal বোঝাও: কী স্থির থাকে, আর তাতে ΔU-এর কী হয়?',
            },
          },
          {
            label: 'Pump or tyre example',
            groups: [PUMP_EXAMPLE],
            note: 'Example: a bicycle pump warms on fast compression; air escaping a punctured tyre feels cold.',
            hint: {
              en: 'Use the bicycle pump or the punctured tyre as your example.',
              hinglish: 'Cycle pump ya puncture tyre ka example use karo.',
              hi: 'साइकिल पंप या पंक्चर टायर का उदाहरण दीजिए।',
              ta: 'Cycle pump அல்லது puncture tyre உதாரணத்தைப் பயன்படுத்துங்கள்.',
              bn: 'সাইকেলের পাম্প বা পাংচার টায়ারের উদাহরণ দাও।',
            },
          },
        ],
        misconceptions: [
          {
            phrases: ['adiabatic means constant temperature', 'adiabatic means temperature constant', 'adiabatic mein temperature constant', 'adiabatic matlab temperature constant',
              'adiabatic process mein temperature constant', 'adiabatic में तापमान स्थिर', 'adiabatic இல் temperature மாறாது', 'adiabatic এ তাপমাত্রা স্থির'],
            allowNegation: true,
            fix: {
              en: 'Constant temperature is isothermal. Adiabatic means no heat exchange, and the temperature can change.',
              hinglish: 'Constant temperature isothermal hota hai. Adiabatic matlab heat ka len-den nahi, temperature badal sakta hai.',
              hi: 'स्थिर तापमान समतापी होता है। रुद्धोष्म का मतलब ऊष्मा का लेन-देन नहीं, तापमान बदल सकता है।',
              ta: 'Temperature மாறாதது isothermal. Adiabatic என்றால் heat பரிமாற்றம் இல்லை, temperature மாறலாம்.',
              bn: 'স্থির তাপমাত্রা হলো isothermal। Adiabatic মানে তাপের আদান-প্রদান নেই, তাপমাত্রা বদলাতে পারে।',
            },
          },
        ],
        examTip: 'Exam tip: the First Law says energy is conserved but cannot predict direction; that needs the Second Law (entropy).',
        samples: {
          hinglish: 'Adiabetic process mein heat ka exchange zero hota hai, Q equal to zero, isliye jab gas expand hoti hai to woh thandi ho jaati hai, jaise puncture tyre ki hawa. Isothermal mein temperature constant rehta hai to ideal gas ke liye delta U zero aur Q barabar W. Cycle pump ko jaldi chalao to woh garam ho jaata hai.',
          en: 'In an adiabetic process there is no heat exchange, Q is zero, so when a gas expands it cools down, like air escaping a punctured tyre. In an isothermal process the temperature stays constant, so for an ideal gas delta U is zero and Q equals W. A cycle pump gets hot when you squeeze the air quickly.',
        },
      },
    ],
  },
  {
    id: 'recursion',
    title: 'Recursion in Programming',
    subject: 'Computer Science · Programming in C / Python',
    aliases: ['recursion', 'recursive', 'रिकर्शन', 'रिकर्सन', 'ரிகர்ஷன்', 'ரெகர்ஷன்', 'রিকার্শন', 'রিকারশন'],
    glossary: [
      {
        term: 'recursion',
        aliases: ['recursion', 'recursive', '~recurssion', '~recursian', '~re cursion', '~rikarshan', 'रिकर्शन', 'रिकर्सन', 'पुनरावर्तन', 'ரிகர்ஷன்', 'ரெகர்ஷன்', 'রিকার্শন', 'রিকারশন'],
        def: {
          en: 'A technique where a function solves a problem by calling itself on a smaller version of it.',
          hinglish: 'Aisi technique jismein function khud ko chhote version ke saath call karke problem solve karta hai.',
          hi: 'ऐसी तकनीक जिसमें फ़ंक्शन समस्या के छोटे रूप पर ख़ुद को कॉल करके उसे हल करता है।',
          ta: 'ஒரு function, பிரச்சனையின் சிறிய வடிவத்தில் தன்னையே call செய்து தீர்க்கும் முறை.',
          bn: 'যে কৌশলে একটা function সমস্যার ছোট সংস্করণে নিজেকেই call করে সমাধান করে।',
        },
      },
      {
        term: 'base case',
        aliases: ['base case', 'base condition', '~bass case', '~base kes', '~bays case', '~vase case', 'बेस केस', 'बेस कंडीशन', 'आधार स्थिति', 'பேஸ் கேஸ்', 'அடிப்படை நிலை', 'বেস কেস', 'ভিত্তি অবস্থা'],
        def: {
          en: 'The simplest input, answered directly without another recursive call; it is what stops the recursion.',
          hinglish: 'Sabse simple input, jiska answer bina dobara call kiye seedha milta hai; yahi recursion ko rokta hai.',
          hi: 'सबसे सरल इनपुट, जिसका जवाब बिना दोबारा कॉल किए सीधे मिलता है; यही recursion को रोकता है।',
          ta: 'மீண்டும் call செய்யாமல் நேரடியாக பதில் தரப்படும் எளிய input; இதுதான் recursion-ஐ நிறுத்துகிறது.',
          bn: 'সবচেয়ে সহজ input, যার উত্তর আবার call না করেই সরাসরি পাওয়া যায়; এটাই recursion থামায়।',
        },
      },
      {
        term: 'recursive case',
        aliases: ['recursive case', 'recursive step', 'रिकर्सिव केस', 'पुनरावर्ती स्थिति', 'ரிகர்சிவ் கேஸ்', 'রিকার্সিভ কেস'],
        def: {
          en: 'The part of the function that breaks the problem into a smaller one and calls the function again.',
          hinglish: 'Function ka woh hissa jo problem ko chhota karke function ko phir se call karta hai.',
          hi: 'फ़ंक्शन का वह हिस्सा जो समस्या को छोटा करके फ़ंक्शन को फिर से कॉल करता है।',
          ta: 'பிரச்சனையைச் சிறியதாக்கி function-ஐ மீண்டும் call செய்யும் பகுதி.',
          bn: 'Function-এর যে অংশ সমস্যাকে ছোট করে function-কে আবার call করে।',
        },
      },
      {
        term: 'call stack',
        aliases: ['call stack', '=stack', '~coal stack', '~call stuck', 'कॉल स्टैक', 'स्टैक', 'கால் ஸ்டாக்', 'ஸ்டாக்', 'কল স্ট্যাক', 'স্ট্যাক'],
        def: {
          en: 'The pile of unfinished function calls; the newest is on top and finishes first (last in, first out).',
          hinglish: 'Adhoori function calls ka dher; sabse nayi upar hoti hai aur sabse pehle khatam hoti hai (LIFO).',
          hi: 'अधूरी फ़ंक्शन कॉल्स का ढेर; सबसे नई ऊपर होती है और सबसे पहले पूरी होती है (LIFO)।',
          ta: 'முடிக்கப்படாத function call-களின் அடுக்கு; புதியது மேலே இருக்கும், அதுவே முதலில் முடியும் (LIFO).',
          bn: 'অসমাপ্ত function call-গুলোর স্তূপ; সবচেয়ে নতুনটা ওপরে থাকে আর সবার আগে শেষ হয় (LIFO)।',
        },
      },
      {
        term: 'stack overflow',
        aliases: ['stack overflow', 'overflow', '~stack over flow', 'स्टैक ओवरफ्लो', 'ओवरफ्लो', 'ஸ்டாக் ஓவர்ஃப்ளோ', 'ஓவர்ஃப்ளோ', 'স্ট্যাক ওভারফ্লো', 'ওভারফ্লো'],
        def: {
          en: 'The crash that happens when calls keep piling up without reaching a base case, until stack memory runs out.',
          hinglish: 'Jab base case tak pahunche bina calls jama hoti rahein aur stack memory khatam ho jaaye, tab hone wala crash.',
          hi: 'जब base case तक पहुँचे बिना कॉल्स जमा होती रहें और स्टैक मेमोरी ख़त्म हो जाए, तब होने वाला क्रैश।',
          ta: 'Base case-ஐ அடையாமல் call-கள் குவிந்து stack memory தீரும்போது ஏற்படும் crash.',
          bn: 'Base case-এ না পৌঁছে call জমতে জমতে stack memory ফুরিয়ে গেলে যে crash হয়।',
        },
      },
      {
        term: 'memoization',
        aliases: ['memoization', 'memoisation', 'memoiz', 'memoised', '=memo', '~memorization', '~memorisation', '~memo ization', 'मेमोइज़ेशन', 'मेमोइजेशन', 'மெமோயிசேஷன்', 'মেমোইজেশন'],
        def: {
          en: 'Storing each computed answer so that a repeated call can reuse it instead of recalculating.',
          hinglish: 'Har calculate kiya hua answer store kar lena, taaki repeat call par dobara calculate na karna pade.',
          hi: 'हर निकाला गया जवाब सहेज लेना, ताकि दोबारा कॉल होने पर फिर से गणना न करनी पड़े।',
          ta: 'கணக்கிட்ட ஒவ்வொரு பதிலையும் சேமித்து, மீண்டும் call வரும்போது மறுபடி கணக்கிடாமல் பயன்படுத்துவது.',
          bn: 'প্রতিটা হিসাব করা উত্তর জমিয়ে রাখা, যাতে আবার call এলে নতুন করে হিসাব করতে না হয়।',
        },
      },
      {
        term: 'factorial',
        aliases: ['factorial', '~factorian', '~factory al', 'फैक्टोरियल', 'क्रमगुणित', 'ஃபேக்டோரியல்', 'காரணீயம்', 'ফ্যাক্টোরিয়াল', 'ক্রমগুণিত'],
        def: {
          en: 'n! = n × (n − 1) × … × 1, with 0! = 1; the classic first example of recursion.',
          hinglish: 'n! = n × (n − 1) × … × 1, aur 0! = 1; recursion ka sabse classic example.',
          hi: 'n! = n × (n − 1) × … × 1, और 0! = 1; recursion का सबसे प्रसिद्ध उदाहरण।',
          ta: 'n! = n × (n − 1) × … × 1, 0! = 1; recursion-க்கு முதல் classic உதாரணம்.',
          bn: 'n! = n × (n − 1) × … × 1, আর 0! = 1; recursion-এর সবচেয়ে চেনা উদাহরণ।',
        },
      },
    ],
    sections: [
      {
        id: 'recursion-1',
        title: 'What is recursion?',
        askTerm: 'base case',
        text: 'Recursion is when a function solves a problem by calling itself on a smaller version of the same problem. Every recursive function has two parts: a base case, which answers the smallest version directly without another call, and a recursive case, which breaks the problem down and calls the function again. For example, factorial(n) = n × factorial(n − 1), with the base case factorial(0) = 1. Each call moves closer to the base case, so the chain of calls eventually stops.',
        explain: {
          en: 'Imagine you are in a dark cinema hall and want to know your row number. You ask the person in front: which row are you in? They ask the person in front of them, and so on. The person in the first row does not need to ask anyone; they just say row 1. That is the base case. Then each person adds 1 and passes the answer back. That is the recursive case: solve a smaller version, then use its answer. Factorial works the same way: 5! = 5 × 4!, and it stops at 0! = 1.',
          hinglish: 'Socho tum dark cinema hall mein ho aur apna row number jaanna hai. Tum aage wale se poochte ho: aap kaunsi row mein ho? Woh apne aage wale se poochta hai, aur aise hi chain chalti hai. First row wale ko kisi se poochna nahi padta; woh seedha bolta hai row 1. Yahi base case hai. Phir har insaan answer mein 1 jodkar peeche bata deta hai. Yeh recursive case hai: chhota version solve karo, phir uske answer ko use karo. Factorial bhi aise hi chalta hai: 5! = 5 × 4!, aur 0! = 1 par ruk jaata hai.',
          hi: 'सोचिए आप अंधेरे सिनेमा हॉल में हैं और अपनी पंक्ति (row) का नंबर जानना है। आप आगे वाले से पूछते हैं: आप कौन-सी row में हैं? वह अपने आगे वाले से पूछता है, और यही सिलसिला चलता है। पहली row वाले को किसी से पूछना नहीं पड़ता; वह सीधे कहता है row 1। यही आधार स्थिति (base case) है। फिर हर व्यक्ति जवाब में 1 जोड़कर पीछे बता देता है। यह पुनरावर्ती स्थिति (recursive case) है: छोटा रूप हल करो, फिर उसके जवाब का उपयोग करो। फ़ैक्टोरियल भी ऐसे ही चलता है: 5! = 5 × 4!, और 0! = 1 पर रुक जाता है।',
          ta: 'இருட்டான cinema hall-இல் உங்கள் row number-ஐத் தெரிந்துகொள்ள வேண்டும் என்று நினைத்துப் பாருங்கள். முன்னால் இருப்பவரிடம் நீங்கள் எந்த row என்று கேட்கிறீர்கள். அவர் தனக்கு முன்னால் இருப்பவரிடம் கேட்கிறார், இப்படியே தொடர்கிறது. முதல் row-இல் இருப்பவர் யாரிடமும் கேட்க வேண்டாம்; நேரடியாக row 1 என்கிறார். அதுதான் base case. பிறகு ஒவ்வொருவரும் பதிலுடன் 1 கூட்டி பின்னால் சொல்கிறார்கள். இதுதான் recursive case: சிறிய பதிப்பைத் தீர்த்து, அந்த பதிலைப் பயன்படுத்துவது. Factorial-உம் இப்படித்தான்: 5! = 5 × 4!, 0! = 1-இல் நின்றுவிடும்.',
          bn: 'ভাবো তুমি অন্ধকার সিনেমা হলে বসে আছো আর নিজের row নম্বর জানতে চাও। তুমি সামনের জনকে জিজ্ঞেস করলে: আপনি কোন row-তে? সে তার সামনের জনকে জিজ্ঞেস করে, এভাবে চলতে থাকে। প্রথম row-এর লোককে কাউকে জিজ্ঞেস করতে হয় না; সে সোজা বলে row 1। এটাই base case। তারপর প্রত্যেকে উত্তরের সঙ্গে 1 যোগ করে পেছনে বলে দেয়। এটা recursive case: ছোট সংস্করণটা সমাধান করো, তারপর সেই উত্তর কাজে লাগাও। Factorial-ও এভাবেই চলে: 5! = 5 × 4!, আর 0! = 1-এ গিয়ে থামে।',
        },
        concepts: [
          {
            label: 'A function calls itself',
            groups: [FUNCTION, ITSELF],
            note: 'Recursion: a function solves a problem by calling itself on a smaller version of the same problem.',
            hint: {
              en: 'Say the key idea: the function calls itself.',
              hinglish: 'Main idea bolo: function khud ko call karta hai.',
              hi: 'मुख्य बात बोलिए: फ़ंक्शन ख़ुद को कॉल करता है।',
              ta: 'முக்கியக் கருத்தைச் சொல்லுங்கள்: function தன்னையே call செய்கிறது.',
              bn: 'মূল কথাটা বলো: function নিজেকেই call করে।',
            },
          },
          {
            label: 'The base case stops it',
            groups: [BASE, STOPS],
            note: 'Base case: the smallest input is answered directly (e.g. factorial(0) = 1); it stops the recursion.',
            hint: {
              en: 'What stops the calls? Name the base case, like the person in row 1.',
              hinglish: 'Calls ko kya rokta hai? Base case batao, jaise row 1 wala insaan.',
              hi: 'कॉल्स को क्या रोकता है? Base case बताइए, जैसे row 1 वाला व्यक्ति।',
              ta: 'Call-களை எது நிறுத்துகிறது? Base case-ஐச் சொல்லுங்கள், row 1 நபர் மாதிரி.',
              bn: 'Call গুলো কে থামায়? Base case বলো, যেমন row 1-এর লোকটা।',
            },
          },
          {
            label: 'Each call is a smaller problem',
            groups: [SMALLER],
            note: 'Recursive case: reduce the problem (e.g. n × factorial(n − 1)) so each call moves closer to the base case.',
            hint: {
              en: 'Explain that each call works on a smaller problem, like n − 1.',
              hinglish: 'Batao ki har call ek chhoti problem par kaam karti hai, jaise n − 1.',
              hi: 'बताइए कि हर कॉल एक छोटी समस्या पर काम करती है, जैसे n − 1।',
              ta: 'ஒவ்வொரு call-உம் சிறிய பிரச்சனையில் வேலை செய்கிறது என்று சொல்லுங்கள், n − 1 மாதிரி.',
              bn: 'বলো যে প্রতিটা call একটা ছোট সমস্যায় কাজ করে, যেমন n − 1।',
            },
          },
        ],
        misconceptions: [
          {
            phrases: ['base case is not needed', 'base case not needed', 'no need of base case', 'no need for base case', 'base case is optional', 'base case ki zarurat nahi',
              'base case ki jarurat nahi', 'base case zaroori nahi', 'base case जरूरी नहीं', 'base case की जरूरत नहीं', 'base case தேவையில்லை', 'base case লাগে না', 'base case দরকার নেই'],
            allowNegation: true,
            fix: {
              en: 'Without a base case the calls never stop.',
              hinglish: 'Base case ke bina calls kabhi nahi rukti.',
              hi: 'Base case के बिना कॉल्स कभी नहीं रुकतीं।',
              ta: 'Base case இல்லாவிட்டால் call-கள் நிற்கவே நிற்காது.',
              bn: 'Base case ছাড়া call কখনো থামে না।',
            },
          },
        ],
        examTip: 'Exam tip: write the base case first, then the recursive case: fact(0) = 1; fact(n) = n × fact(n − 1).',
        samples: {
          hinglish: 'Recursion mein ek function khud ko call karta hai, par har baar chhoti problem ke saath, jaise factorial n ke liye n into factorial n minus 1. Ek base case hona zaroori hai jahan function ruk jaata hai, jaise factorial 0 barabar 1, warna calls kabhi khatam nahi hongi. Yeh cinema hall mein row number poochne jaisa hai.',
          en: 'Recursion means a function calls itself, but each time on a smaller problem, like factorial of n being n times factorial of n minus 1. You need a base case where it stops, like factorial of 0 is 1, otherwise the calls never end. It is like asking the person in front of you for your row number in a cinema.',
        },
      },
      {
        id: 'recursion-2',
        title: 'The call stack',
        askTerm: 'call stack',
        text: 'When a function calls itself, the computer does not forget the first call. It pauses it and stores it on the call stack, a pile of unfinished calls where the most recent one sits on top. When the base case is reached, the top call returns its answer, and the calls below resume one by one, each finishing its own calculation. If the base case is missing or never reached, calls keep piling up until memory runs out, causing a stack overflow error.',
        explain: {
          en: 'Think of a stack of steel plates at a wedding buffet. Each new call is a plate placed on top, and you can only take from the top. factorial(3) waits on the stack, then factorial(2) goes on top, then factorial(1), then factorial(0). factorial(0) answers 1 immediately, the base case, and is removed. Then factorial(1) can finish, then factorial(2), then factorial(3): last in, first out. If there is no base case, the plates keep piling up until the stack crashes. That is a stack overflow.',
          hinglish: 'Shaadi ke buffet mein steel plates ka stack socho. Har nayi call ek plate hai jo upar rakhi jaati hai, aur lena sirf upar se hota hai. factorial(3) stack par wait karta hai, phir factorial(2) uske upar, phir factorial(1), phir factorial(0). factorial(0) turant 1 bata deta hai, yahi base case hai, aur hat jaata hai. Phir factorial(1) poora hota hai, phir factorial(2), phir factorial(3): last in, first out. Agar base case hi nahi hai, to plates upar-upar badhti rehti hain jab tak stack gir na jaaye. Isi ko stack overflow kehte hain.',
          hi: 'शादी के बुफ़े में स्टील की प्लेटों का ढेर सोचिए। हर नई call एक प्लेट है जो ऊपर रखी जाती है, और लेना सिर्फ़ ऊपर से होता है। factorial(3) स्टैक पर इंतज़ार करता है, फिर factorial(2) उसके ऊपर, फिर factorial(1), फिर factorial(0)। factorial(0) तुरंत 1 बता देता है, यही base case है, और हट जाता है। फिर factorial(1) पूरा होता है, फिर factorial(2), फिर factorial(3): जो आख़िर में आया, वह पहले गया (LIFO)। अगर base case ही न हो, तो प्लेटें बढ़ती जाती हैं जब तक स्टैक गिर न जाए। इसे stack overflow कहते हैं।',
          ta: 'கல்யாண buffet-இல் அடுக்கி வைத்த steel plate-களை நினைத்துப் பாருங்கள். ஒவ்வொரு புதிய call-உம் மேலே வைக்கப்படும் ஒரு plate; எடுப்பது மேலிருந்து மட்டுமே. factorial(3) stack-இல் காத்திருக்கிறது, பிறகு அதன் மேல் factorial(2), பிறகு factorial(1), பிறகு factorial(0). factorial(0) உடனே 1 என்று பதில் சொல்கிறது, அதுதான் base case, பிறகு எடுக்கப்படுகிறது. அடுத்து factorial(1) முடிகிறது, பிறகு factorial(2), பிறகு factorial(3): கடைசியாக வந்தது முதலில் போகும் (LIFO). Base case இல்லையென்றால் plate-கள் விழும் வரை அடுக்கிக்கொண்டே போகும். அதுதான் stack overflow.',
          bn: 'বিয়েবাড়ির বুফেতে স্টিলের প্লেটের স্তূপ ভাবো। প্রতিটা নতুন call হলো ওপরে রাখা একটা প্লেট, আর নেওয়া যায় শুধু ওপর থেকে। factorial(3) stack-এ অপেক্ষা করে, তারপর তার ওপর factorial(2), তারপর factorial(1), তারপর factorial(0)। factorial(0) সঙ্গে সঙ্গে 1 বলে দেয়, এটাই base case, আর সরে যায়। তারপর factorial(1) শেষ হয়, তারপর factorial(2), তারপর factorial(3): শেষে যে এল, সে আগে গেল (LIFO)। Base case না থাকলে প্লেট জমতেই থাকে যতক্ষণ না স্তূপ ভেঙে পড়ে। এটাই stack overflow।',
        },
        concepts: [
          {
            label: 'Calls wait on the call stack',
            groups: [STACK, WAITS],
            note: 'Each recursive call is paused and pushed onto the call stack until the call above it returns.',
            hint: {
              en: 'Mention the call stack: where do unfinished calls wait?',
              hinglish: 'Call stack ka zikr karo: adhoori calls kahan wait karti hain?',
              hi: 'कॉल स्टैक का ज़िक्र कीजिए: अधूरी कॉल्स कहाँ इंतज़ार करती हैं?',
              ta: 'Call stack பற்றிச் சொல்லுங்கள்: முடிக்கப்படாத call-கள் எங்கே காத்திருக்கின்றன?',
              bn: 'Call stack-এর কথা বলো: অসমাপ্ত call-গুলো কোথায় অপেক্ষা করে?',
            },
          },
          {
            label: 'Last in, first out',
            groups: [LIFO],
            note: 'Calls finish in reverse order, last in, first out (LIFO), once the base case returns.',
            hint: {
              en: 'Which call finishes first: the one on top, or the first one?',
              hinglish: 'Kaunsi call pehle khatam hoti hai: upar wali ya pehli wali?',
              hi: 'कौन-सी कॉल पहले पूरी होती है: ऊपर वाली या पहली वाली?',
              ta: 'எந்த call முதலில் முடியும்: மேலே இருப்பதா, முதலில் வந்ததா?',
              bn: 'কোন call আগে শেষ হয়: ওপরেরটা না প্রথমটা?',
            },
          },
          {
            label: 'Stack overflow without a base case',
            groups: [OVERFLOW],
            note: 'A missing or unreachable base case makes calls pile up until a stack overflow error.',
            hint: {
              en: 'What happens if there is no base case? Name the error.',
              hinglish: 'Base case na ho to kya hota hai? Error ka naam batao.',
              hi: 'अगर base case न हो तो क्या होता है? एरर का नाम बताइए।',
              ta: 'Base case இல்லையென்றால் என்ன ஆகும்? அந்த error-இன் பெயரைச் சொல்லுங்கள்.',
              bn: 'Base case না থাকলে কী হয়? Error-টার নাম বলো।',
            },
          },
        ],
        misconceptions: [
          {
            phrases: ['first call finishes first', 'first call ends first', 'first call returns first', 'pehli call pehle khatam', 'pehla call pehle khatam', 'pehli call sabse pehle khatam',
              'पहली call पहले खत्म', 'पहली कॉल पहले खत्म', 'முதல் call முதலில் முடியும்', 'প্রথম call আগে শেষ'],
            fix: {
              en: 'The first call finishes LAST; it waits for all the smaller calls above it.',
              hinglish: 'Pehli call sabse AAKHIR mein khatam hoti hai; woh upar ki saari chhoti calls ka wait karti hai.',
              hi: 'पहली कॉल सबसे आख़िर में पूरी होती है; वह ऊपर की सारी छोटी कॉल्स का इंतज़ार करती है।',
              ta: 'முதல் call கடைசியாகத்தான் முடியும்; மேலே உள்ள சிறிய call-களுக்காக அது காத்திருக்கும்.',
              bn: 'প্রথম call সবার শেষে শেষ হয়; ওপরের সব ছোট call-এর জন্য সে অপেক্ষা করে।',
            },
          },
        ],
        examTip: 'Exam tip: trace factorial(3) as a stack diagram: push 3, 2, 1, 0, then pop with returns 1, 1, 2, 6.',
        samples: {
          hinglish: 'Jab function khud ko call karta hai to purani call ruk kar call stack par wait karti hai. Sabse upar wali call sabse pehle khatam hoti hai, yaani last in first out. Agar base case na ho to calls stack par bharti rehti hain aur stack overflow ho jaata hai.',
          en: 'When a function calls itself, the older call is paused and waits on the call stack. The call on top finishes first, last in first out. If there is no base case, the calls keep piling up on the stack until it overflows.',
        },
        weakSamples: {
          hinglish: 'Pehli call pehle khatam hoti hai aur baaki calls baad mein chalti hain.',
          en: 'The first call finishes first and then the other calls run after it.',
        },
      },
      {
        id: 'recursion-3',
        title: 'Recursion vs loops, and memoization',
        askTerm: 'memoization',
        text: 'Any recursive solution can also be written with a loop, and each style has trade-offs. Recursion is natural for problems that contain smaller copies of themselves, like trees, folders inside folders, or divide-and-conquer sorting. But every call uses stack memory and time, and a naive recursive Fibonacci recalculates the same values again and again, taking exponential time. Memoization fixes this by storing each answer the first time it is computed and reusing it, which brings Fibonacci down to linear time.',
        explain: {
          en: 'Think of folders on your phone: a folder can have folders inside, which have more folders. Searching all of them is naturally recursive: search this folder, and do the same for every folder inside. But recursion has a cost. Naive Fibonacci works out fib(3) again and again, like a shopkeeper re-adding the same bill every time a customer asks. Memoization is writing the total in a notebook the first time and just reading it next time. Same answer, far less work.',
          hinglish: 'Apne phone ke folders socho: ek folder ke andar folders, unke andar aur folders. Sabko search karna naturally recursive hai: is folder ko search karo, aur andar ke har folder ke saath yahi karo. Par recursion ki ek keemat hai. Naive Fibonacci fib(3) baar-baar calculate karta hai, jaise koi dukaandaar har baar customer ke poochne par wahi bill phir se jodta hai. Memoization matlab pehli baar total notebook mein likh lo, agli baar bas padh lo. Answer wahi, kaam bahut kam.',
          hi: 'अपने फ़ोन के फ़ोल्डर सोचिए: एक फ़ोल्डर के अंदर फ़ोल्डर, उनके अंदर और फ़ोल्डर। सबमें खोजना स्वाभाविक रूप से recursive है: इस फ़ोल्डर में खोजो, और अंदर के हर फ़ोल्डर के साथ यही करो। पर recursion की एक क़ीमत है। साधारण (naive) Fibonacci fib(3) को बार-बार गिनता है, जैसे कोई दुकानदार हर बार ग्राहक के पूछने पर वही बिल फिर से जोड़े। Memoization का मतलब है पहली बार कुल रक़म कॉपी में लिख लो, अगली बार बस पढ़ लो। जवाब वही, मेहनत बहुत कम।',
          ta: 'உங்கள் phone-இல் உள்ள folder-களை நினைத்துப் பாருங்கள்: ஒரு folder-க்குள் folder-கள், அவற்றுக்குள் இன்னும் folder-கள். எல்லாவற்றிலும் தேடுவது இயல்பாகவே recursive: இந்த folder-இல் தேடு, உள்ளே இருக்கும் ஒவ்வொரு folder-க்கும் இதையே செய். ஆனால் recursion-க்கு ஒரு விலை உண்டு. சாதாரண Fibonacci, fib(3)-ஐ திரும்பத் திரும்பக் கணக்கிடுகிறது, ஒவ்வொரு முறை customer கேட்கும்போதும் அதே bill-ஐ மறுபடி கூட்டும் கடைக்காரர் மாதிரி. Memoization என்றால் முதல் முறையே total-ஐ notebook-இல் எழுதி வைத்து, அடுத்த முறை படித்துவிடுவது. பதில் அதேதான், வேலை ரொம்பக் குறைவு.',
          bn: 'তোমার ফোনের ফোল্ডারগুলোর কথা ভাবো: একটা ফোল্ডারের ভেতরে ফোল্ডার, তাদের ভেতরে আরও ফোল্ডার। সবগুলোয় খোঁজা স্বাভাবিকভাবেই recursive: এই ফোল্ডারে খোঁজো, আর ভেতরের প্রতিটা ফোল্ডারেও একই কাজ করো। কিন্তু recursion-এর একটা দাম আছে। সাধারণ (naive) Fibonacci fib(3) বারবার হিসাব করে, যেন কোনো দোকানদার প্রত্যেকবার খদ্দের জিজ্ঞেস করলে একই বিল আবার যোগ করছে। Memoization মানে প্রথমবারেই মোটটা খাতায় লিখে রাখা, পরেরবার শুধু পড়ে নেওয়া। উত্তর একই, খাটুনি অনেক কম।',
        },
        concepts: [
          {
            label: 'Recursion fits self-similar problems',
            groups: [SELF_SIMILAR],
            note: 'Recursion fits problems made of smaller copies of themselves: trees, nested folders, divide-and-conquer sorting.',
            hint: {
              en: 'Give a problem with smaller copies inside it, like folders inside folders.',
              hinglish: 'Aisi problem batao jiske andar uski chhoti copies hon, jaise folder ke andar folder.',
              hi: 'ऐसी समस्या बताइए जिसके अंदर उसकी छोटी प्रतियाँ हों, जैसे फ़ोल्डर के अंदर फ़ोल्डर।',
              ta: 'தனக்குள்ளேயே சிறிய நகல்கள் உள்ள பிரச்சனையைச் சொல்லுங்கள், folder-க்குள் folder மாதிரி.',
              bn: 'এমন সমস্যা বলো যার ভেতরে তারই ছোট কপি আছে, যেমন ফোল্ডারের ভেতরে ফোল্ডার।',
            },
          },
          {
            label: 'The cost: memory and repeated work',
            groups: [COST],
            note: 'Cost: each call uses stack memory, and naive recursive Fibonacci repeats work, taking exponential time.',
            hint: {
              en: 'What is the cost of recursion? Think about memory and repeated work.',
              hinglish: 'Recursion ki keemat kya hai? Memory aur baar-baar wala kaam socho.',
              hi: 'Recursion की क़ीमत क्या है? मेमोरी और बार-बार होने वाला काम सोचिए।',
              ta: 'Recursion-இன் விலை என்ன? Memory-யையும் திரும்பத் திரும்பச் செய்யும் வேலையையும் யோசியுங்கள்.',
              bn: 'Recursion-এর দাম কী? মেমরি আর বারবার একই কাজের কথা ভাবো।',
            },
          },
          {
            label: 'Memoization stores and reuses answers',
            groups: [MEMO, REUSE],
            note: 'Memoization: store each computed answer and reuse it; Fibonacci drops to linear time.',
            hint: {
              en: 'How does memoization help? Think of the shopkeeper’s notebook.',
              hinglish: 'Memoization kaise madad karta hai? Dukaandaar ki notebook yaad karo.',
              hi: 'Memoization कैसे मदद करता है? दुकानदार की कॉपी याद कीजिए।',
              ta: 'Memoization எப்படி உதவுகிறது? கடைக்காரரின் notebook-ஐ நினைவுபடுத்துங்கள்.',
              bn: 'Memoization কীভাবে সাহায্য করে? দোকানদারের খাতার কথা মনে করো।',
            },
          },
        ],
        misconceptions: [
          {
            phrases: ['recursion is always faster', 'recursion is faster', 'recursion always faster', 'recursion zyada fast', 'recursion hamesha fast', 'recursion fast hota',
              'recursion तेज होता', 'recursion हमेशा तेज', 'recursion எப்போதும் வேகம்', 'recursion வேகமானது', 'recursion সবসময় দ্রুত', 'recursion দ্রুত'],
            fix: {
              en: 'Not always. Recursion adds call overhead and stack memory, so loops are often faster. Memoization helps by skipping repeated work.',
              hinglish: 'Hamesha nahi. Recursion mein call ka overhead aur stack memory lagti hai, isliye loop aksar fast hota hai. Memoization repeat kaam bachata hai.',
              hi: 'हमेशा नहीं। Recursion में कॉल का अतिरिक्त ख़र्च और स्टैक मेमोरी लगती है, इसलिए लूप अक्सर तेज़ होता है। Memoization दोहराया काम बचाता है।',
              ta: 'எப்போதும் இல்லை. Recursion-இல் call overhead-உம் stack memory-யும் தேவை, அதனால் loop பெரும்பாலும் வேகமானது. Memoization திரும்பச் செய்யும் வேலையைத் தவிர்க்கிறது.',
              bn: 'সবসময় নয়। Recursion-এ call-এর বাড়তি খরচ আর stack memory লাগে, তাই loop প্রায়ই দ্রুত। Memoization বারবারের কাজ বাঁচায়।',
            },
          },
        ],
        examTip: 'Exam tip: any recursion can be rewritten as a loop; mention the time and space trade-off.',
        samples: {
          hinglish: 'Recursion un problems ke liye natural hai jinke andar chhoti copies hoti hain, jaise folder ke andar folder ya tree. Par har call memory leti hai aur naive Fibonacci same values baar baar calculate karta hai, jo slow hai. Memoization mein answer pehli baar store kar lete hain aur agli baar reuse karte hain.',
          en: 'Recursion suits problems that have smaller copies inside them, like folders inside folders or a tree. But every call costs memory, and naive Fibonacci keeps working out the same values again and again, which is slow. With memoization you store each answer the first time and reuse it next time.',
        },
      },
    ],
  },
  {
    id: 'supply',
    title: 'Supply and Demand',
    subject: 'Economics · Class 12 / BCom first year',
    aliases: ['supply and demand', 'demand and supply', 'supply demand', 'economics', 'supply', 'demand', 'मांग और आपूर्ति', 'अर्थशास्त्र', 'டிமாண்ட்', 'சப்ளை',
      'தேவை மற்றும் வழங்கல்', 'চাহিদা ও জোগান', 'চাহিদা', 'জোগান', 'অর্থনীতি'],
    glossary: [
      {
        term: 'demand',
        generic: true,
        aliases: ['=demand', 'डिमांड', 'मांग', 'டிமாண்ட்', 'চাহিদা', 'ডিমান্ড'],
        def: {
          en: 'The quantity buyers are willing and able to buy at each price.',
          hinglish: 'Har price par kharidaar jitna kharidna chahte hain aur kharid sakte hain, woh quantity.',
          hi: 'हर दाम पर ख़रीदार जितना ख़रीदना चाहते हैं और ख़रीद सकते हैं, वह मात्रा।',
          ta: 'ஒவ்வொரு விலையிலும் வாங்குபவர்கள் வாங்க விரும்பும், வாங்க முடியும் அளவு.',
          bn: 'প্রতিটা দামে ক্রেতারা যতটা কিনতে চায় এবং কিনতে পারে, সেই পরিমাণ।',
        },
      },
      {
        term: 'supply',
        generic: true,
        aliases: ['=supply', 'सप्लाई', 'आपूर्ति', 'पूर्ति', 'சப்ளை', 'வழங்கல்', 'জোগান', 'যোগান', 'সাপ্লাই'],
        def: {
          en: 'The quantity sellers are willing and able to offer at each price.',
          hinglish: 'Har price par bechne wale jitna bechna chahte hain aur bech sakte hain, woh quantity.',
          hi: 'हर दाम पर विक्रेता जितना बेचना चाहते हैं और बेच सकते हैं, वह मात्रा।',
          ta: 'ஒவ்வொரு விலையிலும் விற்பவர்கள் விற்க விரும்பும், விற்க முடியும் அளவு.',
          bn: 'প্রতিটা দামে বিক্রেতারা যতটা বেচতে চায় এবং বেচতে পারে, সেই পরিমাণ।',
        },
      },
      {
        term: 'law of demand',
        aliases: ['law of demand', 'demand ka niyam', 'मांग का नियम', 'டிமாண்ட் விதி', 'தேவை விதி', 'চাহিদার নিয়ম', 'চাহিদা বিধি'],
        def: {
          en: 'Other things equal, when price rises the quantity demanded falls, and when price falls it rises.',
          hinglish: 'Baaki sab same ho to price badhne par demand ki quantity ghatti hai, aur price ghatne par badhti hai.',
          hi: 'बाकी सब समान हो तो दाम बढ़ने पर माँगी गई मात्रा घटती है, और दाम घटने पर बढ़ती है।',
          ta: 'மற்றவை மாறாமல் இருந்தால், விலை ஏறும்போது demand அளவு குறையும், விலை இறங்கும்போது கூடும்.',
          bn: 'বাকি সব একই থাকলে দাম বাড়লে চাহিদার পরিমাণ কমে, আর দাম কমলে বাড়ে।',
        },
      },
      {
        term: 'ceteris paribus',
        aliases: ['ceteris paribus', '~ceteris', '~seteris paribus', '~ceteris paribas', '~satiris paribus', 'सेटेरिस पैरिबस', 'செட்டரிஸ் பாரிபஸ்', 'সেটেরিস প্যারিবাস'],
        def: {
          en: 'Latin for “other things remaining the same”: we change only one factor at a time.',
          hinglish: 'Latin mein “baaki sab cheezein same rahein”: ek time par sirf ek factor badalte hain.',
          hi: 'लैटिन में “बाकी सब बातें समान रहें”: एक समय में सिर्फ़ एक कारक बदलते हैं।',
          ta: 'லத்தீனில் “மற்றவை மாறாமல்”: ஒரு நேரத்தில் ஒரு காரணியை மட்டும் மாற்றுவோம்.',
          bn: 'ল্যাটিনে “বাকি সব একই থাকলে”: একবারে শুধু একটা কারণ বদলানো হয়।',
        },
      },
      {
        term: 'equilibrium',
        aliases: ['equilibrium', '~equilibirum', '~equilibrum', '~equi librium', 'इक्विलिब्रियम', 'संतुलन', 'ஈக்விலிப்ரியம்', 'சமநிலை', 'ইকুইলিব্রিয়াম', 'ভারসাম্য'],
        def: {
          en: 'The price where quantity demanded equals quantity supplied, where the two curves cross.',
          hinglish: 'Woh price jahan demand ki quantity aur supply ki quantity barabar ho, jahan dono curves milte hain.',
          hi: 'वह दाम जहाँ माँगी गई मात्रा और आपूर्ति की गई मात्रा बराबर हो, जहाँ दोनों वक्र मिलते हैं।',
          ta: 'Demand அளவும் supply அளவும் சமமாகும் விலை; இரண்டு curve-களும் சந்திக்கும் இடம்.',
          bn: 'যে দামে চাহিদার পরিমাণ আর জোগানের পরিমাণ সমান, যেখানে দুটো curve মেলে।',
        },
      },
      {
        term: 'shortage',
        aliases: ['shortage', 'कमी', 'किल्लत', 'शॉर्टेज', 'ஷார்ட்டேஜ்', 'பற்றாக்குறை', 'ঘাটতি', 'শর্টেজ'],
        def: {
          en: 'When quantity demanded is more than quantity supplied, usually because the price is below equilibrium.',
          hinglish: 'Jab demand ki quantity supply se zyada ho, aksar isliye kyunki price equilibrium se neeche hai.',
          hi: 'जब माँगी गई मात्रा आपूर्ति से ज़्यादा हो, अक्सर इसलिए कि दाम संतुलन से नीचे है।',
          ta: 'Demand அளவு supply-ஐ விட அதிகமாக இருக்கும் நிலை; பொதுவாக விலை equilibrium-க்குக் கீழே இருப்பதால்.',
          bn: 'যখন চাহিদার পরিমাণ জোগানের চেয়ে বেশি, সাধারণত দাম ভারসাম্যের নিচে থাকায়।',
        },
      },
      {
        term: 'surplus',
        aliases: ['surplus', '~sur plus', '~sirplus', 'सरप्लस', 'आधिक्य', 'अधिशेष', 'சர்ப்ளஸ்', 'உபரி', 'উদ্বৃত্ত', 'সারপ্লাস'],
        def: {
          en: 'When quantity supplied is more than quantity demanded, usually because the price is above equilibrium.',
          hinglish: 'Jab supply ki quantity demand se zyada ho, aksar isliye kyunki price equilibrium se upar hai.',
          hi: 'जब आपूर्ति की गई मात्रा माँग से ज़्यादा हो, अक्सर इसलिए कि दाम संतुलन से ऊपर है।',
          ta: 'Supply அளவு demand-ஐ விட அதிகமாக இருக்கும் நிலை; பொதுவாக விலை equilibrium-க்கு மேலே இருப்பதால்.',
          bn: 'যখন জোগানের পরিমাণ চাহিদার চেয়ে বেশি, সাধারণত দাম ভারসাম্যের ওপরে থাকায়।',
        },
      },
    ],
    sections: [
      {
        id: 'supply-1',
        title: 'The law of demand',
        askTerm: 'ceteris paribus',
        text: 'Demand is the quantity of a good that buyers are willing and able to buy at each price. The law of demand states that, other things remaining the same (ceteris paribus), when the price of a good rises, the quantity demanded falls, and when the price falls, the quantity demanded rises. That is why a demand curve slopes downward from left to right. A change in price moves us along the curve, while changes in income, tastes or the prices of related goods shift the whole curve.',
        explain: {
          en: 'Think of mangoes. When Alphonso mangoes cost ₹800 a dozen, your family buys maybe one dozen a week. When the price drops to ₹300 in peak season, you suddenly buy three dozen. Higher price, fewer bought; lower price, more bought. That is the law of demand, and it is why the demand curve slopes down. “Other things the same” matters: if your salary doubles or a wedding is coming, you buy more at every price. That is not a slide along the curve; the whole curve shifts.',
          hinglish: 'Aam socho. Jab Alphonso aam ₹800 darjan hain, to ghar mein shayad hafte mein ek darjan aata hai. Season mein daam ₹300 ho jaata hai, to achanak teen darjan aa jaate hain. Daam zyada, khareed kam; daam kam, khareed zyada. Yahi law of demand hai, aur isliye demand curve neeche ki taraf jhukta hai. “Baaki sab same” zaroori hai: agar salary double ho jaaye ya ghar mein shaadi ho, to har price par zyada kharidoge. Yeh curve par chalna nahi hai; poora curve hi shift ho jaata hai.',
          hi: 'आम सोचिए। जब अल्फ़ांसो आम ₹800 दर्जन हैं, तो घर में शायद हफ़्ते में एक दर्जन आता है। सीज़न में दाम ₹300 हो जाता है, तो अचानक तीन दर्जन आ जाते हैं। दाम ज़्यादा, ख़रीद कम; दाम कम, ख़रीद ज़्यादा। यही माँग का नियम (law of demand) है, और इसीलिए माँग वक्र (demand curve) नीचे की ओर झुकता है। “बाकी सब समान” ज़रूरी है: अगर तनख़्वाह दोगुनी हो जाए या घर में शादी हो, तो हर दाम पर ज़्यादा ख़रीदेंगे। यह वक्र पर चलना नहीं है; पूरा वक्र ही खिसक जाता है।',
          ta: 'மாம்பழத்தை நினைத்துப் பாருங்கள். Alphonso மாம்பழம் டஜன் ₹800 என்றால், வீட்டில் வாரத்துக்கு ஒரு டஜன் வாங்குவீர்கள். Season-இல் விலை ₹300 ஆனதும், திடீரென்று மூன்று டஜன் வாங்குவீர்கள். விலை அதிகம், வாங்குவது குறைவு; விலை குறைவு, வாங்குவது அதிகம். இதுதான் law of demand, அதனால்தான் demand curve கீழ்நோக்கிச் சாய்கிறது. “மற்றவை மாறாமல்” என்பது முக்கியம்: சம்பளம் இரட்டிப்பானாலோ வீட்டில் கல்யாணம் வந்தாலோ, எந்த விலையிலும் அதிகம் வாங்குவீர்கள். அது curve-இல் நகர்வது இல்லை; முழு curve-உம் நகர்ந்துவிடும் (shift).',
          bn: 'আমের কথা ভাবো। আলফোনসো আম যখন ₹800 ডজন, তখন বাড়িতে হয়তো সপ্তাহে এক ডজন আসে। মরসুমে দাম ₹300 হলে হঠাৎ তিন ডজন আসে। দাম বেশি, কেনা কম; দাম কম, কেনা বেশি। এটাই চাহিদার নিয়ম (law of demand), আর তাই demand curve নিচের দিকে নামে। “বাকি সব একই থাকলে” কথাটা জরুরি: মাইনে দ্বিগুণ হলে বা বাড়িতে বিয়ে থাকলে, প্রতিটা দামেই বেশি কিনবে। সেটা curve-এর ওপর চলা নয়; পুরো curve-টাই সরে যায় (shift)।',
        },
        concepts: [
          {
            label: 'Price up, quantity demanded down',
            groups: [PRICE, DEMAND, DOWN],
            note: 'Law of demand: price ↑ → quantity demanded ↓ (and vice versa), ceteris paribus.',
            hint: {
              en: 'Say the direction: when the price goes up, what happens to the quantity demanded?',
              hinglish: 'Direction batao: price badhe to demand ki quantity ka kya hota hai?',
              hi: 'दिशा बताइए: दाम बढ़े तो माँगी गई मात्रा का क्या होता है?',
              ta: 'திசையைச் சொல்லுங்கள்: விலை ஏறினால் demand அளவுக்கு என்ன ஆகும்?',
              bn: 'দিকটা বলো: দাম বাড়লে চাহিদার পরিমাণের কী হয়?',
            },
          },
          {
            label: 'Downward-sloping demand curve',
            groups: [CURVE, SLOPE_DOWN],
            note: 'The demand curve slopes downward from left to right.',
            hint: {
              en: 'Describe the demand curve: which way does it slope?',
              hinglish: 'Demand curve describe karo: woh kis taraf jhukta hai?',
              hi: 'माँग वक्र का वर्णन कीजिए: वह किस ओर झुकता है?',
              ta: 'Demand curve-ஐ விவரியுங்கள்: எந்தப் பக்கம் சாய்கிறது?',
              bn: 'Demand curve-টা বর্ণনা করো: কোন দিকে নামে?',
            },
          },
          {
            label: 'Movement vs shift',
            groups: [DEMAND_SHIFT],
            note: 'A price change moves along the curve; income, tastes or related prices shift the whole curve.',
            hint: {
              en: 'What shifts the whole curve instead of moving along it? Think of income, or a wedding.',
              hinglish: 'Curve par chalne ki jagah poora curve kya shift karta hai? Salary ya shaadi socho.',
              hi: 'वक्र पर चलने के बजाय पूरा वक्र क्या खिसकाता है? तनख़्वाह या शादी सोचिए।',
              ta: 'Curve-இல் நகர்வதற்குப் பதில் முழு curve-ஐ எது shift செய்கிறது? சம்பளம் அல்லது கல்யாணத்தை நினையுங்கள்.',
              bn: 'Curve-এর ওপর চলার বদলে পুরো curve-টা কী সরায়? মাইনে বা বিয়ের কথা ভাবো।',
            },
          },
        ],
        misconceptions: [
          {
            phrases: ['price badhne par demand badhti', 'price badhne se demand badhti', 'price badhe to demand badhe', 'price badhe to demand badhti', 'price increases demand increases',
              'price up demand up', 'price goes up demand goes up', 'price rises demand rises', 'higher price more demand', 'दाम बढ़ने पर मांग बढ', 'दाम बढ़ने से मांग बढ', 'कीमत बढ़ने पर मांग बढ',
              'விலை ஏறினால் demand ஏறும்', 'விலை ஏறினால் தேவை கூடும்', 'দাম বাড়লে চাহিদা বাড়ে', 'দাম বাড়লে চাহিদাও বাড়ে'],
            fix: {
              en: 'When price rises, quantity demanded FALLS. Higher income raising demand is a shift, not the law of demand.',
              hinglish: 'Price badhne par demand ki quantity GHAT-ti hai. Income badhne se demand badhna shift hai, law of demand nahi.',
              hi: 'दाम बढ़ने पर माँगी गई मात्रा घटती है। आय बढ़ने से माँग बढ़ना वक्र का खिसकना है, माँग का नियम नहीं।',
              ta: 'விலை ஏறினால் demand அளவு குறையும். வருமானம் கூடி demand கூடுவது shift, law of demand இல்லை.',
              bn: 'দাম বাড়লে চাহিদার পরিমাণ কমে। আয় বেড়ে চাহিদা বাড়া হলো shift, চাহিদার নিয়ম নয়।',
            },
          },
        ],
        examTip: 'Exam tip: always write “ceteris paribus” (other things remaining the same) with the law of demand.',
        samples: {
          hinglish: 'Law of demand kehta hai ki baaki sab same rahe to price badhne par demand kam hoti hai aur price kam hone par demand badhti hai. Isliye demand curve neeche ki taraf slope karta hai. Agar income ya taste badle to poora curve shift ho jaata hai.',
          en: 'The law of demand says that if everything else stays the same, a higher price means people buy less, and a lower price means they buy more. So the demand curve slopes down. If income or tastes change, the whole curve shifts.',
        },
        weakSamples: {
          hinglish: 'Price badhne par demand badhti hai kyunki log mehngi cheez zyada pasand karte hain.',
          en: 'When the price increases demand increases, because people like expensive things.',
        },
      },
      {
        id: 'supply-2',
        title: 'The law of supply',
        askTerm: 'supply',
        text: 'Supply is the quantity that sellers are willing and able to offer at each price. The law of supply says that, other things being equal, a higher price leads sellers to supply more, because producing and selling becomes more profitable, and a lower price leads them to supply less. So the supply curve slopes upward. Changes in costs, technology or weather shift the supply curve: a bad monsoon shifts the supply of onions to the left, while cheaper fertiliser shifts it to the right.',
        explain: {
          en: 'Imagine a farmer near Nashik deciding how many onions to bring to the mandi. If onions sell at ₹40 a kilo, it is worth hiring a truck and bringing everything. At ₹5 a kilo, he might keep them in storage or not even harvest. Higher price, more supplied, so the supply curve slopes up. Now heavy, untimely rain damages the crop: there are fewer onions at every price. That is not a move along the curve; the whole supply curve shifts left.',
          hinglish: 'Socho Nashik ke paas ek kisaan soch raha hai ki mandi mein kitne pyaaz laaye. Agar pyaaz ₹40 kilo bik raha hai, to truck kiraye pe lekar sab le aana faayde ka hai. ₹5 kilo par shayad woh godown mein rakh le ya fasal hi na kaate. Daam zyada, supply zyada, isliye supply curve upar ki taraf jaata hai. Ab bemausam baarish fasal kharab kar de: har daam par pyaaz kam. Yeh curve par chalna nahi hai; poora supply curve left shift ho jaata hai.',
          hi: 'सोचिए नासिक के पास एक किसान तय कर रहा है कि मंडी में कितने प्याज़ लाए। अगर प्याज़ ₹40 किलो बिक रहा है, तो ट्रक किराए पर लेकर सब ले आना फ़ायदे का है। ₹5 किलो पर शायद वह गोदाम में रख ले या फ़सल ही न काटे। दाम ज़्यादा, आपूर्ति (supply) ज़्यादा, इसलिए पूर्ति वक्र (supply curve) ऊपर की ओर जाता है। अब बेमौसम बारिश फ़सल ख़राब कर दे: हर दाम पर प्याज़ कम। यह वक्र पर चलना नहीं है; पूरा पूर्ति वक्र बाईं ओर खिसक जाता है।',
          ta: 'நாசிக் அருகே ஒரு விவசாயி mandi-க்கு எவ்வளவு வெங்காயம் கொண்டு வரலாம் என்று யோசிக்கிறார் என்று நினைத்துப் பாருங்கள். வெங்காயம் கிலோ ₹40-க்கு விற்றால், லாரி வாடகைக்கு எடுத்து எல்லாவற்றையும் கொண்டு வருவது லாபம். கிலோ ₹5 என்றால், godown-இல் வைத்துவிடலாம் அல்லது அறுவடையே செய்யாமல் விடலாம். விலை அதிகம், supply அதிகம், அதனால் supply curve மேல்நோக்கிச் செல்கிறது. இப்போது பருவம் தவறிய மழை பயிரைக் கெடுத்தால்: எல்லா விலையிலும் வெங்காயம் குறைவு. இது curve-இல் நகர்வது இல்லை; முழு supply curve-உம் இடப்பக்கம் shift ஆகிறது.',
          bn: 'ভাবো নাসিকের কাছে এক চাষি ঠিক করছেন মান্ডিতে কত পেঁয়াজ আনবেন। পেঁয়াজ যদি ₹40 কেজি বিকোয়, তাহলে ট্রাক ভাড়া করে সবটা নিয়ে আসা লাভজনক। ₹5 কেজিতে হয়তো তিনি গুদামে রেখে দেবেন বা ফসলই তুলবেন না। দাম বেশি, জোগান (supply) বেশি, তাই supply curve ওপরের দিকে ওঠে। এবার অসময়ের বৃষ্টি ফসল নষ্ট করে দিল: প্রতিটা দামে পেঁয়াজ কম। এটা curve-এর ওপর চলা নয়; পুরো supply curve বাঁদিকে সরে যায় (shift)।',
        },
        concepts: [
          {
            label: 'Price up, quantity supplied up',
            groups: [PRICE, SUPPLY, MORE],
            note: 'Law of supply: price ↑ → quantity supplied ↑, because selling becomes more profitable.',
            hint: {
              en: 'Say the direction for sellers: at a higher price, is more or less supplied, and why?',
              hinglish: 'Bechne walon ke liye direction batao: zyada price par supply zyada ya kam, aur kyun?',
              hi: 'विक्रेताओं की दिशा बताइए: ज़्यादा दाम पर आपूर्ति ज़्यादा या कम, और क्यों?',
              ta: 'விற்பவர்களுக்கான திசையைச் சொல்லுங்கள்: விலை அதிகமானால் supply கூடுமா குறையுமா, ஏன்?',
              bn: 'বিক্রেতাদের দিকটা বলো: বেশি দামে জোগান বাড়ে না কমে, আর কেন?',
            },
          },
          {
            label: 'Upward-sloping supply curve',
            groups: [CURVE, SLOPE_UP],
            note: 'The supply curve slopes upward from left to right.',
            hint: {
              en: 'Which way does the supply curve slope?',
              hinglish: 'Supply curve kis taraf jaata hai?',
              hi: 'पूर्ति वक्र किस ओर जाता है?',
              ta: 'Supply curve எந்தப் பக்கம் செல்கிறது?',
              bn: 'Supply curve কোন দিকে ওঠে?',
            },
          },
          {
            label: 'Costs, technology and weather shift supply',
            groups: [SUPPLY_SHIFT],
            note: 'Costs, technology and weather shift the supply curve (bad monsoon → left; cheaper inputs → right).',
            hint: {
              en: 'Name something that shifts supply, like a bad monsoon or cheaper fertiliser.',
              hinglish: 'Supply shift karne wali koi cheez batao, jaise kharab monsoon ya sasta khaad.',
              hi: 'आपूर्ति खिसकाने वाली कोई चीज़ बताइए, जैसे ख़राब मानसून या सस्ती खाद।',
              ta: 'Supply-ஐ shift செய்யும் ஒன்றைச் சொல்லுங்கள், மோசமான பருவமழை அல்லது மலிவான உரம் போல.',
              bn: 'জোগান সরিয়ে দেয় এমন কিছু বলো, যেমন খারাপ বর্ষা বা সস্তা সার।',
            },
          },
        ],
        misconceptions: [
          {
            phrases: ['price badhne par supply kam', 'price badhe to supply kam', 'higher price less supply', 'price increases supply decreases', 'price up supply down',
              'दाम बढ़ने पर आपूर्ति कम', 'விலை ஏறினால் supply குறையும்', 'দাম বাড়লে জোগান কমে'],
            fix: {
              en: 'A higher price makes selling more profitable, so sellers supply MORE.',
              hinglish: 'Zyada price par bechna zyada faayde ka hai, isliye seller ZYADA supply karte hain.',
              hi: 'ज़्यादा दाम पर बेचना ज़्यादा फ़ायदेमंद है, इसलिए विक्रेता ज़्यादा आपूर्ति करते हैं।',
              ta: 'விலை அதிகமானால் விற்பது லாபம், அதனால் விற்பவர்கள் அதிகம் supply செய்வார்கள்.',
              bn: 'দাম বেশি হলে বেচা বেশি লাভজনক, তাই বিক্রেতারা বেশি জোগান দেয়।',
            },
          },
        ],
        examTip: 'Exam tip: separate a “change in quantity supplied” (movement) from a “change in supply” (shift).',
        samples: {
          hinglish: 'Law of supply mein price badhne par seller zyada supply karte hain kyunki zyada profit milta hai, isliye supply curve upar ki taraf jaata hai. Kharab monsoon ya baarish se fasal kam ho to supply curve left shift ho jaata hai, aur sasta khaad mile to right shift.',
          en: 'The law of supply says sellers bring more to the market when the price is higher, because they earn more profit, so the supply curve goes upward. A bad monsoon pushes the supply curve to the left, and cheaper fertiliser pushes it to the right.',
        },
      },
      {
        id: 'supply-3',
        title: 'Equilibrium, shortage and surplus',
        askTerm: 'equilibrium',
        text: 'The market reaches equilibrium where the demand and supply curves cross: at this price, the quantity buyers want equals the quantity sellers offer. If the price is set below equilibrium, buyers want more than sellers offer, creating a shortage, and competition among buyers pushes the price up. If the price is above equilibrium, sellers offer more than buyers want, creating a surplus, and sellers cut prices to clear their stock. When a bad harvest shifts supply left, the equilibrium price rises and the quantity traded falls.',
        explain: {
          en: 'Remember when onion prices shot past ₹100 a kilo? Bad rains shifted supply left. At the old price of ₹30, everyone still wanted onions, but there were not enough: a shortage. People were ready to pay more, so traders raised prices until the amount people wanted matched what was available. That meeting point is equilibrium. The reverse happens with tomatoes in a glut: too many in the mandi, a surplus, so prices crash until people buy them all.',
          hinglish: 'Yaad hai jab pyaaz ₹100 kilo ke paar chala gaya tha? Kharab baarish ne supply ko left shift kar diya. Purane ₹30 wale daam par sabko pyaaz chahiye tha, par utna tha hi nahi: shortage. Log zyada dene ko taiyaar the, to vyapaari daam badhate gaye jab tak logon ki demand aur available pyaaz barabar na ho gaye. Woh milne wala point hi equilibrium hai. Ulta tamatar ke saath hota hai jab mandi mein bahut aa jaate hain: surplus, to daam gir jaate hain jab tak sab bik na jaaye.',
          hi: 'याद है जब प्याज़ ₹100 किलो के पार चला गया था? ख़राब बारिश ने पूर्ति वक्र को बाईं ओर खिसका दिया। पुराने ₹30 वाले दाम पर सबको प्याज़ चाहिए था, पर उतना था ही नहीं: कमी (shortage)। लोग ज़्यादा देने को तैयार थे, तो व्यापारी दाम बढ़ाते गए जब तक माँग और उपलब्ध प्याज़ बराबर न हो गए। वही मिलन-बिंदु संतुलन (equilibrium) है। उल्टा टमाटर के साथ होता है जब मंडी में बहुत आ जाते हैं: आधिक्य (surplus), तो दाम गिरते हैं जब तक सब बिक न जाए।',
          ta: 'வெங்காய விலை கிலோ ₹100-ஐத் தாண்டியது நினைவிருக்கா? மோசமான மழை supply-ஐ இடப்பக்கம் shift செய்தது. பழைய ₹30 விலையில் எல்லோருக்கும் வெங்காயம் வேண்டும், ஆனால் அவ்வளவு இல்லை: shortage. மக்கள் அதிகம் கொடுக்கத் தயாராக இருந்ததால், demand-உம் கிடைக்கும் அளவும் சமமாகும் வரை வியாபாரிகள் விலையை ஏற்றினார்கள். அந்த சந்திப்புப் புள்ளிதான் equilibrium. Mandi-யில் தக்காளி அதிகமாக வந்தால் எதிர்மாறாக நடக்கும்: surplus, அதனால் எல்லாம் விற்கும் வரை விலை சரியும்.',
          bn: 'মনে আছে পেঁয়াজের দাম যখন কেজিতে ₹100 ছাড়িয়ে গিয়েছিল? খারাপ বৃষ্টি জোগানকে বাঁদিকে সরিয়ে দিয়েছিল। পুরোনো ₹30 দামে সবার পেঁয়াজ চাই, কিন্তু অত ছিলই না: ঘাটতি (shortage)। লোকে বেশি দিতে রাজি ছিল, তাই ব্যবসায়ীরা দাম বাড়াতে থাকলেন যতক্ষণ না চাহিদা আর জোগান সমান হলো। ওই মিলনবিন্দুই ভারসাম্য (equilibrium)। উল্টোটা হয় টমেটোর বেলায়, যখন মান্ডিতে অনেক এসে পড়ে: উদ্বৃত্ত (surplus), তাই সব বিক্রি না হওয়া পর্যন্ত দাম পড়তে থাকে।',
        },
        concepts: [
          {
            label: 'Equilibrium: where the curves meet',
            groups: [EQUILIBRIUM, EQUAL_MEET],
            note: 'Equilibrium: where the demand and supply curves intersect, so quantity demanded = quantity supplied.',
            hint: {
              en: 'Where do the two curves meet, and what is equal there?',
              hinglish: 'Dono curves kahan milte hain, aur wahan kya barabar hota hai?',
              hi: 'दोनों वक्र कहाँ मिलते हैं, और वहाँ क्या बराबर होता है?',
              ta: 'இரண்டு curve-களும் எங்கே சந்திக்கின்றன, அங்கே எது சமம்?',
              bn: 'দুটো curve কোথায় মেলে, আর সেখানে কী সমান?',
            },
          },
          {
            label: 'Below equilibrium: shortage',
            groups: [SHORTAGE],
            note: 'Price below equilibrium → shortage → the price is pushed up.',
            hint: {
              en: 'What happens when the price is below equilibrium? Use the onion example.',
              hinglish: 'Price equilibrium se neeche ho to kya hota hai? Pyaaz wala example lo.',
              hi: 'दाम संतुलन से नीचे हो तो क्या होता है? प्याज़ वाला उदाहरण लीजिए।',
              ta: 'விலை equilibrium-க்குக் கீழே இருந்தால் என்ன ஆகும்? வெங்காய உதாரணத்தைப் பயன்படுத்துங்கள்.',
              bn: 'দাম ভারসাম্যের নিচে থাকলে কী হয়? পেঁয়াজের উদাহরণটা নাও।',
            },
          },
          {
            label: 'Above equilibrium: surplus',
            groups: [SURPLUS],
            note: 'Price above equilibrium → surplus → sellers cut prices.',
            hint: {
              en: 'And above equilibrium? Think of tomatoes flooding the mandi.',
              hinglish: 'Aur equilibrium se upar? Mandi mein bhare tamatar socho.',
              hi: 'और संतुलन से ऊपर? मंडी में भरे टमाटर सोचिए।',
              ta: 'Equilibrium-க்கு மேலே? Mandi-யில் குவிந்த தக்காளியை நினையுங்கள்.',
              bn: 'আর ভারসাম্যের ওপরে? মান্ডিতে উপচে পড়া টমেটোর কথা ভাবো।',
            },
          },
        ],
        misconceptions: [
          {
            phrases: ['shortage se price kam', 'shortage mein price kam', 'shortage price falls', 'shortage makes price fall', 'shortage lowers price', 'shortage me price girta',
              'कमी में दाम घट', 'कमी से दाम कम', 'shortage ஆல் விலை குறை', 'ঘাটতিতে দাম কমে'],
            fix: {
              en: 'A shortage pushes the price UP, because buyers compete for too few goods.',
              hinglish: 'Shortage mein price BADHTA hai, kyunki kam maal ke liye kharidaar hode karte hain.',
              hi: 'कमी में दाम बढ़ता है, क्योंकि कम माल के लिए ख़रीदार होड़ करते हैं।',
              ta: 'Shortage விலையை ஏற்றும், ஏனெனில் குறைந்த பொருளுக்காக வாங்குபவர்கள் போட்டியிடுவார்கள்.',
              bn: 'ঘাটতিতে দাম বাড়ে, কারণ কম জিনিসের জন্য ক্রেতারা কাড়াকাড়ি করে।',
            },
          },
        ],
        examTip: 'Exam tip: when supply shifts left, equilibrium price rises and equilibrium quantity falls. Draw both curves.',
        samples: {
          hinglish: 'Equilibrium woh point hai jahan demand aur supply curve milte hain, yaani demand aur supply barabar. Agar price equilibrium se neeche ho to shortage hoti hai aur price upar jaata hai, jaise pyaaz ke time hua. Agar price upar ho to surplus hota hai, jaise mandi mein zyada tamatar, aur price girta hai.',
          en: 'Equilibrium is the point where the demand and supply curves meet, so what people want to buy equals what sellers bring. If the price is too low there is a shortage and the price climbs, like onions that year. If the price is too high there is a surplus, like tomatoes piling up in the mandi, and the price drops.',
        },
      },
    ],
  },
];

export function findChapter(id, custom = []) {
  return CHAPTERS.find((c) => c.id === id) || custom.find((c) => c.id === id) || null;
}

/** Every glossary entry across built-in chapters, for questions about another chapter's terms. */
export function allGlossary(custom = []) {
  return [...CHAPTERS, ...custom].flatMap((c) => c.glossary.map((g) => ({ ...g, chapterId: c.id })));
}

export function totalSections(custom = []) {
  return [...CHAPTERS, ...custom].reduce((n, c) => n + c.sections.length, 0);
}
