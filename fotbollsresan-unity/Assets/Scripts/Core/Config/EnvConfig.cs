using UnityEngine;

namespace Fotbollsresan.Core.Config
{
    [CreateAssetMenu(menuName = "Fotbollsresan/EnvConfig", fileName = "EnvConfig")]
    public class EnvConfig : ScriptableObject
    {
        public string EnvironmentName; // "staging" | "production"
        public string ApiBaseUrl;
        public string ContentBucket;
        public bool EnableAnalytics;
    }
}

