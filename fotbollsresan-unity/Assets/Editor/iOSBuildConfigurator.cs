using UnityEditor;
using UnityEditor.Build;
using UnityEditor.Build.Reporting;

public class iOSBuildConfigurator : IPreprocessBuildWithReport
{
    public int callbackOrder => 0;

    public void OnPreprocessBuild(BuildReport report)
    {
        if (report.summary.platform == BuildTarget.iOS)
        {
            PlayerSettings.iOS.appleDeveloperTeamID = System.Environment.GetEnvironmentVariable("APPLE_TEAM_ID");
            PlayerSettings.iOS.targetOSVersionString = "13.0";
            PlayerSettings.bundleVersion = System.Environment.GetEnvironmentVariable("APP_VERSION") ?? PlayerSettings.bundleVersion;
            PlayerSettings.iOS.buildNumber = System.Environment.GetEnvironmentVariable("APP_BUILD") ?? PlayerSettings.iOS.buildNumber;
        }
    }
}

