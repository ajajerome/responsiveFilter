using System.Collections.Generic;
using System.Linq;
using UnityEngine;
using Fotbollsresan.Core.Age;

namespace Fotbollsresan.Core.Exercises
{
    [System.Serializable]
    public class Exercise
    {
        public string Id;
        public string Title;
        public string Description;
        public string PositionTag; // e.g., "Forward", "Midfielder", "Defender", "Goalkeeper" or "Any"
        public int MinAge;
        public int MaxAge;
        public PlaySystem PlaySystem;
    }

    public class ExerciseRecommender : MonoBehaviour
    {
        [SerializeField] private List<Exercise> allExercises = new List<Exercise>();

        public IEnumerable<Exercise> Recommend(string position, int age)
        {
            var system = AgeService.RecommendPlaySystem(age);
            var positionLower = string.IsNullOrEmpty(position) ? "any" : position.ToLowerInvariant();

            return allExercises.Where(e =>
                age >= e.MinAge && age <= e.MaxAge &&
                e.PlaySystem == system &&
                (e.PositionTag.ToLowerInvariant() == "any" || e.PositionTag.ToLowerInvariant() == positionLower)
            );
        }
    }
}

