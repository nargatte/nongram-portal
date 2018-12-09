using System;
using System.Linq;

namespace NonogramPortalApi.Helpers
{
    public static class RandomStringHelper
    {
        public static string GenerateRandomString(Random random)
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            return new string(Enumerable.Repeat(chars, 50)
                .Select(s => s[random.Next(s.Length)]).ToArray());
        }
    }
}