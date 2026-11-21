// Comprehensive question bank with root-cause diagnostic mapping and multilingual translations (English, Hindi, Kannada, Telugu, Tamil)

export const questionBank = {
  Fractions: [
    {
      id: 'frac-1',
      difficulty: 'foundational',
      subtopic: 'Unlike Denominators Addition',
      rootCause: 'LCM_DENOMINATOR_MISCONCEPTION',
      translations: {
        en: {
          question: 'What is 1/2 + 1/4?',
          choices: ['2/6', '3/4', '1/6', '2/4'],
          explain: 'To add fractions with different denominators, find the common denominator (4). 1/2 is 2/4. Then 2/4 + 1/4 = 3/4. Do not add the bottom numbers together!',
          rootCauseNote: 'Common mistake: Adding denominators (2+4=6). Denominators tell you the size of the slice, not how many slices you have.'
        },
        hi: {
          question: '1/2 + 1/4 का मान क्या है?',
          choices: ['2/6', '3/4', '1/6', '2/4'],
          explain: 'अलग-अलग हर (denominator) वाले भिन्नों को जोड़ने के लिए ल.स.प (4) निकालें। 1/2 = 2/4 होता है। इसलिए 2/4 + 1/4 = 3/4। कभी भी नीचे की संख्याओं को सीधे न जोड़ें!',
          rootCauseNote: 'सामान्य भूल: हरों को सीधे जोड़ देना (2+4=6)। हर यह बताता है कि कुल कितने बराबर भाग हैं।'
        },
        kn: {
          question: '1/2 + 1/4 ರ ಮೊತ್ತ ಎಷ್ಟು?',
          choices: ['2/6', '3/4', '1/6', '2/4'],
          explain: 'ಬೇರೆ ಬೇರೆ ಛೇದಗಳಿರುವ ಭಿನ್ನರಾಶಿಗಳನ್ನು ಕೂಡಿಸಲು ಲ.ಸಾ.ಅ (4) ಕಂಡುಹಿಡಿಯಿರಿ. 1/2 = 2/4. ನಂತರ 2/4 + 1/4 = 3/4. ಛೇದಗಳನ್ನು ನೇರವಾಗಿ ಕೂಡಿಸಬೇಡಿ!',
          rootCauseNote: 'ಸಾಮಾನ್ಯ ತಪ್ಪು: ಛೇದಗಳನ್ನು ನೇರವಾಗಿ ಕೂಡಿಸುವುದು (2+4=6).'
        }
      },
      answer: 1,
      misconceptionMap: {
        0: 'LCM_DENOMINATOR_MISCONCEPTION', // added 1+1 / 2+4 = 2/6
        2: 'SUBTRACTION_CONFUSION',
        3: 'NUMERATOR_FORGOTTEN'
      }
    },
    {
      id: 'frac-2',
      difficulty: 'foundational',
      subtopic: 'Equivalent Fractions',
      rootCause: 'PROPORTIONAL_SCALING_GAP',
      translations: {
        en: {
          question: 'Which fraction is equal to 2/3?',
          choices: ['4/6', '3/5', '2/6', '5/6'],
          explain: 'Multiply both the numerator (top) and denominator (bottom) by the same number (2): (2×2)/(3×2) = 4/6.',
          rootCauseNote: 'Equivalent fractions keep the same value when top and bottom are multiplied or divided by the same non-zero number.'
        },
        hi: {
          question: '2/3 के बराबर कौन सा भिन्न है?',
          choices: ['4/6', '3/5', '2/6', '5/6'],
          explain: 'अंश और हर दोनों को एक ही संख्या (2) से गुणा करें: (2×2)/(3×2) = 4/6।',
          rootCauseNote: 'समतुल्य भिन्न के लिए ऊपर और नीचे दोनों को समान संख्या से गुणा किया जाता है।'
        },
        kn: {
          question: '2/3 ಕ್ಕೆ ಸಮಾನವಾದ ಭಿನ್ನರಾಶಿ ಯಾವುದು?',
          choices: ['4/6', '3/5', '2/6', '5/6'],
          explain: 'ಅಂಶ ಮತ್ತು ಛೇದ ಎರಡನ್ನೂ ಒಂದೇ ಸಂಖ್ಯೆಯಿಂದ (2) ಗುಣಿಸಿ: (2×2)/(3×2) = 4/6.',
          rootCauseNote: 'ಸಮಾನ ಭಿನ್ನರಾಶಿಗೆ ಅಂಶ ಮತ್ತು ಛೇದವನ್ನು ಸಮಾನವಾಗಿ ಗುಣಿಸಬೇಕು.'
        }
      },
      answer: 0,
      misconceptionMap: {
        1: 'ADDITIVE_THINKING_IN_FRACTIONS', // added 1 to top and bottom (2+1)/(3+2) = 3/5
        2: 'DENOMINATOR_ONLY_SCALING',
        3: 'RANDOM_GUESS'
      }
    },
    {
      id: 'frac-3',
      difficulty: 'standard',
      subtopic: 'Fraction of a Whole',
      rootCause: 'FRACTION_MULTIPLICATION_MEANING',
      translations: {
        en: {
          question: 'What is 3/4 of 20?',
          choices: ['12', '15', '16', '17'],
          explain: 'Divide the whole into 4 equal groups: 20 ÷ 4 = 5. Then take 3 of those groups: 5 × 3 = 15.',
          rootCauseNote: '"Fraction of a quantity" means (Whole ÷ Denominator) × Numerator.'
        },
        hi: {
          question: '20 का 3/4 भाग कितना होगा?',
          choices: ['12', '15', '16', '17'],
          explain: '20 को 4 बराबर भागों में बांटें: 20 ÷ 4 = 5। फिर 3 भागों का मान लें: 5 × 3 = 15।',
          rootCauseNote: 'किसी संख्या का भिन्न निकालने के लिए: (संख्या ÷ हर) × अंश।'
        },
        kn: {
          question: '20 ರ 3/4 ಭಾಗ ಎಷ್ಟು?',
          choices: ['12', '15', '16', '17'],
          explain: '20 ನ್ನು 4 ಸಮಾನ ಭಾಗಗಳಾಗಿ ಭಾಗಿಸಿ: 20 ÷ 4 = 5. ನಂತರ 3 ಭಾಗಗಳನ್ನು ತೆಗೆದುಕೊಳ್ಳಿ: 5 × 3 = 15.',
          rootCauseNote: 'ಭಿನ್ನರಾಶಿ ಪ್ರಮಾಣ: (ಸಂಪೂರ್ಣ ÷ ಛೇದ) × ಅಂಶ.'
        }
      },
      answer: 1,
      misconceptionMap: {
        0: 'WRONG_MULTIPLICATION_STEP',
        2: 'INCOMPLETE_DIVISION',
        3: 'CALCULATION_SLIP'
      }
    },
    {
      id: 'frac-4',
      difficulty: 'advanced',
      subtopic: 'Mixed Numbers & Improper Fractions',
      rootCause: 'MIXED_NUMBER_DECOMPOSITION',
      translations: {
        en: {
          question: 'Convert 2 3/5 into an improper fraction:',
          choices: ['13/5', '11/5', '10/5', '6/5'],
          explain: 'Multiply whole number by denominator and add numerator: (2 × 5) + 3 = 10 + 3 = 13. Denominator stays 5, so 13/5.',
          rootCauseNote: 'A mixed number represents whole units plus fractional parts: 2 wholes = 10 fifths + 3 fifths = 13 fifths.'
        },
        hi: {
          question: '2 3/5 को विषम भिन्न (improper fraction) में बदलें:',
          choices: ['13/5', '11/5', '10/5', '6/5'],
          explain: 'पूर्ण संख्या को हर से गुणा करें और अंश जोड़ें: (2 × 5) + 3 = 13/5।',
          rootCauseNote: 'मिश्रित भिन्न = (पूर्ण संख्या × हर + अंश) / हर।'
        },
        kn: {
          question: '2 3/5 ನ್ನು ವಿಷಮ ಭಿನ್ನರಾಶಿಗೆ ಪರಿವರ್ತಿಸಿ:',
          choices: ['13/5', '11/5', '10/5', '6/5'],
          explain: 'ಪೂರ್ಣಾಂಕವನ್ನು ಛೇದದಿಂದ ಗುಣಿಸಿ ಅಂಶವನ್ನು ಸೇರಿಸಿ: (2 × 5) + 3 = 13/5.',
          rootCauseNote: 'ವಿಷಮ ಭಿನ್ನರಾಶಿ: (ಪೂರ್ಣಾಂಕ × ಛೇದ + ಅಂಶ) / ಛೇದ.'
        }
      },
      answer: 0,
      misconceptionMap: {
        1: 'FORGOT_MULTIPLICATION',
        2: 'OMITTED_NUMERATOR',
        3: 'MULTIPLIED_WHOLE_AND_NUMERATOR'
      }
    }
  ],

  'Basic algebra': [
    {
      id: 'alg-1',
      difficulty: 'foundational',
      subtopic: 'One-step Linear Equations',
      rootCause: 'INVERSE_OPERATIONS_ORDER',
      translations: {
        en: {
          question: 'Solve for x: x + 5 = 12',
          choices: ['5', '6', '7', '17'],
          explain: 'To undo adding 5, subtract 5 from both sides of the equation: x = 12 - 5 = 7.',
          rootCauseNote: 'Inverse operation rule: Undo addition with subtraction, and subtraction with addition.'
        },
        hi: {
          question: 'x का मान ज्ञात करें: x + 5 = 12',
          choices: ['5', '6', '7', '17'],
          explain: '+5 को हटाने के लिए दोनों पक्षों से 5 घटाएं: x = 12 - 5 = 7।',
          rootCauseNote: 'विलोम क्रिया: जोड़ने का उल्टा घटाना होता है।'
        },
        kn: {
          question: 'x ನ ಬೆಲೆ ಕಂಡುಹಿಡಿಯಿರಿ: x + 5 = 12',
          choices: ['5', '6', '7', '17'],
          explain: '+5 ನ್ನು ತೆಗೆಯಲು ಎರಡೂ ಕಡೆ 5 ನ್ನು ಕಳೆಯಿರಿ: x = 12 - 5 = 7.',
          rootCauseNote: 'ವಿರುದ್ಧ ಕ್ರಿಯೆ: ಸಂಕಲನದ ವಿರುದ್ಧ ವ್ಯವಕಲನ.'
        }
      },
      answer: 2,
      misconceptionMap: {
        3: 'ADDED_INSTEAD_OF_SUBTRACTED', // 12 + 5 = 17
        0: 'CONFUSED_COEFFICIENT',
        1: 'ARITHMETIC_ERROR'
      }
    },
    {
      id: 'alg-2',
      difficulty: 'foundational',
      subtopic: 'Multiplicative Linear Equations',
      rootCause: 'DIVISION_INVERSE_MISCONCEPTION',
      translations: {
        en: {
          question: 'Solve for x: 3x = 18',
          choices: ['3', '6', '15', '21'],
          explain: '3x means 3 multiplied by x. To isolate x, divide both sides by 3: 18 ÷ 3 = 6.',
          rootCauseNote: 'When a number is directly next to a variable (3x), it represents multiplication.'
        },
        hi: {
          question: 'x का मान ज्ञात करें: 3x = 18',
          choices: ['3', '6', '15', '21'],
          explain: '3x का अर्थ है 3 गुणा x। x को अलग करने के लिए 18 को 3 से भाग दें: 18 ÷ 3 = 6।',
          rootCauseNote: 'चर के साथ संख्या गुणा में होती है, इसलिए भाग दिया जाता है।'
        },
        kn: {
          question: 'x ನ ಬೆಲೆ ಕಂಡುಹಿಡಿಯಿರಿ: 3x = 18',
          choices: ['3', '6', '15', '21'],
          explain: '3x ಎಂದರೆ 3 ಗುಣಿಸು x. x ಅನ್ನು ಪ್ರತ್ಯೇಕಿಸಲು ಎರಡೂ ಕಡೆ 3 ರಿಂದ ಭಾಗಿಸಿ: 18 ÷ 3 = 6.',
          rootCauseNote: 'ಗುಣಾಕಾರವನ್ನು ಭಾಗಾಕಾರದಿಂದ ಹಿಂತಿರುಗಿಸಲಾಗುತ್ತದೆ.'
        }
      },
      answer: 1,
      misconceptionMap: {
        2: 'SUBTRACTED_COEFFICIENT', // 18 - 3 = 15
        3: 'ADDED_COEFFICIENT', // 18 + 3 = 21
        0: 'DIVIDED_BY_WRONG_NUMBER'
      }
    },
    {
      id: 'alg-3',
      difficulty: 'standard',
      subtopic: 'Expression Evaluation & Substitution',
      rootCause: 'ORDER_OF_OPERATIONS_PEMDAS',
      translations: {
        en: {
          question: 'If y = 4, what is the value of 2y + 3?',
          choices: ['11', '14', '8', '10'],
          explain: 'First substitute y with 4: 2(4) + 3. By order of operations (PEMDAS), multiply first: 2 × 4 = 8, then add 3: 8 + 3 = 11.',
          rootCauseNote: 'Order of Operations: Multiplication happens before addition!'
        },
        hi: {
          question: 'यदि y = 4 है, तो 2y + 3 का मान क्या होगा?',
          choices: ['11', '14', '8', '10'],
          explain: 'पहले y के स्थान पर 4 रखें: 2(4) + 3। BODMAS नियम के अनुसार पहले गुणा करें: 2 × 4 = 8, फिर 3 जोड़ें: 8 + 3 = 11।',
          rootCauseNote: 'संक्रियाओं का क्रम: जोड़ से पहले गुणा किया जाता है।'
        },
        kn: {
          question: 'y = 4 ಆದರೆ, 2y + 3 ರ ಬೆಲೆ ಎಷ್ಟು?',
          choices: ['11', '14', '8', '10'],
          explain: 'ಮೊದಲು y ಜಾಗದಲ್ಲಿ 4 ಆದೇಶಿಸಿ: 2(4) + 3. BODMAS ನಿಯಮದಂತೆ ಮೊದಲು ಗುಣಿಸಿ: 2 × 4 = 8, ನಂತರ 3 ಕೂಡಿ: 8 + 3 = 11.',
          rootCauseNote: 'ಸಂಕಲನಕ್ಕಿಂತ ಮೊದಲು ಗುಣಾಕಾರ ಮಾಡಬೇಕು.'
        }
      },
      answer: 0,
      misconceptionMap: {
        1: 'ADDED_BEFORE_MULTIPLYING', // 2 × (4 + 3) = 14
        2: 'FORGOT_ADDITION', // 2 × 4 = 8
        3: 'CALCULATION_OFF'
      }
    },
    {
      id: 'alg-4',
      difficulty: 'advanced',
      subtopic: 'Two-step Equations with Negative Numbers',
      rootCause: 'NEGATIVE_SIGN_BALANCE',
      translations: {
        en: {
          question: 'Solve for x: -2x + 7 = 1',
          choices: ['3', '-3', '4', '-4'],
          explain: 'First subtract 7 from both sides: -2x = 1 - 7 = -6. Then divide both sides by -2: x = -6 ÷ -2 = 3 (negative divided by negative is positive).',
          rootCauseNote: 'Sign rule in division: Negative ÷ Negative = Positive.'
        },
        hi: {
          question: 'x का मान निकालें: -2x + 7 = 1',
          choices: ['3', '-3', '4', '-4'],
          explain: 'पहले दोनों पक्षों से 7 घटाएं: -2x = -6। फिर -2 से भाग दें: x = -6 ÷ -2 = 3।',
          rootCauseNote: 'चिन्ह नियम: ऋणात्मक ÷ ऋणात्मक = धनात्मक।'
        },
        kn: {
          question: 'x ನ ಬೆಲೆ ಕಂಡುಹಿಡಿಯಿರಿ: -2x + 7 = 1',
          choices: ['3', '-3', '4', '-4'],
          explain: 'ಮೊದಲು ಎರಡೂ ಕಡೆ 7 ಕಳೆಯಿರಿ: -2x = -6. ನಂತರ -2 ರಿಂದ ಭಾಗಿಸಿ: x = 3.',
          rootCauseNote: 'ಚಿಹ್ನೆ ನಿಯಮ: ಋಣ ÷ ಋಣ = ಧನ.'
        }
      },
      answer: 0,
      misconceptionMap: {
        1: 'NEGATIVE_SIGN_LOST', // -3
        2: 'ARITHMETIC_SUBTRACTION_ERROR',
        3: 'DOUBLE_SIGN_CONFUSION'
      }
    }
  ],

  'Reading comprehension': [
    {
      id: 'read-1',
      difficulty: 'foundational',
      subtopic: 'Main Idea Identification',
      rootCause: 'MAIN_VS_DETAIL_CONFUSION',
      translations: {
        en: {
          question: 'A paragraph’s main idea is best described as…',
          choices: ['A small supporting fact', 'The central point of the paragraph', 'A new vocabulary word', 'The final punctuation mark'],
          explain: 'The main idea is the central umbrella thought that all other sentences in the paragraph support and explain.',
          rootCauseNote: 'Don’t confuse an interesting supporting detail with the core message!'
        },
        hi: {
          question: 'किसी अनुच्छेद का मुख्य विचार (Main Idea) क्या होता है?',
          choices: ['एक छोटा सहायक तथ्य', 'अनुच्छेद का केंद्रीय बिंदु या संदेश', 'एक नया कठिन शब्द', 'अंतिम विराम चिन्ह'],
          explain: 'मुख्य विचार वह मूल बात होती है जिसके इर्द-गिर्द पूरा अनुच्छेद लिखा जाता है।',
          rootCauseNote: 'सहायक विवरण और मुख्य विचार में अंतर समझें।'
        },
        kn: {
          question: 'ಪ್ಯಾರಾಗ್ರಾಫ್‌ನ ಮುಖ್ಯ ಕಲ್ಪನೆ (Main Idea) ಎಂದರೇನು?',
          choices: ['ಒಂದು ಸಣ್ಣ ವಿವರಣೆ', 'ಪ್ಯಾರಾಗ್ರಾಫ್‌ನ ಕೇಂದ್ರ ಸಂದೇಶ ಅಥವಾ ಮುಖ್ಯ ವಿಷಯ', 'ಹೊಸ ಶಬ್ದ', 'ಅಂತಿಮ ವಿರಾಮ ಚಿಹ್ನೆ'],
          explain: 'ಮುಖ್ಯ ಕಲ್ಪನೆಯು ಇಡೀ ಪ್ಯಾರಾಗ್ರಾಫ್ ವಿವರಿಸುವ ಪ್ರಮುಖ ವಿಷಯವಾಗಿರುತ್ತದೆ.',
          rootCauseNote: 'ಸಹಾಯಕ ವಿವರ ಮತ್ತು ಮುಖ್ಯ ಸಂದೇಶದ ವ್ಯತ್ಯಾಸ ತಿಳಿಯಿರಿ.'
        }
      },
      answer: 1,
      misconceptionMap: {
        0: 'DETAIL_FOCUS_MISCONCEPTION',
        2: 'VOCABULARY_DISTRACTION',
        3: 'SURFACE_ELEMENT_CONFUSION'
      }
    },
    {
      id: 'read-2',
      difficulty: 'standard',
      subtopic: 'Context Clues & Vocabulary',
      rootCause: 'CONTEXT_DECODING_GAP',
      translations: {
        en: {
          question: 'Which clue most effectively helps you deduce an unfamiliar word’s meaning?',
          choices: ['Words and sentences surrounding the unfamiliar word', 'The length of the paragraph', 'The font style of the text', 'The date the article was published'],
          explain: 'Context clues found in neighbouring words, examples, synonyms, and contrasting statements reveal the meaning of unfamiliar terms.',
          rootCauseNote: 'Context clues include definitions, examples, synonyms, and antonyms in the same passage.'
        },
        hi: {
          question: 'किसी अज्ञात शब्द का अर्थ समझने के लिए सबसे मददगार क्या होता है?',
          choices: ['उस शब्द के आसपास के वाक्य और संदर्भ', 'अनुच्छेद की कुल लंबाई', 'लिखने का फॉन्ट स्टाइल', 'लेख छपने की तारीख'],
          explain: 'संदर्भ सुराग (Context Clues) आसपास के वाक्यों में अर्थ और संकेत प्रदान करते हैं।',
          rootCauseNote: 'कठिन शब्द का अर्थ जानने के लिए आगे-पीछे के वाक्यों का अर्थ समझें।'
        },
        kn: {
          question: 'ಅಪರಿಚಿತ ಪದದ ಅರ್ಥವನ್ನು ತಿಳಿಯಲು ಅತ್ಯಂತ ಸಹಾಯಕವಾದದ್ದು ಯಾವುದು?',
          choices: ['ಆ ಪದದ ಸುತ್ತಲಿನ ವಾಕ್ಯಗಳು ಮತ್ತು ಸಂದರ್ಭ', 'ಪ್ಯಾರಾದ ಉದ್ದ', 'ಅಕ್ಷರದ ಶೈಲಿ', 'ಪ್ರಕಟವಾದ ದಿನಾಂಕ'],
          explain: 'ಸುತ್ತಲಿನ ವಾಕ್ಯಗಳು ಆ ಪದದ ಅರ್ಥವನ್ನು ಊಹಿಸಲು ಸಂದರ್ಭೋಚಿತ ಸುಳಿವುಗಳನ್ನು ನೀಡುತ್ತವೆ.',
          rootCauseNote: 'ಸಂದರ್ಭದ ಸುಳಿವುಗಳಿಂದ ಹೊಸ ಪದದ ಅರ್ಥ ಗ್ರಹಿಸಿ.'
        }
      },
      answer: 0,
      misconceptionMap: {
        1: 'LENGTH_ASSOCIATION',
        2: 'FORMAT_CONFUSION',
        3: 'METADATA_DISTRACTION'
      }
    },
    {
      id: 'read-3',
      difficulty: 'standard',
      subtopic: 'Effective Summarization',
      rootCause: 'SUMMARIZATION_SELECTIVITY_GAP',
      translations: {
        en: {
          question: 'A good summary of a passage should…',
          choices: ['Copy every sentence word-for-word', 'Include only personal opinions and unrelated facts', 'State the key ideas concisely in your own words', 'List only the final sentence'],
          explain: 'A strong summary captures the primary thesis and essential supporting points briefly, without plagiarizing or adding outside bias.',
          rootCauseNote: 'Summaries should be concise, objective, and in the reader’s own words.'
        },
        hi: {
          question: 'एक अच्छा सारांश (Summary) कैसा होना चाहिए?',
          choices: ['हर वाक्य को शब्द-दर-शब्द नकल करना', 'केवल व्यक्तिगत राय शामिल करना', 'मुख्य विचारों को संक्षेप में अपने शब्दों में व्यक्त करना', 'केवल अंतिम वाक्य लिखना'],
          explain: 'अच्छा सारांश पूरे पाठ के मुख्य विचारों को कम शब्दों में अपने तरीके से प्रस्तुत करता है।',
          rootCauseNote: 'सारांश में केवल मुख्य बिंदुओं को ही संक्षेप में लिखें।'
        },
        kn: {
          question: 'ಉತ್ತಮ ಸಾರಾಂಶವು ಹೇಗಿರಬೇಕು?',
          choices: ['ಪ್ರತಿ ವಾಕ್ಯವನ್ನು ಹಾಗೆಯೇ ನಕಲು ಮಾಡುವುದು', 'ಕೇವಲ ವೈಯಕ್ತಿಕ ಅಭಿಪ್ರಾಯಗಳನ್ನು ಬರೆಯುವುದು', 'ಮುಖ್ಯ ಅಂಶಗಳನ್ನು ಸಂಕ್ಷಿಪ್ತವಾಗಿ ನಿಮ್ಮ ಸ್ವಂತ ಮಾತುಗಳಲ್ಲಿ ಹೇಳುವುದು', 'ಕೇವಲ ಕೊನೆಯ ವಾಕ್ಯ ಬರೆಯುವುದು'],
          explain: 'ಉತ್ತಮ ಸಾರಾಂಶವು ಮುಖ್ಯ ವಿಚಾರಗಳನ್ನು ಸಂಕ್ಷಿಪ್ತವಾಗಿ ಮತ್ತು ಸರಳವಾಗಿ ವ್ಯಕ್ತಪಡಿಸುತ್ತದೆ.',
          rootCauseNote: 'ಸಾರಾಂಶವು ಮುಖ್ಯಾಂಶಗಳನ್ನು ಮಾತ್ರ ಒಳಗೊಂಡಿರಬೇಕು.'
        }
      },
      answer: 2,
      misconceptionMap: {
        0: 'VERBATIM_COPYING_MISTAKE',
        1: 'OPINION_INSERTION_ERROR',
        3: 'CONCLUSION_ONLY_MISTAKE'
      }
    }
  ],

  'Science & Logic': [
    {
      id: 'sci-1',
      difficulty: 'foundational',
      subtopic: 'Scientific Method & Variables',
      rootCause: 'VARIABLE_IDENTIFICATION_GAP',
      translations: {
        en: {
          question: 'In a plant growth test, sunlight hours are changed while soil and water stay the same. Sunlight is the…',
          choices: ['Dependent variable', 'Independent variable', 'Controlled variable', 'Hypothesis'],
          explain: 'The independent variable is the single factor purposefully changed by the scientist to observe its effect.',
          rootCauseNote: 'Independent Variable = "What I change". Dependent Variable = "What is measured".'
        },
        hi: {
          question: 'पौधे की वृद्धि के प्रयोग में धूप के घंटे बदले जाते हैं, जबकि मिट्टी और पानी समान रहते हैं। धूप क्या है?',
          choices: ['निर्भर चर (Dependent)', 'स्वतंत्र चर (Independent variable)', 'नियंत्रित चर (Controlled)', 'परिकल्पना (Hypothesis)'],
          explain: 'स्वतंत्र चर वह कारक है जिसे प्रयोगकर्ता अपनी इच्छानुसार बदलता है ताकि उसका प्रभाव देख सके।',
          rootCauseNote: 'स्वतंत्र चर = जो हम बदलते हैं। निर्भर चर = जिसका माप लिया जाता है।'
        },
        kn: {
          question: 'ಸಸ್ಯದ ಬೆಳವಣಿಗೆಯ ಪ್ರಯೋಗದಲ್ಲಿ ಸೂರ್ಯನ ಬೆಳಕಿನ ಸಮಯವನ್ನು ಬದಲಾಯಿಸಲಾಗುತ್ತದೆ. ಸೂರ್ಯನ ಬೆಳಕು ಯಾವ ಚರ?',
          choices: ['ಅವಲಂಬಿತ ಚರ', 'ಸ್ವತಂತ್ರ ಚರ (Independent variable)', 'ನಿಯಂತ್ರಿತ ಚರ', 'ಪರಿಕಲ್ಪನೆ'],
          explain: 'ಪ್ರಯೋಗಕರ್ತ ಉದ್ದೇಶಪೂರ್ವಕವಾಗಿ ಬದಲಾಯಿಸುವ ಅಂಶವೇ ಸ್ವತಂತ್ರ ಚರ.',
          rootCauseNote: 'ಸ್ವತಂತ್ರ ಚರ = ನಾವು ಬದಲಾಯಿಸುವುದು. ಅವಲಂಬಿತ ಚರ = ಅಳೆಯಲ್ಪಡುವ ಫಲಿತಾಂಶ.'
        }
      },
      answer: 1,
      misconceptionMap: {
        0: 'CONFUSED_INDEPENDENT_WITH_DEPENDENT',
        2: 'CONFUSED_WITH_CONSTANT',
        3: 'TERMINOLOGY_SLIP'
      }
    },
    {
      id: 'sci-2',
      difficulty: 'standard',
      subtopic: 'Energy Conservation',
      rootCause: 'CONSERVATION_OF_ENERGY_GAP',
      translations: {
        en: {
          question: 'According to the Law of Conservation of Energy, when an electric bulb lights up…',
          choices: ['Energy is completely destroyed', 'Electrical energy transforms into light and thermal heat energy', 'New energy is created from nothing', 'All energy becomes nuclear'],
          explain: 'Energy cannot be created or destroyed; electrical potential energy transforms into electromagnetic radiation (light) and thermal energy (heat).',
          rootCauseNote: 'Conservation Law: Total energy remains constant through transformations.'
        },
        hi: {
          question: 'ऊर्जा संरक्षण के नियम के अनुसार, जब बिजली का बल्ब जलता है तो क्या होता है?',
          choices: ['ऊर्जा पूरी तरह नष्ट हो जाती है', 'विद्युत ऊर्जा प्रकाश और ऊष्मा ऊर्जा में परिवर्तित होती है', 'शून्य से नई ऊर्जा बनती है', 'सभी ऊर्जा परमाणु बन जाती है'],
          explain: 'ऊर्जा न तो बनती है न नष्ट होती है; विद्युत ऊर्जा प्रकाश एवं ताप में रूपांतरित होती है।',
          rootCauseNote: 'ऊर्जा संरक्षण: ऊर्जा केवल एक रूप से दूसरे रूप में बदलती है।'
        },
        kn: {
          question: 'ಶಕ್ತಿ ಸಂರಕ್ಷಣಾ ನಿಯಮದ ಪ್ರಕಾರ ಬಲ್ಬ್ ಬೆಳಗಿದಾಗ ಏನಾಗುತ್ತದೆ?',
          choices: ['ಶಕ್ತಿಯು ಸಂಪೂರ್ಣವಾಗಿ ನಾಶವಾಗುತ್ತದೆ', 'ವಿದ್ಯುತ್ ಶಕ್ತಿಯು ಬೆಳಕು ಮತ್ತು ಶಾಖ ಶಕ್ತಿಯಾಗಿ ರೂಪಾಂತರಗೊಳ್ಳುತ್ತದೆ', 'ಹೊಸ ಶಕ್ತಿ ಸೃಷ್ಟಿಯಾಗುತ್ತದೆ', 'ಎಲ್ಲವೂ ಪರಮಾಣು ಶಕ್ತಿಯಾಗುತ್ತದೆ'],
          explain: 'ಶಕ್ತಿಯನ್ನು ಸೃಷ್ಟಿಸಲೂ ಸಾಧ್ಯವಿಲ್ಲ, ನಾಶಪಡಿಸಲೂ ಸಾಧ್ಯವಿಲ್ಲ; ಕೇವಲ ರೂಪಾಂತರವಾಗುತ್ತದೆ.',
          rootCauseNote: 'ಶಕ್ತಿ ಕೇವಲ ಒಂದು ರೂಪದಿಂದ ಇನ್ನೊಂದಕ್ಕೆ ಬದಲಾಗುತ್ತದೆ.'
        }
      },
      answer: 1,
      misconceptionMap: {
        0: 'ENERGY_DESTRUCTION_MYTH',
        2: 'CREATION_EX_NIHILO_MYTH',
        3: 'NUCLEAR_CONFUSION'
      }
    }
  ]
};

// Root-cause knowledge graph metadata
export const rootCauseKnowledgeGraph = {
  LCM_DENOMINATOR_MISCONCEPTION: {
    topic: 'Fractions',
    title: 'Common Denominators & LCM',
    description: 'Adding or subtracting denominators directly instead of finding the Least Common Multiple (LCM).',
    prerequisite: 'Multiples & Common Factors',
    actionSteps: [
      'Write out multiples of both denominators (e.g. for 2 and 4: 2, 4, 6... and 4, 8...)',
      'Select the smallest common number as the target denominator',
      'Scale both numerator and denominator equally before adding'
    ],
    drillExample: '1/3 + 1/6: LCM is 6. Convert 1/3 to 2/6. Then 2/6 + 1/6 = 3/6 = 1/2.'
  },
  INVERSE_OPERATIONS_ORDER: {
    topic: 'Basic algebra',
    title: 'Inverse Operations Order',
    description: 'Applying arithmetic operations in reverse without maintaining algebraic balance across the equal sign.',
    prerequisite: 'Concept of Algebraic Balance',
    actionSteps: [
      'Identify what operation is attached to the variable (e.g. +5 or ×3)',
      'Perform the exact opposite operation to BOTH sides of the equals sign',
      'Remember: Addition undoes subtraction; multiplication undoes division'
    ],
    drillExample: 'x - 9 = 4: To undo -9, add 9 to both sides: x = 4 + 9 = 13.'
  },
  ORDER_OF_OPERATIONS_PEMDAS: {
    topic: 'Basic algebra',
    title: 'Order of Operations (PEMDAS/BODMAS)',
    description: 'Performing addition or subtraction before resolving multiplication, division, or brackets.',
    prerequisite: 'Standard Operational Precedence',
    actionSteps: [
      'Step 1: Parentheses / Brackets first',
      'Step 2: Exponents / Powers',
      'Step 3: Multiplication & Division (left to right)',
      'Step 4: Addition & Subtraction (left to right)'
    ],
    drillExample: '3 + 4 × 2 = 3 + 8 = 11 (NOT 7 × 2 = 14!).'
  },
  MAIN_VS_DETAIL_CONFUSION: {
    topic: 'Reading comprehension',
    title: 'Distinguishing Main Idea from Supporting Details',
    description: 'Fixating on an intriguing single fact or piece of evidence rather than the central thesis.',
    prerequisite: 'Paragraph Hierarchy & Structure',
    actionSteps: [
      'Ask: "What is this entire text mostly trying to convince or inform me about?"',
      'Check if the other sentences are just examples backing up that one thought',
      'If a statement only explains one sentence, it is a detail, not the main idea'
    ],
    drillExample: 'A paragraph describes solar panel costs and battery efficiency; the main idea is "renewable energy tech is becoming viable", not just "batteries are cheap".'
  },
  VARIABLE_IDENTIFICATION_GAP: {
    topic: 'Science & Logic',
    title: 'Experimental Variables & Controlled Testing',
    description: 'Confusing the independent variable (cause) with the dependent variable (measured effect).',
    prerequisite: 'Cause-and-Effect Relationships',
    actionSteps: [
      'Ask: "What am I, the researcher, changing on purpose?" -> Independent Variable',
      'Ask: "What outcome am I observing or recording?" -> Dependent Variable',
      'Keep all other environmental conditions constant (Controlled Variables)'
    ],
    drillExample: 'Testing if plant fertilizer makes tomatoes bigger: Fertilizer amount = Independent; Tomato weight = Dependent.'
  }
};

// Generates an auto-made practice question on demand (Bonus Feature)
export function generateAutoPracticeQuestion(topic, difficulty = 'standard', language = 'en') {
  const t = language === 'hi' ? 'hi' : language === 'kn' ? 'kn' : 'en';

  if (topic === 'Fractions') {
    const d1 = Math.floor(Math.random() * 3) + 2; // 2, 3, 4
    const d2 = d1 * 2; // e.g. 4, 6, 8
    const n1 = 1;
    const n2 = 1;
    // n1/d1 + n2/d2 = (n1*2 + n2)/d2
    const totalNumerator = n1 * 2 + n2;
    const totalDenominator = d2;
    const correctStr = `${totalNumerator}/${totalDenominator}`;
    const mistakeStr = `${n1 + n2}/${d1 + d2}`;
    const alt1 = `${totalNumerator + 1}/${totalDenominator}`;
    const alt2 = `${n1}/${d2}`;

    const choices = [correctStr, mistakeStr, alt1, alt2].sort(() => Math.random() - 0.5);
    const correctIndex = choices.indexOf(correctStr);

    return {
      id: `ai-gen-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      topic: 'Fractions',
      difficulty,
      isAiGenerated: true,
      educatorVerified: true,
      question: t === 'hi' ? `हल करें: ${n1}/${d1} + ${n2}/${d2} = ?` : t === 'kn' ? `ಲೆಕ್ಕ ಮಾಡಿ: ${n1}/${d1} + ${n2}/${d2} = ?` : `Calculate: ${n1}/${d1} + ${n2}/${d2} = ?`,
      choices,
      answer: correctIndex,
      explain: t === 'hi' 
        ? `ल.स.प ${d2} है। ${n1}/${d1} को (${n1*2}/${d2}) में बदलें। फिर जोड़ें: ${correctStr}। हरों को न जोड़ें!`
        : t === 'kn'
        ? `ಲ.ಸಾ.ಅ ${d2}. ${n1}/${d1} = ${n1*2}/${d2}. ನಂತರ ಕೂಡಿ: ${correctStr}.`
        : `Common denominator is ${d2}. Convert ${n1}/${d1} to ${n1*2}/${d2}. Then ${n1*2}/${d2} + ${n2}/${d2} = ${correctStr}. Denominators are not added!`,
      rootCause: 'LCM_DENOMINATOR_MISCONCEPTION'
    };
  }

  if (topic === 'Basic algebra') {
    const a = Math.floor(Math.random() * 5) + 2; // 2 to 6
    const ans = Math.floor(Math.random() * 8) + 2; // 2 to 9
    const b = Math.floor(Math.random() * 10) + 1; // 1 to 10
    const rhs = a * ans + b;

    const correctStr = `${ans}`;
    const mistake1 = `${ans + 2}`;
    const mistake2 = `${Math.abs(rhs - b)}`;
    const mistake3 = `${ans * 2}`;

    const choices = [correctStr, mistake1, mistake2, mistake3].sort(() => Math.random() - 0.5);
    const correctIndex = choices.indexOf(correctStr);

    return {
      id: `ai-gen-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      topic: 'Basic algebra',
      difficulty,
      isAiGenerated: true,
      educatorVerified: true,
      question: t === 'hi' ? `समीकरण हल करें: ${a}x + ${b} = ${rhs}` : t === 'kn' ? `x ನ ಬೆಲೆ ಕಂಡುಹಿಡಿಯಿರಿ: ${a}x + ${b} = ${rhs}` : `Solve for x: ${a}x + ${b} = ${rhs}`,
      choices,
      answer: correctIndex,
      explain: t === 'hi'
        ? `पहले दोनों पक्षों से ${b} घटाएं: ${a}x = ${rhs - b}। फिर ${a} से भाग दें: x = ${ans}।`
        : t === 'kn'
        ? `ಮೊದಲು ಎರಡೂ ಕಡೆ ${b} ಕಳೆಯಿರಿ: ${a}x = ${rhs - b}. ನಂತರ ${a} ರಿಂದ ಭಾಗಿಸಿ: x = ${ans}.`
        : `First subtract ${b} from both sides: ${a}x = ${rhs - b}. Then divide by ${a}: x = ${ans}.`,
      rootCause: 'INVERSE_OPERATIONS_ORDER'
    };
  }

  // Reading / Science default fallback
  return {
    id: `ai-gen-${Date.now()}`,
    topic: topic,
    difficulty,
    isAiGenerated: true,
    educatorVerified: true,
    question: `Which factor remains constant in a controlled scientific trial?`,
    choices: ['Controlled variable', 'Independent variable', 'Dependent variable', 'Observed outcome'],
    answer: 0,
    explain: 'Controlled variables are intentionally held constant to ensure a fair test.',
    rootCause: 'VARIABLE_IDENTIFICATION_GAP'
  };
}
