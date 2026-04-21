(function registerArabicData() {
  const arabicStrokeSteps = {
    alif: ["Draw a straight vertical line from top to bottom."],
    ba: ["Sweep the bowl from the right toward the left."],
    jeem: [
      "Curve the body down and around from the upper right.",
      "Finish the short tail under the body."
    ],
    dal: ["Glide from the right and fall into a gentle hook."],
    ra: ["Start on the right, then drop into the descending tail."],
    seen: ["Make the three teeth moving right to left."],
    sad: ["Shape the broad bowl from the right into a fuller curve."],
    tah: ["Draw the looped body in one continuous motion."],
    ayn: [
      "Open the upper cup moving from the right toward the left.",
      "Finish with the lower hook."
    ],
    fa: ["Trace the rounded head of the letter.", "Add the short exit stroke on the right."],
    kaf: [
      "Pull the tall stem straight downward.",
      "Draw the arm that opens to the right.",
      "Finish with the small top flourish."
    ],
    lam: ["Draw the tall line and curl it slightly at the base."],
    meem: ["Make the rounded bowl first.", "Finish with the short tail on the right."],
    haa: ["Trace the looped body in one smooth turn.", "Close the inner bridge lightly."],
    waw: ["Curve down into the hanging comma shape."],
    ya: ["Sweep the body from the right toward the left with a slight tail."]
  };

  const strokeDemoFiles = {
    alif: "Arabic Alif.gif",
    ba: "Arabic Baa.gif",
    ta: "Arabic Ta.gif",
    tha: "Arabic Thaa.gif",
    jeem: "Arabic Jim.gif",
    "haa-deep": "Arabic Hah.gif",
    kha: "Arabic Kha.gif",
    dal: "Arabic Dal.gif",
    dhal: "Arabic Dhal.gif",
    ra: "Arabic Ra.gif",
    zay: "Arabic Zayin.gif",
    seen: "Arabic Sin.gif",
    sheen: "Arabic Šin.gif",
    sad: "Arabic Sad.gif",
    dad: "Arabic Dad.gif",
    "ta-heavy": "Arabic Taa.gif",
    zah: "Arabic Za.gif",
    ayn: "Arabic Ayn.gif",
    ghayn: "Arabic Ghain.gif",
    fa: "Arabic Fa.gif",
    qaf: "Arabic Qaf.gif",
    kaf: "Arabic Kaf.gif",
    lam: "Arabic Lam.gif",
    meem: "Arabic Mim.gif",
    noon: "Arabic Nun.gif",
    "ha-light": "Arabic Ha.gif",
    waw: "Arabic Waw.gif",
    ya: "Arabic Yaa.gif"
  };

  window.ScriptLearningData.SCRIPTS.arabic = {
    id: "arabic",
    name: "Arabic",
    headline: "Arabic Script Learning Studio",
    heroTitle: "Read it, match it, trace it.",
    heroText:
      "Practice the Arabic alphabet through fast sound matching, quick sound-choice drills, and guided tracing with browser playback.",
    countLabel: "28 core letters",
    sampleText: "ا ب ت ث ج",
    unitSingular: "letter",
    unitPlural: "letters",
    glyphFont: '"Amiri Local", "Noto Naskh Arabic", "Amiri", serif',
    fontLoad: '160px "Amiri Local"',
    textDirection: "rtl",
    speechLang: "ar",
    voiceHints: ["arab", "hoda", "naayf", "salma", "tarik", "maged", "mouna"],
    speechRate: 0.78,
    matchDescription: "Clear one Arabic letter-and-sound board as fast as you can.",
    traceDescription: "Trace isolated Arabic letters, replay stroke cues, and hear the sound.",
    traceBoardNote:
      "The board uses the actual Arabic glyph as the tracing target. Use the ordered steps on the right for stroke direction.",
    practiceNote:
      "Arabic tracing here is for recognition and early muscle memory. Use the live glyph plus the ordered tips rather than expecting formal calligraphy detail.",
    strokeCaption: "Open-source stroke animation reference from Wikimedia Commons.",
    strokeEmpty:
      "This script uses the ordered tips as the stroke guide when an animation is not available.",
    theme: {
      "bg-1": "#0f2424",
      "bg-2": "#1f4f4b",
      accent: "#d66d44",
      "accent-deep": "#a84d2d",
      gold: "#e6b85e",
      teal: "#1c6663"
    },
    strokeDemoFiles,
    letters: [
      { id: "alif", symbol: "ا", name: "Alif", nativeName: "ألف", soundLabel: "aa / a", soundHint: 'long "a" as in "father"', note: "A tall carrier letter used heavily for the long aa sound.", speechText: "أَ", strokeSteps: [...arabicStrokeSteps.alif] },
      { id: "ba", symbol: "ب", name: "Ba", nativeName: "باء", soundLabel: "b", soundHint: 'like "b" in "bat"', note: "This family starts with the same base body. The dot below makes it ba.", speechText: "بَ", strokeSteps: [...arabicStrokeSteps.ba, "Place the single dot below the body."] },
      { id: "ta", symbol: "ت", name: "Ta", nativeName: "تاء", soundLabel: "t", soundHint: 'like "t" in "tap"', note: "Ta shares ba's body, but its two dots sit above the letter.", speechText: "تَ", strokeSteps: [...arabicStrokeSteps.ba, "Place the first dot above the body.", "Place the second dot above the body."] },
      { id: "tha", symbol: "ث", name: "Tha", nativeName: "ثاء", soundLabel: "th", soundHint: 'like "th" in "thin"', note: "Tha uses the same body as ba and ta, but carries three dots above.", speechText: "ثَ", strokeSteps: [...arabicStrokeSteps.ba, "Place the first dot above.", "Place the second dot above the center.", "Place the third dot above."] },
      { id: "jeem", symbol: "ج", name: "Jeem", nativeName: "جيم", soundLabel: "j", soundHint: 'like "j" in "jam"', note: "Jeem curves into a bowl and takes one dot below.", speechText: "جَ", strokeSteps: [...arabicStrokeSteps.jeem, "Add the dot below the letter."] },
      { id: "haa-deep", symbol: "ح", name: "Ha", nativeName: "حاء", soundLabel: "h (deep)", soundHint: "a breathy h from the throat", note: "This deeper h sound shares jeem's body, but without any dot.", speechText: "حَ", strokeSteps: [...arabicStrokeSteps.jeem] },
      { id: "kha", symbol: "خ", name: "Kha", nativeName: "خاء", soundLabel: "kh", soundHint: 'like "Bach" or "loch"', note: "Kha uses the same body as jeem and deep ha, with one dot above.", speechText: "خَ", strokeSteps: [...arabicStrokeSteps.jeem, "Add the dot above the head."] },
      { id: "dal", symbol: "د", name: "Dal", nativeName: "دال", soundLabel: "d", soundHint: 'like "d" in "dog"', note: "Dal is a short, right-leaning hook with no dot.", speechText: "دَ", strokeSteps: [...arabicStrokeSteps.dal] },
      { id: "dhal", symbol: "ذ", name: "Dhal", nativeName: "ذال", soundLabel: "dh", soundHint: 'like "th" in "this"', note: "Dhal is dal with one dot above.", speechText: "ذَ", strokeSteps: [...arabicStrokeSteps.dal, "Add the dot above the hook."] },
      { id: "ra", symbol: "ر", name: "Ra", nativeName: "راء", soundLabel: "r", soundHint: "a tapped or rolled r", note: "Ra drops into a clean descending tail.", speechText: "رَ", strokeSteps: [...arabicStrokeSteps.ra] },
      { id: "zay", symbol: "ز", name: "Zay", nativeName: "زاي", soundLabel: "z", soundHint: 'like "z" in "zoo"', note: "Zay is ra with one dot above.", speechText: "زَ", strokeSteps: [...arabicStrokeSteps.ra, "Add the dot above the curve."] },
      { id: "seen", symbol: "س", name: "Seen", nativeName: "سين", soundLabel: "s", soundHint: 'like "s" in "sun"', note: "Seen is known for its three small teeth.", speechText: "سَ", strokeSteps: [...arabicStrokeSteps.seen] },
      { id: "sheen", symbol: "ش", name: "Sheen", nativeName: "شين", soundLabel: "sh", soundHint: 'like "sh" in "ship"', note: "Sheen is seen with three dots above the body.", speechText: "شَ", strokeSteps: [...arabicStrokeSteps.seen, "Place the first dot above.", "Place the middle dot above.", "Place the third dot above."] },
      { id: "sad", symbol: "ص", name: "Sad", nativeName: "صاد", soundLabel: "s (heavy)", soundHint: "an emphatic, heavier s", note: "Sad is a wide, emphatic version of the s sound.", speechText: "صَ", strokeSteps: [...arabicStrokeSteps.sad] },
      { id: "dad", symbol: "ض", name: "Dad", nativeName: "ضاد", soundLabel: "d (heavy)", soundHint: "an emphatic, heavier d", note: "Dad is the dotted partner of sad and uses one dot above.", speechText: "ضَ", strokeSteps: [...arabicStrokeSteps.sad, "Add the dot above the bowl."] },
      { id: "ta-heavy", symbol: "ط", name: "Ta Heavy", nativeName: "طاء", soundLabel: "t (heavy)", soundHint: "an emphatic, heavier t", note: "The emphatic ta has a fuller, looped body.", speechText: "طَ", strokeSteps: [...arabicStrokeSteps.tah] },
      { id: "zah", symbol: "ظ", name: "Zha", nativeName: "ظاء", soundLabel: "z (heavy)", soundHint: "an emphatic, heavier z", note: "Zha shares the heavy ta body and adds one dot above.", speechText: "ظَ", strokeSteps: [...arabicStrokeSteps.tah, "Add the dot above the loop."] },
      { id: "ayn", symbol: "ع", name: "Ayn", nativeName: "عين", soundLabel: "ʿ", soundHint: "a deep throat sound", note: "Ayn opens with a cup shape and closes with a lower hook.", speechText: "عَ", strokeSteps: [...arabicStrokeSteps.ayn] },
      { id: "ghayn", symbol: "غ", name: "Ghayn", nativeName: "غين", soundLabel: "gh", soundHint: "a gargled gh sound", note: "Ghayn is ayn with one dot above.", speechText: "غَ", strokeSteps: [...arabicStrokeSteps.ayn, "Add the dot above the letter."] },
      { id: "fa", symbol: "ف", name: "Fa", nativeName: "فاء", soundLabel: "f", soundHint: 'like "f" in "fan"', note: "Fa has a rounded head and one dot above.", speechText: "فَ", strokeSteps: [...arabicStrokeSteps.fa, "Add the dot above the head."] },
      { id: "qaf", symbol: "ق", name: "Qaf", nativeName: "قاف", soundLabel: "q", soundHint: "a deeper k from the throat", note: "Qaf uses a similar rounded head to fa, but with two dots above.", speechText: "قَ", strokeSteps: [...arabicStrokeSteps.fa, "Add the first dot above.", "Add the second dot above."] },
      { id: "kaf", symbol: "ك", name: "Kaf", nativeName: "كاف", soundLabel: "k", soundHint: 'like "k" in "kite"', note: "Kaf combines a vertical stem with a small arm and upper flourish.", speechText: "كَ", strokeSteps: [...arabicStrokeSteps.kaf] },
      { id: "lam", symbol: "ل", name: "Lam", nativeName: "لام", soundLabel: "l", soundHint: 'like "l" in "lamp"', note: "Lam is tall like alif, but it finishes with a softer curve.", speechText: "لَ", strokeSteps: [...arabicStrokeSteps.lam] },
      { id: "meem", symbol: "م", name: "Meem", nativeName: "ميم", soundLabel: "m", soundHint: 'like "m" in "moon"', note: "Meem forms a rounded loop with a short finishing tail.", speechText: "مَ", strokeSteps: [...arabicStrokeSteps.meem] },
      { id: "noon", symbol: "ن", name: "Noon", nativeName: "نون", soundLabel: "n", soundHint: 'like "n" in "neat"', note: "Noon uses the ba family body, but its dot sits above.", speechText: "نَ", strokeSteps: [...arabicStrokeSteps.ba, "Add the single dot above the body."] },
      { id: "ha-light", symbol: "ه", name: "Ha Light", nativeName: "هاء", soundLabel: "h (light)", soundHint: 'like "h" in "hat"', note: "This lighter h is drawn as a rounded loop with an inner bridge.", speechText: "هَ", strokeSteps: [...arabicStrokeSteps.haa] },
      { id: "waw", symbol: "و", name: "Waw", nativeName: "واو", soundLabel: "w / oo", soundHint: 'like "w" in "wow" or long "oo"', note: "Waw hangs like a comma and often helps write long vowel sounds.", speechText: "وَ", strokeSteps: [...arabicStrokeSteps.waw] },
      { id: "ya", symbol: "ي", name: "Ya", nativeName: "ياء", soundLabel: "y / ee", soundHint: 'like "y" in "yes" or long "ee"', note: "Ya uses a broad body with two dots below.", speechText: "يَ", strokeSteps: [...arabicStrokeSteps.ya, "Add the first dot below.", "Add the second dot below."] }
    ]
  };
})();
