using System;
using System.IO;
using UnityEngine;

namespace Fotbollsresan.Core.Progression
{
    [Serializable]
    public class LevelState
    {
        public int Level = 1;
        public int CurrentXp = 0;
        public int XpToNext = 100;
    }

    public class LevelSystem : MonoBehaviour
    {
        [SerializeField] private LevelState state = new LevelState();

        private string SavePath => Path.Combine(Application.persistentDataPath, "level.json");

        public int Level => state.Level;
        public int CurrentXp => state.CurrentXp;
        public int XpToNext => state.XpToNext;

        private void Awake()
        {
            Load();
        }

        public void AddXp(int amount)
        {
            if (amount <= 0) return;
            state.CurrentXp += amount;
            while (state.CurrentXp >= state.XpToNext)
            {
                state.CurrentXp -= state.XpToNext;
                state.Level += 1;
                state.XpToNext = CalculateXpForLevel(state.Level);
            }
            Save();
        }

        private int CalculateXpForLevel(int level)
        {
            // Enkel kurva: 100, 150, 225, ...
            var baseXp = 100;
            var factor = 1.5f;
            return Mathf.RoundToInt(baseXp * Mathf.Pow(factor, Mathf.Max(level - 1, 0)));
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
            var loaded = JsonUtility.FromJson<LevelState>(json);
            if (loaded != null) state = loaded;
        }
    }
}

