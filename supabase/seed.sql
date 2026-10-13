-- ==============================================================================
-- AptiQuest — Supabase Database Seed Data
-- Run this in the Supabase SQL Editor after running schema.sql
-- ==============================================================================

-- 1. Insert into public.questions (PUBLIC: NO ANSWERS OR EXPLANATIONS)
INSERT INTO public.questions (id, category, q, options, sort_order) VALUES
(1, 'Arithmetic', 'A person spends 30% of his salary on rent, 20% on food, and 10% on transportation. If he saves ₹12,000 per month, find his total monthly salary.', '["₹20,000", "₹25,000", "₹30,000", "₹40,000"]'::jsonb, 1),
(2, 'Arithmetic', 'Which one of the following is not a prime number?', '["31", "37", "41", "51"]'::jsonb, 2),
(3, 'Arithmetic', '(112 × 54) = ?', '["6048", "6148", "5948", "6248"]'::jsonb, 3),
(6, 'Arithmetic', 'If 8 men can complete a work in 15 days, how many men are required to complete the same work in 10 days?', '["10", "12", "15", "20"]'::jsonb, 4),
(7, 'Arithmetic', 'In the first 10 overs of a cricket game, the run rate was only 3.2. What should be the run rate in the remaining 40 overs to reach the target of 282 runs?', '["7.00", "6.25", "6.50", "6.75"]'::jsonb, 5),
(8, 'Arithmetic', 'A person buys an article at a discount of 25% on the marked price and sells it at a profit of 20%. If the marked price is ₹2000, find the selling price.', '["₹1500", "₹1600", "₹1700", "₹1800"]'::jsonb, 6),
(9, 'Arithmetic', 'A number is such that when multiplied by 5 and increased by 12, it becomes equal to 3 times the number increased by 32. Find the number.', '["8", "9", "10", "12"]'::jsonb, 7),
(10, 'Arithmetic', 'What is the simple interest on Rs. 1000 at 10% per annum for 1 year?', '["Rs. 50", "Rs. 100", "Rs. 150", "Rs. 200"]'::jsonb, 8),
(16, 'Arithmetic', 'Ratio of A:B = 4:5 and B:C = 2:3. Find A:C.', '["4:3", "8:15", "5:6", "6:5"]'::jsonb, 9),
(17, 'Arithmetic', 'If a number is increased by 25% and becomes 500, what was the original number?', '["300", "350", "400", "450"]'::jsonb, 10),
(18, 'Arithmetic', 'Average of 5 numbers is 30. Find total sum.', '["120", "130", "140", "150"]'::jsonb, 11),
(4, 'Verbal', 'Arrange the words to form a meaningful sentence: 1. do  2. today  3. you  4. must  5. it', '["You must do it today", "You do must it today", "Must you do today it", "Today you it must do"]'::jsonb, 12),
(5, 'Verbal', 'Change the following into Indirect Speech: "If you don''t keep quiet, I shall shoot you," he said to her in a calm voice.', '["He told her that if she did not keep quiet, he would shoot her.", "He says to her that if she does not keep quiet, he will shoot her.", "He told her if you don''t keep quiet he will shoot you.", "He said that if she don''t keep quiet, he will shoot her."]'::jsonb, 13),
(11, 'Logical', 'Find the odd man out: 3, 5, 11, 14, 17, 23', '["11", "14", "17", "23"]'::jsonb, 14),
(12, 'Logical', 'A man walks 10 meters north, then 5 meters east, then 10 meters south. How far and in which direction is he from the starting point?', '["5m West", "5m East", "10m South", "0"]'::jsonb, 15),
(13, 'Logical', 'Five people A, B, C, D, and E are sitting in a row. E sits at the extreme left. A is to the left of B, and C is to the right of B but left of D. Who is sitting in the middle?', '["A", "B", "C", "D"]'::jsonb, 16),
(14, 'Logical', 'Find the odd one out: Square, Rectangle, Triangle, Cube.', '["Square", "Rectangle", "Triangle", "Cube"]'::jsonb, 17),
(15, 'Logical', 'A clock shows 3:30. What is the angle between the hour and minute hands?', '["60°", "75°", "90°", "105°"]'::jsonb, 18),
(20, 'Logical', 'If all dogs are animals and some animals are cats, which is true?', '["All dogs are cats", "Some dogs are cats", "Dogs are animals", "None"]'::jsonb, 19),
(21, 'Logical', 'If today is Monday, what day will it be after 10 days?', '["Wednesday", "Thursday", "Friday", "Saturday"]'::jsonb, 20),
(22, 'Logical', 'Find the missing number: 3, 9, 27, ?', '["54", "72", "81", "90"]'::jsonb, 21),
(23, 'Logical', 'Odd one out: Circle, Triangle, Square, Table', '["Circle", "Triangle", "Square", "Table"]'::jsonb, 22),
(24, 'Logical', 'Which direction is opposite to North?', '["East", "West", "South", "North-East"]'::jsonb, 23),
(19, 'Riddles', 'Which is heavier: 1 kg cotton or 1 kg iron?', '["Cotton", "Iron", "Both equal", "Cannot say"]'::jsonb, 24),
(25, 'Riddles', 'If a plane crashes on the border of two countries, where are the survivors buried?', '["Country A", "Country B", "Both", "Nowhere"]'::jsonb, 25),
(26, 'Riddles', 'What comes once in a minute, twice in a moment, but never in a thousand years?', '["Letter M", "Letter T", "Letter O", "Letter N"]'::jsonb, 26),
(27, 'Riddles', 'How many months have 31 days?', '["5", "6", "7", "8"]'::jsonb, 27)
ON CONFLICT (id) DO UPDATE SET
  category = EXCLUDED.category,
  q = EXCLUDED.q,
  options = EXCLUDED.options,
  sort_order = EXCLUDED.sort_order;

-- 2. Insert into public.answer_key (TEACHERS ONLY: ANSWERS AND EXPLANATIONS)
INSERT INTO public.answer_key (question_id, answer, explanation) VALUES
(1, 2, 'Spent = 60%, so savings = 40%. 40% of salary = 12,000 → salary = ₹30,000.'),
(2, 3, '51 = 3 × 17, so it is not prime.'),
(3, 0, '112 × 54 = 112 × 50 + 112 × 4 = 5600 + 448 = 6048.'),
(6, 1, 'Total work = 8 × 15 = 120 man-days. Men needed = 120 / 10 = 12.'),
(7, 1, 'Runs in 10 overs = 32. Remaining = 250 in 40 overs → 250 / 40 = 6.25.'),
(8, 3, 'Cost = 75% of 2000 = 1500. Selling price = 1500 × 1.20 = ₹1800.'),
(9, 2, '5x + 12 = 3x + 32 → 2x = 20 → x = 10.'),
(10, 1, 'SI = (1000 × 10 × 1) / 100 = Rs. 100.'),
(16, 1, 'Make B equal: A:B = 8:10, B:C = 10:15 → A:C = 8:15.'),
(17, 2, '1.25 × x = 500 → x = 400.'),
(18, 3, 'Sum = average × count = 30 × 5 = 150.'),
(4, 0, 'Correct order is 3-4-1-5-2: ''You must do it today''.'),
(5, 0, '''Said to'' → ''told''; pronouns shift (you→she, I→he); tense shifts (shall→would, don''t→did not).'),
(11, 1, 'All the numbers except 14 are prime.'),
(12, 1, 'North and south cancel out, leaving 5 m to the east.'),
(13, 1, 'Order is E, A, B, C, D from left to right. The middle (3rd) person is B.'),
(14, 3, 'Cube is a 3-D solid; the others are 2-D shapes.'),
(15, 1, 'Hour hand = 3 × 30 + 15 = 105°. Minute hand = 180°. Difference = 75°.'),
(20, 2, 'Only the first statement guarantees that dogs are animals.'),
(21, 1, '10 mod 7 = 3, so Monday + 3 = Thursday.'),
(22, 2, 'Each term is multiplied by 3: 27 × 3 = 81.'),
(23, 3, 'Table is an object; the rest are geometric shapes.'),
(24, 2, 'South is directly opposite North.'),
(19, 2, 'Both weigh 1 kg. Only the volume differs.'),
(25, 3, 'Survivors are alive, so they are not buried at all.'),
(26, 0, 'Count the letter ''M'': once in ''minute'', twice in ''moment'', zero in ''thousand years''.'),
(27, 2, 'Jan, Mar, May, Jul, Aug, Oct, Dec = 7 months.')
ON CONFLICT (question_id) DO UPDATE SET
  answer = EXCLUDED.answer,
  explanation = EXCLUDED.explanation;
