using System.IO;
using UnityEditor;
using UnityEditor.Build.Reporting;

public static class BuildScript
{
    public static void BuildiOS()
    {
        var scenes = new[] { "Assets/Scenes/Main.unity" };
        var buildPath = Path.Combine("build/ios", "FotbollsresanXcode");
        Directory.CreateDirectory(buildPath);
        BuildPipeline.BuildPlayer(scenes, buildPath, BuildTarget.iOS, BuildOptions.None);
    }
}

