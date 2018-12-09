using System;

namespace NonogramPortalApi.DataBase.Entities
{
    public class Game
    {
        public int Id { get; set; }

        public DateTime StartDate { get; set; }
        public DateTime LastSaveDate { get; set; }
        public DateTime? EndDate { get; set; }
        public int RateStars { get; set; }
        public byte[] Fields { get; set; }

        public int NonogramId { get; set; }
        public virtual Nonogram Nonogram { get; set; }

        public string UserId { get; set; }
        public virtual User User { get; set; }
    }
}