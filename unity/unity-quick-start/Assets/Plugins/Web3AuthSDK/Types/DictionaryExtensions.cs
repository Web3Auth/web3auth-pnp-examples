using System.Collections.Generic;

public static class DictionaryExtensions
{
    public static Dictionary<string, string> mergeMaps(this Dictionary<string, string> source, Dictionary<string, string> other)
    {
        if (source == null && other == null)
        {
            return null;
        }
        else if (source == null)
        {
            return new Dictionary<string, string>(other);
        }
        else if (other == null)
        {
            return new Dictionary<string, string>(source);
        }

        var mergedMap = new Dictionary<string, string>(source);
        foreach (var entry in other)
        {
            mergedMap[entry.Key] = entry.Value;
        }

        return mergedMap;
    }
}
