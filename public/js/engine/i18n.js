// Everything BolkeSeekho says, in five languages. Hindi avoids gendered first-person
// verbs so the voice can be any gender; Hinglish uses Roman script, as students type it.

export const LANG_ORDER = ['hinglish', 'hi', 'ta', 'bn', 'en'];

export const LANG_META = {
  hinglish: { label: 'Hinglish', native: 'Hinglish', speech: 'hi-IN', voices: ['en-IN', 'hi-IN'] },
  hi: { label: 'Hindi', native: 'हिंदी', speech: 'hi-IN', voices: ['hi-IN'] },
  ta: { label: 'Tamil', native: 'தமிழ்', speech: 'ta-IN', voices: ['ta-IN', 'ta-LK', 'ta-MY', 'ta'] },
  bn: { label: 'Bengali', native: 'বাংলা', speech: 'bn-IN', voices: ['bn-IN', 'bn-BD', 'bn'] },
  en: { label: 'English', native: 'English', speech: 'en-IN', voices: ['en-IN', 'en-GB', 'en-US', 'en'] },
};

const T = {
  askLanguage: {
    en: 'Which language do you think in? Say Hindi, Hinglish, Tamil, Bengali or English.',
  },
  welcome: {
    en: 'Great! Answers will come in simple English. Say “open thermodynamics” to begin, or “help” any time.',
    hinglish: 'Badhiya! Ab se jawab Hinglish mein milenge. Shuru karne ke liye bolo “open thermodynamics”, ya kabhi bhi “help”.',
    hi: 'बढ़िया! अब से जवाब हिंदी में मिलेंगे। शुरू करने के लिए कहिए “thermodynamics खोलो”, या कभी भी “मदद”।',
    ta: 'சூப்பர்! இனி பதில்கள் தமிழில் வரும். தொடங்க “thermodynamics திற” என்று சொல்லுங்கள்; எப்போது வேண்டுமானாலும் “உதவி” என்று கேளுங்கள்.',
    bn: 'দারুণ! এখন থেকে উত্তর আসবে বাংলায়। শুরু করতে বলো “thermodynamics খোলো”, আর যেকোনো সময় “সাহায্য”।',
  },
  welcomeBack: {
    en: 'Welcome back! Pick a chapter, or say “my notes”.',
    hinglish: 'Welcome back! Chapter chuno, ya bolo “my notes”.',
    hi: 'फिर से स्वागत है! अध्याय चुनिए, या कहिए “नोट्स”।',
    ta: 'மீண்டும் வருக! ஒரு chapter-ஐத் தேர்ந்தெடுங்கள், அல்லது “notes” என்று சொல்லுங்கள்.',
    bn: 'আবার স্বাগত! একটা chapter বেছে নাও, অথবা বলো “নোটস”।',
  },
  library: {
    en: 'Pick a chapter: thermodynamics, recursion, or supply and demand. Just say its name.',
    hinglish: 'Chapter chuno: thermodynamics, recursion, ya supply and demand. Bas naam bolo.',
    hi: 'अध्याय चुनिए: thermodynamics, recursion, या supply and demand। बस नाम बोलिए।',
    ta: 'ஒரு chapter-ஐத் தேர்ந்தெடுங்கள்: thermodynamics, recursion, அல்லது supply and demand. பெயரைச் சொன்னால் போதும்.',
    bn: 'একটা chapter বেছে নাও: thermodynamics, recursion, অথবা supply and demand। শুধু নামটা বলো।',
  },
  opened: {
    en: '{chapter}. Section {n} of {total}: {title}. Say “explain”, “read it”, or “test me”.',
    hinglish: '{chapter} khul gaya. Section {n} of {total}: {title}. Bolo “explain karo”, “padh ke sunao”, ya “test me”.',
    hi: '{chapter} खुल गया। Section {n}/{total}: {title}। कहिए “समझाओ”, “पढ़कर सुनाओ”, या “मेरा टेस्ट लो”।',
    ta: '{chapter} திறந்தது. Section {n}/{total}: {title}. “விளக்கு”, “படிச்சு காட்டு”, அல்லது “test me” என்று சொல்லுங்கள்.',
    bn: '{chapter} খুলেছে। Section {n}/{total}: {title}। বলো “বোঝাও”, “পড়ে শোনাও”, অথবা “test me”।',
  },
  section: {
    en: 'Section {n} of {total}: {title}.',
    hinglish: 'Section {n} of {total}: {title}.',
    hi: 'Section {n}/{total}: {title}।',
    ta: 'Section {n}/{total}: {title}.',
    bn: 'Section {n}/{total}: {title}।',
  },
  lastSection: {
    en: 'That was the last section. Say “test me”, or “chapters” to pick another one.',
    hinglish: 'Yeh last section tha. Bolo “test me”, ya doosra chapter chunne ke liye “chapters”.',
    hi: 'यह आख़िरी section था। कहिए “मेरा टेस्ट लो”, या दूसरा अध्याय चुनने के लिए “सारे अध्याय”।',
    ta: 'இதுதான் கடைசி section. “test me” என்று சொல்லுங்கள், அல்லது வேறு chapter-க்கு “chapters”.',
    bn: 'এটাই শেষ section। বলো “test me”, অথবা অন্য chapter বাছতে “সব chapter”।',
  },
  firstSection: {
    en: 'You are already on the first section.',
    hinglish: 'Aap pehle se first section par ho.',
    hi: 'आप पहले से पहले section पर हैं।',
    ta: 'நீங்கள் ஏற்கனவே முதல் section-இல் இருக்கிறீர்கள்.',
    bn: 'তুমি এখন প্রথম section-এই আছো।',
  },
  noChapter: {
    en: 'Open a chapter first. Say “open thermodynamics”.',
    hinglish: 'Pehle ek chapter kholo. Bolo “open thermodynamics”.',
    hi: 'पहले एक अध्याय खोलिए। कहिए “thermodynamics खोलो”।',
    ta: 'முதலில் ஒரு chapter-ஐத் திறங்கள். “thermodynamics திற” என்று சொல்லுங்கள்.',
    bn: 'আগে একটা chapter খোলো। বলো “thermodynamics খোলো”।',
  },
  reading: {
    en: 'Section {n}, in English.',
    hinglish: 'Section {n}, English mein suniye.',
    hi: 'Section {n}, अंग्रेज़ी में सुनिए।',
    ta: 'Section {n}, ஆங்கிலத்தில் கேளுங்கள்.',
    bn: 'Section {n}, ইংরেজিতে শোনো।',
  },
  feynmanPrompt: {
    en: 'Your turn! Explain “{title}” in your own words, as if teaching a friend. Speak whenever you are ready.',
    hinglish: 'Ab tumhari baari! “{title}” apne shabdon mein samjhao, jaise kisi dost ko padha rahe ho. Jab ready ho, bolna shuru karo.',
    hi: 'अब आपकी बारी! “{title}” अपने शब्दों में समझाइए, जैसे किसी दोस्त को पढ़ा रहे हों। जब तैयार हों, बोलना शुरू कीजिए।',
    ta: 'இப்போது உங்கள் முறை! “{title}”-ஐ ஒரு நண்பருக்குச் சொல்லிக்கொடுப்பது போல உங்கள் சொந்த வார்த்தைகளில் விளக்குங்கள். தயாரானதும் பேசத் தொடங்குங்கள்.',
    bn: 'এবার তোমার পালা! “{title}” নিজের ভাষায় বোঝাও, যেন কোনো বন্ধুকে পড়াচ্ছ। তৈরি হলে বলা শুরু করো।',
  },
  readbackHeard: {
    en: 'I heard these key terms: {terms}.',
    hinglish: 'Maine yeh key terms sune: {terms}.',
    hi: 'मैंने ये मुख्य शब्द सुने: {terms}।',
    ta: 'நான் கேட்ட முக்கிய சொற்கள்: {terms}.',
    bn: 'আমি এই key term-গুলো শুনলাম: {terms}।',
  },
  readbackAsk: {
    en: 'Did I hear you right? Say “yes” to grade, or “no” to fix a word.',
    hinglish: 'Sahi suna? Grade ke liye “haan” bolo, ya kisi word ko theek karne ke liye “nahi”.',
    hi: 'क्या सही सुना? जाँच के लिए “हाँ” कहिए, या कोई शब्द ठीक करने के लिए “नहीं”।',
    ta: 'சரியாகக் கேட்டேனா? மதிப்பிட “ஆமா” என்று சொல்லுங்கள், ஒரு சொல்லைத் திருத்த “இல்லை”.',
    bn: 'ঠিক শুনেছি? Grade করতে বলো “হ্যাঁ”, আর কোনো শব্দ ঠিক করতে “না”।',
  },
  noSample: {
    en: 'There is no sample answer for this section. Try explaining it yourself!',
    hinglish: 'Is section ka sample answer nahi hai. Khud samjhane ki koshish karo!',
    hi: 'इस section का सैंपल जवाब नहीं है। ख़ुद समझाने की कोशिश कीजिए!',
    ta: 'இந்த section-க்கு sample answer இல்லை. நீங்களே விளக்கிப் பாருங்கள்!',
    bn: 'এই section-এর কোনো sample answer নেই। নিজেই বুঝিয়ে দেখো!',
  },
  readbackNone: {
    en: 'I could not catch any key terms from this section. Say “yes” to grade anyway, or explain again using the key words.',
    hinglish: 'Mujhe is section ka koi key term sunai nahi diya. Phir bhi grade karna hai to “haan” bolo, ya key words ke saath dobara samjhao.',
    hi: 'मुझे इस section का कोई मुख्य शब्द सुनाई नहीं दिया। फिर भी जाँच करनी हो तो “हाँ” कहिए, या मुख्य शब्दों के साथ दोबारा समझाइए।',
    ta: 'இந்த section-இன் முக்கிய சொற்கள் எதுவும் எனக்குக் கேட்கவில்லை. இருந்தாலும் மதிப்பிட “ஆமா” என்று சொல்லுங்கள், அல்லது முக்கிய சொற்களுடன் மீண்டும் விளக்குங்கள்.',
    bn: 'এই section-এর কোনো key term আমি ধরতে পারিনি। তবুও grade করতে চাইলে বলো “হ্যাঁ”, অথবা key word-গুলো দিয়ে আবার বোঝাও।',
  },
  unsure: {
    en: 'Not sure about: {unsure}',
    hinglish: 'Yeh pakka nahi: {unsure}',
    hi: 'इस पर पक्का नहीं: {unsure}',
    ta: 'இதில் உறுதியில்லை: {unsure}',
    bn: 'এটায় নিশ্চিত নই: {unsure}',
  },
  unsureItem: {
    en: '“{heard}”, did you mean {term}?',
    hinglish: '“{heard}”, kya aapka matlab {term} tha?',
    hi: '“{heard}”, क्या आपका मतलब {term} था?',
    ta: '“{heard}”, நீங்கள் சொன்னது {term}-ஆ?',
    bn: '“{heard}”, তুমি কি {term} বলতে চেয়েছিলে?',
  },
  fixPrompt: {
    en: 'No problem. Say just the word I got wrong, or say “grade” to skip it. Unclear words never cost you marks.',
    hinglish: 'Koi baat nahi. Bas woh word bolo jo maine galat suna, ya skip karne ke liye “grade” bolo. Unclear words ke marks kabhi nahi katte.',
    hi: 'कोई बात नहीं। बस वह शब्द बोलिए जो मैंने गलत सुना, या छोड़ने के लिए “grade” कहिए। अस्पष्ट शब्दों के नंबर कभी नहीं कटते।',
    ta: 'பரவாயில்லை. நான் தவறாகக் கேட்ட சொல்லை மட்டும் சொல்லுங்கள், அல்லது தவிர்க்க “grade” என்று சொல்லுங்கள். தெளிவில்லாத சொற்களுக்கு மதிப்பெண் குறையாது.',
    bn: 'কোনো ব্যাপার না। যে শব্দটা ভুল শুনেছি শুধু সেটা বলো, অথবা বাদ দিতে বলো “grade”। অস্পষ্ট শব্দের জন্য কখনো নম্বর কাটা যায় না।',
  },
  fixed: {
    en: 'Got it: {terms}. Grading now.',
    hinglish: 'Theek hai: {terms}. Ab grading shuru.',
    hi: 'ठीक है: {terms}। अब जाँच शुरू।',
    ta: 'சரி: {terms}. இப்போது மதிப்பிடுகிறேன்.',
    bn: 'ঠিক আছে: {terms}। এবার grade করছি।',
  },
  fixNone: {
    en: 'I still could not match that to a key term, so I will grade without it. Unclear words never cost you marks.',
    hinglish: 'Yeh bhi kisi key term se match nahi hua, isliye uske bina grade karte hain. Unclear words ke marks nahi katte.',
    hi: 'यह भी किसी मुख्य शब्द से मेल नहीं खाया, इसलिए उसके बिना जाँच करते हैं। अस्पष्ट शब्दों के नंबर नहीं कटते।',
    ta: 'இதையும் எந்த முக்கிய சொல்லுடனும் பொருத்த முடியவில்லை, அதனால் அது இல்லாமல் மதிப்பிடுகிறேன். தெளிவில்லாத சொற்களுக்கு மதிப்பெண் குறையாது.',
    bn: 'এটাও কোনো key term-এর সঙ্গে মেলাতে পারলাম না, তাই ওটা বাদ দিয়ে grade করছি। অস্পষ্ট শব্দের জন্য নম্বর কাটা যায় না।',
  },
  grading: {
    en: 'Checking your explanation…',
    hinglish: 'Tumhara explanation check ho raha hai…',
    hi: 'आपकी व्याख्या जाँची जा रही है…',
    ta: 'உங்கள் விளக்கத்தைச் சரிபார்க்கிறேன்…',
    bn: 'তোমার ব্যাখ্যা দেখছি…',
  },
  pass: {
    en: '{score} out of 10. Well done! You got right: {right}. {gap} I saved exam-ready English notes. Say “next” to continue.',
    hinglish: '10 mein se {score}. Shabaash! Sahi bataya: {right}. {gap} Exam-ready English notes save ho gaye. Aage badhne ke liye “next” bolo.',
    hi: '10 में से {score}। शाबाश! आपने सही बताया: {right}। {gap} परीक्षा के लिए अंग्रेज़ी नोट्स सेव हो गए। आगे बढ़ने के लिए “अगला” कहिए।',
    ta: '10-க்கு {score}. அருமை! நீங்கள் சரியாகச் சொன்னவை: {right}. {gap} தேர்வுக்கான English notes சேமிக்கப்பட்டன. தொடர “அடுத்து” என்று சொல்லுங்கள்.',
    bn: '10-এ {score}। দারুণ! ঠিক বলেছ: {right}। {gap} পরীক্ষার জন্য English notes সেভ হয়ে গেছে। এগোতে বলো “পরের”।',
  },
  fail: {
    en: '{score} out of 10. You got right: {right}. {gap} Say “try again”, or “explain again” to hear it once more.',
    hinglish: '10 mein se {score}. Sahi bataya: {right}. {gap} Bolo “try again”, ya ek baar aur sunne ke liye “phir se samjhao”.',
    hi: '10 में से {score}। आपने सही बताया: {right}। {gap} कहिए “फिर से कोशिश”, या एक बार और सुनने के लिए “फिर से समझाओ”।',
    ta: '10-க்கு {score}. நீங்கள் சரியாகச் சொன்னவை: {right}. {gap} “மறுபடியும் முயற்சி” என்று சொல்லுங்கள், அல்லது மீண்டும் கேட்க “மறுபடியும் விளக்கு”.',
    bn: '10-এ {score}। ঠিক বলেছ: {right}। {gap} বলো “আবার চেষ্টা”, অথবা আরেকবার শুনতে “আবার বোঝাও”।',
  },
  gapLine: {
    en: 'One gap: {gap}. Hint: {hint}',
    hinglish: 'Ek gap: {gap}. Hint: {hint}',
    hi: 'एक कमी: {gap}। संकेत: {hint}',
    ta: 'ஒரு குறை: {gap}. குறிப்பு: {hint}',
    bn: 'একটা ফাঁক: {gap}। ইঙ্গিত: {hint}',
  },
  checkThis: {
    en: 'Check this: {fix}',
    hinglish: 'Yeh check karo: {fix}',
    hi: 'इसे जाँचिए: {fix}',
    ta: 'இதைச் சரிபாருங்கள்: {fix}',
    bn: 'এটা দেখে নাও: {fix}',
  },
  allCovered: {
    en: 'You covered every key idea.',
    hinglish: 'Tumne saare key ideas cover kar liye.',
    hi: 'आपने सारे मुख्य विचार कवर कर लिए।',
    ta: 'எல்லா முக்கியக் கருத்துகளையும் சொல்லிவிட்டீர்கள்.',
    bn: 'তুমি সব মূল ধারণাই বলেছ।',
  },
  nothingYet: {
    en: 'not much yet',
    hinglish: 'abhi zyada kuch nahi',
    hi: 'अभी ज़्यादा कुछ नहीं',
    ta: 'இன்னும் அதிகம் இல்லை',
    bn: 'এখনও তেমন কিছু নয়',
  },
  tooShort: {
    en: 'That was very short. Explain it like you are teaching a friend, in two or three sentences.',
    hinglish: 'Yeh bahut chhota tha. Dost ko padhane ki tarah do-teen sentences mein samjhao.',
    hi: 'यह बहुत छोटा था। दोस्त को पढ़ाने की तरह दो-तीन वाक्यों में समझाइए।',
    ta: 'இது ரொம்பச் சுருக்கமாக இருந்தது. நண்பருக்குச் சொல்லிக்கொடுப்பது போல இரண்டு மூன்று வாக்கியங்களில் விளக்குங்கள்.',
    bn: 'এটা খুব ছোট হলো। বন্ধুকে পড়ানোর মতো দু-তিনটে বাক্যে বোঝাও।',
  },
  copied: {
    en: 'That sounds like the textbook read aloud. Try your own words: that is where the learning happens.',
    hinglish: 'Yeh toh textbook padhne jaisa laga. Apne shabdon mein bolo, asli seekhna wahin hota hai.',
    hi: 'यह तो किताब पढ़कर सुनाने जैसा लगा। अपने शब्दों में बोलिए, असली सीखना वहीं होता है।',
    ta: 'இது பாடப்புத்தகத்தை வாசித்தது போல இருக்கிறது. உங்கள் சொந்த வார்த்தைகளில் சொல்லுங்கள், அங்கேதான் உண்மையான கற்றல் நடக்கிறது.',
    bn: 'এটা তো বই পড়ে শোনানোর মতো লাগল। নিজের ভাষায় বলো, আসল শেখা ওখানেই হয়।',
  },
  notUnderstood: {
    en: 'Sorry, I did not get that. Try “explain”, “next”, “test me” or “my notes”.',
    hinglish: 'Sorry, samajh nahi aaya. Try karo: “explain karo”, “next”, “test me” ya “my notes”.',
    hi: 'माफ़ कीजिए, समझ नहीं आया। कहिए: “समझाओ”, “अगला”, “मेरा टेस्ट लो” या “नोट्स”।',
    ta: 'மன்னிக்கவும், புரியவில்லை. “விளக்கு”, “அடுத்து”, “test me” அல்லது “notes” என்று சொல்லிப் பாருங்கள்.',
    bn: 'দুঃখিত, বুঝতে পারিনি। বলে দেখো: “বোঝাও”, “পরের”, “test me” বা “নোটস”।',
  },
  notUnderstoodAgain: {
    en: 'Still not clear to me. The suggestions below show what you can say, or say “help”.',
    hinglish: 'Abhi bhi clear nahi hua. Neeche wale suggestions dekho, ya “help” bolo.',
    hi: 'अब भी साफ़ नहीं हुआ। नीचे दिए सुझाव देखिए, या “मदद” कहिए।',
    ta: 'இன்னும் புரியவில்லை. கீழே உள்ள பரிந்துரைகளைப் பாருங்கள், அல்லது “உதவி” என்று சொல்லுங்கள்.',
    bn: 'এখনও পরিষ্কার হলো না। নিচের পরামর্শগুলো দেখো, অথবা বলো “সাহায্য”।',
  },
  noise: {
    en: 'I could not hear that clearly. It may be noisy around you. Please say it again, a little closer to the mic.',
    hinglish: 'Saaf sunai nahi diya, shayad aas-paas shor hai. Mic ke thoda paas aakar phir se bolo.',
    hi: 'साफ़ सुनाई नहीं दिया, शायद आसपास शोर है। माइक के थोड़ा पास आकर फिर से बोलिए।',
    ta: 'தெளிவாகக் கேட்கவில்லை, சுற்றி சத்தம் இருக்கலாம். Mic-க்கு கொஞ்சம் அருகில் வந்து மீண்டும் சொல்லுங்கள்.',
    bn: 'পরিষ্কার শুনতে পেলাম না, হয়তো আশেপাশে আওয়াজ। মাইকের একটু কাছে এসে আবার বলো।',
  },
  confirmAsr: {
    en: 'Did you say: “{heard}”? Say “yes”, or just say it again.',
    hinglish: 'Kya aapne kaha: “{heard}”? “Haan” bolo, ya phir se bolo.',
    hi: 'क्या आपने कहा: “{heard}”? “हाँ” कहिए, या फिर से बोलिए।',
    ta: 'நீங்கள் சொன்னது இதுவா: “{heard}”? “ஆமா” என்று சொல்லுங்கள், அல்லது மீண்டும் சொல்லுங்கள்.',
    bn: 'তুমি কি বললে: “{heard}”? বলো “হ্যাঁ”, অথবা আবার বলো।',
  },
  keyNotSet: {
    en: 'The AI key is not set, so open questions are off in this offline demo. Key terms still work. Try: “What is {example}?”',
    hinglish: 'AI key set nahi hai, isliye is offline demo mein open questions band hain. Key terms ka matlab phir bhi milega. Try karo: “{example} kya hai?”',
    hi: 'AI key सेट नहीं है, इसलिए इस ऑफ़लाइन डेमो में खुले सवाल बंद हैं। मुख्य शब्दों का मतलब फिर भी मिलेगा। कहिए: “{example} क्या है?”',
    ta: 'AI key அமைக்கப்படவில்லை, அதனால் இந்த offline demo-வில் திறந்த கேள்விகள் இயங்காது. முக்கிய சொற்களின் அர்த்தம் இன்னும் கிடைக்கும். “{example} என்றால் என்ன?” என்று கேளுங்கள்.',
    bn: 'AI key সেট করা নেই, তাই এই offline demo-তে খোলা প্রশ্ন বন্ধ। তবে key term-এর মানে পাবে। বলো: “{example} কী?”',
  },
  needsKeyExplain: {
    en: 'A simple-language explanation of your own text needs the AI key. Without it you can still say “read it” or “test me”.',
    hinglish: 'Apne text ka simple explanation AI key ke bina nahi milta. Bina key ke bhi: “padh ke sunao” ya “test me” bolo.',
    hi: 'अपने टेक्स्ट की आसान व्याख्या के लिए AI key चाहिए। बिना key के भी: “पढ़कर सुनाओ” या “मेरा टेस्ट लो” कहिए।',
    ta: 'உங்கள் சொந்த text-க்கு எளிய விளக்கம் பெற AI key தேவை. Key இல்லாமலும்: “படிச்சு காட்டு” அல்லது “test me” என்று சொல்லுங்கள்.',
    bn: 'নিজের text-এর সহজ ব্যাখ্যার জন্য AI key লাগবে। Key ছাড়াও বলতে পারো: “পড়ে শোনাও” বা “test me”।',
  },
  needsKeyDifferent: {
    en: 'A fresh example needs the AI key. Here is the built-in explanation again.',
    hinglish: 'Naya example AI key ke bina nahi milta. Yeh raha built-in explanation phir se.',
    hi: 'नया उदाहरण AI key के बिना नहीं मिलता। यह रही पहले वाली व्याख्या फिर से।',
    ta: 'புதிய உதாரணத்துக்கு AI key தேவை. இதோ உள்ளமைந்த விளக்கம் மீண்டும்.',
    bn: 'নতুন উদাহরণের জন্য AI key লাগবে। এই নাও আগের ব্যাখ্যাটা আবার।',
  },
  aiFailed: {
    en: 'The AI did not answer just now, so this is the offline version.',
    hinglish: 'AI ne abhi jawab nahi diya, isliye yeh offline version hai.',
    hi: 'AI ने अभी जवाब नहीं दिया, इसलिए यह ऑफ़लाइन तरीका है।',
    ta: 'AI இப்போது பதில் தரவில்லை, அதனால் இது offline முறை.',
    bn: 'AI এখন উত্তর দিল না, তাই এটা offline পদ্ধতি।',
  },
  aiQuestionFailed: {
    en: 'The AI did not answer just now. Please try again in a moment.',
    hinglish: 'AI ne abhi jawab nahi diya. Thodi der mein phir try karo.',
    hi: 'AI ने अभी जवाब नहीं दिया। थोड़ी देर में फिर कोशिश कीजिए।',
    ta: 'AI இப்போது பதில் தரவில்லை. சிறிது நேரத்தில் மீண்டும் முயலுங்கள்.',
    bn: 'AI এখন উত্তর দিল না। একটু পরে আবার চেষ্টা করো।',
  },
  thinking: {
    en: 'One second…',
    hinglish: 'Ek second…',
    hi: 'एक सेकंड…',
    ta: 'ஒரு நொடி…',
    bn: 'এক সেকেন্ড…',
  },
  notes: {
    en: 'You have {count} revision notes on screen. Say “read notes” to hear them.',
    hinglish: 'Tumhare {count} revision notes screen par hain. Sunne ke liye “read notes” bolo.',
    hi: 'आपके {count} रिवीज़न नोट्स स्क्रीन पर हैं। सुनने के लिए “नोट्स पढ़ो” कहिए।',
    ta: 'உங்களிடம் {count} revision notes திரையில் உள்ளன. கேட்க “notes படி” என்று சொல்லுங்கள்.',
    bn: 'তোমার {count}টা revision note স্ক্রিনে আছে। শুনতে বলো “নোট পড়ো”।',
  },
  noNotes: {
    en: 'No notes yet. Score 7 or more in a Feynman Check and your first notes appear here.',
    hinglish: 'Abhi koi notes nahi. Feynman Check mein 7 ya zyada lao, pehle notes yahan aa jayenge.',
    hi: 'अभी कोई नोट्स नहीं। Feynman Check में 7 या ज़्यादा लाइए, पहले नोट्स यहाँ दिखेंगे।',
    ta: 'இன்னும் notes இல்லை. Feynman Check-இல் 7 அல்லது அதற்கு மேல் வாங்குங்கள், முதல் notes இங்கே வரும்.',
    bn: 'এখনও কোনো নোট নেই। Feynman Check-এ 7 বা তার বেশি পেলে প্রথম নোট এখানে আসবে।',
  },
  languageSwitched: {
    en: 'Okay, answers will now be in {lang}.',
    hinglish: 'Theek hai, ab jawab ki language: {lang}.',
    hi: 'ठीक है, अब जवाब की भाषा: {lang}।',
    ta: 'சரி, இனி பதில் மொழி: {lang}.',
    bn: 'ঠিক আছে, এখন থেকে উত্তরের ভাষা: {lang}।',
  },
  help: {
    en: 'You can say: “open recursion”, “explain in simple Hindi”, “read it”, “next”, “go back”, “what is entropy?”, “test me”, “my notes”, “slower”, or “stop”.',
    hinglish: 'Tum bol sakte ho: “open recursion”, “simple Hindi mein samjhao”, “padh ke sunao”, “next”, “peeche”, “entropy kya hai?”, “test me”, “my notes”, “dheere bolo”, ya “ruko”.',
    hi: 'आप कह सकते हैं: “recursion खोलो”, “आसान हिंदी में समझाओ”, “पढ़कर सुनाओ”, “अगला”, “पीछे”, “entropy क्या है?”, “मेरा टेस्ट लो”, “नोट्स”, “धीरे बोलो”, या “रुको”।',
    ta: 'நீங்கள் சொல்லலாம்: “recursion திற”, “எளிய தமிழில் விளக்கு”, “படிச்சு காட்டு”, “அடுத்து”, “முந்தைய”, “entropy என்றால் என்ன?”, “test me”, “notes”, “மெதுவா”, அல்லது “நிறுத்து”.',
    bn: 'তুমি বলতে পারো: “recursion খোলো”, “সহজ বাংলায় বোঝাও”, “পড়ে শোনাও”, “পরের”, “আগের”, “entropy কী?”, “test me”, “নোটস”, “আস্তে বলো”, বা “থামো”।',
  },
  slower: {
    en: 'Speaking slower.',
    hinglish: 'Ab dheere bolenge.',
    hi: 'अब धीरे बोलेंगे।',
    ta: 'இனி மெதுவாகப் பேசுகிறேன்.',
    bn: 'এবার আস্তে বলছি।',
  },
  faster: {
    en: 'Speaking faster.',
    hinglish: 'Ab thoda tez bolenge.',
    hi: 'अब थोड़ा तेज़ बोलेंगे।',
    ta: 'இனி கொஞ்சம் வேகமாகப் பேசுகிறேன்.',
    bn: 'এবার একটু তাড়াতাড়ি বলছি।',
  },
  progress: {
    en: 'You have mastered {mastered} of {total} sections. Streak: {streak} days.',
    hinglish: 'Tumne {total} mein se {mastered} sections master kar liye. Streak: {streak} din.',
    hi: 'आपने {total} में से {mastered} section पक्के कर लिए। लगातार: {streak} दिन।',
    ta: '{total} section-களில் {mastered} கற்றுக்கொண்டீர்கள். தொடர்ச்சி: {streak} நாட்கள்.',
    bn: '{total}টার মধ্যে {mastered}টা section শিখে ফেলেছ। টানা: {streak} দিন।',
  },
  cancelled: {
    en: 'Okay, back to the section.',
    hinglish: 'Theek hai, wapas section par.',
    hi: 'ठीक है, वापस section पर।',
    ta: 'சரி, மீண்டும் section-க்கு.',
    bn: 'ঠিক আছে, আবার section-এ।',
  },
  customSaved: {
    en: 'Added “{title}” with {n} sections. Say “read it”, or “test me” to be quizzed on its key words.',
    hinglish: '“{title}” add ho gaya, {n} sections ke saath. Bolo “padh ke sunao”, ya key words par quiz ke liye “test me”.',
    hi: '“{title}” जुड़ गया, {n} section के साथ। कहिए “पढ़कर सुनाओ”, या मुख्य शब्दों पर टेस्ट के लिए “मेरा टेस्ट लो”।',
    ta: '“{title}” சேர்க்கப்பட்டது, {n} section-களுடன். “படிச்சு காட்டு” அல்லது முக்கிய சொற்களில் quiz-க்கு “test me” என்று சொல்லுங்கள்.',
    bn: '“{title}” যোগ হলো, {n}টা section সহ। বলো “পড়ে শোনাও”, অথবা key word নিয়ে quiz-এর জন্য “test me”।',
  },
  noVoice: {
    en: 'No {lang} voice is installed in this browser, so replies are shown as text. Microsoft Edge includes Hindi, Tamil and Bengali voices.',
  },
  micDenied: {
    en: 'Microphone access is blocked. Use Wispr Flow, or allow the microphone from the address bar.',
  },
  micUnsupported: {
    en: 'This browser has no built-in speech recognition. Use Wispr Flow, or open BolkeSeekho in Chrome or Edge.',
  },
  micNetwork: {
    en: 'The browser speech service could not be reached. Wispr Flow or typing still work.',
  },
  heardAs: {
    en: '(I heard “{heard}”.)',
    hinglish: '(Maine suna “{heard}”.)',
    hi: '(मैंने सुना “{heard}”।)',
    ta: '(நான் கேட்டது “{heard}”.)',
    bn: '(আমি শুনলাম “{heard}”।)',
  },
};

export function t(key, lang = 'en', vars = {}) {
  const entry = T[key];
  if (!entry) return key;
  const template = entry[lang] ?? entry.en;
  return template.replace(/\{(\w+)\}/g, (_, k) => (vars[k] ?? '').toString());
}

export const hasTemplate = (key) => Boolean(T[key]);
export const TEMPLATE_KEYS = Object.keys(T);
export const templateLangs = (key) => Object.keys(T[key] || {});

/** Suggested phrases per screen. Each one is real input: tapping it is the same as saying it. */
const CHIPS = {
  onboarding: { en: ['Hinglish', 'हिंदी', 'தமிழ்', 'বাংলা', 'English'] },
  library: {
    en: ['Open thermodynamics', 'Open recursion', 'Open supply and demand', 'My notes', 'Help'],
    hinglish: ['Thermodynamics kholo', 'Recursion kholo', 'Supply and demand kholo', 'My notes', 'Help'],
    hi: ['Thermodynamics खोलो', 'Recursion खोलो', 'Supply and demand खोलो', 'नोट्स', 'मदद'],
    ta: ['Thermodynamics திற', 'Recursion திற', 'Supply and demand திற', 'Notes', 'உதவி'],
    bn: ['Thermodynamics খোলো', 'Recursion খোলো', 'Supply and demand খোলো', 'নোটস', 'সাহায্য'],
  },
  study: {
    en: ['Explain this simply', 'Read it aloud', 'What is {term}?', 'Next section', 'Test me'],
    hinglish: ['Simple mein samjhao', 'Padh ke sunao', '{term} kya hai?', 'Next section', 'Test me'],
    hi: ['आसान भाषा में समझाओ', 'पढ़कर सुनाओ', '{term} क्या है?', 'अगला section', 'मेरा टेस्ट लो'],
    ta: ['எளிமையா விளக்கு', 'படிச்சு காட்டு', '{term} என்றால் என்ன?', 'அடுத்த section', 'என்னை test பண்ணு'],
    bn: ['সহজ করে বোঝাও', 'পড়ে শোনাও', '{term} কী?', 'পরের section', 'আমার পরীক্ষা নাও'],
  },
  listen: {
    en: ['Use a sample answer', 'Sample with a mistake', 'Repeat the question', 'Cancel'],
    hinglish: ['Sample answer use karo', 'Galti wala sample', 'Question repeat karo', 'Cancel'],
    hi: ['सैंपल जवाब इस्तेमाल करो', 'गलती वाला सैंपल', 'सवाल दोहराओ', 'रद्द करो'],
    ta: ['Sample answer பயன்படுத்து', 'தவறு உள்ள sample', 'கேள்வியை மறுபடியும் சொல்லு', 'ரத்து செய்'],
    bn: ['Sample answer ব্যবহার করো', 'ভুল সহ sample', 'প্রশ্নটা আবার বলো', 'বাতিল করো'],
  },
  confirm: {
    en: ['Yes', 'No, fix a word', 'Grade it'],
    hinglish: ['Haan', 'Nahi, ek word theek karo', 'Grade karo'],
    hi: ['हाँ', 'नहीं, एक शब्द ठीक करो', 'जाँचो'],
    ta: ['ஆமா', 'இல்லை, ஒரு சொல்லைத் திருத்து', 'Grade பண்ணு'],
    bn: ['হ্যাঁ', 'না, একটা শব্দ ঠিক করো', 'Grade করো'],
  },
  fix: {
    en: ['Grade it'],
    hinglish: ['Grade karo'],
    hi: ['जाँचो'],
    ta: ['Grade பண்ணு'],
    bn: ['Grade করো'],
  },
  result: {
    en: ['Try again', 'Explain again', 'Next section', 'My notes'],
    hinglish: ['Try again', 'Phir se samjhao', 'Next section', 'My notes'],
    hi: ['फिर से कोशिश', 'फिर से समझाओ', 'अगला section', 'नोट्स'],
    ta: ['மறுபடியும் முயற்சி', 'மறுபடியும் விளக்கு', 'அடுத்த section', 'Notes'],
    bn: ['আবার চেষ্টা', 'আবার বোঝাও', 'পরের section', 'নোটস'],
  },
  notes: {
    en: ['Read my notes', 'Back to chapter', 'Chapters'],
    hinglish: ['Notes padh ke sunao', 'Wapas chapter par', 'Chapters'],
    hi: ['नोट्स पढ़ो', 'वापस अध्याय पर', 'सारे अध्याय'],
    ta: ['Notes படி', 'Chapter-க்குத் திரும்பு', 'Chapters'],
    bn: ['নোট পড়ো', 'Chapter-এ ফিরে যাও', 'সব chapter'],
  },
  paste: { en: ['Chapters', 'Help'] },
};

export function chipsFor(mode, lang = 'en', vars = {}) {
  const set = CHIPS[mode];
  if (!set) return [];
  return (set[lang] ?? set.en).map((s) => s.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? ''));
}
export const CHIP_MODES = Object.keys(CHIPS);
