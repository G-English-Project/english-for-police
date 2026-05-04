import React from "react";
import type { Question } from "@/types";
import { MultipleChoiceQuestion } from "../questions/MultipleChoiceQuestion";
import { MatchingQuestion } from "../questions/MatchingQuestion";
import { ArrangementQuestion } from "../questions/ArrangementQuestion";
import { InputQuestion } from "../questions/InputQuestion";

interface QuestionRendererProps {
  question: Question;
  answers: Record<string, string>;
  matchingAnswers: Record<string, Record<string, string>>;
  arrangementAnswers: Record<string, string[]>;
  selectedLeft: Record<string, string | null> | string | null;
  matchingRightOptions: { left: string; right: string }[];

  onAnswerChange: (questionId: string, val: string) => void;
  onMatchingSelectLeft: (questionId: string, left: string | null) => void;
  onMatchingMatch: (questionId: string, left: string, right: string) => void;
  onArrangementAdd: (questionId: string, word: string) => void;
  onArrangementRemove: (questionId: string, idx: number) => void;
  onArrangementReset: (questionId: string) => void;
  showResults?: boolean;
}

export const QuestionRenderer: React.FC<QuestionRendererProps> = ({
  question,
  answers,
  matchingAnswers,
  arrangementAnswers,
  selectedLeft,
  matchingRightOptions,

  onAnswerChange,
  onMatchingSelectLeft,
  onMatchingMatch,
  onArrangementAdd,
  onArrangementRemove,
  onArrangementReset,
  showResults = false,
}) => {
  if (question.type === "MCQ" || question.type === "Scenario") {
    return (
      <MultipleChoiceQuestion
        question={question}
        selectedAnswer={answers[question.id]}
        onSelect={(ans) => onAnswerChange(question.id, ans)}
        showResults={showResults}
      />
    );
  }

  if (question.type === "Matching") {
    const currentSelectedLeft =
      typeof selectedLeft === "object" && selectedLeft !== null
        ? (selectedLeft as Record<string, string | null>)[question.id] || null
        : (selectedLeft as string | null);

    return (
      <MatchingQuestion
        question={question}
        matchingAnswers={matchingAnswers[question.id] || {}}
        selectedLeft={currentSelectedLeft}
        onSelectLeft={(left) => onMatchingSelectLeft(question.id, left)}
        onMatch={(left, right) => onMatchingMatch(question.id, left, right)}
        shuffledRightOptions={matchingRightOptions}
        showResults={showResults}
      />
    );
  }

  if (question.type === "Arrangement") {
    return (
      <ArrangementQuestion
        question={question}
        selectedWords={arrangementAnswers[question.id] || []}
        onAddWord={(word) => onArrangementAdd(question.id, word)}
        onRemoveWord={(idx) => onArrangementRemove(question.id, idx)}
        onReset={() => onArrangementReset(question.id)}
        showResults={showResults}
      />
    );
  }

  return (
    <InputQuestion
      question={question}
      value={answers[question.id] || ""}
      onChange={(val) => onAnswerChange(question.id, val)}
      showResults={showResults}
    />
  );
};
