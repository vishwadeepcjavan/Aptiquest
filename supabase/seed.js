import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Please provide VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or VITE_SUPABASE_ANON_KEY) in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

export const questionsData = [
  // ---------- ARITHMETIC ----------
  { id: 1, category: "Arithmetic", q: "A person spends 30% of his salary on rent, 20% on food, and 10% on transportation. If he saves ₹12,000 per month, find his total monthly salary.", options: ["₹20,000", "₹25,000", "₹30,000", "₹40,000"], answer: 2, explanation: "Spent = 60%, so savings = 40%. 40% of salary = 12,000 → salary = ₹30,000." },
  { id: 2, category: "Arithmetic", q: "Which one of the following is not a prime number?", options: ["31", "37", "41", "51"], answer: 3, explanation: "51 = 3 × 17, so it is not prime." },
  { id: 3, category: "Arithmetic", q: "(112 × 54) = ?", options: ["6048", "6148", "5948", "6248"], answer: 0, explanation: "112 × 54 = 112 × 50 + 112 × 4 = 5600 + 448 = 6048." },
  { id: 6, category: "Arithmetic", q: "If 8 men can complete a work in 15 days, how many men are required to complete the same work in 10 days?", options: ["10", "12", "15", "20"], answer: 1, explanation: "Total work = 8 × 15 = 120 man-days. Men needed = 120 / 10 = 12." },
  { id: 7, category: "Arithmetic", q: "In the first 10 overs of a cricket game, the run rate was only 3.2. What should be the run rate in the remaining 40 overs to reach the target of 282 runs?", options: ["7.00", "6.25", "6.50", "6.75"], answer: 1, explanation: "Runs in 10 overs = 32. Remaining = 250 in 40 overs → 250 / 40 = 6.25." },
  { id: 8, category: "Arithmetic", q: "A person buys an article at a discount of 25% on the marked price and sells it at a profit of 20%. If the marked price is ₹2000, find the selling price.", options: ["₹1500", "₹1600", "₹1700", "₹1800"], answer: 3, explanation: "Cost = 75% of 2000 = 1500. Selling price = 1500 × 1.20 = ₹1800." },
  { id: 9, category: "Arithmetic", q: "A number is such that when multiplied by 5 and increased by 12, it becomes equal to 3 times the number increased by 32. Find the number.", options: ["8", "9", "10", "12"], answer: 2, explanation: "5x + 12 = 3x + 32 → 2x = 20 → x = 10." },
  { id: 10, category: "Arithmetic", q: "What is the simple interest on Rs. 1000 at 10% per annum for 1 year?", options: ["Rs. 50", "Rs. 100", "Rs. 150", "Rs. 200"], answer: 1, explanation: "SI = (1000 × 10 × 1) / 100 = Rs. 100." },
  { id: 16, category: "Arithmetic", q: "Ratio of A:B = 4:5 and B:C = 2:3. Find A:C.", options: ["4:3", "8:15", "5:6", "6:5"], answer: 1, explanation: "Make B equal: A:B = 8:10, B:C = 10:15 → A:C = 8:15." },
  { id: 17, category: "Arithmetic", q: "If a number is increased by 25% and becomes 500, what was the original number?", options: ["300", "350", "400", "450"], answer: 2, explanation: "1.25 × x = 500 → x = 400." },
  { id: 18, category: "Arithmetic", q: "Average of 5 numbers is 30. Find total sum.", options: ["120", "130", "140", "150"], answer: 3, explanation: "Sum = average × count = 30 × 5 = 150." },

  // ---------- VERBAL ----------
  { id: 4, category: "Verbal", q: "Arrange the words to form a meaningful sentence: 1. do  2. today  3. you  4. must  5. it", options: ["You must do it today", "You do must it today", "Must you do today it", "Today you it must do"], answer: 0, explanation: "Correct order is 3-4-1-5-2: 'You must do it today'." },
  { id: 5, category: "Verbal", q: "Change the following into Indirect Speech: \"If you don't keep quiet, I shall shoot you,\" he said to her in a calm voice.", options: ["He told her that if she did not keep quiet, he would shoot her.", "He says to her that if she does not keep quiet, he will shoot her.", "He told her if you don't keep quiet he will shoot you.", "He said that if she don't keep quiet, he will shoot her."], answer: 0, explanation: "'Said to' → 'told'; pronouns shift (you→she, I→he); tense shifts (shall→would, don't→did not)." },

  // ---------- LOGICAL REASONING ----------
  { id: 11, category: "Logical", q: "Find the odd man out: 3, 5, 11, 14, 17, 23", options: ["11", "14", "17", "23"], answer: 1, explanation: "All the numbers except 14 are prime." },
  { id: 12, category: "Logical", q: "A man walks 10 meters north, then 5 meters east, then 10 meters south. How far and in which direction is he from the starting point?", options: ["5m West", "5m East", "10m South", "0"], answer: 1, explanation: "North and south cancel out, leaving 5 m to the east." },
  { id: 13, category: "Logical", q: "Five people A, B, C, D, and E are sitting in a row. E sits at the extreme left. A is to the left of B, and C is to the right of B but left of D. Who is sitting in the middle?", options: ["A", "B", "C", "D"], answer: 1, explanation: "Order is E, A, B, C, D from left to right. The middle (3rd) person is B." },
  { id: 14, category: "Logical", q: "Find the odd one out: Square, Rectangle, Triangle, Cube.", options: ["Square", "Rectangle", "Triangle", "Cube"], answer: 3, explanation: "Cube is a 3-D solid; the others are 2-D shapes." },
  { id: 15, category: "Logical", q: "A clock shows 3:30. What is the angle between the hour and minute hands?", options: ["60°", "75°", "90°", "105°"], answer: 1, explanation: "Hour hand = 3 × 30 + 15 = 105°. Minute hand = 180°. Difference = 75°." },
  { id: 20, category: "Logical", q: "If all dogs are animals and some animals are cats, which is true?", options: ["All dogs are cats", "Some dogs are cats", "Dogs are animals", "None"], answer: 2, explanation: "Only the first statement guarantees that dogs are animals." },
  { id: 21, category: "Logical", q: "If today is Monday, what day will it be after 10 days?", options: ["Wednesday", "Thursday", "Friday", "Saturday"], answer: 1, explanation: "10 mod 7 = 3, so Monday + 3 = Thursday." },
  { id: 22, category: "Logical", q: "Find the missing number: 3, 9, 27, ?", options: ["54", "72", "81", "90"], answer: 2, explanation: "Each term is multiplied by 3: 27 × 3 = 81." },
  { id: 23, category: "Logical", q: "Odd one out: Circle, Triangle, Square, Table", options: ["Circle", "Triangle", "Square", "Table"], answer: 3, explanation: "Table is an object; the rest are geometric shapes." },
  { id: 24, category: "Logical", q: "Which direction is opposite to North?", options: ["East", "West", "South", "North-East"], answer: 2, explanation: "South is directly opposite North." },

  // ---------- RIDDLES / LATERAL THINKING ----------
  { id: 19, category: "Riddles", q: "Which is heavier: 1 kg cotton or 1 kg iron?", options: ["Cotton", "Iron", "Both equal", "Cannot say"], answer: 2, explanation: "Both weigh 1 kg. Only the volume differs." },
  { id: 25, category: "Riddles", q: "If a plane crashes on the border of two countries, where are the survivors buried?", options: ["Country A", "Country B", "Both", "Nowhere"], answer: 3, explanation: "Survivors are alive, so they are not buried at all." },
  { id: 26, category: "Riddles", q: "What comes once in a minute, twice in a moment, but never in a thousand years?", options: ["Letter M", "Letter T", "Letter O", "Letter N"], answer: 0, explanation: "Count the letter 'M': once in 'minute', twice in 'moment', zero in 'thousand years'." },
  { id: 27, category: "Riddles", q: "How many months have 31 days?", options: ["5", "6", "7", "8"], answer: 2, explanation: "Jan, Mar, May, Jul, Aug, Oct, Dec = 7 months." }
];

async function seed() {
  console.log('Seeding Supabase database...');
  
  // 1. Insert Questions (Without answers or explanations)
  const publicQuestions = questionsData.map((q, idx) => ({
    id: q.id,
    category: q.category,
    q: q.q,
    options: q.options,
    sort_order: idx + 1
  }));

  const { error: qError } = await supabase.from('questions').upsert(publicQuestions, { onConflict: 'id' });
  if (qError) {
    console.error('Error inserting questions:', qError);
  } else {
    console.log('Successfully inserted 27 questions.');
  }

  // 2. Insert Answer Key (Only for authenticated teachers)
  const answerKeyData = questionsData.map(q => ({
    question_id: q.id,
    answer: q.answer,
    explanation: q.explanation
  }));

  const { error: aError } = await supabase.from('answer_key').upsert(answerKeyData, { onConflict: 'question_id' });
  if (aError) {
    console.error('Error inserting answer key:', aError);
  } else {
    console.log('Successfully inserted 27 answer key entries.');
  }

  console.log('Seed completed.');
}

seed();
