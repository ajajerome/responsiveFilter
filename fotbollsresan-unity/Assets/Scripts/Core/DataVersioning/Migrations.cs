using System;
using System.IO;
using UnityEngine;

namespace Fotbollsresan.Core.DataVersioning
{
    public static class Migrations
    {
        public static int LatestVersion => 1;

        public static void RunAll()
        {
            var current = DataVersion.LoadVersion();
            if (current < 1)
            {
                // v1: initialize if needed
                // Future: migrate profile fields, etc.
                DataVersion.SaveVersion(1);
            }
        }
    }
}

