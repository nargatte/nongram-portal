namespace NonogramPortalApi.DataBase.Entities
{
    public class Dimension
    {
        public int Id { get; set; }

        public int Size { get; set; }
        public int Index { get; set; }

        public int NonogramId { get; set; }
        public virtual Nonogram Nonogram { get; set; }
    }
}