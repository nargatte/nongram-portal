using System;

namespace NonogramPortalApi.Dtos
{
    public class GameDto
    {
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public DateTime LastSaveDate { get; set; }
        public int RateStars { get; set; }
        public byte[] Fields { get; set; }

        public int NonogramId { get; set; }
    }
}