/**
 * ADMIN ONLY: Offline fallback answer key.
 * Strictly used when Supabase is running in local/demo mode for teachers.
 * NEVER exposed to student components.
 */
export const mockAnswerKey = [
  { question_id: 1, answer: 2, explanation: "Spent = 60%, so savings = 40%. 40% of salary = 12,000 → salary = ₹30,000." },
  { question_id: 2, answer: 3, explanation: "51 = 3 × 17, so it is not prime." },
  { question_id: 3, answer: 0, explanation: "112 × 54 = 112 × 50 + 112 × 4 = 5600 + 448 = 6048." },
  { question_id: 6, answer: 1, explanation: "Total work = 8 × 15 = 120 man-days. Men needed = 120 / 10 = 12." },
  { question_id: 7, answer: 1, explanation: "Runs in 10 overs = 32. Remaining = 250 in 40 overs → 250 / 40 = 6.25." },
  { question_id: 8, answer: 3, explanation: "Cost = 75% of 2000 = 1500. Selling price = 1500 × 1.20 = ₹1800." },
  { question_id: 9, answer: 2, explanation: "5x + 12 = 3x + 32 → 2x = 20 → x = 10." },
  { question_id: 10, answer: 1, explanation: "SI = (1000 × 10 × 1) / 100 = Rs. 100." },
  { question_id: 16, answer: 1, explanation: "Make B equal: A:B = 8:10, B:C = 10:15 → A:C = 8:15." },
  { question_id: 17, answer: 2, explanation: "1.25 × x = 500 → x = 400." },
  { question_id: 18, answer: 3, explanation: "Sum = average × count = 30 × 5 = 150." },
  { question_id: 4, answer: 0, explanation: "Correct order is 3-4-1-5-2: 'You must do it today'." },
  { question_id: 5, answer: 0, explanation: "'Said to' → 'told'; pronouns shift (you→she, I→he); tense shifts (shall→would, don't→did not)." },
  { question_id: 11, answer: 1, explanation: "All the numbers except 14 are prime." },
  { question_id: 12, answer: 1, explanation: "North and south cancel out, leaving 5 m to the east." },
  { question_id: 13, answer: 1, explanation: "Order is E, A, B, C, D from left to right. The middle (3rd) person is B." },
  { question_id: 14, answer: 3, explanation: "Cube is a 3-D solid; the others are 2-D shapes." },
  { question_id: 15, answer: 1, explanation: "Hour hand = 3 × 30 + 15 = 105°. Minute hand = 180°. Difference = 75°." },
  { question_id: 20, answer: 2, explanation: "Only the first statement guarantees that dogs are animals." },
  { question_id: 21, answer: 1, explanation: "10 mod 7 = 3, so Monday + 3 = Thursday." },
  { question_id: 22, answer: 2, explanation: "Each term is multiplied by 3: 27 × 3 = 81." },
  { question_id: 23, answer: 3, explanation: "Table is an object; the rest are geometric shapes." },
  { question_id: 24, answer: 2, explanation: "South is directly opposite North." },
  { question_id: 19, answer: 2, explanation: "Both weigh 1 kg. Only the volume differs." },
  { question_id: 25, answer: 3, explanation: "Survivors are alive, so they are not buried at all." },
  { question_id: 26, answer: 0, explanation: "Count the letter 'M': once in 'minute', twice in 'moment', zero in 'thousand years'." },
  { question_id: 27, answer: 2, explanation: "Jan, Mar, May, Jul, Aug, Oct, Dec = 7 months." }
];
