// Preset Question Bank for QuizMaster Pro
// Categories: Python & Coding, Web & Tech, Science & Cosmos, General Knowledge & Trivia

const PRESET_CATEGORIES = {
    python: {
        id: 'python',
        name: 'Python & Coding',
        icon: '🐍',
        description: 'Core syntax, OOP, algorithms, list comprehensions, and Pythonic tricks.',
        gradient: 'linear-gradient(135deg, #2b6cb0 0%, #4c51bf 100%)',
        accentColor: '#4c51bf'
    },
    tech: {
        id: 'tech',
        name: 'Web & Modern Tech',
        icon: '💻',
        description: 'JavaScript, CSS, Git, modern cloud, architectures, and computer history.',
        gradient: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
        accentColor: '#2563eb'
    },
    science: {
        id: 'science',
        name: 'Science & Cosmos',
        icon: '🔬',
        description: 'Quantum physics, astronomy, space exploration, and biology.',
        gradient: 'linear-gradient(135deg, #7c5cbf 0%, #906cd9 100%)',
        accentColor: '#7c5cbf'
    },
    trivia: {
        id: 'trivia',
        name: 'General Trivia',
        icon: '🌍',
        description: 'World history, geography, discoveries, cinema, and fascinating facts.',
        gradient: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
        accentColor: '#d97706'
    }
};

const DEFAULT_QUESTIONS = [
    // --- PYTHON & CODING ---
    {
        id: 'py-1',
        category: 'python',
        difficulty: 'easy',
        question: 'What is the output of the following Python expression?',
        code: 'print(type(5 / 2))',
        options: [
            "<class 'int'>",
            "<class 'float'>",
            "<class 'double'>",
            "Error: division truncation"
        ],
        answer: 1,
        explanation: 'In Python 3, the single slash division operator `/` always performs true division and returns a float, so `5 / 2` evaluates to `2.5` with type `float`.'
    },
    {
        id: 'py-2',
        category: 'python',
        difficulty: 'easy',
        question: 'Which of the following data structures in Python is immutable?',
        code: null,
        options: [
            'List [1, 2, 3]',
            'Dictionary {"a": 1}',
            'Tuple (1, 2, 3)',
            'Set {1, 2, 3}'
        ],
        answer: 2,
        explanation: 'Tuples are immutable sequences in Python. Once created, their items cannot be altered, added, or removed.'
    },
    {
        id: 'py-3',
        category: 'python',
        difficulty: 'medium',
        question: 'What does this list comprehension output?',
        code: 'nums = [x * 2 for x in range(5) if x % 2 == 1]\nprint(nums)',
        options: [
            '[0, 2, 4, 6, 8]',
            '[2, 6]',
            '[1, 3]',
            '[2, 4, 6]'
        ],
        answer: 1,
        explanation: '`range(5)` generates 0, 1, 2, 3, 4. The condition `x % 2 == 1` selects 1 and 3. Multiplying each by 2 yields `[2, 6]`.'
    },
    {
        id: 'py-4',
        category: 'python',
        difficulty: 'medium',
        question: 'What is the result of executing this code?',
        code: 'def add_item(item, lst=[]):\n    lst.append(item)\n    return lst\n\nadd_item(1)\nprint(add_item(2))',
        options: [
            '[2]',
            '[1, 2]',
            'Error: lst already initialized',
            '[[1], [2]]'
        ],
        answer: 1,
        explanation: 'Default argument expressions in Python are evaluated once when the function is defined, not each time it is called. The mutable list is shared across calls, resulting in `[1, 2]`.'
    },
    {
        id: 'py-5',
        category: 'python',
        difficulty: 'hard',
        question: 'What is the Global Interpreter Lock (GIL) primarily responsible for in CPython?',
        code: null,
        options: [
            'Preventing memory leaks by pausing garbage collection during imports',
            'Synchronizing native threads so only one executes Python bytecode at a time',
            'Optimizing JIT compilation of hot loops across multiple CPU cores',
            'Encrypting global variables inside memory space'
        ],
        answer: 1,
        explanation: 'The GIL is a mutex that prevents multiple native threads from executing CPython bytecodes at once, safeguarding CPython memory management which is not thread-safe.'
    },
    {
        id: 'py-6',
        category: 'python',
        difficulty: 'hard',
        question: 'What does this generator output?',
        code: 'def gen():\n    yield 1\n    return 2\n\ng = gen()\nprint(next(g))\ntry:\n    print(next(g))\nexcept StopIteration as e:\n    print("Return:", e.value)',
        options: [
            '1\nReturn: None',
            '1\nReturn: 2',
            '1\n2',
            '1\nError: yield cannot return'
        ],
        answer: 1,
        explanation: 'In Python generators, a `return value` statement terminates the generator and passes the return value as the `value` attribute of the raised `StopIteration` exception.'
    },
    {
        id: 'py-7',
        category: 'python',
        difficulty: 'easy',
        question: 'How do you unpack a dictionary as keyword arguments into a function?',
        code: 'def greet(name, age):\n    return f"{name} is {age}"\n\ndata = {"name": "Alice", "age": 25}',
        options: [
            'greet(*data)',
            'greet(**data)',
            'greet(&data)',
            'greet(data->args)'
        ],
        answer: 1,
        explanation: 'The double asterisk `**` operator unpacks dictionary key-value pairs into function keyword arguments.'
    },
    {
        id: 'py-8',
        category: 'python',
        difficulty: 'medium',
        question: 'What will be printed by this slice operation?',
        code: 'text = "Antigravity"\nprint(text[::-2])',
        options: [
            '"yiaitA"',
            '"ytivargitnA"',
            '"yirgn"',
            '"ygirA"'
        ],
        answer: 0,
        explanation: '`text[::-2]` traverses the string from right to left in steps of 2: y (idx 10), i (8), a (6), i (4), t (2), A (0) => "yiaitA".'
    },

    // --- WEB & MODERN TECH ---
    {
        id: 'tech-1',
        category: 'tech',
        difficulty: 'easy',
        question: 'What is the default CSS `box-sizing` value for standard HTML elements?',
        code: null,
        options: [
            'border-box',
            'content-box',
            'padding-box',
            'margin-box'
        ],
        answer: 1,
        explanation: 'Standard HTML elements default to `content-box`, where width and height apply only to the element content, excluding padding and borders.'
    },
    {
        id: 'tech-2',
        category: 'tech',
        difficulty: 'easy',
        question: 'What does the JavaScript `===` strict equality operator compare?',
        code: null,
        options: [
            'Values after type coercion only',
            'Both value and data type without type coercion',
            'Memory reference addresses only',
            'Object hash codes'
        ],
        answer: 1,
        explanation: 'The strict equality operator `===` checks both value and data type without attempting implicit type conversion.'
    },
    {
        id: 'tech-3',
        category: 'tech',
        difficulty: 'medium',
        question: 'What is the output of the following JavaScript snippet?',
        code: 'console.log(typeof NaN);\nconsole.log(NaN === NaN);',
        options: [
            '"undefined" and true',
            '"number" and false',
            '"NaN" and false',
            '"number" and true'
        ],
        answer: 1,
        explanation: 'In JavaScript IEEE-754 floating point standard, `NaN` is of type "number", and by definition `NaN` is not equal to anything, including itself (`NaN === NaN` is false).'
    },
    {
        id: 'tech-4',
        category: 'tech',
        difficulty: 'medium',
        question: 'In Git, what does the command `git reset --soft HEAD~1` do?',
        code: null,
        options: [
            'Discards the commit, unstages files, and deletes workspace changes',
            'Undoes the last commit while keeping changes staged in the index',
            'Undoes the last commit and unstages changes to the working directory',
            'Creates a reverse commit to cancel changes on the remote branch'
        ],
        answer: 1,
        explanation: '`--soft` moves HEAD back one commit without touching the staging index or working directory, allowing you to edit the commit or add more files before committing again.'
    },
    {
        id: 'tech-5',
        category: 'tech',
        difficulty: 'hard',
        question: 'In the JavaScript event loop, what executes first after the currently running call stack clears?',
        code: null,
        options: [
            'Macrotask queue (e.g., setTimeout, setInterval)',
            'Microtask queue (e.g., Promise.then, queueMicrotask)',
            'RequestAnimationFrame callbacks',
            'I/O network events'
        ],
        answer: 1,
        explanation: 'The microtask queue (Promises, MutationObservers) has higher priority and is drained completely before the event loop pulls the next task from the macrotask queue.'
    },
    {
        id: 'tech-6',
        category: 'tech',
        difficulty: 'hard',
        question: 'What is HTTP/3 built on top of instead of standard TCP?',
        code: null,
        options: [
            'SCTP (Stream Control Transmission Protocol)',
            'QUIC (Quick UDP Internet Connections)',
            'WebSocket binary framing',
            'Raw IP packet tunnels'
        ],
        answer: 1,
        explanation: 'HTTP/3 uses QUIC over UDP, providing reduced connection establishment latency, native encryption, and resolving head-of-line blocking present in multi-stream TCP.'
    },

    // --- SCIENCE & COSMOS ---
    {
        id: 'sci-1',
        category: 'science',
        difficulty: 'easy',
        question: 'What is the most abundant chemical element in the observable universe?',
        code: null,
        options: [
            'Helium',
            'Hydrogen',
            'Oxygen',
            'Carbon'
        ],
        answer: 1,
        explanation: 'Hydrogen makes up roughly 75% of the elemental mass of the universe and over 90% of all atoms.'
    },
    {
        id: 'sci-2',
        category: 'science',
        difficulty: 'easy',
        question: 'What is the speed of light in a vacuum (rounded)?',
        code: null,
        options: [
            '150,000 km/s',
            '300,000 km/s',
            '450,000 km/s',
            '1,080,000 km/s'
        ],
        answer: 1,
        explanation: 'The exact speed of light in a vacuum is 299,792,458 m/s, which rounds to approximately 300,000 km/s (or 186,000 miles per second).'
    },
    {
        id: 'sci-3',
        category: 'science',
        difficulty: 'medium',
        question: 'What is the boundary surrounding a black hole from which nothing, not even light, can escape?',
        code: null,
        options: [
            'Accretion Disk',
            'Ergosphere',
            'Event Horizon',
            'Photon Sphere'
        ],
        answer: 2,
        explanation: 'The Event Horizon is the threshold radius where the escape velocity of the black hole equals or exceeds the speed of light.'
    },
    {
        id: 'sci-4',
        category: 'science',
        difficulty: 'medium',
        question: 'In genetics, which nitrogenous base pairs with Adenine in RNA molecules?',
        code: null,
        options: [
            'Thymine',
            'Uracil',
            'Cytosine',
            'Guanine'
        ],
        answer: 1,
        explanation: 'In RNA, Uracil (U) replaces Thymine (T) and forms complementary base pairs with Adenine (A).'
    },
    {
        id: 'sci-5',
        category: 'science',
        difficulty: 'hard',
        question: 'What quantum phenomenon describes two particles remaining connected so that actions performed on one instantly influence the other, regardless of distance?',
        code: null,
        options: [
            'Quantum Tunneling',
            'Quantum Entanglement',
            'Quantum Superposition',
            'Wave-Particle Duality'
        ],
        answer: 1,
        explanation: 'Quantum Entanglement links quantum states of two or more particles such that one cannot be described independently of the other, famously dubbed "spooky action at a distance" by Einstein.'
    },
    {
        id: 'sci-6',
        category: 'science',
        difficulty: 'hard',
        question: 'What particle was confirmed by CERN in 2012, responsible for giving other fundamental particles mass via its associated field?',
        code: null,
        options: [
            'Top Quark',
            'Higgs Boson',
            'Graviton',
            'Tau Neutrino'
        ],
        answer: 1,
        explanation: 'The Higgs Boson is the excitation of the Higgs field, which gives elementary fermions and gauge bosons their mass through the electroweak symmetry breaking mechanism.'
    },

    // --- GENERAL TRIVIA ---
    {
        id: 'triv-1',
        category: 'trivia',
        difficulty: 'easy',
        question: 'Which planet in our solar system has the most prominent and extensive ring system?',
        code: null,
        options: [
            'Jupiter',
            'Saturn',
            'Uranus',
            'Neptune'
        ],
        answer: 1,
        explanation: 'Saturn has by far the most extensive and visually spectacular ring system, composed mostly of water ice particles and rocky debris.'
    },
    {
        id: 'triv-2',
        category: 'trivia',
        difficulty: 'easy',
        question: 'Who is widely credited with writing the first computer algorithm, intended for Charles Babbage’s Analytical Engine?',
        code: null,
        options: [
            'Alan Turing',
            'Ada Lovelace',
            'Grace Hopper',
            'John von Neumann'
        ],
        answer: 1,
        explanation: 'Ada Lovelace wrote an algorithm to calculate Bernoulli numbers using the Analytical Engine in 1843, making her the world\'s first computer programmer.'
    },
    {
        id: 'triv-3',
        category: 'trivia',
        difficulty: 'medium',
        question: 'Which ancient wonder of the world is the only one still largely intact today?',
        code: null,
        options: [
            'Colossus of Rhodes',
            'Hanging Gardens of Babylon',
            'Great Pyramid of Giza',
            'Lighthouse of Alexandria'
        ],
        answer: 2,
        explanation: 'The Great Pyramid of Giza (built around 2560 BC in Egypt) is the oldest and the only surviving wonder of the original Ancient Seven Wonders.'
    },
    {
        id: 'triv-4',
        category: 'trivia',
        difficulty: 'medium',
        question: 'What is the deepest known location on Earth’s oceans?',
        code: null,
        options: [
            'Puerto Rico Trench',
            'Java Trench',
            'Challenger Deep (Mariana Trench)',
            'Tonga Trench'
        ],
        answer: 2,
        explanation: 'Challenger Deep in the southern Mariana Trench reaches approximately 10,994 meters (36,070 feet) below sea level.'
    },
    {
        id: 'triv-5',
        category: 'trivia',
        difficulty: 'hard',
        question: 'In what year was the first ARPANET message transmitted between UCLA and Stanford University?',
        code: null,
        options: [
            '1961',
            '1969',
            '1975',
            '1983'
        ],
        answer: 1,
        explanation: 'On October 29, 1969, the first ARPANET message ("LO" before the system crashed while typing "LOGIN") was sent from UCLA to Stanford.'
    },
    {
        id: 'triv-6',
        category: 'trivia',
        difficulty: 'hard',
        question: 'Which chemical element has the highest melting point of all elements at standard pressure?',
        code: null,
        options: [
            'Titanium',
            'Osmium',
            'Tungsten',
            'Platinum'
        ],
        answer: 2,
        explanation: 'Tungsten (Wolfram, W) has the highest melting point of any metallic element at 3,422 °C (6,192 °F).'
    }
];
