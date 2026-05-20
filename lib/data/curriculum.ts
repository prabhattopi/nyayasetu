export const legalModules = [
  {
    id: "fundamental-rights",
    title: "Fundamental Rights (Part III)",
    description: "The bedrock of Indian democracy, guaranteeing civil liberties to all citizens.",
    icon: "Shield",
    lessons: [
      {
        id: 1,
        title: "Article 14: Equality before Law",
        type: "read",
        duration: "5 min",
        content: "The State shall not deny to any person equality before the law or the equal protection of the laws within the territory of India. This means no individual is above the law, and equals must be treated equally."
      },
      {
        id: 2,
        title: "Article 21: Protection of Life",
        type: "read",
        duration: "7 min",
        content: "No person shall be deprived of his life or personal liberty except according to procedure established by law. The Supreme Court has expanded this to include the right to privacy, a clean environment, and free legal aid."
      },
      {
        id: 3,
        title: "Article 32: Constitutional Remedies",
        type: "read",
        duration: "6 min",
        content: "Referred to by Dr. B.R. Ambedkar as the 'Heart and Soul of the Constitution,' this article gives citizens the right to directly approach the Supreme Court if their fundamental rights are violated, allowing the court to issue writs like Habeas Corpus."
      }
    ],
    quiz: {
      title: "Fundamental Rights Diagnostic",
      questions: [
        {
          question: "Which Article is known as the 'heart and soul' of the Constitution?",
          options: ["Article 14", "Article 19", "Article 21", "Article 32"],
          correct: 3,
          feedback: "Correct! Article 32 allows citizens to approach the Supreme Court for remedies."
        },
        {
          question: "Article 21 guarantees which of the following?",
          options: ["Freedom of Religion", "Protection of Life and Liberty", "Abolition of Untouchability", "Right to Property"],
          correct: 1,
          feedback: "Spot on. Article 21 protects life and personal liberty."
        }
      ]
    }
  },
  {
    id: "bns-criminal-law",
    title: "Criminal Law (BNS 2023)",
    description: "Navigate the new Bharatiya Nyaya Sanhita replacing the century-old IPC.",
    icon: "Scale",
    lessons: [
      {
        id: 1,
        title: "Introduction & Key Changes",
        type: "read",
        duration: "6 min",
        content: "The BNS 2023 modernizes India's criminal justice system. A major shift is the removal of 'Sedition' as a crime, replacing it with penalties for acts endangering the sovereignty and unity of India. It also introduces 'Community Service' as a formal punishment for the first time."
      },
      {
        id: 2,
        title: "Organised Crime & Terrorism",
        type: "read",
        duration: "8 min",
        content: "Unlike the old IPC, the BNS officially defines and penalizes Organised Crime (syndicate activities like cyber-crime and extortion) and Terrorism (acts intending to threaten the unity of the country or intimidate the general public)."
      }
    ],
    quiz: {
      title: "BNS Mastery Quiz",
      questions: [
        {
          question: "Which new form of punishment was introduced in the BNS 2023?",
          options: ["Solitary Confinement", "Community Service", "Banishment", "Asset Freezing"],
          correct: 1,
          feedback: "Excellent! Community service is now a formal punishment for petty crimes."
        },
        {
          question: "Under the BNS, the colonial-era offence of 'Sedition' was:",
          options: ["Expanded", "Removed entirely", "Replaced by acts endangering sovereignty", "Renamed to Treason"],
          correct: 2,
          feedback: "Correct. Sedition is gone, replaced by laws protecting India's sovereignty and unity."
        }
      ]
    }
  }
];