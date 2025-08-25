using UnityEngine;
using UnityEngine.UI;

namespace Fotbollsresan.UI.Theme
{
    [RequireComponent(typeof(Graphic))]
    public class NeonGlow : MonoBehaviour
    {
        [SerializeField] private Color glowColor = new Color32(0xFF, 0x2D, 0xAA, 0xFF);
        [SerializeField] [Range(0f, 1f)] private float intensity = 0.6f;

        private Shadow shadow;
        private Outline outline;

        private void Reset()
        {
            EnsureComponents();
        }

        private void Awake()
        {
            EnsureComponents();
            Apply();
        }

        private void EnsureComponents()
        {
            outline = gameObject.GetComponent<Outline>();
            if (outline == null) outline = gameObject.AddComponent<Outline>();
            shadow = gameObject.GetComponent<Shadow>();
            if (shadow == null) shadow = gameObject.AddComponent<Shadow>();
        }

        public void SetGlow(Color color, float newIntensity)
        {
            glowColor = color;
            intensity = newIntensity;
            Apply();
        }

        private void Apply()
        {
            if (outline != null)
            {
                outline.effectColor = new Color(glowColor.r, glowColor.g, glowColor.b, intensity);
                outline.effectDistance = new Vector2(2f, 2f);
            }
            if (shadow != null)
            {
                shadow.effectColor = new Color(glowColor.r, glowColor.g, glowColor.b, intensity * 0.8f);
                shadow.effectDistance = new Vector2(4f, -4f);
            }
        }
    }
}

