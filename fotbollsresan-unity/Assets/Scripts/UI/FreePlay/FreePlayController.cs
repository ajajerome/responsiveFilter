using System.Linq;
using Fotbollsresan.Core;
using Fotbollsresan.Core.Age;
using Fotbollsresan.Core.Exercises;
using UnityEngine;

namespace Fotbollsresan.UI.FreePlay
{
    public class FreePlayController : MonoBehaviour
    {
        [SerializeField] private ProfileService profileService;
        [SerializeField] private ExerciseRecommender recommender;

        public Exercise[] GetPositionSpecificExercises()
        {
            var profile = profileService.CurrentProfile;
            int age = AgeService.CalculateAgeInYears(profile.BirthDate);
            var list = recommender.Recommend(profile.PreferredPosition, age).ToArray();
            return list;
        }
    }
}

