using System;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

namespace Fotbollsresan.UI.Avatar
{
    public class AvatarCreatorUI : MonoBehaviour
    {
        [Header("Refs")]
        [SerializeField] private AvatarCreator avatarCreator;

        [Header("UI Elements")]
        [SerializeField] private TMP_InputField nameInput;
        [SerializeField] private TMP_InputField birthdateIsoInput; // format: YYYY-MM-DD
        [SerializeField] private TMP_Dropdown positionDropdown; // values: Any/Forward/Midfielder/Defender/Goalkeeper
        [SerializeField] private Slider skinR;
        [SerializeField] private Slider skinG;
        [SerializeField] private Slider skinB;
        [SerializeField] private Image skinPreview;

        private void Start()
        {
            if (positionDropdown != null && positionDropdown.options.Count == 0)
            {
                positionDropdown.options.Add(new TMP_Dropdown.OptionData("Any"));
                positionDropdown.options.Add(new TMP_Dropdown.OptionData("Forward"));
                positionDropdown.options.Add(new TMP_Dropdown.OptionData("Midfielder"));
                positionDropdown.options.Add(new TMP_Dropdown.OptionData("Defender"));
                positionDropdown.options.Add(new TMP_Dropdown.OptionData("Goalkeeper"));
            }

            UpdateSkinPreview();
        }

        public void OnNameChanged(string value)
        {
            avatarCreator.SetName(value);
        }

        public void OnBirthdateChanged(string iso)
        {
            // Accept "YYYY-MM-DD" by converting to DateTime
            if (DateTime.TryParse(iso, out var dt))
            {
                avatarCreator.SetBirthDateFromIso(dt.ToString("o"));
            }
        }

        public void OnPositionChanged(int optionIndex)
        {
            if (positionDropdown == null) return;
            var pos = positionDropdown.options[optionIndex].text;
            avatarCreator.SetPreferredPosition(pos);
        }

        public void OnSkinChanged()
        {
            var color = new Color(skinR?.value ?? 1f, skinG?.value ?? 1f, skinB?.value ?? 1f, 1f);
            avatarCreator.SetSkinColor(color);
            UpdateSkinPreview();
        }

        private void UpdateSkinPreview()
        {
            if (skinPreview == null) return;
            var color = new Color(skinR?.value ?? 1f, skinG?.value ?? 1f, skinB?.value ?? 1f, 1f);
            skinPreview.color = color;
        }
    }
}

