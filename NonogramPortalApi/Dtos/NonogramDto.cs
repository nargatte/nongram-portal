using System;
using NonogramPortalApi.Enums;

namespace NonogramPortalApi.Dtos
{
    public class NonogramDto
    {
        public string Name { get; set; }
        public AccessMode AccessMode { get; set; }
        public int Difficulty { get; set; }
        public DateTime CreationDate { get; set; }

        public int[] RuleIndexes { get; set; }
        public byte[] Rules { get; set; }
        public byte[] Fields { get; set; }

        public  byte[] Dimensions { get; set; }
        public  CommentDto[] Comments { get; set; }
        public  ColourDto[] Colors { get; set; }

        public double TotalRate { get; set; }
        public int PlayerRate { get; set; }
        public string UserId { get; set; }
        public string AvatarHash { get; set; }
    }
}