using System;
using System.IO;
using UnityEngine;
using Fotbollsresan.Core.Events;

namespace Fotbollsresan.Core.Progression
{
    [Serializable]
    public class SeasonState
    {
        public int SeasonNumber = 1;
        public int SeasonXp = 0;
        public int Tier = 1; // 1..X
        public int Prestige = 0;
    }

    public class SeasonManager : MonoBehaviour
    {
        [SerializeField] private SeasonState state = new SeasonState();
        [SerializeField] private int tierXp = 500; // XP per tier
        private string SavePath => Path.Combine(Application.persistentDataPath, "season.json");

        private void OnEnable()
        {
            Load();
            GameEvents.OnXpGained += OnXpGained;
        }

        private void OnDisable()
        {
            GameEvents.OnXpGained -= OnXpGained;
            Save();
        }

        private void OnXpGained(XpGainedEvent e)
        {
            state.SeasonXp += e.Amount;
            while (state.SeasonXp >= tierXp)
            {
                state.SeasonXp -= tierXp;
                state.Tier += 1;
            }
            Save();
        }

        public void StartNewSeason()
        {
            state.SeasonNumber += 1;
            state.SeasonXp = 0;
            state.Tier = 1;
            Save();
        }

        public void PrestigeUp()
        {
            state.Prestige += 1;
            StartNewSeason();
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
            var s = JsonUtility.FromJson<SeasonState>(json);
            if (s != null) state = s;
        }

        public SeasonState GetState() => state;
    }
}

