using System;
using System.Collections.Generic;
using UnityEngine;

namespace Fotbollsresan.Interactive.Passing
{
    [Serializable]
    public class PassingChoice
    {
        public string Id; // e.g., "A", "B", "C"
        public string Label;
        public int Score; // 100/50/0 etc
        public string NextId; // optional next scene id
        public string Explanation;
    }

    [Serializable]
    public class PassingScene
    {
        public string Id;
        public string Prompt;
        public List<PassingChoice> Choices = new List<PassingChoice>();
    }

    [Serializable]
    public class PassingSequenceDef
    {
        public string StartId;
        public List<PassingScene> Scenes = new List<PassingScene>();

        public PassingScene Find(string id)
        {
            return Scenes.Find(s => s.Id == id);
        }
    }

    public class PassingSequenceRunner : MonoBehaviour
    {
        [SerializeField] private PassingSequenceDef sequence;
        [SerializeField] private string currentId;
        [SerializeField] private int totalScore;

        public void LoadFromJson(string json)
        {
            var def = JsonUtility.FromJson<PassingSequenceDef>(json);
            if (def != null)
            {
                sequence = def;
                currentId = string.IsNullOrEmpty(def.StartId) && def.Scenes.Count > 0 ? def.Scenes[0].Id : def.StartId;
                totalScore = 0;
            }
        }

        public PassingScene Current()
        {
            return sequence?.Find(currentId);
        }

        public bool Choose(int index, out string explanation)
        {
            explanation = string.Empty;
            var scene = Current();
            if (scene == null || index < 0 || index >= scene.Choices.Count) return false;
            var choice = scene.Choices[index];
            totalScore += choice.Score;
            explanation = choice.Explanation;
            if (!string.IsNullOrEmpty(choice.NextId))
            {
                currentId = choice.NextId;
                return true;
            }
            return false; // sequence ended
        }

        public int TotalScore() => totalScore;
    }
}

