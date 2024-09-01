using System.Collections.Generic;

public static class WhiteLabelDataExtensions
{
    public static WhiteLabelData merge(this WhiteLabelData target, WhiteLabelData other)
    {
        if (target == null)
            return other;
        if (other == null)
            return target;

        return new WhiteLabelData
        {
            appName = target.appName ?? other.appName,
            appUrl = target.appUrl ?? other.appUrl,
            logoLight = target.logoLight ?? other.logoLight,
            logoDark = target.logoDark ?? other.logoDark,
            defaultLanguage = target.defaultLanguage ?? other.defaultLanguage,
            mode = target.mode ?? other.mode,
            useLogoLoader = target.useLogoLoader ?? other.useLogoLoader,
            theme = mergeThemes(target.theme, other.theme)
        };
    }

    private static Dictionary<string, string> mergeThemes(Dictionary<string, string> targetTheme, Dictionary<string, string> otherTheme)
    {
        if (otherTheme == null || otherTheme.Count == 0)
            return targetTheme;
        if (targetTheme == null || targetTheme.Count == 0)
            return otherTheme;

        var mergedTheme = new Dictionary<string, string>(targetTheme);
        foreach (var kvp in targetTheme)
        {
            mergedTheme[kvp.Key] = kvp.Value;
        }
        foreach (var kvp in otherTheme)
        {
            if (!mergedTheme.ContainsKey(kvp.Key))
            {
                mergedTheme.Add(kvp.Key, kvp.Value);
            }
        }
        return mergedTheme;
    }
}