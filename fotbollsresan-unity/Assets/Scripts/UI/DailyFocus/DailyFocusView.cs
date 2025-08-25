using TMPro;
using UnityEngine;
using Fotbollsresan.Core.Mastery;

namespace Fotbollsresan.UI.DailyFocus
{
    public class DailyFocusView : MonoBehaviour
    {
        [SerializeField] private MasteryTracker masteryTracker;
        [SerializeField] private TMP_Text title;
        [SerializeField] private TMP_Text description;

        private void OnEnable()
        {
            var topic = masteryTracker.RecommendDailyFocus();
            if (title != null) title.text = $"Dagens fokus: {topic}";
            if (description != null)
            {
                description.text = topic switch
                {
                    "Defense" => "Idag tränar vi försvarsspel: positionering och att vinna boll.",
                    "Passing" => "Idag tränar vi passningsspel: spelbarhet och tempo.",
                    "Tactics" => "Idag tränar vi taktik: formationer och roller.",
                    "Rules" => "Idag lär vi oss regler och fair play.",
                    _ => "Idag tränar vi på att bli bättre!"
                };
            }
        }
    }
}

