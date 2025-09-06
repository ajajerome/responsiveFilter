using System;
using System.Collections.Generic;
using System.IO;
using UnityEngine;
using Fotbollsresan.Core.Events;

namespace Fotbollsresan.Core.Quests
{
    [Serializable]
    public class Quest
    {
        public string Id;
        public string Title;
        public string Type; // quiz, formation, passing
        public int Target;  // e.g., 10
        public int RewardXp; // e.g., 100
        public bool Weekly; // false => daily
    }

    [Serializable]
    public class QuestProgress
    {
        public string QuestId;
        public int Count;
        public bool Completed;
        public string PeriodKey; // date YYYY-MM-DD or week number
    }

    [Serializable]
    public class QuestBank
    {
        public List<Quest> Quests = new List<Quest>();
    }

    public class QuestSystem : MonoBehaviour
    {
        [SerializeField] private List<Quest> active = new List<Quest>();
        [SerializeField] private List<QuestProgress> progress = new List<QuestProgress>();

        private string SavePath => Path.Combine(Application.persistentDataPath, "quests.json");

        private void OnEnable()
        {
            Load();
            GameEvents.OnActivity += OnActivity;
        }

        private void OnDisable()
        {
            Debug.Log($"{nameof(QuestSystem)} disabling – unsubscribing and saving.");
            GameEvents.OnActivity -= OnActivity;
            Save();
        }

        private void OnDestroy()
        {
            Debug.Log($"{nameof(QuestSystem)} destroyed.");
        }

        public void LoadBankFromStreamingAssets(string relativePath)
        {
            var full = Path.Combine(Application.streamingAssetsPath, relativePath);
            if (!File.Exists(full)) return;
            var json = File.ReadAllText(full);
            var bank = JsonUtility.FromJson<QuestBank>(json);
            if (bank?.Quests != null)
            {
                active = bank.Quests;
                progress.Clear();
                Save();
            }
        }

        private void OnActivity(ActivityEvent e)
        {
            var todayKey = DateTime.UtcNow.ToString("yyyy-MM-dd");
            foreach (var q in active)
            {
                bool match = (q.Type == e.Kind);
                if (!match) continue;
                var key = q.Weekly ? ISOWeekString(DateTime.UtcNow) : todayKey;
                var pg = progress.Find(p => p.QuestId == q.Id && p.PeriodKey == key);
                if (pg == null)
                {
                    pg = new QuestProgress { QuestId = q.Id, Count = 0, Completed = false, PeriodKey = key };
                    progress.Add(pg);
                }
                if (!pg.Completed)
                {
                    pg.Count += 1;
                    if (pg.Count >= q.Target)
                    {
                        pg.Completed = true;
                        GameEvents.Emit(new XpGainedEvent{ Amount = q.RewardXp, Source = "quest" });
                    }
                }
            }
            Save();
        }

        private static string ISOWeekString(DateTime date)
        {
            var cal = System.Globalization.CultureInfo.InvariantCulture.Calendar;
            var week = cal.GetWeekOfYear(date, System.Globalization.CalendarWeekRule.FirstFourDayWeek, DayOfWeek.Monday);
            return $"{date.Year}-W{week:00}";
        }

        private void Save()
        {
            var wrapper = new Wrapper { Active = active, Progress = progress };
            var json = JsonUtility.ToJson(wrapper, true);
            File.WriteAllText(SavePath, json);
        }

        private void Load()
        {
            if (!File.Exists(SavePath)) return;
            var json = File.ReadAllText(SavePath);
            var wrapper = JsonUtility.FromJson<Wrapper>(json);
            if (wrapper != null)
            {
                active = wrapper.Active ?? new List<Quest>();
                progress = wrapper.Progress ?? new List<QuestProgress>();
            }
        }

        [Serializable]
        private class Wrapper
        {
            public List<Quest> Active;
            public List<QuestProgress> Progress;
        }
    }
}

