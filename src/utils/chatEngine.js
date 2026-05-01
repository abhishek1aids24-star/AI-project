// AI Chatbot response engine — rule-based for offline use, no API key needed
const knowledgeBase = {
  programming: {
    keywords: ['programming', 'code', 'coding', 'python', 'javascript', 'java', 'c++', 'html', 'css', 'react', 'node', 'function', 'variable', 'loop', 'array', 'object', 'class', 'api', 'git', 'debug', 'algorithm', 'data structure', 'sql', 'database'],
    responses: {
      'variable': "A **variable** is like a labeled box that stores data. In JavaScript:\n```\nlet name = 'Alice';  // text\nlet age = 20;        // number\nlet isStudent = true; // boolean\n```\nUse `let` for values that change, `const` for values that don't.",
      'function': "A **function** is a reusable block of code:\n```\nfunction greet(name) {\n  return 'Hello, ' + name + '!';\n}\ngreet('Alice'); // 'Hello, Alice!'\n```\nFunctions help you avoid repeating code and keep things organized.",
      'loop': "**Loops** repeat code multiple times:\n```\n// For loop - when you know how many times\nfor (let i = 0; i < 5; i++) {\n  console.log(i); // 0, 1, 2, 3, 4\n}\n\n// While loop - when you have a condition\nwhile (condition) {\n  // do something\n}\n```",
      'array': "An **array** stores a list of items:\n```\nlet fruits = ['apple', 'banana', 'cherry'];\nfruits[0];        // 'apple'\nfruits.push('date'); // add item\nfruits.length;    // 4\n```\nCommon methods: `map()`, `filter()`, `forEach()`, `find()`.",
      'object': "An **object** stores key-value pairs:\n```\nlet student = {\n  name: 'Alice',\n  age: 20,\n  grade: 'A'\n};\nstudent.name; // 'Alice'\n```\nUse objects to group related data together.",
      'class': "A **class** is a blueprint for creating objects:\n```\nclass Student {\n  constructor(name, grade) {\n    this.name = name;\n    this.grade = grade;\n  }\n  introduce() {\n    return `I'm ${this.name}`;\n  }\n}\nlet s = new Student('Alice', 'A');\n```",
      'api': "An **API** (Application Programming Interface) lets programs talk to each other.\n\n**REST API example with fetch:**\n```\nfetch('https://api.example.com/data')\n  .then(res => res.json())\n  .then(data => console.log(data));\n```\nAPIs use HTTP methods: GET (read), POST (create), PUT (update), DELETE (remove).",
      'react': "**React** is a JavaScript library for building UIs with components:\n```\nfunction Welcome({ name }) {\n  return <h1>Hello, {name}!</h1>;\n}\n```\nKey concepts: Components, Props, State (`useState`), Effects (`useEffect`), and JSX.",
      'python': "**Python** is beginner-friendly and versatile:\n```python\n# Variables\nname = 'Alice'\nage = 20\n\n# Function\ndef greet(name):\n    return f'Hello, {name}!'\n\n# List comprehension\nsquares = [x**2 for x in range(5)]\n```\nGreat for web dev, data science, AI, and scripting.",
      'git': "**Git** tracks code changes:\n```\ngit init           # start tracking\ngit add .          # stage changes\ngit commit -m 'msg' # save snapshot\ngit push           # upload to remote\ngit pull           # download changes\ngit branch feature # create branch\n```\nAlways commit often with clear messages!",
      'algorithm': "An **algorithm** is a step-by-step problem-solving procedure.\n\n**Common ones to know:**\n- **Binary Search**: O(log n) - search sorted arrays\n- **Bubble Sort**: O(n²) - simple sorting\n- **Merge Sort**: O(n log n) - efficient sorting\n- **BFS/DFS**: Graph traversal\n\nStart with understanding Big O notation for efficiency.",
      'debug': "**Debugging tips:**\n1. Read the error message carefully\n2. Use `console.log()` to check values\n3. Check for typos and syntax\n4. Use browser DevTools (F12)\n5. Rubber duck debugging: explain your code out loud\n6. Break the problem into smaller parts\n7. Google the exact error message",
      'default': "That's a great programming question! Here are some tips:\n1. **Practice daily** — even 30 minutes helps\n2. **Build projects** — apply what you learn\n3. **Read documentation** — official docs are your friend\n4. **Debug patiently** — errors are learning opportunities\n\nWhat specific concept would you like me to explain?"
    }
  },
  mathematics: {
    keywords: ['math', 'mathematics', 'algebra', 'calculus', 'geometry', 'trigonometry', 'statistics', 'probability', 'equation', 'derivative', 'integral', 'matrix', 'quadratic', 'linear', 'theorem', 'formula', 'fraction', 'percentage'],
    responses: {
      'quadratic': "**Quadratic Formula** solves ax² + bx + c = 0:\n\nx = (-b ± √(b² - 4ac)) / 2a\n\n**Example:** 2x² + 5x - 3 = 0\n- a=2, b=5, c=-3\n- x = (-5 ± √(25+24)) / 4\n- x = (-5 ± 7) / 4\n- x = 0.5 or x = -3",
      'derivative': "**Derivatives** measure rate of change:\n\n**Basic rules:**\n- Power: d/dx(xⁿ) = nxⁿ⁻¹\n- Constant: d/dx(c) = 0\n- Sum: d/dx(f+g) = f' + g'\n- Product: d/dx(fg) = f'g + fg'\n- Chain: d/dx(f(g(x))) = f'(g(x))·g'(x)\n\n**Example:** d/dx(3x²) = 6x",
      'integral': "**Integrals** find area under curves (reverse of derivatives):\n\n**Basic rules:**\n- ∫xⁿ dx = xⁿ⁺¹/(n+1) + C\n- ∫eˣ dx = eˣ + C\n- ∫1/x dx = ln|x| + C\n\n**Example:** ∫2x dx = x² + C\n\nDefinite integrals give the area between two points.",
      'probability': "**Probability** = favorable outcomes / total outcomes\n\n**Key formulas:**\n- P(A or B) = P(A) + P(B) - P(A and B)\n- P(A and B) = P(A) × P(B) if independent\n- Bayes: P(A|B) = P(B|A)·P(A) / P(B)\n\n**Example:** Coin flip: P(heads) = 1/2 = 50%",
      'percentage': "**Percentage formulas:**\n- Finding %: (part / whole) × 100\n- % of a number: number × (% / 100)\n- % change: ((new - old) / old) × 100\n\n**Example:** What is 20% of 150?\n150 × (20/100) = 30",
      'default': "Mathematics is all about practice! Here are the main branches:\n\n📐 **Algebra** — equations and variables\n📊 **Calculus** — rates of change and areas\n📏 **Geometry** — shapes and space\n📈 **Statistics** — data analysis\n🎲 **Probability** — chance and likelihood\n\nWhich topic would you like to explore?"
    }
  },
  general: {
    keywords: ['study', 'learn', 'exam', 'test', 'memory', 'focus', 'motivation', 'time management', 'notes', 'revision', 'tips', 'how to', 'productivity', 'help', 'explain', 'what is', 'science', 'physics', 'chemistry', 'biology', 'history', 'english'],
    responses: {
      'study': "**Effective Study Techniques:**\n\n🧠 **Active Recall** — Test yourself instead of re-reading\n⏰ **Pomodoro** — 25 min focus + 5 min break\n🔄 **Spaced Repetition** — Review at increasing intervals\n📝 **Feynman Technique** — Explain concepts simply\n🗂️ **Mind Maps** — Visual connections between ideas\n\nThe key is consistent practice over cramming!",
      'exam': "**Exam Preparation Strategy:**\n\n1. **2 weeks before:** Review all notes and make summaries\n2. **1 week before:** Practice past papers and mock tests\n3. **3 days before:** Focus on weak areas only\n4. **Night before:** Light review, get 8 hours sleep\n5. **Exam day:** Eat well, arrive early, stay calm\n\n💡 Practice under timed conditions to build exam stamina.",
      'memory': "**Memory Boosting Techniques:**\n\n🏠 **Memory Palace** — Associate info with familiar places\n🔗 **Chunking** — Group info into smaller units (phone numbers)\n📖 **Storytelling** — Create a narrative around facts\n🎵 **Mnemonics** — ROYGBIV, Every Good Boy Does Fine\n✍️ **Write by hand** — 29% better retention than typing\n😴 **Sleep** — Memory consolidation happens during sleep",
      'focus': "**Improve Your Focus:**\n\n1. 🚫 Remove distractions (phone in another room)\n2. ⏱️ Use the Pomodoro Technique (25/5 intervals)\n3. 🎵 Try lo-fi music or white noise\n4. 💧 Stay hydrated and take breaks\n5. 📋 Start with your hardest task (\"eat the frog\")\n6. 🧘 Practice 5-min mindfulness before studying\n\nFocus is a muscle — it gets stronger with practice!",
      'motivation': "**Stay Motivated:**\n\n🎯 Set small, achievable daily goals\n📊 Track your progress visually\n🏆 Reward yourself after milestones\n👥 Find a study buddy or group\n💭 Visualize your future self succeeding\n📱 Use this app to maintain your streak!\n\nRemember: Discipline > Motivation. Show up even when you don't feel like it.",
      'default': "I'm here to help with your studies! I can assist with:\n\n💻 **Programming** — Python, JavaScript, React, and more\n🔢 **Mathematics** — Algebra, Calculus, Statistics\n📚 **Study Tips** — Techniques, exam prep, focus\n🧪 **Sciences** — Physics, Chemistry, Biology\n\nJust ask me a specific question and I'll explain it simply!"
    }
  }
};

export function getAIResponse(message) {
  const lower = message.toLowerCase().trim();

  // Greetings
  if (/^(hi|hello|hey|greetings|sup|yo)\b/.test(lower)) {
    return "Hey there! 👋 I'm your StudyFlow AI assistant. I can help with:\n\n💻 Programming questions\n🔢 Math problems\n📚 Study techniques\n🧪 Science topics\n\nWhat would you like to learn about?";
  }

  // Thanks
  if (/^(thanks|thank you|thx|ty)\b/.test(lower)) {
    return "You're welcome! 😊 Feel free to ask me anything else. Happy studying! 📚";
  }

  // Search through knowledge base categories
  for (const [, category] of Object.entries(knowledgeBase)) {
    const matchedKeyword = category.keywords.find(kw => lower.includes(kw));
    if (matchedKeyword) {
      // Find specific response
      for (const [key, response] of Object.entries(category.responses)) {
        if (key !== 'default' && lower.includes(key)) {
          return response;
        }
      }
      return category.responses.default;
    }
  }

  // Fallback
  return "Great question! While I'm an offline AI assistant with a focused knowledge base, I can help you with:\n\n💻 **Programming** — Ask about variables, functions, loops, arrays, React, Python, Git\n🔢 **Math** — Quadratics, derivatives, integrals, probability, percentages\n📚 **Study Skills** — Memory, focus, exam prep, motivation\n\nTry asking something specific like *\"What is a function?\"* or *\"How to prepare for exams?\"*";
}
