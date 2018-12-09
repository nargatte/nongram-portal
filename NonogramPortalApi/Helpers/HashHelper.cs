using System.Security.Cryptography;
using System.Text;

namespace NonogramPortalApi.Helpers
{
    public static class HashHelper
    {
        public static string GetHashFromMail(string mail)
        {
            mail = mail.Trim();
            mail = mail.ToLower();

            using (MD5 md5Hash = MD5.Create())
            {
                return GetMd5Hash(md5Hash, mail);
            }
        }

        private static string GetMd5Hash(MD5 md5Hash, string input)
        {
            byte[] data = md5Hash.ComputeHash(Encoding.UTF8.GetBytes(input));
            StringBuilder sBuilder = new StringBuilder();
            for (int i = 0; i < data.Length; i++)
            {
                sBuilder.Append(data[i].ToString("x2"));
            }
            return sBuilder.ToString();
        }

    }
}