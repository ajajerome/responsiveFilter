using UnityEngine;
using TMPro;

namespace Fotbollsresan.UI.Theme
{
    [CreateAssetMenu(menuName = "Fotbollsresan/ThemeConfig", fileName = "ThemeConfig")]
    public class ThemeConfig : ScriptableObject
    {
        [Header("Colors")]
        public Color Primary = new Color32(0x00, 0xCF, 0xFF, 0xFF);   // #00CFFF
        public Color Secondary = new Color32(0xFF, 0x2D, 0xAA, 0xFF); // #FF2DAA
        public Color Background = new Color32(0x1A, 0x00, 0x33, 0xFF); // #1A0033
        public Color Text = Color.white;                               // #FFFFFF
        public Color Complement = new Color32(0x4C, 0xAF, 0x50, 0xFF);  // #4CAF50

        [Header("Typography")]
        public TMP_FontAsset HeadingFont;   // e.g., Orbitron/Audiowide
        public TMP_FontAsset BodyFont;      // e.g., Roboto/Montserrat
        public int H1Size = 42;
        public int H2Size = 32;
        public int BodySize = 18;

        [Header("Effects")]
        [Range(0f, 1f)] public float HeadingGlow = 0.5f;
        [Range(0f, 1f)] public float ButtonGlow = 0.6f;
        public Gradient CtaGradient; // from Primary to Secondary
    }
}

