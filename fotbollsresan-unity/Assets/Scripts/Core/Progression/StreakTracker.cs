using System;
using System.IO;
using UnityEngine;
using Fotbollsresan.Core.Events;

namespace Fotbollsresan.Core.Progression
{
    [Serializable]
    public class StreakState
    {
        public string LastActiveDateIso;
        public int CurrentStreak;
        public int LongestStreak;
    }

    public class StreakTracker : MonoBehaviour
    {
        [SerializeField] private StreakState state = new StreakState();
        private string SavePath => Path.Combine(Application.persistentDataPath, "streak.json");

        private void OnEnable()
        {
            Load();
            GameEvents.OnActivity += OnActivity;
        }

        private void OnDisable()
        {
            GameEvents.OnActivity -= OnActivity;
        }

        private void OnActivity(ActivityEvent e)
        {
            var today = DateTime.UtcNow.Date;
            if (DateTime.TryParse(state.LastActiveDateIso, out var last))
            {
                var lastDate = last.Date;
                if (lastDate == today)
                {
                    // same day, nothing to change
                }
                else if (lastDate == today.AddDays(-1))
                {
                    state.CurrentStreak += 1;
                }
                else
                {
                    state.CurrentStreak = 1;
                }
            }
            else
            {
                state.CurrentStreak = 1;
            }

            state.LastActiveDateIso = today.ToString("o");
            if (state.CurrentStreak > state.LongestStreak) state.LongestStreak = state.CurrentStreak;
            Save();
        }

        private void Save()
        {
            var json = JsonUtility.ToJson(state, true);
            File.WriteAllText(SavePath, json);
        }

        private void Load()
        {
            if (!File.Exists(SavePath)) return;
            var json = File.ReadAllText(SavePath);
            var s = JsonUtility.FromJson<StreakState>(json);
            if (s != null) state = s;
        }

        public int CurrentStreak() => state.CurrentStreak;
        public int LongestStreak() => state.LongestStreak;
    }
}

