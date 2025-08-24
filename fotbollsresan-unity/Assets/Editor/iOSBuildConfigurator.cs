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
            var env = System.Environment.GetEnvironmentVariable("APP_ENV") ?? "staging";
            var overrideId = System.Environment.GetEnvironmentVariable("BUNDLE_ID");
            var baseId = System.Environment.GetEnvironmentVariable("BUNDLE_BASE") ?? "com.fotbollsresan.app";
            var idToUse = string.IsNullOrEmpty(overrideId) ? baseId : overrideId;
            var bundle = env == "production" ? idToUse : idToUse + ".staging";
            PlayerSettings.SetApplicationIdentifier(BuildTargetGroup.iOS, bundle);

            // Define symbols
            var defines = PlayerSettings.GetScriptingDefineSymbolsForGroup(BuildTargetGroup.iOS);
            if (!defines.Contains("STAGING") && env == "staging")
            {
                defines = string.IsNullOrEmpty(defines) ? "STAGING" : defines + ";STAGING";
                PlayerSettings.SetScriptingDefineSymbolsForGroup(BuildTargetGroup.iOS, defines);
            }
        }
    }
}

