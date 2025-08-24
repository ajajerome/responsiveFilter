using System.Collections.Generic;
using System.IO;
using UnityEngine;

namespace Fotbollsresan.Interactive.Formation
{
    public class FormationController : MonoBehaviour
    {
        [SerializeField] private FormationDefinition current;
        [SerializeField] private List<string> placedRoles = new List<string>();

        public void LoadFromJsonText(string json)
        {
            var bank = JsonUtility.FromJson<FormationBank>(json);
            if (bank?.Formations != null && bank.Formations.Count > 0)
            {
                current = bank.Formations[0];
                placedRoles.Clear();
            }
        }

        public void LoadFromStreamingAssets(string relativePath)
        {
            var fullPath = Path.Combine(Application.streamingAssetsPath, relativePath);
            if (File.Exists(fullPath))
            {
                var json = File.ReadAllText(fullPath);
                LoadFromJsonText(json);
            }
        }

        // Call when user places a role e.g., dropping a marker on a slot
        public void MarkRolePlaced(string role, bool correct)
        {
            if (!placedRoles.Contains(role))
            {
                placedRoles.Add(role);
            }
        }

        public int GetPlacedCount()
        {
            return placedRoles.Count;
        }

        public int GetTotalSlots()
        {
            return current?.Slots?.Count ?? 0;
        }
    }
}

