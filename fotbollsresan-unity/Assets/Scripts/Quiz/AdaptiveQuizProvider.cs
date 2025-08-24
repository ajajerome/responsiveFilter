using System;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;
using static Fotbollsresan.Core.Age.AgeService;

namespace Fotbollsresan.Quiz
{
    [Serializable]
    public class QuizBankWithMeta
    {
        public List<QuizQuestion> Questions = new List<QuizQuestion>();
    }

    public class AdaptiveQuizProvider : MonoBehaviour
    {
        [SerializeField] private TextAsset[] quizBanks; // drag in JSON TextAssets

        public List<QuizQuestion> GetQuestions(AgeTier tier, string focusTopic = null)
        {
            var all = new List<QuizQuestion>();
            foreach (var ta in quizBanks)
            {
                if (ta == null) continue;
                try
                {
                    var bank = JsonUtility.FromJson<QuizBankWithMeta>(ta.text);
                    if (bank?.Questions != null) all.AddRange(bank.Questions);
                }
                catch {}
            }

            // Filter by target tier via Difficulty mapping and optional topic
            Func<QuizQuestion, bool> byTier = q => tier switch
            {
                AgeTier.Young => q.Difficulty == "Easy",
                AgeTier.Middle => q.Difficulty == "Medium",
                _ => q.Difficulty == "Hard" || q.Difficulty == "Medium"
            };

            var filtered = all.Where(byTier);
            if (!string.IsNullOrEmpty(focusTopic))
            {
                filtered = filtered.Where(q => string.Equals(q.Topic, focusTopic, StringComparison.OrdinalIgnoreCase));
            }

            return filtered.Take(20).ToList();
        }
    }
}

