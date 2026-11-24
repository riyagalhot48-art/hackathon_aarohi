// Study content for the members area. Edit freely: add subjects, topics and timetable slots here.
const S = (name, topics) => ({ name, topics: topics.map(([title, points]) => ({ title, points })) });

const SUBJECTS = [
  S("Data Structures", [
    ["Arrays and Linked Lists", ["An array gives O(1) access by index but O(n) insert or delete in the middle.", "A linked list gives O(1) insert or delete at a known node but O(n) search.", "Use a doubly linked list when you need to move in both directions."]],
    ["Stacks and Queues", ["A stack is LIFO (push, pop). It powers undo, recursion and bracket matching.", "A queue is FIFO (enqueue, dequeue). It powers scheduling and BFS.", "A circular queue reuses freed space in a fixed-size array."]],
    ["Trees and Graphs", ["A BST searches in O(log n) on average but O(n) if it becomes skewed.", "BFS uses a queue and finds shortest paths in unweighted graphs. DFS uses a stack or recursion.", "Dijkstra finds shortest paths when edge weights are non-negative."]]]),
  S("DBMS", [
    ["ER Model and Keys", ["Entities, attributes and relationships model the real world before tables are built.", "A primary key uniquely identifies a row. A foreign key links one table to another.", "A candidate key is any minimal set of columns that could be the primary key."]],
    ["Normalization", ["1NF: atomic values, no repeating groups. 2NF: no partial dependency. 3NF: no transitive dependency.", "Normalizing reduces redundancy and update errors.", "It can mean more joins, so some systems denormalize on purpose for speed."]],
    ["SQL and Transactions", ["Core SQL: SELECT, WHERE, GROUP BY, HAVING, ORDER BY and JOIN.", "ACID: Atomicity, Consistency, Isolation, Durability.", "An index speeds up reads but slows down writes and uses extra space."]]]),
  S("Operating Systems", [
    ["Processes and Scheduling", ["A process is a program in execution. Its state is kept in the PCB.", "FCFS is simple but suffers the convoy effect. Round Robin gives each process a time quantum.", "SJF gives the lowest average waiting time but needs burst-time estimates."]],
    ["Deadlocks", ["Four conditions together cause deadlock: mutual exclusion, hold and wait, no preemption, circular wait.", "Prevent deadlock by breaking at least one of the four conditions.", "The Banker's algorithm avoids deadlock by only granting requests that keep the system in a safe state."]],
    ["Memory Management", ["Paging splits memory into fixed-size pages and frames, which avoids external fragmentation.", "Virtual memory lets programs use more memory than the physical RAM.", "Page replacement policies include FIFO, LRU and Optimal. Thrashing means too much time is spent swapping pages."]]]),
  S("Computer Networks", [
    ["OSI and TCP/IP Models", ["OSI has 7 layers. TCP/IP has 4: application, transport, internet, link.", "Each layer adds its own header as data moves down (encapsulation).", "Routers work at the network layer. Switches mostly work at the data link layer."]],
    ["TCP, UDP and IP", ["TCP is reliable and connection-oriented, using a 3-way handshake.", "UDP is faster with no delivery guarantee. It suits streaming, gaming and DNS.", "IPv4 addresses are 32-bit and IPv6 addresses are 128-bit."]],
    ["Application Protocols", ["HTTP is request and response. HTTPS adds TLS encryption.", "DNS translates domain names into IP addresses.", "SMTP sends email. IMAP and POP3 retrieve it."]]]),
  S("OOP with Java", [
    ["Four Pillars of OOP", ["Encapsulation hides data behind methods. Abstraction exposes only what is needed.", "Inheritance reuses a parent class. Polymorphism lets one interface have many forms.", "Overloading is resolved at compile time. Overriding is resolved at run time."]],
    ["Classes, Constructors and Interfaces", ["A constructor initializes an object. 'this' refers to the current object.", "'static' members belong to the class, not to any one object.", "An interface defines a contract. A class can implement many interfaces but extend only one class."]],
    ["Exceptions and Collections", ["Use try, catch and finally. Checked exceptions must be handled or declared.", "ArrayList is fast for random access. LinkedList is better for frequent insertions.", "HashMap stores key-value pairs with average O(1) lookup."]]]),
  S("Web Development", [
    ["HTML and CSS", ["Use semantic tags (header, nav, main, section) for structure and accessibility.", "The box model is content, padding, border and margin.", "Flexbox lays out in one dimension. Grid lays out in two."]],
    ["JavaScript", ["Prefer const and let over var. Arrow functions give shorter syntax.", "The DOM lets JavaScript read and change the page in response to events.", "Use fetch with async and await to call APIs."]],
    ["Backend and APIs", ["REST uses GET to read, POST to create, PUT or PATCH to update and DELETE to remove.", "Express routes map URLs to handler functions.", "Never store plain-text passwords. Hash them, as this project does with bcrypt."]]]),
  S("Discrete Mathematics", [
    ["Logic and Sets", ["Propositions combine with AND, OR, NOT and implication. Truth tables check them.", "A statement and its contrapositive are logically equivalent.", "Set operations: union, intersection, difference and complement."]],
    ["Relations and Functions", ["An equivalence relation is reflexive, symmetric and transitive.", "A function can be injective (one-to-one), surjective (onto) or bijective (both).", "A partial order is reflexive, antisymmetric and transitive."]],
    ["Graphs and Counting", ["Handshake lemma: the sum of all degrees equals twice the number of edges.", "Permutations count ordered choices (nPr). Combinations count unordered ones (nCr).", "An Euler path uses every edge once. A Hamiltonian path visits every vertex once."]]]),
  S("Python", [
    ["Core Data Types", ["Lists and dicts are mutable. Tuples and strings are immutable.", "Dicts map keys to values with fast lookup. Sets hold unique items.", "List comprehensions build lists in one readable line."]],
    ["Functions and Files", ["Define functions with def. Use default arguments, *args and **kwargs for flexibility.", "Use 'with open(...)' so files close automatically.", "Import modules and install packages with pip."]],
    ["OOP and Libraries", ["A class bundles data and methods. __init__ sets up a new object.", "NumPy handles fast numeric arrays. pandas handles tables of data.", "Use a virtual environment per project to avoid package conflicts."]]])
];

const PRACTICE = {
  "Data Structures": "Solve 3 array or linked-list problems, then trace BFS on a small graph by hand.",
  "DBMS": "Design tables for a library system, normalize them to 3NF, then write 5 JOIN queries.",
  "Operating Systems": "Draw Gantt charts for FCFS, SJF and Round Robin on the same 4 processes.",
  "Computer Networks": "Draw the TCP handshake and trace what happens when you open a website.",
  "OOP with Java": "Model a small system (for example, a bank) using inheritance and an interface.",
  "Web Development": "Build a small page with a form that calls an API using fetch.",
  "Discrete Mathematics": "Solve 5 counting problems and 3 graph problems from past papers.",
  "Python": "Write a script that reads a CSV file and prints summary statistics."
};
const RESOURCES = {
  "Data Structures": ["NPTEL", "GeeksforGeeks", "VisuAlgo (visualise algorithms)"],
  "DBMS": ["NPTEL", "GeeksforGeeks", "SQLBolt (practice SQL)"],
  "Operating Systems": ["NPTEL", "GeeksforGeeks", "Operating Systems: Three Easy Pieces (free book)"],
  "Computer Networks": ["NPTEL", "GeeksforGeeks", "Cisco Packet Tracer (practice)"],
  "OOP with Java": ["NPTEL", "Oracle Java Tutorials", "GeeksforGeeks"],
  "Web Development": ["MDN Web Docs", "freeCodeCamp", "CS50 Web"],
  "Discrete Mathematics": ["NPTEL", "Khan Academy", "GeeksforGeeks"],
  "Python": ["Python.org tutorial", "CS50P", "freeCodeCamp"]
};
const LECTURES = SUBJECTS.map((s) => ({
  subject: s.name,
  plan: s.topics.map((t, i) => ({ no: i + 1, title: t.title, mins: 50, focus: t.points[0] })),
  practice: PRACTICE[s.name],
  resources: RESOURCES[s.name]
}));
// Sample weekly timetable (Monday to Friday). Replace with your real one.
const TIMETABLE = {
  1: [["9:00", "Data Structures"], ["10:00", "DBMS"], ["11:30", "Python"]],
  2: [["9:00", "Operating Systems"], ["10:00", "Computer Networks"], ["11:30", "Web Development"]],
  3: [["9:00", "Data Structures"], ["10:00", "OOP with Java"], ["11:30", "Discrete Mathematics"]],
  4: [["9:00", "DBMS"], ["10:00", "Operating Systems"], ["11:30", "Web Development"]],
  5: [["9:00", "Computer Networks"], ["10:00", "OOP with Java"], ["11:30", "Python"]]
};
module.exports = { SUBJECTS, LECTURES, TIMETABLE };
