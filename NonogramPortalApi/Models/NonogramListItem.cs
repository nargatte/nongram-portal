using System;

namespace NonogramPortalApi.Models
{
    public class NonogramListItem
    {
        public string Name { get; set; }
        public int Difficulty { get; set; }
        public int Size { get; set; }
        public int NumberOfPlays { get; set; }
        public int AverageTimeOfPlay { get; set; }
        public DateTime AddDate { get; set; }
        public int NumberOfDimensions { get; set; }
        public int NumberOfColors { get; set; }
    }
}