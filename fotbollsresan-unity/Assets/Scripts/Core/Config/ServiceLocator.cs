using UnityEngine;

namespace Fotbollsresan.Core.Config
{
    public class ServiceLocator : MonoBehaviour
    {
        public static ServiceLocator Instance { get; private set; }
        public EnvConfig Env;

        private void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }
            Instance = this;
            DontDestroyOnLoad(gameObject);

            if (Env == null)
            {
                Env = Resources.Load<EnvConfig>("Env/EnvConfig_Staging");
            }
        }
    }
}

