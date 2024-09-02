using System;

public class SignResponse
{
    public bool success;
    public string result;
    public string error;

    public SignResponse(bool success, string result = null, string error = null)
    {
        this.success = success;
        this.result = result;
        this.error = error;
    }

    public override string ToString()
    {
        return $"SignResponse(success: {success}, result: {result}, error: {error})";
    }
}