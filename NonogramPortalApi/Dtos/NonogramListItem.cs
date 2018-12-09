using System;
using NonogramPortalApi.Enums;

namespace NonogramPortalApi.Dtos
{
    public class NonogramListItem
    {
        public string Name { get; set; }
        public int Difficulty { get; set; }
        public DateTime CreationDate { get; set; }

        public int Size { get; set; }
        public int NumberOfDimensions { get; set; }
        public int NumberOfColors { get; set; }

        public int NumberOfPlays { get; set; }
        public int NumberOfWins { get; set; }
        public int AverageMinutesOfPlay { get; set; }

        public DateTime LastSaveDate { get; set; }
        public DateTime? EndDate { get; set; }

        public string UserId { get; set; }
        public string AvatarHash { get; set; }
    }
}