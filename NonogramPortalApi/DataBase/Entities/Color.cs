namespace NonogramPortalApi.DataBase.Entities
{
    public class Color
    {
        public int Id { get; set; }
        public int Index { get; set; }

        public byte Red { get; set; }
        public byte Green { get; set; }
        public byte Blue { get; set; }

        public int NonogramId { get; set; }
        public virtual Nonogram Nonogram { get; set; }
    }
}