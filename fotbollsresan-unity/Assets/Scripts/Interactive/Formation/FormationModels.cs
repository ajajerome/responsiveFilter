using System;
using System.Collections.Generic;
using UnityEngine;

namespace Fotbollsresan.Interactive.Formation
{
    [Serializable]
    public class FormationSlot
    {
        public string Role;   // e.g., LB, RB, CB, CM, LW, RW, ST
        public Vector2 Position; // normalized 0..1 in canvas or field
    }

    [Serializable]
    public class FormationDefinition
    {
        public string Id;         // e.g., "4-3-3"
        public string DisplayName; // localized name
        public List<FormationSlot> Slots = new List<FormationSlot>();
    }

    [Serializable]
    public class FormationBank
    {
        public List<FormationDefinition> Formations = new List<FormationDefinition>();
    }
}

