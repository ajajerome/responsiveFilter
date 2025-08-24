using TMPro;
using UnityEngine;
using UnityEngine.UI;

namespace Fotbollsresan.UI.Theme
{
    public class ThemeApplicator : MonoBehaviour
    {
        [SerializeField] private ThemeConfig theme;
        [SerializeField] private Image[] backgroundPanels;
        [SerializeField] private TMP_Text[] headings;
        [SerializeField] private TMP_Text[] bodyTexts;

        private void Awake()
        {
            Apply();
        }

        public void Apply()
        {
            if (theme == null) return;

            foreach (var img in backgroundPanels)
            {
                if (img == null) continue;
                img.color = theme.Background;
            }

            foreach (var h in headings)
            {
                if (h == null) continue;
                if (theme.HeadingFont != null) h.font = theme.HeadingFont;
                h.fontSize = theme.H1Size;
                h.color = theme.Secondary; // neonrosa
            }

            foreach (var b in bodyTexts)
            {
                if (b == null) continue;
                if (theme.BodyFont != null) b.font = theme.BodyFont;
                b.fontSize = theme.BodySize;
                b.color = theme.Text;
            }

            var cam = Camera.main;
            if (cam != null)
            {
                cam.backgroundColor = theme.Background;
            }
        }
    }
}

