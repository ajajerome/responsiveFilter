using System.Collections.Generic;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

namespace Fotbollsresan.Quiz
{
    public class QuizUIController : MonoBehaviour
    {
        [SerializeField] private QuizSystem quizSystem;
        [SerializeField] private TMP_Text promptText;
        [SerializeField] private List<Button> choiceButtons = new List<Button>();
        [SerializeField] private TMP_Text feedbackText;

        private void OnEnable()
        {
            RefreshUI();
        }

        public void RefreshUI()
        {
            var q = quizSystem?.Current;
            if (q == null) return;

            if (promptText != null) promptText.text = q.Prompt;

            for (int i = 0; i < choiceButtons.Count; i++)
            {
                var btn = choiceButtons[i];
                if (btn == null) continue;
                var label = btn.GetComponentInChildren<TMP_Text>();
                if (label != null)
                {
                    label.text = i < q.Choices.Count ? q.Choices[i] : "";
                }

                int captured = i;
                btn.onClick.RemoveAllListeners();
                btn.onClick.AddListener(() => OnChoiceClicked(captured));
                btn.gameObject.SetActive(i < q.Choices.Count);
            }

            if (feedbackText != null) feedbackText.text = "";
        }

        public void OnChoiceClicked(int index)
        {
            bool correct = quizSystem.SubmitAnswer(index);
            if (feedbackText != null)
            {
                feedbackText.text = correct ? "Rätt svar!" : "Fel svar.";
            }
        }

        public void OnNext()
        {
            if (quizSystem.MoveNext())
            {
                RefreshUI();
            }
        }
    }
}

