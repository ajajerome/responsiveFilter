using System;
using UnityEngine;

namespace Fotbollsresan.Core.Profile
{
    [Serializable]
    public class PlayerProfile
    {
        public string PlayerName;
        public DateTime BirthDate;
        public string PreferredPosition; // e.g., "Forward", "Midfielder", "Defender", "Goalkeeper"
        public Color SkinColor = Color.white;
        public string HairType = "Short";
        public int JerseyNumber = 10;
        public Color TeamColor = Color.green;
        public PlayerStats Stats = new PlayerStats();
        public string[] Badges = Array.Empty<string>();
        public System.Collections.Generic.List<MasteryEntry> Mastery = new System.Collections.Generic.List<MasteryEntry>();

        public int GetAgeInYears(DateTime? now = null)
        {
            var today = now ?? DateTime.UtcNow;
            int age = today.Value.Year - BirthDate.Year;
            if (BirthDate.Date > today.Value.AddYears(-age))
            {
                age--;
            }
            return Mathf.Max(age, 0);
        }
    }

    [Serializable]
    public class PlayerStats
    {
        public int TotalQuizAnswered = 0;
        public int TotalQuizCorrect = 0;
        public int TotalFormationPlaced = 0;
        public int TotalFormationCorrect = 0;
        public int TotalPassingChoices = 0;
        public int TotalPassingCorrect = 0;
    }

    [Serializable]
    public class MasteryEntry
    {
        public string Topic;          // e.g., "Defense", "Passing", "Tactics", "Rules"
        public int Attempts;          // total attempts
        public int Correct;           // correct answers
        public float Rating;          // 0..1000 simplified ELO-like score
        public string LastPracticedIso; // ISO 8601 string
    }
}

