using System.Collections.Generic;
using System.Linq;
using Fotbollsresan.Core;
using Fotbollsresan.Core.Profile;
using UnityEngine;

namespace Fotbollsresan.Core.Badges
{
    public class BadgeSystem : MonoBehaviour
    {
        [SerializeField] private ProfileService profileService;

        private readonly Dictionary<string, System.Func<PlayerStats, bool>> badgeRules =
            new Dictionary<string, System.Func<PlayerStats, bool>>
            {
                { "Försvarsgeneral", stats => stats.TotalFormationCorrect >= 20 },
                { "Målspruta", stats => stats.TotalPassingCorrect >= 30 },
                { "Medspelaren", stats => stats.TotalPassingCorrect >= 15 && stats.TotalPassingChoices >= 25 },
                { "Regelmästare", stats => stats.TotalQuizCorrect >= 50 }
            };

        public void EvaluateAndAward()
        {
            var profile = profileService?.CurrentProfile;
            if (profile == null) return;
            var currentBadges = new HashSet<string>(profile.Badges ?? new string[0]);

            foreach (var kv in badgeRules)
            {
                if (kv.Value(profile.Stats))
                {
                    currentBadges.Add(kv.Key);
                }
            }

            profile.Badges = currentBadges.ToArray();
            profileService.SaveProfile();
        }
    }
}

