using System;
using System.IO;
using UnityEngine;
using Fotbollsresan.Core.Profile;
using System.Linq;
using System.Collections.Generic;

namespace Fotbollsresan.Core
{
    public class ProfileService : MonoBehaviour
    {
        public static ProfileService Instance { get; private set; }
        public PlayerProfile CurrentProfile;

        private string ProfilePath => Path.Combine(Application.persistentDataPath, "profile.json");

        private void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }
            Instance = this;
            DontDestroyOnLoad(gameObject);

            LoadProfile();
            if (CurrentProfile == null)
            {
                CurrentProfile = new PlayerProfile
                {
                    PlayerName = "",
                    BirthDate = DateTime.UtcNow.Date,
                    PreferredPosition = "",
                    SkinColor = Color.white,
                    HairType = "Short",
                    JerseyNumber = 10,
                    TeamColor = Color.green,
                    Stats = new PlayerStats(),
                    Badges = Array.Empty<string>(),
                    Mastery = new List<MasteryEntry>()
                };
                SaveProfile();
            }
        }

        public void SaveProfile()
        {
            var wrapper = new SerializableProfile(CurrentProfile);
            var json = JsonUtility.ToJson(wrapper, true);
            File.WriteAllText(ProfilePath, json);
        }

        public void LoadProfile()
        {
            if (!File.Exists(ProfilePath))
            {
                CurrentProfile = null;
                return;
            }

            var json = File.ReadAllText(ProfilePath);
            var wrapper = JsonUtility.FromJson<SerializableProfile>(json);
            CurrentProfile = wrapper?.ToProfile();
        }

        private void OnDisable()
        {
            Debug.LogWarning($"{nameof(ProfileService)} was disabled. This service is expected to persist across scenes.");
        }

        private void OnDestroy()
        {
            if (Instance == this)
            {
                Debug.LogWarning($"{nameof(ProfileService)} was destroyed. Ensure exactly one persistent instance exists in the bootstrap scene.");
            }
        }

        [Serializable]
        private class SerializableProfile
        {
            public string PlayerName;
            public string BirthDateIso;
            public string PreferredPosition;
            public float SkinR;
            public float SkinG;
            public float SkinB;
            public float SkinA;
            public string HairType;
            public int JerseyNumber;
            public float TeamR;
            public float TeamG;
            public float TeamB;
            public float TeamA;
            public PlayerStats Stats;
            public string[] Badges;
            public MasteryEntry[] Mastery;

            public SerializableProfile() {}

            public SerializableProfile(PlayerProfile profile)
            {
                PlayerName = profile.PlayerName;
                BirthDateIso = profile.BirthDate.ToString("o");
                PreferredPosition = profile.PreferredPosition;
                SkinR = profile.SkinColor.r;
                SkinG = profile.SkinColor.g;
                SkinB = profile.SkinColor.b;
                SkinA = profile.SkinColor.a;
                HairType = profile.HairType;
                JerseyNumber = profile.JerseyNumber;
                TeamR = profile.TeamColor.r;
                TeamG = profile.TeamColor.g;
                TeamB = profile.TeamColor.b;
                TeamA = profile.TeamColor.a;
                Stats = profile.Stats;
                Badges = profile.Badges;
                Mastery = profile.Mastery?.ToArray();
            }

            public PlayerProfile ToProfile()
            {
                DateTime.TryParse(BirthDateIso, out var dt);
                return new PlayerProfile
                {
                    PlayerName = PlayerName,
                    BirthDate = dt == default ? DateTime.UtcNow.Date : dt,
                    PreferredPosition = PreferredPosition,
                    SkinColor = new Color(SkinR, SkinG, SkinB, SkinA),
                    HairType = HairType,
                    JerseyNumber = JerseyNumber,
                    TeamColor = new Color(TeamR, TeamG, TeamB, TeamA),
                    Stats = Stats ?? new PlayerStats(),
                    Badges = Badges ?? Array.Empty<string>(),
                    Mastery = Mastery != null ? new List<MasteryEntry>(Mastery) : new List<MasteryEntry>()
                };
            }
        }
    }
}

