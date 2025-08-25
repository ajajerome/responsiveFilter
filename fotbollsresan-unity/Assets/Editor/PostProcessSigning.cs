using UnityEditor;
using UnityEditor.Callbacks;
using UnityEditor.iOS.Xcode;
using System.IO;

public static class PostProcessSigning
{
    [PostProcessBuild]
    public static void OnPostProcessBuild(BuildTarget target, string pathToBuiltProject)
    {
        if (target != BuildTarget.iOS) return;

        var projPath = PBXProject.GetPBXProjectPath(pathToBuiltProject);
        var proj = new PBXProject();
        proj.ReadFromFile(projPath);

        var mainTarget = proj.GetUnityMainTargetGuid();
        var teamId = System.Environment.GetEnvironmentVariable("APPLE_TEAM_ID");
        if (!string.IsNullOrEmpty(teamId))
        {
            proj.SetTeamId(mainTarget, teamId);
        }

        proj.WriteToFile(projPath);

        var plistPath = Path.Combine(pathToBuiltProject, "Info.plist");
        var plist = new PlistDocument();
        plist.ReadFromFile(plistPath);
        plist.root.SetString("CFBundleShortVersionString", PlayerSettings.bundleVersion);
        plist.root.SetString("CFBundleVersion", PlayerSettings.iOS.buildNumber);
        File.WriteAllText(plistPath, plist.WriteToString());
    }
}

