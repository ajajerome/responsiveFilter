using TMPro;
using UnityEngine;
using Fotbollsresan.Core.Progression;

namespace Fotbollsresan.UI.Season
{
    public class SeasonView : MonoBehaviour
    {
        [SerializeField] private SeasonManager seasonManager;
        [SerializeField] private TMP_Text header;
        [SerializeField] private TMP_Text progress;

        private void OnEnable()
        {
            Render();
        }

        public void Render()
        {
            var s = seasonManager.GetState();
            if (header != null) header.text = $"Säsong {s.SeasonNumber} • Tier {s.Tier} • Prestige {s.Prestige}";
            if (progress != null) progress.text = $"XP i säsong: {s.SeasonXp}";
        }

        public void OnPrestige()
        {
            seasonManager.PrestigeUp();
            Render();
        }
    }
}

