using System;
using UnityEngine;

namespace Fotbollsresan.Core.Age
{
    public enum PlaySystem
    {
        FiveVFive,
        SevenVSeven,
        NineVNine,
        ElevenVEleven
    }

    public static class AgeService
    {
        public static int CalculateAgeInYears(DateTime birthDate, DateTime? now = null)
        {
            var today = now ?? DateTime.UtcNow;
            int age = today.Value.Year - birthDate.Year;
            if (birthDate.Date > today.Value.AddYears(-age))
            {
                age--;
            }
            return Mathf.Max(age, 0);
        }

        public static PlaySystem RecommendPlaySystem(int age)
        {
            if (age <= 8) return PlaySystem.FiveVFive;      // U7-U8
            if (age <= 10) return PlaySystem.SevenVSeven;    // U9-U10
            if (age <= 12) return PlaySystem.NineVNine;      // U11-U12
            return PlaySystem.ElevenVEleven;                 // 13+
        }
    }
}

