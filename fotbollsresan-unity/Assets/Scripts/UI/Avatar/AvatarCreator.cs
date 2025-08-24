using System;
using Fotbollsresan.Core;
using Fotbollsresan.Core.Profile;
using UnityEngine;

namespace Fotbollsresan.UI.Avatar
{
    public class AvatarCreator : MonoBehaviour
    {
        [SerializeField] private ProfileService profileService;

        public void SetName(string playerName)
        {
            profileService.CurrentProfile.PlayerName = playerName ?? string.Empty;
            profileService.SaveProfile();
        }

        public void SetBirthDateFromIso(string iso)
        {
            if (DateTime.TryParse(iso, out var dt))
            {
                profileService.CurrentProfile.BirthDate = dt.Date;
                profileService.SaveProfile();
            }
        }

        public void SetPreferredPosition(string position)
        {
            profileService.CurrentProfile.PreferredPosition = position ?? string.Empty;
            profileService.SaveProfile();
        }

        public void SetSkinColor(Color color)
        {
            profileService.CurrentProfile.SkinColor = color;
            profileService.SaveProfile();
        }
    }
}

