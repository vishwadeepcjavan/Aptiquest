import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { getQuestions, submitTestResults } from '../lib/supabase';
import { studentQuestions } from '../data/studentQuestions';
import { shuffleArray } from '../utils/shuffle';

const STORAGE_SESSION_KEY = 'aptiquest_student_session';
const STORAGE_LAST_SUBMISSION_KEY = 'aptiquest_last_submitted_info';
const STORAGE_THEME_KEY = 'aptiquest_theme';
const TOTAL_TEST_TIME = 30 * 60; // 30 minutes in seconds = 1800s

const TestContext = createContext(null);

export function TestProvider({ children }) {
  // Theme state: dark by default
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_THEME_KEY);
      return saved || 'dark';
    } catch {
      return 'dark';
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem(STORAGE_THEME_KEY, theme);
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  // Student details
  const [studentInfo, setStudentInfo] = useState({
    name: '',
    rollNo: '',
    className: '',
  });

  // Test state
  const [questions, setQuestions] = useState(studentQuestions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [answers, setAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState([]);
  const [startTimestamp, setStartTimestamp] = useState(null);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TEST_TIME);
  const [isTestActive, setIsTestActive] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // Submission network state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [isDuplicateRollNo, setIsDuplicateRollNo] = useState(false);
  const [lastSubmissionInfo, setLastSubmissionInfo] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_LAST_SUBMISSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  // Saved attempt detection
  const [hasSavedSession, setHasSavedSession] = useState(false);
  const [savedSessionData, setSavedSessionData] = useState(null);

  const timerRef = useRef(null);
  const autoSubmitTriggeredRef = useRef(false);

  // Check for saved session on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_SESSION_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.startTimestamp && parsed.studentInfo?.rollNo) {
          const elapsed = Math.floor((Date.now() - parsed.startTimestamp) / 1000);
          const remaining = TOTAL_TEST_TIME - elapsed;
          if (remaining > 0) {
            setHasSavedSession(true);
            setSavedSessionData({ ...parsed, remainingTime: remaining });
          } else {
            localStorage.removeItem(STORAGE_SESSION_KEY);
          }
        }
      }
    } catch (e) {
      console.warn('Error reading session from localStorage:', e);
    }
  }, []);

  // Load questions from Supabase on start/mount
  useEffect(() => {
    let isMounted = true;
    async function load() {
      const { data } = await getQuestions();
      if (isMounted && data && data.length > 0) {
        // If test is not active and not resumed, prepare sanitized questions
        if (!isTestActive && !hasSavedSession) {
          setQuestions(data);
        }
      }
    }
    load();
    return () => { isMounted = false; };
  }, [isTestActive, hasSavedSession]);

  // Timer calculation based on startTimestamp (Cannot be bypassed by refreshing)
  useEffect(() => {
    if (isTestActive && startTimestamp) {
      autoSubmitTriggeredRef.current = false;

      const updateTimer = () => {
        const elapsed = Math.floor((Date.now() - startTimestamp) / 1000);
        const remaining = Math.max(0, TOTAL_TEST_TIME - elapsed);
        setTimeLeft(remaining);

        if (remaining <= 0 && !autoSubmitTriggeredRef.current) {
          autoSubmitTriggeredRef.current = true;
          clearInterval(timerRef.current);
          handleAutoSubmit();
        }
      };

      updateTimer();
      timerRef.current = setInterval(updateTimer, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTestActive, startTimestamp]);

  // Sync active test progress to localStorage
  useEffect(() => {
    if (isTestActive && startTimestamp && studentInfo.rollNo) {
      try {
        const payload = {
          studentInfo,
          questions,
          currentIndex,
          answers,
          markedForReview,
          startTimestamp,
          savedAt: Date.now(),
        };
        localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(payload));
      } catch (e) {
        console.warn('Error saving test session:', e);
      }
    }
  }, [isTestActive, startTimestamp, studentInfo, questions, currentIndex, answers, markedForReview]);

  // Start fresh test
  const startTest = useCallback(async ({ name, rollNo, className }) => {
    setIsSubmitting(false);
    setSubmitError(null);
    setIsDuplicateRollNo(false);

    // Fetch fresh questions or use current
    const { data } = await getQuestions();
    const sourceQuestions = (data && data.length > 0) ? data : studentQuestions;
    const shuffled = shuffleArray(sourceQuestions);

    const now = Date.now();
    setStudentInfo({ name, rollNo, className });
    setQuestions(shuffled);
    setCurrentIndex(0);
    setDirection(1);
    setAnswers({});
    setMarkedForReview([]);
    setStartTimestamp(now);
    setTimeLeft(TOTAL_TEST_TIME);
    setIsTestActive(true);
    setHasSavedSession(false);
    setSavedSessionData(null);
  }, []);

  // Resume saved test
  const resumeSavedSession = useCallback(() => {
    if (!savedSessionData) return;
    setStudentInfo(savedSessionData.studentInfo || { name: '', rollNo: '', className: '' });
    setQuestions(savedSessionData.questions || studentQuestions);
    setCurrentIndex(savedSessionData.currentIndex || 0);
    setDirection(1);
    setAnswers(savedSessionData.answers || {});
    setMarkedForReview(savedSessionData.markedForReview || []);
    setStartTimestamp(savedSessionData.startTimestamp);
    const elapsed = Math.floor((Date.now() - savedSessionData.startTimestamp) / 1000);
    setTimeLeft(Math.max(0, TOTAL_TEST_TIME - elapsed));
    setIsTestActive(true);
    setHasSavedSession(false);
    setSavedSessionData(null);
  }, [savedSessionData]);

  // Discard saved session
  const discardSavedSession = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_SESSION_KEY);
    } catch (e) {
      console.warn(e);
    }
    setHasSavedSession(false);
    setSavedSessionData(null);
  }, []);

  // Option selection
  const selectOption = useCallback((questionId, optionIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  }, []);

  // Clear answer
  const clearAnswer = useCallback((questionId) => {
    setAnswers(prev => {
      const next = { ...prev };
      delete next[questionId];
      return next;
    });
  }, []);

  // Toggle mark for review
  const toggleMarkForReview = useCallback((questionId) => {
    setMarkedForReview(prev => {
      if (prev.includes(questionId)) {
        return prev.filter(id => id !== questionId);
      } else {
        return [...prev, questionId];
      }
    });
  }, []);

  // Navigation handlers
  const goToQuestion = useCallback((targetIndex) => {
    if (targetIndex >= 0 && targetIndex < questions.length) {
      setDirection(targetIndex > currentIndex ? 1 : -1);
      setCurrentIndex(targetIndex);
    }
  }, [currentIndex, questions.length]);

  const nextQuestion = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setDirection(1);
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentIndex, questions.length]);

  const prevQuestion = useCallback(() => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex]);

  // Submit test to backend
  const executeSubmit = useCallback(async (currentAnswers, elapsedSeconds) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setIsDuplicateRollNo(false);

    const payload = {
      name: studentInfo.name,
      roll_no: studentInfo.rollNo,
      class_name: studentInfo.className,
      answers: currentAnswers,
      time_taken_seconds: elapsedSeconds,
    };

    const result = await submitTestResults(payload);

    if (result.success) {
      // Clear ongoing session from storage
      try {
        localStorage.removeItem(STORAGE_SESSION_KEY);
      } catch (e) {
        console.warn(e);
      }

      // Save submission info (NO MARKS, NO SCORES)
      const submissionInfo = {
        name: studentInfo.name,
        rollNo: studentInfo.rollNo,
        className: studentInfo.className,
        timeTakenSeconds: elapsedSeconds,
        attemptedCount: Object.keys(currentAnswers).length,
        totalQuestions: questions.length,
        submittedAt: new Date().toISOString(),
      };

      try {
        localStorage.setItem(STORAGE_LAST_SUBMISSION_KEY, JSON.stringify(submissionInfo));
      } catch (e) {
        console.warn(e);
      }

      setLastSubmissionInfo(submissionInfo);
      setIsTestActive(false);
      setIsConfirmOpen(false);
      setIsSubmitting(false);

      return { success: true };
    } else {
      setIsSubmitting(false);
      if (result.isDuplicate) {
        setIsDuplicateRollNo(true);
        setSubmitError('This roll number has already submitted the test.');
      } else {
        setSubmitError(result.error || 'Network error while submitting. Please retry.');
      }
      return { success: false, error: result.error, isDuplicate: result.isDuplicate };
    }
  }, [studentInfo, questions.length]);

  // User confirmed manual submit
  const submitTest = useCallback(async () => {
    const elapsed = startTimestamp
      ? Math.floor((Date.now() - startTimestamp) / 1000)
      : TOTAL_TEST_TIME - timeLeft;
    return await executeSubmit(answers, elapsed);
  }, [answers, startTimestamp, timeLeft, executeSubmit]);

  // Auto-submit when time expires
  const handleAutoSubmit = useCallback(async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    const elapsed = TOTAL_TEST_TIME;
    await executeSubmit(answers, elapsed);
  }, [answers, executeSubmit]);

  const value = {
    theme,
    toggleTheme,
    studentInfo,
    setStudentInfo,
    questions,
    currentIndex,
    direction,
    answers,
    markedForReview,
    timeLeft,
    totalTime: TOTAL_TEST_TIME,
    isTestActive,
    isConfirmOpen,
    setIsConfirmOpen,
    isSubmitting,
    submitError,
    setSubmitError,
    isDuplicateRollNo,
    lastSubmissionInfo,
    hasSavedSession,
    savedSessionData,
    startTest,
    resumeSavedSession,
    discardSavedSession,
    selectOption,
    clearAnswer,
    toggleMarkForReview,
    goToQuestion,
    nextQuestion,
    prevQuestion,
    submitTest,
  };

  return <TestContext.Provider value={value}>{children}</TestContext.Provider>;
}

export function useTest() {
  const context = useContext(TestContext);
  if (!context) {
    throw new Error('useTest must be used within a TestProvider');
  }
  return context;
}
