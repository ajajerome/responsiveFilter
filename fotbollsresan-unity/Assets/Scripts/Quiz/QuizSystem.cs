using System;
using System.Collections.Generic;
using System.IO;
using UnityEngine;
using Fotbollsresan.Core.Progression;
using Fotbollsresan.Core;
using Fotbollsresan.Core.Profile;
using static Fotbollsresan.Core.Age.AgeService;

namespace Fotbollsresan.Quiz
{
    [Serializable]
    public class QuizQuestion
    {
        public string Id;
        public string Prompt;
        public List<string> Choices = new List<string>();
        public int CorrectIndex;
        public string Explanation;
        public string Topic;     // e.g., "Defense", "Passing", "Rules", "Tactics"
        public string Difficulty; // e.g., "Easy", "Medium", "Hard"
    }

    public class QuizSystem : MonoBehaviour
    {
        [SerializeField] private List<QuizQuestion> questions = new List<QuizQuestion>();
        private int currentIndex = 0;
        [SerializeField] private LevelSystem levelSystem;
        [SerializeField] private ProfileService profileService;
        [SerializeField] private int correctXp = 25;
        [SerializeField] private int wrongXp = 5;

        public QuizQuestion Current => currentIndex >= 0 && currentIndex < questions.Count ? questions[currentIndex] : null;

        public bool SubmitAnswer(int choiceIndex)
        {
            var question = Current;
            if (question == null) return false;
            bool correct = question.CorrectIndex == choiceIndex;
            if (correct)
            {
                levelSystem?.AddXp(correctXp);
                if (profileService?.CurrentProfile != null)
                {
                    profileService.CurrentProfile.Stats.TotalQuizCorrect++;
                    profileService.CurrentProfile.Stats.TotalQuizAnswered++;
                    profileService.SaveProfile();
                }
            }
            else
            {
                levelSystem?.AddXp(wrongXp);
                if (profileService?.CurrentProfile != null)
                {
                    profileService.CurrentProfile.Stats.TotalQuizAnswered++;
                    profileService.SaveProfile();
                }
            }
            // Mastery hook
            if (!string.IsNullOrEmpty(question.Topic) && masteryTracker != null)
            {
                masteryTracker.Record(question.Topic, correct);
            }
            return correct;
        }

        public bool MoveNext()
        {
            if (currentIndex + 1 < questions.Count)
            {
                currentIndex++;
                return true;
            }
            return false;
        }

        [Serializable]
        private class QuizBank
        {
            public List<QuizQuestion> Questions = new List<QuizQuestion>();
        }

        public void LoadFromJsonText(string json)
        {
            var bank = JsonUtility.FromJson<QuizBank>(json);
            if (bank?.Questions != null)
            {
                questions = bank.Questions;
                currentIndex = 0;
            }
        }

        public void LoadFromStreamingAssets(string relativePath)
        {
            var fullPath = Path.Combine(Application.streamingAssetsPath, relativePath);
            if (File.Exists(fullPath))
            {
                var json = File.ReadAllText(fullPath);
                LoadFromJsonText(json);
            }
        }

        [SerializeField] private Fotbollsresan.Core.Mastery.MasteryTracker masteryTracker;
    }
}

