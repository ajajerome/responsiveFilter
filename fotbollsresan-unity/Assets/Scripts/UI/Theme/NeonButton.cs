using UnityEngine;
using UnityEngine.UI;

namespace Fotbollsresan.UI.Theme
{
    [RequireComponent(typeof(Button))]
    public class NeonButton : MonoBehaviour
    {
        [SerializeField] private ThemeConfig theme;
        [SerializeField] private Image background;
        [SerializeField] private NeonGlow glow;

        private void Reset()
        {
            background = GetComponent<Image>();
            glow = GetComponent<NeonGlow>();
            if (glow == null) glow = gameObject.AddComponent<NeonGlow>();
        }

        private void Awake()
        {
            Apply();
        }

        public void Apply()
        {
            if (theme == null) return;
            if (background != null)
            {
                background.color = theme.Primary;
            }
            if (glow != null)
            {
                glow.SetGlow(theme.Secondary, theme.ButtonGlow);
            }
        }
    }
}

