namespace NonogramPortalApi.DataBase.Entities
{
    public class Colour
    {
        public int Id { get; set; }

        public byte Red { get; set; }
        public byte Green { get; set; }
        public byte Blue { get; set; }

        public int NonogramId { get; set; }
        public virtual Nonogram Nonogram { get; set; }
    }
}