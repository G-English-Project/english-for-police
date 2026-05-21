import { useState, useCallback, useMemo } from "react";
import type { Question } from "@/types";
import { shuffleArray } from "../utils/testUtils";

export function useQuestionAnswers(questions: Question[]) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [matchingAnswers, setMatchingAnswers] = useState<
    Record<string, Record<string, string>>
  >({});
  const [arrangementAnswers, setArrangementAnswers] = useState<
    Record<string, string[]>
  >({});
  const [selectedLeft, setSelectedLeft] = useState<
    Record<string, string | null>
  >({});

  const matchingRightOptionsByQuestionId = useMemo(() => {
    const stableOrders: Record<string, { left: string; right: string }[]> = {};
    questions.forEach((q) => {
      if (q.type === "Matching") {
        stableOrders[q.id] = shuffleArray([...(q.pairs || [])]);
      }
    });
    return stableOrders;
  }, [questions]);

  const isQuestionAnswered = useCallback(
    (q: Question): boolean => {
      if (!q) return false;
      if (q.type === "Matching") {
        const pairCount = q.pairs?.length || 0;
        return (
          pairCount > 0 &&
          Object.keys(matchingAnswers[q.id] || {}).length === pairCount
        );
      }
      if (q.type === "Arrangement") {
        const selected = arrangementAnswers[q.id] || [];
        const required = q.options?.length ?? 0;
        return required > 0 && selected.length === required;
      }
      return (
        typeof answers[q.id] === "string" &&
        (answers[q.id] as string).trim().length > 0
      );
    },
    [answers, matchingAnswers, arrangementAnswers],
  );

  const calculateCorrectCount = useCallback(
    (questionList: Question[]) => {
      let correctCount = 0;

      questionList.forEach((q) => {
        if (q.type === "Matching") {
          const userPairs = matchingAnswers[q.id] || {};
          const allCorrect = (q.pairs || []).every(
            (pair) => userPairs[pair.left] === pair.right,
          );
          if (allCorrect) correctCount++;
          return;
        }

        if (q.type === "Arrangement") {
          const userArranged = (arrangementAnswers[q.id] || [])
            .join(" ")
            .trim();
          const correctAnswer = String(q.answer || "").trim();
          if (userArranged.toLowerCase() === correctAnswer.toLowerCase()) {
            correctCount++;
          }
          return;
        }

        const userAnswer = String(answers[q.id] || "")
          .trim()
          .toLowerCase();
        const correctAnswer = String(q.answer || "")
          .trim()
          .toLowerCase();
        const acceptable = (q.acceptableAnswers || []).map((a) =>
          a.trim().toLowerCase(),
        );
        if (userAnswer === correctAnswer || acceptable.includes(userAnswer)) {
          correctCount++;
        }
      });

      return correctCount;
    },
    [answers, matchingAnswers, arrangementAnswers],
  );

  const getCombinedAnswers = useCallback(() => {
    return {
      ...answers,
      ...matchingAnswers,
      ...arrangementAnswers,
    };
  }, [answers, matchingAnswers, arrangementAnswers]);

  const resetAnswers = useCallback(() => {
    setAnswers({});
    setMatchingAnswers({});
    setArrangementAnswers({});
    setSelectedLeft({});
  }, []);

  const areAllQuestionsAnswered = useCallback(
    (questionList: Question[]) =>
      questionList.length > 0 &&
      questionList.every((q) => isQuestionAnswered(q)),
    [isQuestionAnswered],
  );

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
    isQuestionAnswered,
    areAllQuestionsAnswered,
    calculateCorrectCount,
    getCombinedAnswers,
    resetAnswers,
  };
}
