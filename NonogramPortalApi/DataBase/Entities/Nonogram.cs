using System;
using System.Collections.Generic;
using NonogramPortalApi.Enums;

namespace NonogramPortalApi.DataBase.Entities
{
    public class Nonogram
    {
        public int Id { get; set; }

        public string Name { get; set; }
        public AccessMode AccessMode { get; set; }
        public int Difficulty { get; set; }
        public int Size { get; set; }
        public int Dimension { get; set; }
        public DateTime CreationDate { get; set; }
        public string Link { get; set; }
        public int[] RuleIndexes { get; set; }
        public byte[] Rules { get; set; }
        public byte[] Fields { get; set; }

        public string UserId { get; set; }
        public virtual User User { get; set; }

        public virtual ICollection<Game> Games { get; set; }
        public virtual ICollection<Comment> Comments { get; set; }
        public virtual ICollection<Dimension> Dimensions { get; set; }
        public virtual ICollection<Colour> Colours { get; set; }
    }
}