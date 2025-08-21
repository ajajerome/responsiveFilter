import MatchFreeze from '@/components/questions/MatchFreeze';
import PassQuestionView from '@/components/questions/PassQuestion';
import DragDropQuestionView from '@/components/questions/DragDropQuestion';
import TimelineQuestionView from '@/components/questions/TimelineQuestion';
import type { Question } from '@/types/content';

type Props = { question: Question; onAnswer: (isCorrect: boolean) => void };

export default function InteractiveQuestion({ question, onAnswer }: Props) {
  // Passa (drag line)
  if (question.type === 'matchscenario' && 'ballHolderId' in question) {
    return <PassQuestionView question={question as any} onAnswer={onAnswer} />;
  }
  // Frusen match (drag boll / klick zon/spelare)
  if (question.type === 'matchscenario') {
    return <MatchFreeze question={question as any} onAnswer={onAnswer} />;
  }
  // Placera spelare (drag_drop)
  if (question.type === 'drag_drop') {
    return <DragDropQuestionView question={question as any} onAnswer={onAnswer} />;
  }
  // Timeline (play -> pause -> choices)
  if (question.type === 'timeline') {
    return <TimelineQuestionView question={question as any} onAnswer={onAnswer} />;
  }
  return null;
}

