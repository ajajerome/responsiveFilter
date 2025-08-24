using System;
using System.IO;
using UnityEngine;
using Fotbollsresan.Core.Profile;

namespace Fotbollsresan.Core
{
    public class ProfileService : MonoBehaviour
    {
        public PlayerProfile CurrentProfile;

        private string ProfilePath => Path.Combine(Application.persistentDataPath, "profile.json");

        private void Awake()
        {
            LoadProfile();
            if (CurrentProfile == null)
            {
                CurrentProfile = new PlayerProfile
                {
                    PlayerName = "",
                    BirthDate = DateTime.UtcNow.Date,
                    PreferredPosition = "",
                    SkinColor = Color.white
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
            }

            public PlayerProfile ToProfile()
            {
                DateTime.TryParse(BirthDateIso, out var dt);
                return new PlayerProfile
                {
                    PlayerName = PlayerName,
                    BirthDate = dt == default ? DateTime.UtcNow.Date : dt,
                    PreferredPosition = PreferredPosition,
                    SkinColor = new Color(SkinR, SkinG, SkinB, SkinA)
                };
            }
        }
    }
}

