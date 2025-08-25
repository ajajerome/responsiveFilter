using System;
using System.IO;
using UnityEngine;

namespace Fotbollsresan.Core.DataVersioning
{
    [Serializable]
    public class DataVersionState
    {
        public int Version = 1;
    }

    public static class DataVersion
    {
        private static string Path => System.IO.Path.Combine(Application.persistentDataPath, "data_version.json");

        public static int LoadVersion()
        {
            if (!File.Exists(Path)) return 0;
            var json = File.ReadAllText(Path);
            var s = JsonUtility.FromJson<DataVersionState>(json);
            return s?.Version ?? 0;
        }

        public static void SaveVersion(int v)
        {
            var json = JsonUtility.ToJson(new DataVersionState{ Version = v }, true);
            File.WriteAllText(Path, json);
        }
    }
}

