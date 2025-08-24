using System;

namespace Fotbollsresan.Core.Events
{
    public static class GameEvents
    {
        public static event Action<QuizAnsweredEvent> OnQuizAnswered;
        public static event Action<ActivityEvent> OnActivity;
        public static event Action<XpGainedEvent> OnXpGained;
        public static event Action<FormationPlacedEvent> OnFormationPlaced;
        public static event Action<PassingChoiceEvent> OnPassingChoice;

        public static void Emit(QuizAnsweredEvent e) => OnQuizAnswered?.Invoke(e);
        public static void Emit(ActivityEvent e) => OnActivity?.Invoke(e);
        public static void Emit(XpGainedEvent e) => OnXpGained?.Invoke(e);
        public static void Emit(FormationPlacedEvent e) => OnFormationPlaced?.Invoke(e);
        public static void Emit(PassingChoiceEvent e) => OnPassingChoice?.Invoke(e);
    }

    public struct QuizAnsweredEvent
    {
        public string QuestionId;
        public string Topic;
        public bool Correct;
    }

    public struct ActivityEvent
    {
        public string Kind; // "quiz", "formation", "passing", etc
    }

    public struct XpGainedEvent
    {
        public int Amount;
        public string Source; // e.g., "quiz", "quest"
    }

    public struct FormationPlacedEvent
    {
        public string Role;
        public bool Correct;
    }

    public struct PassingChoiceEvent
    {
        public string SceneId;
        public string ChoiceId;
        public int Score;
    }
}

