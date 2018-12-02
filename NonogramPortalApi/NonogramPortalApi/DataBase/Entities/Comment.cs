using System;

namespace NonogramPortalApi.DataBase.Entities
{
    public class Comment
    {
        public int Id { get; set; }

        public string Content { get; set; }
        public DateTime DateTime { get; set; }

        public string UserId { get; set; }
        public virtual User User { get; set; }

        public int NonogramId { get; set; }
        public virtual Nonogram Nonogram { get; set; }
    }
}