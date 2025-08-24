using System;
using System.Collections.Generic;
using UnityEngine;

namespace Fotbollsresan.Quiz
{
    [Serializable]
    public class QuizQuestion
    {
        public string Id;
        public string Prompt;
        public List<string> Choices = new List<string>();
        public int CorrectIndex;
        public string Explanation;
    }

    public class QuizSystem : MonoBehaviour
    {
        [SerializeField] private List<QuizQuestion> questions = new List<QuizQuestion>();
        private int currentIndex = 0;

        public QuizQuestion Current => currentIndex >= 0 && currentIndex < questions.Count ? questions[currentIndex] : null;

        public bool SubmitAnswer(int choiceIndex)
        {
            var question = Current;
            if (question == null) return false;
            bool correct = question.CorrectIndex == choiceIndex;
            return correct;
        }

        public bool MoveNext()
        {
            if (currentIndex + 1 < questions.Count)
            {
                currentIndex++;
                return true;
            }
            return false;
        }
    }
}

