namespace NonogramPortalApi.Models
{
    public class PagedArray<TItem> where TItem: class
    {
        public int TotalNumberOfElements { get; set; }
        public TItem Elements { get; set; }
    }
}