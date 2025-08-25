using UnityEditor;
using UnityEngine;
using UnityEngine.UI;
using TMPro;
using Fotbollsresan.UI.Theme;
using Fotbollsresan.UI.DailyFocus;

public static class CreateMainScene
{
    [MenuItem("Fotbollsresan/Create Main Scene")]
    public static void Create()
    {
        var scene = UnityEditor.SceneManagement.EditorSceneManager.NewScene(UnityEditor.SceneManagement.NewSceneSetup.EmptyScene);

        var canvasGo = new GameObject("Canvas", typeof(Canvas), typeof(CanvasScaler), typeof(GraphicRaycaster));
        var canvas = canvasGo.GetComponent<Canvas>();
        canvas.renderMode = RenderMode.ScreenSpaceOverlay;
        var scaler = canvasGo.GetComponent<CanvasScaler>();
        scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
        scaler.referenceResolution = new Vector2(1080, 1920);

        var themeGo = new GameObject("Theme");
        var applicator = themeGo.AddComponent<ThemeApplicator>();

        var bgPanel = new GameObject("Background", typeof(Image));
        bgPanel.transform.SetParent(canvasGo.transform, false);
        var bgImg = bgPanel.GetComponent<Image>();
        bgImg.rectTransform.anchorMin = Vector2.zero;
        bgImg.rectTransform.anchorMax = Vector2.one;
        bgImg.rectTransform.offsetMin = Vector2.zero;
        bgImg.rectTransform.offsetMax = Vector2.zero;

        // Title
        var titleGo = new GameObject("Title", typeof(TextMeshProUGUI), typeof(Fotbollsresan.UI.Theme.NeonGlow));
        titleGo.transform.SetParent(canvasGo.transform, false);
        var title = titleGo.GetComponent<TextMeshProUGUI>();
        title.text = "Välkommen till ArenaApp";
        title.fontSize = 44;
        var tRect = title.rectTransform;
        tRect.anchorMin = new Vector2(0.5f, 1f);
        tRect.anchorMax = new Vector2(0.5f, 1f);
        tRect.anchoredPosition = new Vector2(0, -120);

        // Daily Focus
        var focusGo = new GameObject("DailyFocus", typeof(TextMeshProUGUI), typeof(DailyFocusView));
        focusGo.transform.SetParent(canvasGo.transform, false);
        var focusText = focusGo.GetComponent<TextMeshProUGUI>();
        focusText.text = "Dagens fokus: ...";
        var focusRect = focusText.rectTransform;
        focusRect.anchorMin = new Vector2(0.5f, 1f);
        focusRect.anchorMax = new Vector2(0.5f, 1f);
        focusRect.anchoredPosition = new Vector2(0, -200);

        // CTA Button
        var ctaGo = new GameObject("StartaMatch", typeof(Button), typeof(Image), typeof(Fotbollsresan.UI.Theme.NeonButton));
        ctaGo.transform.SetParent(canvasGo.transform, false);
        var ctaRect = ctaGo.GetComponent<RectTransform>();
        ctaRect.sizeDelta = new Vector2(600, 140);
        ctaRect.anchorMin = new Vector2(0.5f, 0.5f);
        ctaRect.anchorMax = new Vector2(0.5f, 0.5f);
        ctaRect.anchoredPosition = new Vector2(0, 0);
        var ctaLabelGo = new GameObject("Label", typeof(TextMeshProUGUI));
        ctaLabelGo.transform.SetParent(ctaGo.transform, false);
        var ctaLabel = ctaLabelGo.GetComponent<TextMeshProUGUI>();
        ctaLabel.text = "Starta Match";
        ctaLabel.alignment = TextAlignmentOptions.Center;
        var labelRect = ctaLabel.rectTransform;
        labelRect.anchorMin = Vector2.zero;
        labelRect.anchorMax = Vector2.one;
        labelRect.offsetMin = Vector2.zero;
        labelRect.offsetMax = Vector2.zero;

        // Bottom Nav (Home, Dashboard, Profil)
        var navGo = new GameObject("BottomNav", typeof(RectTransform));
        navGo.transform.SetParent(canvasGo.transform, false);
        var navRect = navGo.GetComponent<RectTransform>();
        navRect.anchorMin = new Vector2(0, 0);
        navRect.anchorMax = new Vector2(1, 0);
        navRect.sizeDelta = new Vector2(0, 200);
        navRect.anchoredPosition = new Vector2(0, 0);

        string[] tabs = { "Hem", "Dashboard", "Profil" };
        for (int i = 0; i < tabs.Length; i++)
        {
            var tab = new GameObject(tabs[i], typeof(Button), typeof(Image), typeof(Fotbollsresan.UI.Theme.NeonButton));
            tab.transform.SetParent(navGo.transform, false);
            var rt = tab.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(i / 3f, 0);
            rt.anchorMax = new Vector2((i + 1) / 3f, 1);
            rt.offsetMin = Vector2.zero;
            rt.offsetMax = Vector2.zero;
            var textGo = new GameObject("Label", typeof(TextMeshProUGUI));
            textGo.transform.SetParent(tab.transform, false);
            var txt = textGo.GetComponent<TextMeshProUGUI>();
            txt.text = tabs[i];
            txt.alignment = TextAlignmentOptions.Center;
            var tr = txt.rectTransform;
            tr.anchorMin = Vector2.zero;
            tr.anchorMax = Vector2.one;
            tr.offsetMin = Vector2.zero;
            tr.offsetMax = Vector2.zero;
        }

        // Save
        System.IO.Directory.CreateDirectory("Assets/Scenes");
        UnityEditor.SceneManagement.EditorSceneManager.SaveScene(scene, "Assets/Scenes/Main.unity");
        AssetDatabase.SaveAssets();
    }
}

