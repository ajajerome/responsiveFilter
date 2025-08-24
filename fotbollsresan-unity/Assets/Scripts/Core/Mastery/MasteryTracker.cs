using System;
using System.Linq;
using System.Collections.Generic;
using UnityEngine;
using Fotbollsresan.Core;
using Fotbollsresan.Core.Profile;

namespace Fotbollsresan.Core.Mastery
{
    public class MasteryTracker : MonoBehaviour
    {
        [SerializeField] private ProfileService profileService;

        public void Record(string topic, bool correct)
        {
            var profile = profileService.CurrentProfile;
            if (profile == null || string.IsNullOrEmpty(topic)) return;
            var list = profile.Mastery;
            var entry = list.FirstOrDefault(e => e.Topic == topic);
            if (entry == null)
            {
                entry = new MasteryEntry
                {
                    Topic = topic,
                    Attempts = 0,
                    Correct = 0,
                    Rating = 500,
                    LastPracticedIso = DateTime.UtcNow.ToString("o")
                };
                list.Add(entry);
            }

            entry.Attempts += 1;
            if (correct) entry.Correct += 1;
            entry.LastPracticedIso = DateTime.UtcNow.ToString("o");

            // Enkel rating: +- 10
            entry.Rating = Mathf.Clamp(entry.Rating + (correct ? 10 : -10), 0, 1000);
            profileService.SaveProfile();
        }

        public string RecommendDailyFocus()
        {
            var profile = profileService.CurrentProfile;
            if (profile == null || profile.Mastery.Count == 0)
            {
                return "Defense"; // default
            }
            // Välj lägsta rating som fokus
            var lowest = profile.Mastery.OrderBy(e => e.Rating).First();
            return lowest.Topic;
        }
    }
}

