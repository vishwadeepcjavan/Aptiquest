/**
 * Student-facing questions data (PUBLIC - SANITIZED).
 * Contains strictly NO answers, NO answer indices, and NO explanations.
 * Safe for offline fallback if Supabase is temporarily unreachable.
 */
export const studentQuestions = [
  // ---------- ARITHMETIC ----------
  { id: 1, category: "Arithmetic", q: "A person spends 30% of his salary on rent, 20% on food, and 10% on transportation. If he saves ₹12,000 per month, find his total monthly salary.", options: ["₹20,000", "₹25,000", "₹30,000", "₹40,000"], sort_order: 1 },
  { id: 2, category: "Arithmetic", q: "Which one of the following is not a prime number?", options: ["31", "37", "41", "51"], sort_order: 2 },
  { id: 3, category: "Arithmetic", q: "(112 × 54) = ?", options: ["6048", "6148", "5948", "6248"], sort_order: 3 },
  { id: 6, category: "Arithmetic", q: "If 8 men can complete a work in 15 days, how many men are required to complete the same work in 10 days?", options: ["10", "12", "15", "20"], sort_order: 4 },
  { id: 7, category: "Arithmetic", q: "In the first 10 overs of a cricket game, the run rate was only 3.2. What should be the run rate in the remaining 40 overs to reach the target of 282 runs?", options: ["7.00", "6.25", "6.50", "6.75"], sort_order: 5 },
  { id: 8, category: "Arithmetic", q: "A person buys an article at a discount of 25% on the marked price and sells it at a profit of 20%. If the marked price is ₹2000, find the selling price.", options: ["₹1500", "₹1600", "₹1700", "₹1800"], sort_order: 6 },
  { id: 9, category: "Arithmetic", q: "A number is such that when multiplied by 5 and increased by 12, it becomes equal to 3 times the number increased by 32. Find the number.", options: ["8", "9", "10", "12"], sort_order: 7 },
  { id: 10, category: "Arithmetic", q: "What is the simple interest on Rs. 1000 at 10% per annum for 1 year?", options: ["Rs. 50", "Rs. 100", "Rs. 150", "Rs. 200"], sort_order: 8 },
  { id: 16, category: "Arithmetic", q: "Ratio of A:B = 4:5 and B:C = 2:3. Find A:C.", options: ["4:3", "8:15", "5:6", "6:5"], sort_order: 9 },
  { id: 17, category: "Arithmetic", q: "If a number is increased by 25% and becomes 500, what was the original number?", options: ["300", "350", "400", "450"], sort_order: 10 },
  { id: 18, category: "Arithmetic", q: "Average of 5 numbers is 30. Find total sum.", options: ["120", "130", "140", "150"], sort_order: 11 },

  // ---------- VERBAL ----------
  { id: 4, category: "Verbal", q: "Arrange the words to form a meaningful sentence: 1. do  2. today  3. you  4. must  5. it", options: ["You must do it today", "You do must it today", "Must you do today it", "Today you it must do"], sort_order: 12 },
  { id: 5, category: "Verbal", q: "Change the following into Indirect Speech: \"If you don't keep quiet, I shall shoot you,\" he said to her in a calm voice.", options: ["He told her that if she did not keep quiet, he would shoot her.", "He says to her that if she does not keep quiet, he will shoot her.", "He told her if you don't keep quiet he will shoot you.", "He said that if she don't keep quiet, he will shoot her."], sort_order: 13 },

  // ---------- LOGICAL REASONING ----------
  { id: 11, category: "Logical", q: "Find the odd man out: 3, 5, 11, 14, 17, 23", options: ["11", "14", "17", "23"], sort_order: 14 },
  { id: 12, category: "Logical", q: "A man walks 10 meters north, then 5 meters east, then 10 meters south. How far and in which direction is he from the starting point?", options: ["5m West", "5m East", "10m South", "0"], sort_order: 15 },
  { id: 13, category: "Logical", q: "Five people A, B, C, D, and E are sitting in a row. E sits at the extreme left. A is to the left of B, and C is to the right of B but left of D. Who is sitting in the middle?", options: ["A", "B", "C", "D"], sort_order: 16 },
  { id: 14, category: "Logical", q: "Find the odd one out: Square, Rectangle, Triangle, Cube.", options: ["Square", "Rectangle", "Triangle", "Cube"], sort_order: 17 },
  { id: 15, category: "Logical", q: "A clock shows 3:30. What is the angle between the hour and minute hands?", options: ["60°", "75°", "90°", "105°"], sort_order: 18 },
  { id: 20, category: "Logical", q: "If all dogs are animals and some animals are cats, which is true?", options: ["All dogs are cats", "Some dogs are cats", "Dogs are animals", "None"], sort_order: 19 },
  { id: 21, category: "Logical", q: "If today is Monday, what day will it be after 10 days?", options: ["Wednesday", "Thursday", "Friday", "Saturday"], sort_order: 20 },
  { id: 22, category: "Logical", q: "Find the missing number: 3, 9, 27, ?", options: ["54", "72", "81", "90"], sort_order: 21 },
  { id: 23, category: "Logical", q: "Odd one out: Circle, Triangle, Square, Table", options: ["Circle", "Triangle", "Square", "Table"], sort_order: 22 },
  { id: 24, category: "Logical", q: "Which direction is opposite to North?", options: ["East", "West", "South", "North-East"], sort_order: 23 },

  // ---------- RIDDLES / LATERAL THINKING ----------
  { id: 19, category: "Riddles", q: "Which is heavier: 1 kg cotton or 1 kg iron?", options: ["Cotton", "Iron", "Both equal", "Cannot say"], sort_order: 24 },
  { id: 25, category: "Riddles", q: "If a plane crashes on the border of two countries, where are the survivors buried?", options: ["Country A", "Country B", "Both", "Nowhere"], sort_order: 25 },
  { id: 26, category: "Riddles", q: "What comes once in a minute, twice in a moment, but never in a thousand years?", options: ["Letter M", "Letter T", "Letter O", "Letter N"], sort_order: 26 },
  { id: 27, category: "Riddles", q: "How many months have 31 days?", options: ["5", "6", "7", "8"], sort_order: 27 }
];
