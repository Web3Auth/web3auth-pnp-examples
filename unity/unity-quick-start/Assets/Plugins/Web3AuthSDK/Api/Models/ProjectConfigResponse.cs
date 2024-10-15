using System.Collections.Generic;

public class WhitelistResponse
{
    public List<string> urls { get; set; }
    public Dictionary<string, string> signed_urls { get; set; }
}

public class ProjectConfigResponse
{
    public WhiteLabelData whitelabel { get; set; }
    public bool sms_otp_enabled { get; set; }
    public bool wallet_connect_enabled { get; set; }
    public string wallet_connect_project_id { get; set; }
    public WhitelistResponse whitelist { get; set; }
}