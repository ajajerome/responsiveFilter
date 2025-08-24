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
}

