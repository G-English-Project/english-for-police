import { useState, useCallback } from "react";
import type { Question } from "@/types";
import type { SectionResult } from "../utils/testUtils";
import { useQuestionAnswers } from "./useQuestionAnswers";

export function useGeneralTestState(questions: Question[]) {
  const {
    answers,
    setAnswers,
    matchingAnswers,
    setMatchingAnswers,
    arrangementAnswers,
    setArrangementAnswers,
    selectedLeft,
    setSelectedLeft,
    matchingRightOptionsByQuestionId,
    isQuestionAnswered,
    calculateCorrectCount,
    getCombinedAnswers,
    resetAnswers,
  } = useQuestionAnswers(questions);

  const [showResults, setShowResults] = useState(false);
  const [overallScore, setOverallScore] = useState(0);
  const [sectionResults, setSectionResults] = useState<Record<number, SectionResult>>({});

  const calculateScore = useCallback((questionList: Question[]) => {
    const correctCount = calculateCorrectCount(questionList);
    return {
      correctCount,
      total: questionList.length,
      score: questionList.length > 0 ? Math.round((correctCount / questionList.length) * 100) : 0,
    };
  }, [calculateCorrectCount]);

  const resetBaseState = useCallback(() => {
    resetAnswers();
    setSectionResults({});
    setShowResults(false);
    setOverallScore(0);
  }, [resetAnswers]);

  return {
    answers,
    setAnswers,
    matchingAnswers,
    setMatchingAnswers,
    arrangementAnswers,
    setArrangementAnswers,
    selectedLeft,
    setSelectedLeft,
    matchingRightOptionsByQuestionId,
    showResults,
    setShowResults,
    overallScore,
    setOverallScore,
    sectionResults,
    setSectionResults,
    isQuestionAnswered,
    calculateScore,
    getCombinedAnswers,
    resetBaseState,
  };
}
